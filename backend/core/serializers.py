from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Organization, AuditLog

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm', 'first_name', 'last_name',
            'organization_name', 'industry', 'country', 'currency', 'phone'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        organization_name = validated_data.pop('organization_name')
        org_id = User.objects.filter(organization_name=organization_name).first()
        if org_id:
            org_id = org_id.organization_id
        else:
            import uuid
            org_id = uuid.uuid4()
        
        user = User.objects.create_user(
            password=password,
            organization_id=org_id,
            organization_name=organization_name,
            role='admin',
            **validated_data
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role', 'department',
            'phone', 'organization_id', 'organization_name', 'industry',
            'subscription', 'currency', 'country', 'is_active', 'is_on_trial',
            'trial_ends_at', 'created_at', 'last_login_at'
        ]
        read_only_fields = ['id', 'organization_id', 'created_at', 'last_login_at']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = [
            'email', 'password', 'first_name', 'last_name', 'role',
            'department', 'phone', 'organization_id', 'organization_name'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'role', 'department', 'phone',
            'is_active', 'subscription'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'email', 'phone', 'address', 'city', 'country',
            'industry', 'subscription', 'currency', 'is_active', 'is_on_trial',
            'trial_ends_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class OrganizationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = [
            'name', 'email', 'phone', 'address', 'city', 'country',
            'industry', 'subscription', 'currency'
        ]


class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_email', 'organization_id', 'action',
            'model_name', 'object_id', 'details', 'ip_address', 'created_at'
        ]

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None
