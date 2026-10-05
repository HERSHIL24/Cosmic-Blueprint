"""
Health check endpoint for the Django API Gateway.
Used by Kubernetes liveness probes and monitoring tools.
"""
from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import connection
import os


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Returns service health status, DB connectivity, and upstream service info."""
    # Check PostgreSQL
    db_status = 'connected'
    try:
        connection.ensure_connection()
    except Exception as e:
        db_status = f'error: {str(e)}'

    return Response({
        'status': 'healthy',
        'service': 'django-api-gateway',
        'database': db_status,
        'node_service_url': os.environ.get('NODE_SERVICE_URL', 'http://localhost:5000'),
        'version': '1.0.0',
    })


urlpatterns = [
    path('', health_check, name='health-check'),
]
