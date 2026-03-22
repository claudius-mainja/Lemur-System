from rest_framework import serializers
from .models import User, Organization


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
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm', 'first_name', 'last_name',
            'organization_name', 'industry', 'country', 'currency', 'subscription'
        ]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match'})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        import uuid
        validated_data['id'] = str(uuid.uuid4())
        validated_data['organization_id'] = str(uuid.uuid4())
        
        user = User(**validated_data)
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
