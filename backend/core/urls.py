from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('refresh/', views.refresh_token, name='refresh'),
    path('me/', views.get_current_user, name='current-user'),
    path('me/update/', views.update_current_user, name='update-current-user'),
    path('organization/', views.organization_detail, name='organization'),
    path('users/', views.users_list, name='users'),
    path('users/<str:user_id>/', views.user_detail, name='user-detail'),
    path('user-groups/', views.user_groups, name='user-groups'),
    path('user-groups/<str:group_id>/', views.user_group_detail, name='user-group-detail'),
    path('user-groups/<str:group_id>/add-user/', views.add_user_to_group, name='add-user-to-group'),
    path('user-groups/<str:group_id>/remove-user/', views.remove_user_from_group, name='remove-user-from-group'),
    path('audit-logs/', views.audit_logs, name='audit-logs'),
    path('subscription-plans/', views.subscription_plans, name='subscription-plans'),
    path('purchase-extra-users/', views.purchase_extra_users, name='purchase-extra-users'),
    path('stats/', views.organization_stats, name='organization-stats'),
    path('health/', views.health_check, name='health'),
    path('info/', views.api_info, name='api-info'),
]
