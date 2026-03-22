from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from django.utils import timezone
from django.db import models
from .models import OrganizationSettings, Role, UserActivity, SystemAnnouncement, BackupRecord
from .serializers import (
    OrganizationSettingsSerializer, RoleSerializer, UserActivitySerializer,
    SystemAnnouncementSerializer, BackupRecordSerializer, UserWithOrganizationSerializer,
    AdminDashboardSerializer
)

User = settings.AUTH_USER_MODEL


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_staff or 
            getattr(request.user, 'role', None) in ['admin', 'super_admin'] or
            request.user.is_superuser
        )


class OrganizationSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSettingsSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'organization_id'):
            return OrganizationSettings.objects.filter(organization_id=user.organization_id)
        return OrganizationSettings.objects.none()
    
    def perform_create(self, serializer):
        if hasattr(self.request.user, 'organization_id'):
            serializer.save(organization_id=self.request.user.organization_id)


class RoleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'organization_id'):
            return Role.objects.filter(organization_id=user.organization_id)
        return Role.objects.none()
    
    def perform_create(self, serializer):
        if hasattr(self.request.user, 'organization_id'):
            serializer.save(organization_id=self.request.user.organization_id)


class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserActivitySerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'organization_id'):
            return UserActivity.objects.filter(organization_id=user.organization_id)
        return UserActivity.objects.none()
    
    @action(detail=False, methods=['get'])
    def by_user(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            activities = self.get_queryset().filter(user_id=user_id)[:50]
        else:
            activities = self.get_queryset()[:50]
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)


class SystemAnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = SystemAnnouncementSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        user = self.request.user
        queryset = SystemAnnouncement.objects.all()
        if hasattr(user, 'organization_id'):
            queryset = queryset.filter(
                models.Q(organization_id=user.organization_id) |
                models.Q(is_global=True)
            )
        return queryset.filter(is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class BackupRecordViewSet(viewsets.ModelViewSet):
    serializer_class = BackupRecordSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'organization_id'):
            return BackupRecord.objects.filter(organization_id=user.organization_id)
        return BackupRecord.objects.none()
    
    @action(detail=False, methods=['post'])
    def create_backup(self, request):
        if hasattr(request.user, 'organization_id'):
            backup = BackupRecord.objects.create(
                organization_id=request.user.organization_id,
                backup_type='manual',
                status='pending',
                created_by=request.user
            )
            backup.status = 'in_progress'
            backup.started_at = timezone.now()
            backup.save()
            
            return Response({
                'message': 'Backup initiated',
                'backup_id': backup.id
            }, status=status.HTTP_201_CREATED)
        return Response({'error': 'No organization associated'}, status=status.HTTP_400_BAD_REQUEST)


class AdminDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    
    def list(self, request):
        user = request.user
        
        if hasattr(user, 'organization_id'):
            org_id = user.organization_id
            
            total_users = User.objects.filter(organization_id=org_id).count()
            active_users = User.objects.filter(organization_id=org_id, is_active=True).count()
            
            today = timezone.now().date()
            activities_today = UserActivity.objects.filter(
                organization_id=org_id,
                created_at__date=today
            ).count()
            
            pending_backups = BackupRecord.objects.filter(
                organization_id=org_id,
                status__in=['pending', 'in_progress']
            ).count()
            
            active_announcements = SystemAnnouncement.objects.filter(
                models.Q(organization_id=org_id) | models.Q(is_global=True),
                is_active=True
            ).count()
            
            data = {
                'total_users': total_users,
                'active_users': active_users,
                'total_activities_today': activities_today,
                'pending_backups': pending_backups,
                'active_announcements': active_announcements,
            }
            
            serializer = AdminDashboardSerializer(data)
            return Response(serializer.data)
        
        return Response({
            'total_users': 0,
            'active_users': 0,
            'total_activities_today': 0,
            'pending_backups': 0,
            'active_announcements': 0,
        })


class OrganizationUsersViewSet(viewsets.ModelViewSet):
    serializer_class = UserWithOrganizationSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ['get', 'put', 'patch', 'delete']
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'organization_id'):
            return User.objects.filter(organization_id=user.organization_id)
        return User.objects.none()
    
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        user_obj = self.get_object()
        user_obj.is_active = not user_obj.is_active
        user_obj.save()
        
        UserActivity.objects.create(
            user=request.user,
            organization_id=request.user.organization_id,
            action='toggle_user_status',
            resource_type='user',
            resource_id=str(user_obj.id),
            details={'new_status': user_obj.is_active}
        )
        
        return Response({
            'message': f'User {"activated" if user_obj.is_active else "deactivated"}',
            'is_active': user_obj.is_active
        })
    
    @action(detail=True, methods=['post'])
    def update_modules(self, request, pk=None):
        user_obj = self.get_object()
        modules = request.data.get('modules', [])
        
        if hasattr(user_obj, 'modules'):
            user_obj.modules = modules
            user_obj.save()
        
        UserActivity.objects.create(
            user=request.user,
            organization_id=request.user.organization_id,
            action='update_user_modules',
            resource_type='user',
            resource_id=str(user_obj.id),
            details={'modules': modules}
        )
        
        return Response({
            'message': 'User modules updated',
            'modules': modules
        })
