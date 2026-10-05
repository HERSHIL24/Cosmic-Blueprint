"""
URL patterns for the astrology app.

Mounted under /api/astrology/ from the project urls.py.
"""

from django.urls import path

from .views import (
    AstrologyChartView,
    AstrologyCompatibilityView,
    AstrologyReportView,
    AstrologyReportDetailView,
)

app_name = 'astrology'

urlpatterns = [
    path('chart/', AstrologyChartView.as_view(), name='chart'),
    path('report/', AstrologyReportView.as_view(), name='report-list'),
    path('report/<str:report_id>/', AstrologyReportDetailView.as_view(), name='report-detail'),
    path('compatibility/', AstrologyCompatibilityView.as_view(), name='compatibility'),
]
