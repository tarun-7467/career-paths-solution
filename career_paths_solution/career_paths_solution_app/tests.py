
from rest_framework.test import APITestCase
from rest_framework import status

from .models import User, JobApplication


class JobApplicationAPITests(APITestCase):

    def setUp(self):
        # Create a test user in the isolated test database.
        self.user = User.objects.create(
            name="Test User",
            email="test@example.com",
            password_hash="test_hash"
        )

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

