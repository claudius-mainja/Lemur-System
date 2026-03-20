from rest_framework import serializers
from .models import Employee, Department, LeaveRequest


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'organization_id', 'name', 'description', 'manager_id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Employee
        fields = [
            'id', 'user_id', 'organization_id', 'first_name', 'last_name', 'full_name',
            'email', 'phone', 'department', 'position', 'start_date', 'salary',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'organization_id', 'employee_id', 'employee_name', 'leave_type',
            'start_date', 'end_date', 'days', 'reason', 'status', 'approved_by',
            'approved_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'approved_by', 'approved_at', 'created_at', 'updated_at']


class LeaveApprovalSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['approved', 'rejected'])
    comments = serializers.CharField(required=False, allow_blank=True)
