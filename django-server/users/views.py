"""
Views for the users app.

Endpoints
---------
POST  /api/auth/register/          RegisterView      – Create a new account & receive JWT tokens
POST  /api/auth/login/             LoginView         – Authenticate and receive JWT tokens
POST  /api/auth/token/refresh/     TokenRefreshView  – Refresh the access token (via simplejwt)
POST  /api/auth/logout/            LogoutView        – Blacklist the refresh token
GET   /api/auth/profile/           UserProfileView   – Retrieve current user's profile
PUT   /api/auth/profile/           UserProfileView   – Full update of current user's profile
PATCH /api/auth/profile/           UserProfileView   – Partial update of current user's profile
PUT   /api/auth/change-password/   ChangePasswordView – Change authenticated user's password
"""

import logging

from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import (
    ChangePasswordSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)

logger = logging.getLogger(__name__)
User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/

    Create a new user account.  On success, returns the user data plus
    a JWT access/refresh token pair so the client can authenticate
    immediately without a second round-trip.
    """

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate token pair for the newly registered user
        refresh = RefreshToken.for_user(user)
        tokens = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        user_data = UserSerializer(user, context={'request': request}).data

        logger.info('New user registered: %s (%s)', user.username, user.email)

        return Response(
            {
                'message': 'Account created successfully.',
                'user': user_data,
                'tokens': tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(generics.GenericAPIView):
    """
    POST /api/auth/login/

    Authenticate with email + password; returns a JWT token pair and
    the user's profile data.
    """

    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        tokens = LoginSerializer.get_tokens(user)
        user_data = UserSerializer(user, context={'request': request}).data

        logger.info('User logged in: %s', user.email)

        return Response(
            {
                'message': 'Login successful.',
                'user': user_data,
                'tokens': tokens,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    """
    POST /api/auth/logout/

    Blacklist the provided refresh token, effectively logging the user out.
    Requires a valid JWT access token in the Authorization header and
    the refresh token in the request body.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            logger.info('User logged out: %s', request.user.email)
            return Response(
                {'message': 'Successfully logged out.'},
                status=status.HTTP_205_RESET_CONTENT,
            )
        except TokenError as exc:
            return Response(
                {'error': str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/auth/profile/   – Return the authenticated user's profile.
    PUT  /api/auth/profile/   – Full update of the authenticated user's profile.
    PATCH /api/auth/profile/  – Partial update of the authenticated user's profile.
    """

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_object(self):
        """Always operate on the currently authenticated user."""
        return self.request.user

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = kwargs.get('partial', False)
        response = super().update(request, *args, **kwargs)
        response.data['message'] = 'Profile updated successfully.'
        return response


class ChangePasswordView(generics.UpdateAPIView):
    """
    PUT /api/auth/change-password/

    Change the authenticated user's password.  Requires the user's current
    password to prevent abuse even with a stolen access token.
    """

    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['put', 'options']

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        logger.info('Password changed for user: %s', request.user.email)

        return Response(
            {'message': 'Password changed successfully.'},
            status=status.HTTP_200_OK,
        )
