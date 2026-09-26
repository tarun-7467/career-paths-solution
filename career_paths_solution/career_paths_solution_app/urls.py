from django.urls import path
from .views import JobApplicationListCreateView

urlpatterns = [
    path("job-applications/", JobApplicationListCreateView.as_view(), name="job-application-list-create"),
]