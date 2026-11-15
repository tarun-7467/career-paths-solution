from django.urls import path
from .views import (
    JobApplicationListCreateView,
    JobApplicationDetailView,
    ReminderListCreateView,
    ReminderDetailView,
)
from .auth_views import RegisterView, LoginView, LogoutView, CSRFTokenView, CurrentUserView

urlpatterns = [
    path(
        "job-applications/",
        JobApplicationListCreateView.as_view(),
        name="job-application-list-create"
    ),
    path(
        "job-applications/<int:job_id>/",
        JobApplicationDetailView.as_view(),
        name="job-application-detail"
    ),
    path(
        "reminders/",
        ReminderListCreateView.as_view(),
        name="reminder-list-create"
    ),
    path(
        "reminders/<int:reminder_id>/",
        ReminderDetailView.as_view(),
        name="reminder-detail"
    ),
    path(
        "auth/register/",
        RegisterView.as_view(),
        name="auth-register"
    ),
    path(
        "auth/login/",
        LoginView.as_view(),
        name="auth-login"
    ),
    path(
        "auth/logout/",
        LogoutView.as_view(),
        name="auth-logout"
    ),
    path(
        "auth/csrf/",
        CSRFTokenView.as_view(),
        name="auth-csrf"
    ),
    path(
        "auth/me/",
        CurrentUserView.as_view(),
        name="auth-me"
    ),
]