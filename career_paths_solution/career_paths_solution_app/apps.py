from django.apps import AppConfig


class CareerPathsSolutionAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "career_paths_solution_app"

class TestCareerPathsSolutionAppConfig(CareerPathsSolutionAppConfig):
    def ready(self):
        from .models import User, JobApplication, Reminder

        # Enable table creation only in the test environment.
        User._meta.managed = True
        JobApplication._meta.managed = True
        Reminder._meta.managed = True
