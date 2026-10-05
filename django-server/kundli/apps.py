"""
AppConfig for the kundli app.
"""

from django.apps import AppConfig


class KundliConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'kundli'
    verbose_name = 'Kundli Analysis'
