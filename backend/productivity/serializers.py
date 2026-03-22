from rest_framework import serializers
from django.db.models import Count, Sum
from .models import (
    Folder, Document, DocumentVersion, DocumentPermission,
    Project, ProjectMember, Milestone,
    Board, BoardColumn, TaskLabel, Task, TaskComment, TaskAttachment,
    TimeEntry, Event, EventAttendee,
    Channel, ChannelMember, Message, MessageRead, SharedLink
)


class FolderSerializer(serializers.ModelSerializer):
    document_count = serializers.SerializerMethodField()

    class Meta:
        model = Folder
        fields = ['id', 'name', 'parent', 'document_count', 'created_at']

    def get_document_count(self, obj):
        return obj.documents.count()


class DocumentVersionSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = DocumentVersion
        fields = ['id', 'document', 'version_number', 'file', 'size', 'uploaded_by',
                  'uploaded_by_name', 'change_notes', 'created_at']


class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True, allow_null=True)
    folder_name = serializers.CharField(source='folder.name', read_only=True, allow_null=True)
    versions = DocumentVersionSerializer(many=True, read_only=True)

    class Meta:
        model = Document
        fields = ['id', 'name', 'file', 'folder', 'folder_name', 'document_type', 'size',
                  'mime_type', 'version', 'tags', 'uploaded_by', 'uploaded_by_name',
                  'project', 'versions', 'created_at', 'updated_at']


class DocumentListSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)

    class Meta:
        model = Document
        fields = ['id', 'name', 'document_type', 'size', 'mime_type', 'version',
                  'uploaded_by', 'uploaded_by_name', 'created_at']


class ProjectMemberSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = ProjectMember
        fields = ['id', 'project', 'user', 'user_name', 'user_email', 'role', 'joined_at']


class ProjectSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True, allow_null=True)
    member_count = serializers.SerializerMethodField()
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'status', 'start_date', 'end_date', 'budget',
                  'progress', 'owner', 'owner_name', 'member_count', 'task_count',
                  'created_at', 'updated_at']

    def get_member_count(self, obj):
        return obj.members.count()

    def get_task_count(self, obj):
        return obj.tasks.count()


class MilestoneSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = Milestone
        fields = ['id', 'project', 'project_name', 'name', 'description', 'due_date',
                  'completed_at', 'status', 'created_at']


class BoardColumnSerializer(serializers.ModelSerializer):
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = BoardColumn
        fields = ['id', 'board', 'name', 'position', 'wip_limit', 'color', 'task_count', 'created_at']

    def get_task_count(self, obj):
        return obj.tasks.count()


class BoardSerializer(serializers.ModelSerializer):
    columns = BoardColumnSerializer(many=True, read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = Board
        fields = ['id', 'name', 'project', 'project_name', 'board_type', 'columns', 'created_at', 'updated_at']


class TaskLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskLabel
        fields = ['id', 'board', 'name', 'color']


class TaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.CharField(source='assignee.get_full_name', read_only=True, allow_null=True)
    column_name = serializers.CharField(source='column.name', read_only=True, allow_null=True)
    board_name = serializers.CharField(source='board.name', read_only=True)
    comment_count = serializers.SerializerMethodField()
    attachment_count = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'board', 'board_name', 'column', 'column_name',
                  'assignee', 'assignee_name', 'priority', 'due_date', 'estimated_hours',
                  'actual_hours', 'progress', 'position', 'parent_task', 'labels', 'project',
                  'created_by', 'created_at', 'updated_at', 'comment_count', 'attachment_count']

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_attachment_count(self, obj):
        return obj.attachments.count()


class TaskCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = TaskComment
        fields = ['id', 'task', 'content', 'author', 'author_name', 'parent', 'replies',
                  'created_at', 'updated_at']

    def get_replies(self, obj):
        if obj.replies.exists():
            return TaskCommentSerializer(obj.replies.all(), many=True).data
        return []


class TaskAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = TaskAttachment
        fields = ['id', 'task', 'file', 'name', 'size', 'uploaded_by', 'uploaded_by_name', 'created_at']


class TimeEntrySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)

    class Meta:
        model = TimeEntry
        fields = ['id', 'task', 'task_title', 'user', 'user_name', 'start_time', 'end_time',
                  'duration', 'description', 'created_at', 'updated_at']


class EventAttendeeSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = EventAttendee
        fields = ['id', 'event', 'user', 'user_name', 'status']


class EventSerializer(serializers.ModelSerializer):
    attendees = EventAttendeeSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True, allow_null=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'start_time', 'end_time', 'all_day',
                  'location', 'reminder', 'recurrence_rule', 'color', 'project',
                  'project_name', 'created_by', 'created_by_name', 'attendees',
                  'created_at', 'updated_at']


class ChannelMemberSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = ChannelMember
        fields = ['id', 'channel', 'user', 'user_name', 'user_email', 'role', 'joined_at']


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    replies = serializers.SerializerMethodField()
    read_count = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'channel', 'sender', 'sender_name', 'content', 'message_type',
                  'file', 'parent', 'replies', 'is_edited', 'created_at', 'updated_at', 'read_count']

    def get_replies(self, obj):
        if obj.replies.exists():
            return MessageSerializer(obj.replies.all(), many=True).data
        return []

    def get_read_count(self, obj):
        return obj.read_by.count()


class ChannelSerializer(serializers.ModelSerializer):
    members = ChannelMemberSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Channel
        fields = ['id', 'name', 'description', 'is_private', 'created_by', 'members',
                  'member_count', 'last_message', 'created_at']

    def get_member_count(self, obj):
        return obj.members.count()

    def get_last_message(self, obj):
        last = obj.messages.order_by('-created_at').first()
        if last:
            return {
                'content': last.content[:50],
                'sender': last.sender.get_full_name(),
                'created_at': last.created_at
            }
        return None


class SharedLinkSerializer(serializers.ModelSerializer):
    document_name = serializers.CharField(source='document.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = SharedLink
        fields = ['id', 'document', 'document_name', 'token', 'created_by', 'created_by_name',
                  'expires_at', 'download_count', 'max_downloads', 'created_at']
