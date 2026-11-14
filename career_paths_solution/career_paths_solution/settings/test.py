from .base import *

# Use a separate SQLite database for automated tests.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "test_db.sqlite3",
        "TEST": {
            "NAME": None,
        },
    }
}

# Create tables for models that normally use external database tables.
MIGRATION_MODULES = {
    "career_paths_solution_app": None,
}

# Use the test-specific AppConfig so unmanaged models
# can have tables created in the test database.
INSTALLED_APPS = [
    (
        "career_paths_solution_app.apps.TestCareerPathsSolutionAppConfig"
        if app in (
            "career_paths_solution_app",
            "career_paths_solution_app.apps.CareerPathsSolutionAppConfig",
        )
        else app
    )
    for app in INSTALLED_APPS
]