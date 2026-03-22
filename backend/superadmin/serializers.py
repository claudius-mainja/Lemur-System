from rest_framework import serializers
from .models import UserGroup, ModulePermission, SubscriptionPlan, TenantSubscription, AuditLog


class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGroup
        fields = ['id', 'organization', 'name', 'description', 'permissions', 'modules', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ModulePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModulePermission
        fields = ['id', 'organization', 'module_name', 'module_display_name', 'features', 'is_enabled', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ['id', 'name', 'code', 'description', 'modules', 'features', 'price_monthly', 'price_yearly', 'max_users', 'max_storage_gb', 'is_active', 'is_trial_available', 'trial_days', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TenantSubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    
    class Meta:
        model = TenantSubscription
        fields = ['id', 'organization', 'plan', 'plan_name', 'status', 'start_date', 'end_date', 'auto_renew', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = ['id', 'organization', 'organization_name', 'user', 'user_email', 'action', 'resource_type', 'resource_id', 'details', 'ip_address', 'user_agent', 'created_at']
        read_only_fields = ['id', 'created_at']


class CreateUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    role = serializers.ChoiceField(choices=['admin', 'manager', 'hr', 'finance', 'employee'], default='employee')
    modules = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    department = serializers.CharField(max_length=100, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)


class CreateTenantSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    industry = serializers.CharField(max_length=50, required=False)
    country = serializers.CharField(max_length=10, required=False)
    currency = serializers.CharField(max_length=10, required=False)
    plan_code = serializers.CharField(max_length=50, default='starter')
