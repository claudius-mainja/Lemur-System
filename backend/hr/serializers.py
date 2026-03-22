from rest_framework import serializers
from .models import Department, Employee, Leave, Attendance


class DepartmentSerializer(serializers.ModelSerializer):
    employee_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'employee_count', 'created_at', 'updated_at']

    def get_employee_count(self, obj):
        return obj.employees.count()


class EmployeeSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Employee
        fields = [
            'id', 'employee_id', 'user_name', 'user_email', 'department', 'department_name',
            'position', 'employment_type', 'status', 'hire_date', 'termination_date',
            'salary', 'phone', 'address', 'emergency_contact', 'emergency_phone',
            'created_at', 'updated_at'
        ]


class LeaveSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.user.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Leave
        fields = [
            'id', 'employee', 'employee_name', 'leave_type', 'start_date', 'end_date',
            'reason', 'status', 'approved_by', 'approved_by_name', 'approved_at',
            'created_at', 'updated_at'
        ]


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id', 'employee', 'employee_name', 'date', 'check_in', 'check_out',
            'hours_worked', 'created_at', 'updated_at'
        ]
