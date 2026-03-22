from rest_framework import serializers
from django.contrib.auth.models import User
from .models import OrganizationSettings, Role, UserActivity, SystemAnnouncement, BackupRecord


class OrganizationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationSettings
        fields = '__all__'


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class UserActivitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserActivity
        fields = '__all__'


class SystemAnnouncementSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = SystemAnnouncement
        fields = '__all__'


class BackupRecordSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = BackupRecord
        fields = '__all__'


class UserWithOrganizationSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    role_display = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'is_active', 'date_joined', 'organization_id', 'organization_name', 
                  'role', 'role_display', 'modules']
    
    def get_role_display(self, obj):
        return getattr(obj, 'get_role_display', lambda: obj.role)()


class AdminDashboardSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    total_activities_today = serializers.IntegerField()
    pending_backups = serializers.IntegerField()
    active_announcements = serializers.IntegerField()
