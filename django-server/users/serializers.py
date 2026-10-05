"""
Serializers for the users app.

Provides:
  - UserSerializer        : Full read/update serializer for the CustomUser model
  - RegisterSerializer    : Creates a new user; validates password confirmation
  - LoginSerializer       : Validates credentials and returns JWT token pair
  - ChangePasswordSerializer : Validates old password and sets a new one
"""

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Full serializer for reading and updating user profiles."""

    full_name = serializers.ReadOnlyField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'bio',
            'birth_date',
            'birth_time',
            'birth_place',
            'avatar',
            'avatar_url',
            'is_active',
            'date_joined',
            'created_at',
        ]
        read_only_fields = ['id', 'date_joined', 'created_at', 'is_active']
        extra_kwargs = {
            'avatar': {'write_only': True, 'required': False},
        }

    def get_avatar_url(self, obj) -> str | None:
        """Return an absolute URL for the avatar if present."""
        request = self.context.get('request')
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for new user registration.

    Validates that password and password_confirm match, then creates
    the user using Django's create_user helper (hashes password properly).
    """

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password],
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'password_confirm',
            'birth_date',
            'birth_time',
            'birth_place',
            'bio',
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate_email(self, value: str) -> str:
        """Ensure the email address is not already in use."""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                'A user with this email address already exists.'
            )
        return value.lower()

    def validate(self, attrs: dict) -> dict:
        """Ensure both password fields match."""
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError(
                {'password_confirm': 'Passwords do not match.'}
            )
        return attrs

    def create(self, validated_data: dict) -> User:
        """Create and return a new user with a hashed password."""
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            birth_date=validated_data.get('birth_date'),
            birth_time=validated_data.get('birth_time'),
            birth_place=validated_data.get('birth_place', ''),
            bio=validated_data.get('bio', ''),
        )
        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.

    Accepts email + password credentials, validates them, and attaches
    the authenticated user instance for use in the view.
    """

    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )

    def validate(self, attrs: dict) -> dict:
        email = attrs.get('email', '').lower()
        password = attrs.get('password')

        # Django's authenticate works on username; look up by email first
        try:
            user_obj = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {'non_field_errors': 'Invalid email or password.'}
            )

        user = authenticate(
            request=self.context.get('request'),
            username=user_obj.username,
            password=password,
        )

        if not user:
            raise serializers.ValidationError(
                {'non_field_errors': 'Invalid email or password.'}
            )

        if not user.is_active:
            raise serializers.ValidationError(
                {'non_field_errors': 'This account has been deactivated.'}
            )

        attrs['user'] = user
        return attrs

    @staticmethod
    def get_tokens(user) -> dict:
        """Generate JWT access and refresh tokens for the given user."""
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for the change-password endpoint.

    Requires the user to provide their current (old) password before
    setting a new one, preventing unauthorised password changes even
    with a valid JWT.
    """

    old_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password],
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )

    def validate_old_password(self, value: str) -> str:
        """Check that the old password is correct for the current user."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value

    def validate(self, attrs: dict) -> dict:
        if attrs['new_password'] != attrs.pop('new_password_confirm'):
            raise serializers.ValidationError(
                {'new_password_confirm': 'New passwords do not match.'}
            )
        return attrs

    def save(self, **kwargs):
        """Apply the new password to the current user."""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user
