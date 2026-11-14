import hashlib
from urllib.parse import urlsplit

from django.db import transaction
from rest_framework import generics, status
from rest_framework.response import Response

from .models import JobApplication
from .serializers import JobApplicationSerializer


def get_job_hostname(job_url):
    try:
        return urlsplit(job_url or "").hostname or ""
    except ValueError:
        return ""


def build_stable_job_key(requisition_id, job_url):
    if requisition_id and requisition_id.strip():
        identifier = (
            f"requisition:{get_job_hostname(job_url)}:{requisition_id.strip()}"
        )
    elif job_url:
        identifier = f"url:{job_url}"
    else:
        return None

    return hashlib.sha256(identifier.encode("utf-8")).hexdigest()


class JobApplicationListCreateView(generics.ListCreateAPIView):
    queryset = JobApplication.objects.select_related("user").all()
    serializer_class = JobApplicationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application_data = serializer.validated_data
        user = application_data["user"]
        requisition_id = application_data.get("requisition_id") or ""
        job_url = application_data.get("job_url") or ""
        stable_job_key = build_stable_job_key(requisition_id, job_url)

        with transaction.atomic():
            applications = JobApplication.objects.filter(user=user)
            existing = (
                applications.filter(stable_job_key=stable_job_key).first()
                if stable_job_key else None
            )
            if not existing and requisition_id.strip():
                hostname = get_job_hostname(job_url)
                for candidate in applications.filter(
                    requisition_id=requisition_id.strip()
                ).order_by("job_id"):
                    if get_job_hostname(candidate.job_url) == hostname:
                        existing = candidate
                        break
            if not existing and job_url:
                existing = applications.filter(job_url=job_url).first()

            if existing:
                for field in (
                    "company",
                    "position",
                    "location",
                    "requisition_id",
                    "employment_type",
                    "work_mode",
                    "posted_date",
                    "job_url",
                    "job_description",
                ):
                    if application_data.get(field) not in (None, ""):
                        setattr(existing, field, application_data[field])
                existing.stable_job_key = stable_job_key or existing.stable_job_key
                existing.save()
                response_serializer = self.get_serializer(existing)
                return Response(response_serializer.data, status=status.HTTP_200_OK)

            application = serializer.save(stable_job_key=stable_job_key)

        response_serializer = self.get_serializer(application)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=self.get_success_headers(response_serializer.data),
        )


class JobApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    lookup_field = "job_id"

    def perform_update(self, serializer):
        application = serializer.instance
        requisition_id = serializer.validated_data.get(
            "requisition_id", application.requisition_id
        )
        job_url = serializer.validated_data.get("job_url", application.job_url)
        stable_job_key = build_stable_job_key(requisition_id, job_url)
        serializer.save(stable_job_key=stable_job_key)