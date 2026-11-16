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


class ExtensionTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return None

        token = parts[1]
        if not token:
            return None

        try:
            user = User.objects.get(api_token=token)
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid extension token.")

        return (user, None)