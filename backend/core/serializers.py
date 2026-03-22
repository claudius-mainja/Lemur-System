from rest_framework import serializers
from .models import User, Organization
import uuid


PLAN_MODULES = {
    'starter': ['hr', 'finance', 'supply-chain'],
    'professional': ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain'],
    'enterprise': ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'email', 'documents', 'marketing', 'services'],
}


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role',
            'department', 'phone', 'organization_id', 'organization_name',
            'industry', 'subscription', 'currency', 'country', 'timezone',
            'modules', 'is_active', 'is_on_trial', 'trial_ends_at'
        ]
        read_only_fields = ['id', 'is_active', 'is_on_trial', 'trial_ends_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, required=False)
    plan = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm', 'first_name', 'last_name',
            'organization_name', 'industry', 'country', 'currency', 'subscription', 'plan'
        ]

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
            modules = PLAN_MODULES.get(validated_data.get('subscription', 'starter'), PLAN_MODULES['starter'])
        else:
            role = 'employee'
            modules = []
        
        org = Organization.objects.create(
            id=org_id,
            name=validated_data.get('organization_name', 'My Organization'),
            industry=validated_data.get('industry'),
            country=validated_data.get('country', 'US'),
            currency=validated_data.get('currency', 'USD'),
            subscription=validated_data.get('subscription', 'starter'),
            modules=modules,
        )
        
        user = User.objects.create(
            id=user_id,
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=role,
            organization_id=org_id,
            organization_name=org.name,
            industry=validated_data.get('industry'),
            country=validated_data.get('country', 'US'),
            currency=validated_data.get('currency', 'USD'),
            subscription=validated_data.get('subscription', 'starter'),
            modules=modules,
            is_staff=is_first_user,
        )
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'
