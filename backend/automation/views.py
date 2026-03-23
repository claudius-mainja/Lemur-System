from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import uuid

from .models import AutomationSetting, Workflow, WorkflowLog, ScheduledTask, NotificationTemplate, AutomationAction
from .serializers import (
    AutomationSettingSerializer, WorkflowSerializer, WorkflowLogSerializer,
    ScheduledTaskSerializer, NotificationTemplateSerializer, AutomationActionSerializer
)


class IsAdminOrHasModuleAccess:
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role in ['admin', 'super_admin', 'manager'] or
            'automation' in (request.user.modules or [])
        )


class AutomationSettingViewSet(viewsets.ModelViewSet):
    queryset = AutomationSetting.objects.all()
    serializer_class = AutomationSettingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['setting_name', 'module']
    ordering_fields = ['module', 'setting_name', 'created_at']

    def get_queryset(self):
        if hasattr(self.request.user, 'organization') and self.request.user.organization:
            return AutomationSetting.objects.filter(organization=self.request.user.organization)
        return AutomationSetting.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'organization') and self.request.user.organization:
            serializer.save(organization=self.request.user.organization)

    @action(detail=True, methods=['post'])
    def toggle_automated(self, request, pk=None):
        setting = self.get_object()
        setting.is_automated = not setting.is_automated
        setting.save()
        return Response({
            'is_automated': setting.is_automated,
            'message': f'Automation {"enabled" if setting.is_automated else "disabled"}'
        })

    @action(detail=True, methods=['post'])
    def toggle_enabled(self, request, pk=None):
        setting = self.get_object()
        setting.is_enabled = not setting.is_enabled
        setting.save()
        return Response({
            'is_enabled': setting.is_enabled,
            'message': f'Setting {"enabled" if setting.is_enabled else "disabled"}'
        })


class WorkflowViewSet(viewsets.ModelViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'module']
    ordering_fields = ['name', 'status', 'created_at']

    def get_queryset(self):
        if hasattr(self.request.user, 'organization') and self.request.user.organization:
            return Workflow.objects.filter(organization=self.request.user.organization)
        return Workflow.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'organization') and self.request.user.organization:
            serializer.save(
                organization=self.request.user.organization,
                created_by=self.request.user
            )

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        workflow = self.get_object()
        workflow.status = 'active'
        workflow.save()
        return Response({'status': 'active', 'message': 'Workflow activated'})

    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        workflow = self.get_object()
        workflow.status = 'paused'
        workflow.save()
        return Response({'status': 'paused', 'message': 'Workflow paused'})

    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        workflow = self.get_object()
        workflow.run_count += 1
        workflow.last_run_at = timezone.now()
        workflow.save()
        
        WorkflowLog.objects.create(
            workflow=workflow,
            organization=workflow.organization,
            status='completed',
            completed_at=timezone.now()
        )
        
        return Response({'message': 'Workflow executed', 'run_count': workflow.run_count})

    @action(detail=True, methods=['post'])
    def toggle_automated(self, request, pk=None):
        workflow = self.get_object()
        workflow.is_automated = not workflow.is_automated
        workflow.save()
        return Response({
            'is_automated': workflow.is_automated,
            'message': f'Automation {"enabled" if workflow.is_automated else "disabled"}'
        })


class WorkflowLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WorkflowLog.objects.all()
    serializer_class = WorkflowLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['workflow__name']
    ordering_fields = ['started_at', 'status']

    def get_queryset(self):
        if hasattr(self.request.user, 'organization') and self.request.user.organization:
            return WorkflowLog.objects.filter(organization=self.request.user.organization)
        return WorkflowLog.objects.none()


class ScheduledTaskViewSet(viewsets.ModelViewSet):
    queryset = ScheduledTask.objects.all()
    serializer_class = ScheduledTaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'task_type', 'module']
    ordering_fields = ['name', 'task_type', 'created_at']

    def get_queryset(self):
        if hasattr(self.request.user, 'organization') and self.request.user.organization:
            return ScheduledTask.objects.filter(organization=self.request.user.organization)
        return ScheduledTask.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'organization') and self.request.user.organization:
            serializer.save(
                organization=self.request.user.organization,
                created_by=self.request.user
            )

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        task = self.get_object()
        task.is_active = not task.is_active
        task.save()
        return Response({
            'is_active': task.is_active,
            'message': f'Task {"activated" if task.is_active else "deactivated"}'
        })

    @action(detail=True, methods=['post'])
    def toggle_automated(self, request, pk=None):
        task = self.get_object()
        task.is_automated = not task.is_automated
        task.save()
        return Response({
            'is_automated': task.is_automated,
            'message': f'Automation {"enabled" if task.is_automated else "disabled"}'
        })

    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        task = self.get_object()
        task.status = 'running'
        task.last_run_at = timezone.now()
        task.save()
        
        return Response({'message': 'Task executed', 'status': 'running'})


