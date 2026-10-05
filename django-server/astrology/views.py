"""
Views for the astrology app.

Delegates all computation to the Node.js microservice.

Endpoints
---------
POST /api/astrology/chart/           AstrologyChartView
GET  /api/astrology/report/          AstrologyReportView
GET  /api/astrology/report/<id>/     AstrologyReportDetailView
POST /api/astrology/compatibility/   AstrologyCompatibilityView
"""

import logging

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cosmic_core.proxy import proxy_to_node

logger = logging.getLogger(__name__)


class AstrologyChartView(APIView):
    """
    POST /api/astrology/chart/

    Generate an astrology (birth / natal) chart for the provided
    birth data.  Coordinates can be supplied directly or derived by
    the Node service from the place name.

    Request body
    ------------
    {
        "dob":   "YYYY-MM-DD",           // required – date of birth
        "time":  "HH:MM",                // required – local time of birth (24h)
        "lat":   28.6139,                // optional – latitude  (float)
        "lon":   77.2090,                // optional – longitude (float)
        "place": "New Delhi, India"      // optional – place name (used if lat/lon absent)
    }

    Response
    --------
    Proxied JSON from Node service containing planetary positions,
    house cusps, aspects, and chart SVG data.
    """

    permission_classes = []

    def post(self, request, *args, **kwargs):
        dob = request.data.get('dob', '').strip()
        time = request.data.get('time', '').strip()

        if not dob:
            return Response(
                {'error': 'The "dob" (date of birth) field is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not time:
            return Response(
                {'error': 'The "time" (birth time) field is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        has_coords = 'lat' in request.data and 'lon' in request.data
        has_place = bool(request.data.get('place', '').strip())
        if not has_coords and not has_place:
            return Response(
                {
                    'error': (
                        'Either coordinates ("lat" and "lon") or '
                        'a "place" name must be provided.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = {
            'dob': dob,
            'time': time,
            'user_id': request.user.id,
        }
        if has_coords:
            payload['lat'] = request.data['lat']
            payload['lon'] = request.data['lon']
        if has_place:
            payload['place'] = request.data['place']

        logger.info(
            'Astrology chart requested by user %s (dob=%s, time=%s)',
            request.user.id,
            dob,
            time,
        )

        result, status_code = proxy_to_node(
            path='/api/astrology/chart',
            method='POST',
            data=payload,
            user_id=request.user.id,
        )

        return Response(result, status=status_code)


class AstrologyReportView(APIView):
    """
    GET /api/astrology/report/

    Retrieve the paginated list of saved astrology reports for the
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

        logger.info('Astrology report list requested by user %s', user_id)

        result, status_code = proxy_to_node(
            path=f'/api/astrology/report/{user_id}',
            method='GET',
            user_id=user_id,
            params={'page': page, 'limit': limit},
        )

        return Response(result, status=status_code)


class AstrologyReportDetailView(APIView):
    """
    GET /api/astrology/report/<report_id>/

    Retrieve a single saved astrology report by its ID.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, report_id, *args, **kwargs):
        user_id = request.user.id

        logger.info(
            'Astrology report %s detail requested by user %s', report_id, user_id
        )

        result, status_code = proxy_to_node(
            path=f'/api/astrology/report/{user_id}/{report_id}',
            method='GET',
            user_id=user_id,
        )

        return Response(result, status=status_code)


class AstrologyCompatibilityView(APIView):
    """
    POST /api/astrology/compatibility/

    Calculate compatibility (synastry) between two people.

    Request body
    ------------
    {
        "person1": { "dob": "YYYY-MM-DD", "time": "HH:MM", "place": "City" },
        "person2": { "dob": "YYYY-MM-DD", "time": "HH:MM", "place": "City" }
    }
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        person1 = request.data.get('person1')
        person2 = request.data.get('person2')

        if not person1 or not person2:
            return Response(
                {'error': 'Both "person1" and "person2" fields are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = {
            'person1': person1,
            'person2': person2,
            'user_id': request.user.id,
        }

        logger.info(
            'Astrology compatibility check requested by user %s', request.user.id
        )

        result, status_code = proxy_to_node(
            path='/api/astrology/compatibility',
            method='POST',
            data=payload,
            user_id=request.user.id,
        )

        return Response(result, status=status_code)
