from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from django.utils import timezone
from .models import Project, Task, TimeEntry, Document
from .serializers import (
    ProjectSerializer, ProjectDetailSerializer,
    TaskSerializer, TaskDetailSerializer,
    TimeEntrySerializer, DocumentSerializer
)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'start_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Project.objects.filter(organization=org).select_related('owner')
        return Project.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(self.request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        projects = Project.objects.filter(organization=org)
        tasks = Task.objects.filter(organization=org)
        return Response({
            'total_projects': projects.count(),
            'active_projects': projects.filter(status='active').count(),
            'completed_projects': projects.filter(status='completed').count(),
            'total_tasks': tasks.count(),
            'pending_tasks': tasks.filter(status='todo').count(),
            'in_progress_tasks': tasks.filter(status='in_progress').count(),
            'completed_tasks': tasks.filter(status='done').count(),
        })


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'priority', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Task.objects.filter(organization=org).select_related('project', 'assignee')
        return Task.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TaskDetailSerializer
        return TaskSerializer

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        task = self.get_object()
        task.status = 'in_progress'
        task.save()
        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        task.status = 'done'
        task.save()
        return Response(TaskSerializer(task).data)

    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        tasks = self.get_queryset().filter(assignee=request.user)
        return Response(TaskSerializer(tasks, many=True).data)


class TimeEntryViewSet(viewsets.ModelViewSet):
    queryset = TimeEntry.objects.all()
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['description', 'task__title']
    ordering_fields = ['start_time', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return TimeEntry.objects.filter(organization=org).select_related('task', 'user')
        return TimeEntry.objects.none()

    @action(detail=False, methods=['post'])
    def start_timer(self, request):
        task_id = request.data.get('task')
        if not task_id:
            return Response({'error': 'task is required'}, status=status.HTTP_400_BAD_REQUEST)

        active_entry = TimeEntry.objects.filter(
            user=request.user,
            end_time__isnull=True
        ).first()
        
        if active_entry:
            return Response({'error': 'You already have an active timer'}, status=status.HTTP_400_BAD_REQUEST)

        org = getattr(request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)

        time_entry = TimeEntry.objects.create(
            task_id=task_id,
            user=request.user,
            start_time=timezone.now(),
            organization=org
        )
        return Response(TimeEntrySerializer(time_entry).data)

    @action(detail=False, methods=['post'])
    def stop_timer(self, request):
        time_entry = TimeEntry.objects.filter(
            user=request.user,
            end_time__isnull=True
        ).first()

        if not time_entry:
            return Response({'error': 'No active timer found'}, status=status.HTTP_400_BAD_REQUEST)

        time_entry.end_time = timezone.now()
        duration = (time_entry.end_time - time_entry.start_time).total_seconds() / 60
        time_entry.duration = int(duration)
        time_entry.save()
        return Response(TimeEntrySerializer(time_entry).data)

    @action(detail=False, methods=['get'])
    def my_entries(self, request):
        entries = self.get_queryset().filter(user=request.user)
        return Response(TimeEntrySerializer(entries, many=True).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        org = getattr(self.request.user, 'organization', None)
        if not org:
            return Response({'error': 'Organization not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        entries = TimeEntry.objects.filter(organization=org)
        return Response({
            'total_entries': entries.count(),
            'total_minutes': entries.aggregate(total=Sum('duration'))['total'] or 0,
            'total_hours': round((entries.aggregate(total=Sum('duration'))['total'] or 0) / 60, 2),
        })


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Document.objects.filter(organization=org).select_related('project', 'task', 'uploaded_by')
        return Document.objects.none()
