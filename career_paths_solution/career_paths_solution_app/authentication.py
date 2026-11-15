from rest_framework.authentication import BaseAuthentication, CSRFCheck
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from .models import User


class AppSessionAuthentication(BaseAuthentication):
    def authenticate(self, request):
        user_id = request.session.get("app_user_id")

        if user_id is None:
            return None

        try:
            user = User.objects.get(user_id=user_id)
        except (User.DoesNotExist, ValueError, TypeError):
            raise AuthenticationFailed("Invalid session.")

        self.enforce_csrf(request)

        return (user, None)

    def enforce_csrf(self, request):
        check = CSRFCheck(lambda request: None)
        check.process_request(request)

        reason = check.process_view(request, None, (), {})

        if reason:
            raise PermissionDenied(
                f"CSRF verification failed: {reason}"
            )