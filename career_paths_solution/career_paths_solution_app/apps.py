from django.apps import AppConfig


class CareerPathsSolutionAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "career_paths_solution_app"

class TestCareerPathsSolutionAppConfig(CareerPathsSolutionAppConfig):
    def ready(self):
        super().ready()

        for model in self.get_models(include_auto_created=True):
            model._meta.managed = True