from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganizationSettingsViewSet, RoleViewSet, UserActivityViewSet,
    SystemAnnouncementViewSet, BackupRecordViewSet, AdminDashboardViewSet,
    OrganizationUsersViewSet
)

router = DefaultRouter()
router.register(r'settings', OrganizationSettingsViewSet, basename='admin-settings')
router.register(r'roles', RoleViewSet, basename='admin-roles')
router.register(r'activities', UserActivityViewSet, basename='admin-activities')
router.register(r'announcements', SystemAnnouncementViewSet, basename='admin-announcements')
router.register(r'backups', BackupRecordViewSet, basename='admin-backups')
router.register(r'dashboard', AdminDashboardViewSet, basename='admin-dashboard')
router.register(r'users', OrganizationUsersViewSet, basename='admin-users')

urlpatterns = [
    path('', include(router.urls)),
]
