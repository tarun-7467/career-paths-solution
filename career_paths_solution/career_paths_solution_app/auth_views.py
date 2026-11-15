
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import IntegrityError, transaction
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from .models import User

from .auth_serializers import RegisterSerializer, LoginSerializer
from .authentication import AppSessionAuthentication
from django.middleware.csrf import get_token
from rest_framework.authentication import CSRFCheck
from rest_framework.exceptions import PermissionDenied

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        check = CSRFCheck(lambda request: None)
        check.process_request(request)
        reason = check.process_view(request, None, (), {})

        if reason:
            raise PermissionDenied(
                f"CSRF verification failed: {reason}"
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            with transaction.atomic():
                user = serializer.save()
        except IntegrityError:
            return Response(
                {"email": ["An account with this email already exists."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Account created successfully.",
                "user": {
                    "user_id": user.user_id,
                    "name": user.name,
                    "email": user.email,
                }
            },
            status=status.HTTP_201_CREATED
        )

    
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        check = CSRFCheck(lambda request: None)
        check.process_request(request)
        reason = check.process_view(request, None, (), {})

        if reason:
            raise PermissionDenied(
                f"CSRF verification failed: {reason}"
            )
        
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = User.objects.filter(email__iexact=email).first()

        if user is None or not check_password(
            password, user.password_hash
        ):
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        request.session.cycle_key()
        request.session["app_user_id"] = user.user_id

        return Response(
            {
                "message": "Login successful.",
                "user": {
                    "user_id": user.user_id,
                    "name": user.name,
                    "email": user.email,
                }
            },
            status=status.HTTP_200_OK
        )

class LogoutView(APIView):
    authentication_classes = [AppSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request.session.flush()

        return Response(
            {"message": "Logout successful."},
            status=status.HTTP_200_OK
        )

class CSRFTokenView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            "csrfToken": get_token(request)
        })

class CurrentUserView(APIView):
    authentication_classes = [AppSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at,
        })