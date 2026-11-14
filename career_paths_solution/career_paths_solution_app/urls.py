from django.urls import path
from .views import (
    JobApplicationListCreateView,
    JobApplicationDetailView,
    ReminderListCreateView,
    ReminderDetailView,
)

urlpatterns = [
    path("job-applications/", JobApplicationListCreateView.as_view(), name="job-application-list-create"),
    path("job-applications/<int:job_id>/", JobApplicationDetailView.as_view(), name="job-application-detail"),
    path("reminders/", ReminderListCreateView.as_view(), name="reminder-list-create"),
    path("reminders/<int:reminder_id>/", ReminderDetailView.as_view(), name="reminder-detail"),
]