
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, JobApplication
from django.contrib.auth.hashers import make_password

class JobApplicationAPITests(APITestCase):
    
    def setUp(self):
        # Create a test user.
        self.user = User.objects.create(
            name="Test User",
            email="test@example.com",
            password_hash=make_password("TestPassword123!")
        )

        # Authenticate the test client using the app's session.
        session = self.client.session
        session["app_user_id"] = self.user.user_id
        session.save()

    def test_create_job_application_success(self):
        # Prepare valid job application data.
        data = {
            "user": self.user.user_id,
            "company": "Microsoft",
            "position": "Software Engineer",
            "status": "Applied"
        }

        # Submit a POST request to the API.
        response = self.client.post(
            "/api/job-applications/",
            data,
            format="json"
        )

        # Verify successful creation.
        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        # Verify the application was saved.
        self.assertEqual(JobApplication.objects.count(), 1)

        application = JobApplication.objects.first()
        self.assertEqual(application.company, "Microsoft")
        self.assertEqual(application.position, "Software Engineer")
        self.assertEqual(application.user_id, self.user.user_id)

        
    def test_create_job_application_missing_required_fields(self):
        # Submit an application without company and position.
        data = {
            "user": self.user.user_id,
            "status": "Applied"
        }

        response = self.client.post(
            "/api/job-applications/",
            data,
            format="json"
        )

        # The API should reject invalid submissions.
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        # Verify validation errors are returned.
        self.assertIn("company", response.data)
        self.assertIn("position", response.data)

        # Invalid submissions must not create database records.
        self.assertEqual(JobApplication.objects.count(), 0)

        
    def test_update_job_application_success(self):
        # Create an existing application.
        application = JobApplication.objects.create(
            user=self.user,
            company="Microsoft",
            position="Software Engineer",
            status="Applied"
        )

        # Update its status and position.
        data = {
            "status": "Interview",
            "position": "Senior Software Engineer"
        }

        response = self.client.patch(
            f"/api/job-applications/{application.job_id}/",
            data,
            format="json"
        )

        # Verify the API accepted the update.
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        # Reload the application from the database.
        application.refresh_from_db()

        # Verify the changes were saved.
        self.assertEqual(application.status, "Interview")
        self.assertEqual(
            application.position,
            "Senior Software Engineer"
        )

        # Editing must not create another application.
        self.assertEqual(JobApplication.objects.count(), 1)

        
    def test_delete_job_application_success(self):
        # Create an application to delete.
        application = JobApplication.objects.create(
            user=self.user,
            company="Google",
            position="Software Developer",
            status="Applied"
        )

        # Send a DELETE request.
        response = self.client.delete(
            f"/api/job-applications/{application.job_id}/"
        )

        # Verify the API returns 204 No Content.
        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )

        # Verify the application was removed from the database.
        self.assertEqual(JobApplication.objects.count(), 0)

        # Verify the deleted application no longer exists.
        self.assertFalse(
            JobApplication.objects.filter(
                job_id=application.job_id
            ).exists()
        )


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
