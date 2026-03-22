from rest_framework import serializers
from .models import Project, Task, TimeEntry, Document


class TaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.CharField(source='assignee.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Task
        fields = [
            'id', 'project', 'title', 'description', 'status', 'priority',
            'assignee', 'assignee_name', 'due_date', 'estimated_hours',
            'created_at', 'updated_at'
        ]


class TaskDetailSerializer(TaskSerializer):
    time_entries = serializers.SerializerMethodField()
    total_time = serializers.SerializerMethodField()

    class Meta(TaskSerializer.Meta):
        fields = TaskSerializer.Meta.fields + ['time_entries', 'total_time']

    def get_time_entries(self, obj):
        from .serializers import TimeEntrySerializer
        return TimeEntrySerializer(obj.time_entries.all()[:10], many=True).data

    def get_total_time(self, obj):
        return sum(te.duration for te in obj.time_entries.all())


class ProjectSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True, allow_null=True)
    task_count = serializers.SerializerMethodField()
    completed_task_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'status', 'priority', 'start_date',
            'end_date', 'owner', 'owner_name', 'task_count', 'completed_task_count',
            'created_at', 'updated_at'
        ]

    def get_task_count(self, obj):
        return obj.tasks.count()

    def get_completed_task_count(self, obj):
        return obj.tasks.filter(status='done').count()


class ProjectDetailSerializer(ProjectSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ['tasks']


class TimeEntrySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)

    class Meta:
        model = TimeEntry
        fields = [
            'id', 'task', 'task_title', 'user', 'user_name', 'start_time',
            'end_time', 'duration', 'description', 'created_at'
        ]


class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Document
        fields = [
            'id', 'project', 'task', 'name', 'file', 'file_size',
            'mime_type', 'uploaded_by', 'uploaded_by_name', 'created_at'
        ]