class NotificationTemplateViewSet(viewsets.ModelViewSet):
    queryset = NotificationTemplate.objects.all()
    serializer_class = NotificationTemplateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'template_type']
    ordering_fields = ['name', 'template_type', 'created_at']

    def get_queryset(self):
        if hasattr(self.request.user, 'organization') and self.request.user.organization:
            return NotificationTemplate.objects.filter(organization=self.request.user.organization)
        return NotificationTemplate.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'organization') and self.request.user.organization:
            serializer.save(organization=self.request.user.organization)


class AutomationActionViewSet(viewsets.ModelViewSet):
    queryset = AutomationAction.objects.all()
    serializer_class = AutomationActionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['order', 'created_at']

    def get_queryset(self):
        workflow_id = self.request.query_params.get('workflow_id')
        if workflow_id:
            return AutomationAction.objects.filter(workflow_id=workflow_id)
        return AutomationAction.objects.none()

    @action(detail=True, methods=['post'])
    def toggle_automated(self, request, pk=None):
        action = self.get_object()
        action.is_automated = not action.is_automated
        action.save()
        return Response({
            'is_automated': action.is_automated,
            'message': f'Action automation {"enabled" if action.is_automated else "disabled"}'
        })


class AutomationDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        if not hasattr(self.request.user, 'organization') or not self.request.user.organization:
            return Response({
                'total_workflows': 0,
                'active_workflows': 0,
                'total_tasks': 0,
                'active_tasks': 0,
                'automated_count': 0,
                'manual_count': 0,
            })
        
        org = self.request.user.organization
        
        return Response({
            'total_workflows': Workflow.objects.filter(organization=org).count(),
            'active_workflows': Workflow.objects.filter(organization=org, status='active').count(),
            'total_tasks': ScheduledTask.objects.filter(organization=org).count(),
            'active_tasks': ScheduledTask.objects.filter(organization=org, is_active=True).count(),
            'automated_count': Workflow.objects.filter(organization=org, is_automated=True).count(),
            'manual_count': Workflow.objects.filter(organization=org, is_automated=False).count(),
        })

    @action(detail=False, methods=['get'])
    def modules(self, request):
        return Response({
            'modules': [
                {'code': 'hr', 'name': 'Human Resources', 'settings': [
                    'auto_attendance_reminder', 'leave_approval_auto', 'anniversary_reminder',
                    'probation_alert', 'contract_renewal_alert', 'overtime_approval_auto'
                ]},
                {'code': 'finance', 'name': 'Finance & Accounting', 'settings': [
                    'invoice_reminder_auto', 'payment_reconciliation_auto', 'expense_approval_auto',
                    'budget_alert', 'monthly_report_auto', 'tax_reminder'
                ]},
                {'code': 'payroll', 'name': 'Payroll', 'settings': [
                    'payroll_process_auto', 'payslip_distribution_auto', 'tax_calculation_auto',
                    'leave_adjustment_auto', 'bonus_processing_auto'
                ]},
                {'code': 'crm', 'name': 'Customer Relations', 'settings': [
                    'lead_assignment_auto', 'follow_up_reminder_auto', 'deal_stage_alert',
                    'customer_anniversary_auto', 'task_assignment_auto'
                ]},
                {'code': 'inventory', 'name': 'Inventory', 'settings': [
                    'low_stock_alert', 'reorder_auto', 'supplier_payment_auto',
                    'delivery_tracking_auto', 'stock_valuation_auto'
                ]},
                {'code': 'productivity', 'name': 'Productivity', 'settings': [
                    'task_reminder_auto', 'meeting_summary_auto', 'deadline_alert',
                    'project_status_auto', 'document_backup_auto'
                ]},
                {'code': 'marketing', 'name': 'Marketing', 'settings': [
                    'campaign_schedule_auto', 'email_sequence_auto', 'lead_score_auto',
                    'campaign_report_auto', 'social_post_auto'
                ]},
                {'code': 'services', 'name': 'Help Desk', 'settings': [
                    'ticket_assignment_auto', 'sla_alert', 'customer_satisfaction_auto',
                    'escalation_auto', 'resolution_summary_auto'
                ]},
            ]
        })
