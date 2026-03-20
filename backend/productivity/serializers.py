from rest_framework import serializers
from .models import Task, Meeting, Project


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'organization_id', 'project', 'title', 'description', 'assigned_to',
            'assigned_name', 'priority', 'status', 'due_date', 'completed_at',
            'estimated_hours', 'actual_hours', 'tags', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = [
            'id', 'organization_id', 'title', 'description', 'meeting_type', 'start_time',
            'end_time', 'timezone', 'location', 'meeting_link', 'organizer_id', 'organizer_name',
            'attendees', 'recurring', 'project', 'status', 'notes', 'agenda',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id', 'organization_id', 'name', 'description', 'project_code', 'client_name',
            'start_date', 'end_date', 'budget', 'priority', 'status', 'owner_id', 'owner_name',
            'team_members', 'tags', 'progress', 'notes', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TaskStatsSerializer(serializers.Serializer):
    total_tasks = serializers.IntegerField()
    todo = serializers.IntegerField()
    in_progress = serializers.IntegerField()
    completed = serializers.IntegerField()
    overdue = serializers.IntegerField()


class MeetingStatsSerializer(serializers.Serializer):
    total_meetings = serializers.IntegerField()
    scheduled = serializers.IntegerField()
    in_progress = serializers.IntegerField()
    completed = serializers.IntegerField()
    upcoming = serializers.IntegerField()


class ProjectStatsSerializer(serializers.Serializer):
    total_projects = serializers.IntegerField()
    planning = serializers.IntegerField()
    active = serializers.IntegerField()
    completed = serializers.IntegerField()
