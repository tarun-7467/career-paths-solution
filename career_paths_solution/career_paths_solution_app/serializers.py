from rest_framework import serializers
from .models import JobApplication

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            "job_id", "user", "company", "position", "status", "date_applied", "notes", "created_at"
        ]
        read_only_fields = ["job_id", "created_at"]