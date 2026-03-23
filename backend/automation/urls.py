from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AutomationSettingViewSet, WorkflowViewSet, WorkflowLogViewSet,
    ScheduledTaskViewSet, NotificationTemplateViewSet, AutomationActionViewSet,
    AutomationDashboardViewSet
)

router = DefaultRouter()
router.register(r'settings', AutomationSettingViewSet, basename='automation-settings')
router.register(r'workflows', WorkflowViewSet, basename='workflows')
router.register(r'workflow-logs', WorkflowLogViewSet, basename='workflow-logs')
router.register(r'scheduled-tasks', ScheduledTaskViewSet, basename='scheduled-tasks')
router.register(r'notification-templates', NotificationTemplateViewSet, basename='notification-templates')
router.register(r'actions', AutomationActionViewSet, basename='automation-actions')
router.register(r'dashboard', AutomationDashboardViewSet, basename='automation-dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
