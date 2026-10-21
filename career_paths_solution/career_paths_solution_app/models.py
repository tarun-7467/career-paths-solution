from django.utils import timezone
from django.db import models

# Create your models here.
class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = False
        db_table = "users"

class JobApplication(models.Model):
    job_id = models.AutoField(primary_key=True)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        db_column="user_id"
    )

    company = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    date_applied = models.DateField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    # Additional job details from job postings and Chrome Extension
    location = models.CharField(max_length=255, null=True, blank=True)
    requisition_id = models.CharField(max_length=100, null=True, blank=True)
    employment_type = models.CharField(max_length=100, null=True, blank=True)
    work_mode = models.CharField(max_length=50, null=True, blank=True)
    posted_date = models.CharField(max_length=100, null=True, blank=True)
    job_url = models.TextField(null=True, blank=True)
    job_description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = False
        db_table = "job_applications"

class Reminder(models.Model):
    reminder_id = models.AutoField(primary_key=True)

    job = models.ForeignKey(
        JobApplication,
        on_delete=models.CASCADE,
        db_column="job_id"
    )

    reminder_name = models.CharField(max_length=255)
    reminder_date = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = False
        db_table = "reminders"