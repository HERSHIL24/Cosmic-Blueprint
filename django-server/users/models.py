"""
Custom User model for the Cosmic Astrology / Numerology platform.

Extends Django's AbstractUser to add astrology-relevant fields
(birth date, birth time, birth place) used by numerology and chart views.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """
    Extended user model.

    Fields inherited from AbstractUser
    -----------------------------------
    username, first_name, last_name, email, password,
    is_staff, is_active, is_superuser, date_joined, last_login

    Additional fields
    -----------------
    bio          – Short free-text biography / profile description
    birth_date   – Date of birth (required for numerology & astrology)
    birth_time   – Exact time of birth (optional; needed for detailed charts)
    birth_place  – City / location of birth (optional; needed for Kundli)
    avatar       – Profile photo
    created_at   – Record creation timestamp (immutable)
    """

    bio = models.TextField(
        blank=True,
        default='',
        help_text='Short biography or profile description.',
    )
    birth_date = models.DateField(
        null=True,
        blank=True,
        help_text='Date of birth in YYYY-MM-DD format.',
    )
    birth_time = models.TimeField(
        null=True,
        blank=True,
        help_text='Time of birth in HH:MM:SS format (optional).',
    )
    birth_place = models.CharField(
        max_length=255,
        blank=True,
        default='',
        help_text='City or location of birth.',
    )
    avatar = models.ImageField(
        upload_to='avatars/%Y/%m/',
        blank=True,
        null=True,
        help_text='Profile photo.',
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Timestamp when the account was created.',
    )

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']

    def __str__(self) -> str:
        return f'{self.username} <{self.email}>'

    @property
    def full_name(self) -> str:
        """Return the user's full name, falling back to username."""
        return self.get_full_name() or self.username
