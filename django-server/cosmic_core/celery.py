"""
Celery application configuration for cosmic_core.

Usage
-----
Start a worker:
    celery -A cosmic_core worker -l info

Start the beat scheduler (for periodic tasks):
    celery -A cosmic_core beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
"""

import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cosmic_core.settings')

app = Celery('cosmic_core')

# Using a string here means the worker doesn't have to serialize the
# configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """Simple task for debugging the Celery worker."""
    print(f'Request: {self.request!r}')
