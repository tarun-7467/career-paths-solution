from django.shortcuts import render
from rest_framework import generics
from .models import JobApplication
from.serializers import JobApplicationSerializer

class JobApplicationListCreateView(generics.ListCreateAPIView):
    queryset = JobApplication.objects.select_related("user").all()
    serializer_class = JobApplicationSerializer

class JobApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    lookup_field = "job_id"