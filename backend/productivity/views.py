from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count
from .models import Task, Meeting, Project
from .serializers import TaskSerializer, MeetingSerializer, ProjectSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'priority', 'assigned_to']
    search_fields = ['title', 'description', 'assigned_name']
    ordering_fields = ['created_at', 'title', 'due_date', 'priority']

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(organization_id=user.organization_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(
            organization_id=self.request.user.organization_id,
            created_by=self.request.user.id
        )

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        task.status = 'completed'
        task.completed_at = timezone.now()
        task.save()
        return Response({'message': 'Task marked as completed'})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        now = timezone.now()
        return Response({
            'total_tasks': queryset.count(),
            'todo': queryset.filter(status='todo').count(),
            'in_progress': queryset.filter(status='in_progress').count(),
            'completed': queryset.filter(status='completed').count(),
            'overdue': queryset.filter(due_date__lt=now, status__in=['todo', 'in_progress', 'review']).count(),
        })

    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        queryset = self.get_queryset().filter(assigned_to=request.user.id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'meeting_type', 'recurring']
    search_fields = ['title', 'description', 'organizer_name']
    ordering_fields = ['created_at', 'start_time', 'title']

    def get_queryset(self):
        user = self.request.user
        queryset = Meeting.objects.filter(organization_id=user.organization_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(
            organization_id=self.request.user.organization_id,
            organizer_id=self.request.user.id,
            organizer_name=f"{self.request.user.first_name} {self.request.user.last_name}"
        )

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        now = timezone.now()
        queryset = self.get_queryset().filter(start_time__gte=now, status='scheduled')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        now = timezone.now()
        return Response({
            'total_meetings': queryset.count(),
            'scheduled': queryset.filter(status='scheduled').count(),
            'in_progress': queryset.filter(status='in_progress').count(),
            'completed': queryset.filter(status='completed').count(),
            'upcoming': queryset.filter(start_time__gte=now).count(),
        })


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'priority']
    search_fields = ['name', 'description', 'client_name', 'project_code']
    ordering_fields = ['created_at', 'name', 'start_date', 'priority']

    def get_queryset(self):
        user = self.request.user
        queryset = Project.objects.filter(organization_id=user.organization_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(
            organization_id=self.request.user.organization_id,
            created_by=self.request.user.id,
            owner_id=self.request.user.id,
            owner_name=f"{self.request.user.first_name} {self.request.user.last_name}"
        )

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        return Response({
            'total_projects': queryset.count(),
            'planning': queryset.filter(status='planning').count(),
            'active': queryset.filter(status='active').count(),
            'completed': queryset.filter(status='completed').count(),
        })

    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        project = self.get_object()
        tasks = Task.objects.filter(project=project)
        meetings = Meeting.objects.filter(project=project)
        return Response({
            'project': ProjectSerializer(project).data,
            'task_summary': {
                'total': tasks.count(),
                'completed': tasks.filter(status='completed').count(),
                'in_progress': tasks.filter(status='in_progress').count(),
            },
            'meeting_summary': {
                'total': meetings.count(),
                'upcoming': meetings.filter(start_time__gte=timezone.now()).count(),
            },
        })
