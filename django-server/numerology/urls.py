"""
URL patterns for the numerology app.

Mounted under /api/numerology/ from the project urls.py.
"""

from django.urls import path

from .views import (
    NumerologyCalculateView,
    NumerologyHistoryView,
    NumerologyHistoryDetailView,
)

app_name = 'numerology'

urlpatterns = [
    path('calculate/', NumerologyCalculateView.as_view(), name='calculate'),
    path('history/', NumerologyHistoryView.as_view(), name='history'),
    path('history/<str:record_id>/', NumerologyHistoryDetailView.as_view(), name='history-detail'),
]
