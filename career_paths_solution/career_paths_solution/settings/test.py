
from .base import *

# Use SQLite instead of Supabase for automated tests.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "test_db.sqlite3",
    }
}

# Create application tables without migration files in tests.
MIGRATION_MODULES = {
    "career_paths_solution_app": None,
}

# Use the test-specific AppConfig for unmanaged models.
INSTALLED_APPS = [
    "career_paths_solution_app.apps.TestCareerPathsSolutionAppConfig"
    if app == "career_paths_solution_app"
    else app
    for app in INSTALLED_APPS
]