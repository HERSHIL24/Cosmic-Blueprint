"""
Views for the numerology app.

All computation is delegated to the Node.js microservice via the shared
proxy helper.  Django handles authentication and request validation only.

Endpoints
---------
POST /api/numerology/calculate/     NumerologyCalculateView
GET  /api/numerology/history/       NumerologyHistoryView
GET  /api/numerology/history/<id>/  NumerologyHistoryDetailView
"""

import logging

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cosmic_core.proxy import proxy_to_node

logger = logging.getLogger(__name__)


class NumerologyCalculateView(APIView):
    """
    POST /api/numerology/calculate/

    Calculate numerology readings for a person.

    Request body
    ------------
    {
        "name": "Full Name",       // required
        "dob":  "YYYY-MM-DD"      // required – date of birth
    }

    Response
    --------
    Proxied JSON from Node service, e.g.:
    {
        "life_path_number": 7,
        "expression_number": 5,
        "soul_urge_number": 9,
        "personality_number": 3,
        "birthday_number": 14,
        "maturity_number": 3,
        "interpretation": { ... }
    }
    """

    permission_classes = []

    def post(self, request, *args, **kwargs):
        name = request.data.get('name', '').strip()
        dob = request.data.get('dob', '').strip()

        if not name:
            return Response(
                {'error': 'The "name" field is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not dob:
            return Response(
                {'error': 'The "dob" (date of birth) field is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = {
            'name': name,
            'dob': dob,
            'user_id': request.user.id,
        }

        logger.info(
            'Numerology calculation requested by user %s for name=%s dob=%s',
            request.user.id,
            name,
            dob,
        )

        result, status_code = proxy_to_node(
            path='/api/numerology/calculate',
            method='POST',
            data=payload,
            user_id=request.user.id,
        )

        return Response(result, status=status_code)


class NumerologyHistoryView(APIView):
    """
    GET /api/numerology/history/

    Retrieve the paginated numerology calculation history for the
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

        logger.info('Numerology history requested by user %s', user_id)

        result, status_code = proxy_to_node(
            path=f'/api/numerology/history/{user_id}',
            method='GET',
            user_id=user_id,
            params={'page': page, 'limit': limit},
        )

        return Response(result, status=status_code)


class NumerologyHistoryDetailView(APIView):
    """
    GET /api/numerology/history/<record_id>/

    Retrieve a single numerology calculation record by its ID.
    Users can only access their own records (enforced by the Node service
    via the X-User-Id header).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, record_id, *args, **kwargs):
        user_id = request.user.id

        logger.info(
            'Numerology history detail requested by user %s for record %s',
            user_id,
            record_id,
        )

        result, status_code = proxy_to_node(
            path=f'/api/numerology/history/{user_id}/{record_id}',
            method='GET',
            user_id=user_id,
        )

        return Response(result, status=status_code)
