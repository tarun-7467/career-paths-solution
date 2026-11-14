
from django.test import TestCase
from django.contrib.auth.hashers import check_password
from rest_framework.test import APIClient

from .models import User


class AuthenticationTests(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_user_registration(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "name": "Test User",
                "email": "test@example.com",
                "password": "SecureTest2026!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)

        user = User.objects.get(email="test@example.com")

        self.assertEqual(user.name, "Test User")
        self.assertNotEqual(user.password_hash, "SecureTest2026!")
        self.assertTrue(
            check_password("SecureTest2026!", user.password_hash)
        )
    
    def test_user_login(self):
        from django.contrib.auth.hashers import make_password

        user = User.objects.create(
            name="Login Test User",
            email="login@example.com",
            password_hash=make_password("SecureTest2026!"),
        )

        response = self.client.post(
            "/api/auth/login/",
            {
                "email": "login@example.com",
                "password": "SecureTest2026!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            self.client.session.get("app_user_id"),
            user.user_id,
        )
  
    def test_login_with_invalid_password(self):
        from django.contrib.auth.hashers import make_password

        User.objects.create(
            name="Invalid Password User",
            email="invalid@example.com",
            password_hash=make_password("SecureTest2026!"),
        )

        response = self.client.post(
            "/api/auth/login/",
            {
                "email": "invalid@example.com",
                "password": "WrongPassword2026!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 401)
        self.assertIsNone(
            self.client.session.get("app_user_id")
        )
    
    def test_user_logout(self):
        from django.contrib.auth.hashers import make_password

        user = User.objects.create(
            name="Logout Test User",
            email="logout@example.com",
            password_hash=make_password("SecureTest2026!"),
        )

        self.client.post(
            "/api/auth/login/",
            {
                "email": user.email,
                "password": "SecureTest2026!",
            },
            format="json",
        )

        self.assertEqual(
            self.client.session.get("app_user_id"),
            user.user_id,
        )

        response = self.client.post("/api/auth/logout/")

        self.assertEqual(response.status_code, 200)
        self.assertIsNone(
            self.client.session.get("app_user_id")
        )
    
    def test_users_only_see_their_own_applications(self):
        from django.contrib.auth.hashers import make_password
        from .models import JobApplication

        user_a = User.objects.create(
            name="User A",
            email="usera@example.com",
            password_hash=make_password("SecureTest2026!"),
        )

        user_b = User.objects.create(
            name="User B",
            email="userb@example.com",
            password_hash=make_password("SecureTest2026!"),
        )

        JobApplication.objects.create(
            user=user_a,
            company="Company A",
            position="Developer",
            status="Applied",
        )

        JobApplication.objects.create(
            user=user_b,
            company="Company B",
            position="Designer",
            status="Applied",
        )

        self.client.post(
            "/api/auth/login/",
            {
                "email": user_a.email,
                "password": "SecureTest2026!",
            },
            format="json",
        )

        response = self.client.get("/api/job-applications/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["company"], "Company A")
    
    def test_user_cannot_view_another_users_application(self):
        from django.contrib.auth.hashers import make_password
        from .models import JobApplication

        user_a = User.objects.create(
            name="User A",
            email="usera@example.com",
            password_hash=make_password("SecureTest2026!"),
        )

        user_b = User.objects.create(
            name="User B",
            email="userb@example.com",
            password_hash=make_password("SecureTest2026!"),
        )

        application_b = JobApplication.objects.create(
            user=user_b,
            company="Private Company",
            position="Software Engineer",
            status="Applied",
        )

        self.client.post(
            "/api/auth/login/",
            {
                "email": user_a.email,
                "password": "SecureTest2026!",
            },
            format="json",
        )

        response = self.client.get(
            f"/api/job-applications/{application_b.job_id}/"
        )

        self.assertEqual(response.status_code, 404)
    
    def test_user_cannot_update_another_users_application(self):
        from django.contrib.auth.hashers import make_password
        from .models import JobApplication

        user_a = User.objects.create(
            name="User A",
            email="usera@example.com",
            password_hash=make_password("SecureTest2026!"),
        )

        user_b = User.objects.create(
            name="User B",
            email="userb@example.com",
            password_hash=make_password("SecureTest2026!"),
        )

        application_b = JobApplication.objects.create(
            user=user_b,
            company="Private Company",
            position="Software Engineer",
            status="Applied",
        )

        self.client.post(
            "/api/auth/login/",
            {
                "email": user_a.email,
                "password": "SecureTest2026!",
            },
            format="json",
        )

        response = self.client.patch(
            f"/api/job-applications/{application_b.job_id}/",
            {"status": "Rejected"},
            format="json",
        )

        self.assertEqual(response.status_code, 404)

        application_b.refresh_from_db()
        self.assertEqual(application_b.status, "Applied")
    
    def test_user_cannot_delete_another_users_application(self):
        from django.contrib.auth.hashers import make_password
        from .models import JobApplication

        user_a = User.objects.create(
            name="User A",
            email="usera@example.com",
            password_hash=make_password("SecureTest2026!"),
        )

        user_b = User.objects.create(
            name="User B",
            email="userb@example.com",
            password_hash=make_password("SecureTest2026!"),
        )

        application_b = JobApplication.objects.create(
            user=user_b,
            company="Private Company",
            position="Software Engineer",
            status="Applied",
        )

        self.client.post(
            "/api/auth/login/",
            {
                "email": user_a.email,
                "password": "SecureTest2026!",
            },
            format="json",
        )

        response = self.client.delete(
            f"/api/job-applications/{application_b.job_id}/"
        )

        self.assertEqual(response.status_code, 404)

        self.assertTrue(
            JobApplication.objects.filter(
                job_id=application_b.job_id
            ).exists()
        )
