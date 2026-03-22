from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum
from datetime import datetime, timedelta
from decimal import Decimal

from .models import (
    Folder, Document, DocumentVersion, DocumentPermission,
    Project, ProjectMember, Milestone,
    Board, BoardColumn, TaskLabel, Task, TaskComment, TaskAttachment,
    TimeEntry, Event, EventAttendee,
    Channel, ChannelMember, Message, MessageRead, SharedLink
)
from .serializers import (
    FolderSerializer, DocumentSerializer, DocumentListSerializer, DocumentVersionSerializer,
    ProjectSerializer, ProjectMemberSerializer, MilestoneSerializer,
    BoardSerializer, BoardColumnSerializer, TaskLabelSerializer, TaskSerializer,
    TaskCommentSerializer, TaskAttachmentSerializer, TimeEntrySerializer,
    EventSerializer, EventAttendeeSerializer, ChannelSerializer, ChannelMemberSerializer,
    MessageSerializer, SharedLinkSerializer
)


class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Folder.objects.filter(organization=org)
        return Folder.objects.none()


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'tags']
    ordering_fields = ['name', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return DocumentListSerializer
        return DocumentSerializer

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Document.objects.filter(organization=org)
            
            folder = self.request.query_params.get('folder')
            if folder:
                queryset = queryset.filter(folder_id=folder)
            
            project = self.request.query_params.get('project')
            if project:
                queryset = queryset.filter(project_id=project)
            
            doc_type = self.request.query_params.get('type')
            if doc_type:
                queryset = queryset.filter(document_type=doc_type)
            
            return queryset
        return Document.objects.none()

    @action(detail=True, methods=['post'])
    def upload_version(self, request, pk=None):
        document = self.get_object()
        version = DocumentVersion.objects.create(
            document=document,
            version_number=document.version + 1,
            file=request.data.get('file'),
            size=request.data.get('size', 0),
            uploaded_by=request.user,
            change_notes=request.data.get('change_notes', '')
        )
        document.version += 1
        document.save()
        return Response(DocumentVersionSerializer(version).data)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at', 'start_date']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Project.objects.filter(organization=org).prefetch_related('members')
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            owner = self.request.query_params.get('owner')
            if owner:
                queryset = queryset.filter(owner_id=owner)
            
            return queryset
        return Project.objects.none()

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        project = self.get_object()
        members = project.members.all()
        return Response(ProjectMemberSerializer(members, many=True).data)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        project = self.get_object()
        member = ProjectMember.objects.create(
            project=project,
            user_id=request.data.get('user'),
            role=request.data.get('role', 'member')
        )
        return Response(ProjectMemberSerializer(member).data)

    @action(detail=True, methods=['get'])
    def milestones(self, request, pk=None):
        project = self.get_object()
        milestones = project.milestones.all()
        return Response(MilestoneSerializer(milestones, many=True).data)

    @action(detail=True, methods=['get'])
    def tasks(self, request, pk=None):
        project = self.get_object()
        tasks = project.tasks.all()
        return Response(TaskSerializer(tasks, many=True).data)


class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['due_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Milestone.objects.filter(organization=org)
            
            project = self.request.query_params.get('project')
            if project:
                queryset = queryset.filter(project_id=project)
            
            status_filter = self.request.query_params.get('status')
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            
            return queryset
        return Milestone.objects.none()

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        milestone = self.get_object()
        milestone.status = 'completed'
        milestone.completed_at = timezone.now()
        milestone.save()
        return Response(MilestoneSerializer(milestone).data)


class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Board.objects.filter(organization=org).prefetch_related('columns')
            
            project = self.request.query_params.get('project')
            if project:
                queryset = queryset.filter(project_id=project)
            
            return queryset
        return Board.objects.none()


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['priority', 'due_date', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Task.objects.filter(organization=org).select_related('assignee', 'column', 'board')
            
            board = self.request.query_params.get('board')
            if board:
                queryset = queryset.filter(board_id=board)
            
            column = self.request.query_params.get('column')
            if column:
                queryset = queryset.filter(column_id=column)
            
            assignee = self.request.query_params.get('assignee')
            if assignee:
                queryset = queryset.filter(assignee_id=assignee)
            
            status = self.request.query_params.get('status')
            if status:
                queryset = queryset.filter(column__name__icontains=status)
            
            priority = self.request.query_params.get('priority')
            if priority:
                queryset = queryset.filter(priority=priority)
            
            return queryset
        return Task.objects.none()

    @action(detail=True, methods=['post'])
    def move(self, request, pk=None):
        task = self.get_object()
        column_id = request.data.get('column_id')
        position = request.data.get('position', 0)
        
        if column_id:
            task.column_id = column_id
        task.position = position
        task.save()
        
        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        task = self.get_object()
        task.assignee_id = request.data.get('assignee_id')
        task.save()
        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        task = self.get_object()
        comments = task.comments.filter(parent__isnull=True)
        return Response(TaskCommentSerializer(comments, many=True).data)


class TaskCommentViewSet(viewsets.ModelViewSet):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['content']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return TaskComment.objects.filter(task__organization=org)
        return TaskComment.objects.none()


class TimeEntryViewSet(viewsets.ModelViewSet):
    queryset = TimeEntry.objects.all()
    serializer_class = TimeEntrySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['start_time', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = TimeEntry.objects.filter(organization=org)
            
            task = self.request.query_params.get('task')
            if task:
                queryset = queryset.filter(task_id=task)
            
            user = self.request.query_params.get('user')
            if user:
                queryset = queryset.filter(user_id=user)
            
            start_date = self.request.query_params.get('start_date')
            if start_date:
                queryset = queryset.filter(start_time__date__gte=start_date)
            
            end_date = self.request.query_params.get('end_date')
            if end_date:
                queryset = queryset.filter(start_time__date__lte=end_date)
            
            return queryset
        return TimeEntry.objects.none()


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['start_time', 'created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            queryset = Event.objects.filter(organization=org).prefetch_related('attendees')
            
            start_date = self.request.query_params.get('start_date')
            end_date = self.request.query_params.get('end_date')
            if start_date and end_date:
                queryset = queryset.filter(
                    start_time__date__gte=start_date,
                    end_time__date__lte=end_date
                )
            
            project = self.request.query_params.get('project')
            if project:
                queryset = queryset.filter(project_id=project)
            
            return queryset
        return Event.objects.none()

    @action(detail=True, methods=['post'])
    def add_attendee(self, request, pk=None):
        event = self.get_object()
        attendee = EventAttendee.objects.create(
            event=event,
            user_id=request.data.get('user_id')
        )
        return Response(EventAttendeeSerializer(attendee).data)


class ChannelViewSet(viewsets.ModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Channel.objects.filter(organization=org).prefetch_related('members')
        return Channel.objects.none()

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        channel = self.get_object()
        message = Message.objects.create(
            channel=channel,
            sender=request.user,
            content=request.data.get('content'),
            message_type=request.data.get('type', 'text'),
            organization=channel.organization
        )
        return Response(MessageSerializer(message).data)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        channel = self.get_object()
        limit = int(request.query_params.get('limit', 50))
        messages = channel.messages.filter(parent__isnull=True).order_by('-created_at')[:limit]
        return Response(MessageSerializer(messages, many=True).data)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        channel = self.get_object()
        member = ChannelMember.objects.create(
            channel=channel,
            user_id=request.data.get('user_id'),
            role=request.data.get('role', 'member')
        )
        return Response(ChannelMemberSerializer(member).data)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return Message.objects.filter(organization=org)
        return Message.objects.none()


class SharedLinkViewSet(viewsets.ModelViewSet):
    queryset = SharedLink.objects.all()
    serializer_class = SharedLinkSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['document__name']

    def get_queryset(self):
        org = getattr(self.request.user, 'organization', None)
        if org:
            return SharedLink.objects.filter(document__organization=org)
        return SharedLink.objects.none()

    @action(detail=True, methods=['get'])
    def access(self, request, pk=None):
        link = self.get_object()
        if link.expires_at and link.expires_at < timezone.now():
            return Response({'error': 'Link expired'}, status=status.HTTP_400_BAD_REQUEST)
        if link.max_downloads > 0 and link.download_count >= link.max_downloads:
            return Response({'error': 'Download limit reached'}, status=status.HTTP_400_BAD_REQUEST)
        link.download_count += 1
        link.save()
        return Response({'document_id': link.document_id, 'file_url': link.document.file.url})
