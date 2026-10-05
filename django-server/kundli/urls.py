"""
URL patterns for the kundli app.

Mounted under /api/kundli/ from the project urls.py.
"""

from django.urls import path

from .views import (
    KundliUploadView,
    KundliHistoryView,
    KundliHistoryDetailView,
)

app_name = 'kundli'

urlpatterns = [
    path('upload/', KundliUploadView.as_view(), name='upload'),
    path('history/', KundliHistoryView.as_view(), name='history'),
    path('history/<str:analysis_id>/', KundliHistoryDetailView.as_view(), name='history-detail'),
]
