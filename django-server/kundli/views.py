"""
Views for the kundli app.

Handles file uploads (image / PDF) for Kundli chart analysis and
proxies them to the Node.js microservice as multipart/form-data.

Endpoints
---------
POST /api/kundli/upload/         KundliUploadView      – Upload & analyse a Kundli file
GET  /api/kundli/history/        KundliHistoryView     – List user's past analyses
GET  /api/kundli/history/<id>/   KundliHistoryDetailView – Single analysis record
"""

import logging

from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from cosmic_core.proxy import proxy_to_node

logger = logging.getLogger(__name__)

# Allowed MIME types for kundli uploads
ALLOWED_CONTENT_TYPES = {
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf',
}

# Maximum file size: 10 MB
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


class KundliUploadView(APIView):
    """
    POST /api/kundli/upload/

    Accept an image (JPEG, PNG, WebP) or PDF file of a Kundli chart,
    forward it to the Node.js service for OCR / analysis, and return
    the structured analysis result.

    The endpoint is authenticated for registered users but also supports
    anonymous test submissions (permission_classes includes AllowAny).
    In production, set KUNDLI_REQUIRE_AUTH=True to enforce authentication.

    Form fields
    -----------
    file       (required) – The Kundli image or PDF file
    notes      (optional) – Free-text notes about the chart

    Response
    --------
    Proxied JSON from Node service containing extracted planetary data,
    house positions, and an AI-generated interpretation.
    """

    # Allow both authenticated and anonymous (for testing) submissions.
    # In production, replace AllowAny with IsAuthenticated.
    permission_classes = [IsAuthenticated | AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('file')

        if not uploaded_file:
            return Response(
                {'error': 'A Kundli file must be provided in the "file" field.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate content type
        content_type = uploaded_file.content_type
        if content_type not in ALLOWED_CONTENT_TYPES:
            return Response(
                {
                    'error': (
                        f'Unsupported file type "{content_type}". '
                        f'Allowed types: JPEG, PNG, WebP, PDF.'
                    )
                },
                status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            )

        # Validate file size
        if uploaded_file.size > MAX_FILE_SIZE_BYTES:
            return Response(
                {
                    'error': (
                        f'File size ({uploaded_file.size / 1024 / 1024:.1f} MB) '
                        f'exceeds the 10 MB limit.'
                    )
                },
                status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            )

        notes = request.data.get('notes', '')
        user_id = request.user.id if request.user.is_authenticated else None

        logger.info(
            'Kundli upload by user=%s, filename=%s, size=%s bytes',
            user_id,
            uploaded_file.name,
            uploaded_file.size,
        )

        # Build the files dict for multipart forwarding
        files = {
            'file': (
                uploaded_file.name,
                uploaded_file,
                content_type,
            )
        }
        data = {'notes': notes}
        if user_id:
            data['user_id'] = str(user_id)

        result, status_code = proxy_to_node(
            path='/api/kundli/analyze',
            method='POST',
            data=data,
            files=files,
            user_id=user_id,
        )

        return Response(result, status=status_code)


class KundliHistoryView(APIView):
    """
    GET /api/kundli/history/

    Retrieve the paginated list of past Kundli analyses for the
    currently authenticated user.

    Query parameters
    ----------------
    page  (int, optional) – Page number (default: 1)
    limit (int, optional) – Items per page (default: 20)
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        page = request.query_params.get('page', '1')
        limit = request.query_params.get('limit', '20')

        logger.info('Kundli history requested by user %s', user_id)

        result, status_code = proxy_to_node(
            path=f'/api/kundli/history/{user_id}',
            method='GET',
            user_id=user_id,
            params={'page': page, 'limit': limit},
        )

        return Response(result, status=status_code)


class KundliHistoryDetailView(APIView):
    """
    GET /api/kundli/history/<analysis_id>/

    Retrieve a single Kundli analysis record by its ID.
    The Node service verifies via X-User-Id that the record belongs
    to the requesting user.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, analysis_id, *args, **kwargs):
        user_id = request.user.id

        logger.info(
            'Kundli analysis %s detail requested by user %s', analysis_id, user_id
        )

        result, status_code = proxy_to_node(
            path=f'/api/kundli/history/{user_id}/{analysis_id}',
            method='GET',
            user_id=user_id,
        )

        return Response(result, status=status_code)
