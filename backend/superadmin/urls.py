from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'user-groups', views.UserGroupViewSet, basename='user-group')
router.register(r'module-permissions', views.ModulePermissionViewSet, basename='module-permission')
router.register(r'subscription-plans', views.SubscriptionPlanViewSet, basename='subscription-plan')
router.register(r'tenant-subscriptions', views.TenantSubscriptionViewSet, basename='tenant-subscription')
router.register(r'audit-logs', views.AuditLogViewSet, basename='audit-log')
router.register(r'users', views.SuperAdminUserManagementViewSet, basename='superadmin-user')
router.register(r'tenants', views.SuperAdminTenantManagementViewSet, basename='superadmin-tenant')
router.register(r'stats', views.SuperAdminStatsViewSet, basename='superadmin-stats')

urlpatterns = [
    path('', include(router.urls)),
]
