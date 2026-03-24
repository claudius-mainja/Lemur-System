from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from datetime import datetime

from core.views import (
    register, login, refresh_token, get_current_user, update_current_user, logout,
    health_check, api_info, organization_detail, organization_stats,
    users_list, user_detail, user_groups, user_group_detail,
    add_user_to_group, remove_user_from_group, audit_logs, subscription_plans,
    purchase_extra_users, dashboard_stats, module_permissions,
    bulk_user_action, team_members, activity_log_summary, industries_and_modules
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/health/', health_check, name='health-check'),
    path('api/v1/', api_info, name='api-info'),
    
    path('api/v1/auth/register/', register, name='register'),
    path('api/v1/auth/login/', login, name='login'),
    path('api/v1/auth/refresh/', refresh_token, name='refresh-token'),
    path('api/v1/auth/logout/', logout, name='logout'),
    path('api/v1/auth/me/', get_current_user, name='current-user'),
    path('api/v1/auth/me/update/', update_current_user, name='update-current-user'),
    
    path('api/v1/organization/', organization_detail, name='organization-detail'),
    path('api/v1/organization/stats/', organization_stats, name='organization-stats'),
    path('api/v1/dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    
    path('api/v1/users/', users_list, name='users-list'),
    path('api/v1/users/bulk-action/', bulk_user_action, name='bulk-user-action'),
    path('api/v1/users/<str:user_id>/', user_detail, name='user-detail'),
    
    path('api/v1/team/members/', team_members, name='team-members'),
    
    path('api/v1/groups/', user_groups, name='user-groups'),
    path('api/v1/groups/<str:group_id>/', user_group_detail, name='user-group-detail'),
    path('api/v1/groups/<str:group_id>/add-user/', add_user_to_group, name='add-user-to-group'),
    path('api/v1/groups/<str:group_id>/remove-user/', remove_user_from_group, name='remove-user-from-group'),
    
    path('api/v1/audit-logs/', audit_logs, name='audit-logs'),
    path('api/v1/audit-logs/summary/', activity_log_summary, name='activity-log-summary'),
    
    path('api/v1/plans/', subscription_plans, name='subscription-plans'),
    path('api/v1/extra-users/', purchase_extra_users, name='purchase-extra-users'),
    
    path('api/v1/modules/permissions/', module_permissions, name='module-permissions'),
    path('api/v1/industries/', industries_and_modules, name='industries-modules'),
    
    path('api/v1/hr/', include('hr.urls')),
    path('api/v1/crm/', include('crm.urls')),
    path('api/v1/finance/', include('finance.urls')),
    path('api/v1/inventory/', include('inventory.urls')),
    path('api/v1/payroll/', include('payroll.urls')),
    path('api/v1/productivity/', include('productivity.urls')),
    path('api/v1/marketing/', include('marketing.urls')),
    path('api/v1/services/', include('services.urls')),
    path('api/v1/superadmin/', include('superadmin.urls')),
    path('api/v1/admin/', include('orgadmin.urls')),
    path('api/v1/automation/', include('automation.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
