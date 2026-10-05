from django.urls import path
from . import views

urlpatterns = [
    path('analyze/', views.NamologyAnalyzeView.as_view(), name='namology-analyze'),
    path('correct/', views.NamologyCorrectView.as_view(), name='namology-correct'),
    path('history/', views.NamologyHistoryView.as_view(), name='namology-history'),
]
