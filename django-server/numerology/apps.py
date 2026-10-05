"""
AppConfig for the numerology app.
"""

from django.apps import AppConfig


class NumerologyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'numerology'
    verbose_name = 'Numerology'
