"""
Admin registrations for the users app.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    Admin configuration for CustomUser.

    Extends the default UserAdmin to expose the additional fields
    (bio, birth_date, birth_time, birth_place, avatar).
    """

    list_display = [
        'username',
        'email',
        'first_name',
        'last_name',
        'birth_date',
        'birth_place',
        'is_staff',
        'is_active',
        'date_joined',
    ]
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'birth_place']
    ordering = ['-date_joined']
    readonly_fields = ['created_at', 'date_joined', 'last_login']

    # Extend the default UserAdmin fieldsets to include custom fields
    fieldsets = UserAdmin.fieldsets + (
        (
            _('Astrology Profile'),
            {
                'fields': (
                    'bio',
                    'birth_date',
                    'birth_time',
                    'birth_place',
                    'avatar',
                    'created_at',
                ),
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            _('Astrology Profile'),
            {
                'classes': ('wide',),
                'fields': (
                    'email',
                    'birth_date',
                    'birth_time',
                    'birth_place',
                ),
            },
        ),
    )
