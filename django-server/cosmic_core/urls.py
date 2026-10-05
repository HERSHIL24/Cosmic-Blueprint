from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Cosmic Profile Engine API",
        default_version='v1',
        description="API for the Cosmic Profile Engine — Numerology, Namology, Astrology & Kundli Reading Platform",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="admin@cosmicprofile.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth & Users
    path('api/auth/', include('users.urls')),

    # The 4 Departments
    path('api/numerology/', include('numerology.urls')),
    path('api/astrology/', include('astrology.urls')),
    path('api/namology/', include('namology.urls')),
    path('api/kundli/', include('kundli.urls')),

    # API Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),

    # Health check
    path('api/health/', include('cosmic_core.health')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
