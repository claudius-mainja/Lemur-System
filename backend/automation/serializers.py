from rest_framework import serializers
from .models import AutomationSetting, Workflow, WorkflowLog, ScheduledTask, NotificationTemplate, AutomationAction


class AutomationSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutomationSetting
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class WorkflowSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Workflow
        fields = '__all__'
        read_only_fields = ['id', 'run_count', 'last_run_at', 'created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}"
        return None


class WorkflowLogSerializer(serializers.ModelSerializer):
    workflow_name = serializers.CharField(source='workflow.name', read_only=True)
    
    class Meta:
        model = WorkflowLog
        fields = '__all__'
        read_only_fields = ['id', 'started_at']


class ScheduledTaskSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ScheduledTask
        fields = '__all__'
        read_only_fields = ['id', 'last_run_at', 'created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}"
        return None


class NotificationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationTemplate
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AutomationActionSerializer(serializers.ModelSerializer):
    action_type_display = serializers.CharField(source='get_action_type_display', read_only=True)
    
    class Meta:
        model = AutomationAction
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
