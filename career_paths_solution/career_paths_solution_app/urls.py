from django.urls import path
from .views import JobApplicationListCreateView, JobApplicationDetailView

urlpatterns = [
    path("job-applications/", JobApplicationListCreateView.as_view(), name="job-application-list-create"),
    path("job-applications/<int:job_id>/", JobApplicationDetailView.as_view(), name="job-application-detail")
]