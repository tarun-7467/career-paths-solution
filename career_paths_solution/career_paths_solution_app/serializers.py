
from rest_framework import serializers
from .models import JobApplication, Reminder


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            "job_id",
            "user",
            "company",
            "position",
            "status",
            "date_applied",
            "notes",
            "location",
            "requisition_id",
            "employment_type",
            "work_mode",
            "posted_date",
            "job_url",
            "job_description",
            "created_at",
        ]
        read_only_fields = ["job_id", "created_at"]
class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = "__all__"