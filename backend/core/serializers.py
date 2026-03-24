from rest_framework import serializers
from .models import User, Organization, UserGroup, AuditLog
import uuid
from datetime import timedelta
from django.utils import timezone


PLAN_MODULES = {
    'starter': ['hr', 'finance', 'inventory'],
    'professional': ['hr', 'finance', 'crm', 'payroll', 'productivity', 'inventory', 'marketing', 'services'],
    'enterprise': ['hr', 'finance', 'crm', 'payroll', 'productivity', 'inventory', 'marketing', 'services', 'operations'],
}

PLAN_MAX_USERS = {
    'starter': 5,
    'professional': 25,
    'enterprise': 100,
}

EXTRA_USER_COST = 5.00


class UserSerializer(serializers.ModelSerializer):
    organization_name = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name', 'role',
            'department', 'phone', 'organization', 'organization_name',
            'industry', 'subscription', 'currency', 'country', 'timezone',
            'modules', 'user_groups', 'is_active', 'is_on_trial', 'trial_ends_at',
            'extra_users', 'extra_users_cost', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'is_active', 'is_on_trial', 'trial_ends_at', 'date_joined', 'last_login']
    
    def get_organization_name(self, obj):
        return obj.organization.name if obj.organization else None
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class UserListSerializer(serializers.ModelSerializer):
    organization_name = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name', 'role',
            'department', 'phone', 'organization', 'organization_name',
            'industry', 'subscription', 'modules', 'is_active',
            'date_joined', 'last_login'
        ]
    
    def get_organization_name(self, obj):
        return obj.organization.name if obj.organization else None
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class OrganizationSerializer(serializers.ModelSerializer):
    user_count = serializers.SerializerMethodField()
    max_users_total = serializers.SerializerMethodField()
    extra_users_cost = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'email', 'phone', 'address', 'city', 'state', 'country',
            'industry', 'subscription', 'currency', 'modules', 'max_users',
            'extra_users', 'extra_users_cost', 'user_count', 'max_users_total',
            'is_active', 'is_on_trial', 'trial_ends_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user_count', 'max_users_total', 'extra_users_cost', 'created_at', 'updated_at']
    
    def get_user_count(self, obj):
        return obj.get_active_user_count()
    
    def get_max_users_total(self, obj):
        return obj.get_max_users_total()
    
    def get_extra_users_cost(self, obj):
        return float(obj.get_extra_users_cost())


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    organization_name = serializers.CharField(max_length=200)
    industry = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100)
    currency = serializers.CharField(max_length=10)
    subscription = serializers.CharField(required=False)
    plan = serializers.CharField(required=False)

    def validate(self, data):
        password_confirm = data.get('password_confirm')
        if password_confirm and data['password'] != password_confirm:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match'})
        
        if 'plan' in data:
            data['subscription'] = data.pop('plan')
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        validated_data.pop('plan', None)
        
        org_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        
        is_first_user = User.objects.count() == 0
        
        if is_first_user:
            role = 'super_admin'
            subscription = validated_data.get('subscription', 'starter')
            modules = PLAN_MODULES.get(subscription, PLAN_MODULES['starter'])
        else:
            role = 'employee'
            modules = []
            subscription = 'starter'
        
        org = Organization.objects.create(
            id=org_id,
            name=validated_data.get('organization_name', 'My Organization'),
            industry=validated_data.get('industry'),
            country=validated_data.get('country', 'US'),
            currency=validated_data.get('currency', 'USD'),
            subscription=subscription,
            modules=modules,
            max_users=PLAN_MAX_USERS.get(subscription, 5),
            is_on_trial=True,
            trial_ends_at=timezone.now() + timedelta(days=14),
        )
        
        user = User.objects.create(
            id=user_id,
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=role,
            organization=org,
            industry=validated_data.get('industry'),
            country=validated_data.get('country', 'US'),
            currency=validated_data.get('currency', 'USD'),
            subscription=subscription,
            modules=modules,
            is_staff=is_first_user,
            is_on_trial=True,
            trial_ends_at=timezone.now() + timedelta(days=14),
        )
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class CreateUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    role = serializers.ChoiceField(choices=['admin', 'manager', 'hr', 'finance', 'accounting', 'employee', 'ordinary'], default='employee')
    department = serializers.CharField(max_length=100, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    modules = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    user_groups = serializers.ListField(child=serializers.CharField(), required=False, default=list)


class UpdateUserSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100, required=False)
    last_name = serializers.CharField(max_length=100, required=False)
    role = serializers.ChoiceField(choices=['admin', 'manager', 'hr', 'finance', 'accounting', 'employee', 'ordinary'], required=False)
    department = serializers.CharField(max_length=100, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    modules = serializers.ListField(child=serializers.CharField(), required=False)
    user_groups = serializers.ListField(child=serializers.CharField(), required=False)
    is_active = serializers.BooleanField(required=False)


class UserGroupSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = UserGroup
        fields = [
            'id', 'organization', 'name', 'description', 'module',
            'permissions', 'modules_access', 'members', 'member_count',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_member_count(self, obj):
        return len(obj.members) if obj.members else 0


class CreateUserGroupSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(required=False, allow_blank=True)
    module = serializers.CharField(max_length=50, default='general')
    permissions = serializers.DictField(required=False, default=dict)
    modules_access = serializers.ListField(child=serializers.CharField(), required=False, default=list)


class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    organization_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'organization', 'organization_name', 'user', 'user_email',
            'action', 'resource_type', 'resource_id', 'details',
            'ip_address', 'user_agent', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_user_email(self, obj):
        return obj.user.email if obj.user else None
    
    def get_organization_name(self, obj):
        return obj.organization.name if obj.organization else None


class SubscriptionPlanSerializer(serializers.Serializer):
    code = serializers.CharField()
    name = serializers.CharField()
    modules = serializers.ListField(child=serializers.CharField())
    max_users = serializers.IntegerField()
    price_monthly = serializers.DecimalField(max_digits=10, decimal_places=2)
    price_yearly = serializers.DecimalField(max_digits=10, decimal_places=2)
    extra_user_cost = serializers.DecimalField(max_digits=10, decimal_places=2, default=5.00)
    features = serializers.ListField(child=serializers.CharField(), required=False)


class TenantSerializer(serializers.ModelSerializer):
    user_count = serializers.SerializerMethodField()
    max_users_total = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'email', 'phone', 'address', 'city', 'state', 'country',
            'industry', 'subscription', 'currency', 'modules', 'max_users',
            'extra_users', 'user_count', 'max_users_total', 'is_active',
            'is_on_trial', 'trial_ends_at', 'created_at'
        ]
    
    def get_user_count(self, obj):
        return obj.get_active_user_count()
    
    def get_max_users_total(self, obj):
        return obj.get_max_users_total()


class OrganizationStatsSerializer(serializers.Serializer):
    total_organizations = serializers.IntegerField()
    active_organizations = serializers.IntegerField()
    trial_organizations = serializers.IntegerField()
    active_users = serializers.IntegerField()
    total_users = serializers.IntegerField()
    subscription_breakdown = serializers.DictField()


class DashboardStatsSerializer(serializers.Serializer):
    total_employees = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_invoices = serializers.IntegerField()
    pending_invoices = serializers.IntegerField()
    paid_invoices = serializers.IntegerField()
    overdue_invoices = serializers.IntegerField()
    active_customers = serializers.IntegerField()
    new_leads = serializers.IntegerField()


class TeamMemberSerializer(serializers.Serializer):
    id = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    full_name = serializers.CharField()
    role = serializers.CharField()
    department = serializers.CharField(allow_blank=True)
    modules = serializers.ListField(child=serializers.CharField())
    is_active = serializers.BooleanField()


class ModuleAccessSerializer(serializers.Serializer):
    module_name = serializers.CharField()
    has_access = serializers.BooleanField()
    permissions = serializers.ListField(child=serializers.CharField())


class PermissionSerializer(serializers.Serializer):
    name = serializers.CharField()
    description = serializers.CharField()
    module = serializers.CharField()


class RolePermissionSerializer(serializers.Serializer):
    role = serializers.CharField()
    module = serializers.CharField()
    permissions = serializers.ListField(child=serializers.CharField())
