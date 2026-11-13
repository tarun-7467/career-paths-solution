from django.shortcuts import render
from rest_framework import generics
from .models import JobApplication, Reminder 
from.serializers import JobApplicationSerializer, ReminderSerializer

class JobApplicationListCreateView(generics.ListCreateAPIView):
    queryset = JobApplication.objects.select_related("user").all()
    serializer_class = JobApplicationSerializer

class JobApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    lookup_field = "job_id"

class ReminderListCreateView(generics.ListCreateAPIView):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer

class ReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    lookup_field = "reminder_id"