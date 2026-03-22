from rest_framework import serializers
from django.db.models import Sum, Count, Q
from datetime import date
from .models import (
    Department, JobPosition, JobPosting, Applicant, Interview, OfferLetter,
    Employee, EmployeeDocument, LeaveBalance, Leave, Attendance, OvertimeRecord,
    ReviewCycle, Goal, PerformanceReview, Feedback360, Training, TimeSheet, TimeSheetEntry, Holiday
)


class DepartmentSerializer(serializers.ModelSerializer):
    employee_count = serializers.SerializerMethodField()
    parent_name = serializers.CharField(source='parent.name', read_only=True, allow_null=True)

    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'parent', 'parent_name', 'employee_count', 'created_at', 'updated_at']

    def get_employee_count(self, obj):
        return obj.employees.filter(status='active').count()


class JobPositionSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = JobPosition
        fields = ['id', 'title', 'department', 'department_name', 'description', 'requirements',
                  'salary_min', 'salary_max', 'is_active', 'created_at', 'updated_at']


class JobPostingSerializer(serializers.ModelSerializer):
    position_title = serializers.CharField(source='position.title', read_only=True)
    department_name = serializers.CharField(source='position.department.name', read_only=True)
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = JobPosting
        fields = ['id', 'position', 'position_title', 'department_name', 'title', 'description',
                  'requirements', 'benefits', 'location', 'employment_type', 'salary_min', 'salary_max',
                  'status', 'posted_date', 'closing_date', 'application_count', 'created_at', 'updated_at']

    def get_application_count(self, obj):
        return obj.applications.count()


class ApplicantSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job_posting.title', read_only=True, allow_null=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Applicant
        fields = ['id', 'first_name', 'last_name', 'full_name', 'email', 'phone', 'resume',
                  'cover_letter', 'linkedin_url', 'portfolio_url', 'source', 'status',
                  'job_posting', 'job_title', 'notes', 'created_at', 'updated_at']


class InterviewSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.full_name', read_only=True)
    interviewer_name = serializers.CharField(source='interviewer.user.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Interview
        fields = ['id', 'applicant', 'applicant_name', 'interview_type', 'interviewer',
                  'interviewer_name', 'scheduled_date', 'duration', 'location', 'meeting_link',
                  'status', 'feedback', 'rating', 'recommendation', 'created_at', 'updated_at']


class OfferLetterSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.full_name', read_only=True)
    position_title = serializers.CharField(source='position.title', read_only=True, allow_null=True)

    class Meta:
        model = OfferLetter
        fields = ['id', 'applicant', 'applicant_name', 'position', 'position_title', 'salary',
                  'start_date', 'benefits', 'valid_until', 'status', 'sent_date', 'response_date',
                  'created_at', 'updated_at']


class EmployeeDocumentSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    verified_by_name = serializers.CharField(source='verified_by.user.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = EmployeeDocument
        fields = ['id', 'employee', 'employee_name', 'document_type', 'title', 'file',
                  'document_number', 'issue_date', 'expiry_date', 'is_verified', 'verified_by',
                  'verified_by_name', 'verified_at', 'notes', 'created_at', 'updated_at']
        extra_kwargs = {'file': {'required': False}}


class EmployeeListSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source='user.email', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True, allow_null=True)
    reporting_to_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'user_name', 'user_email', 'department', 'department_name',
                  'position', 'employment_type', 'status', 'hire_date', 'reporting_to', 'reporting_to_name',
                  'phone', 'city', 'country', 'created_at']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_reporting_to_name(self, obj):
        if obj.reporting_to:
            return f"{obj.reporting_to.user.first_name} {obj.reporting_to.user.last_name}"
        return None


class EmployeeSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True, allow_null=True)
    reporting_to_name = serializers.SerializerMethodField()
    document_count = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id', 'employee_id', 'user', 'user_name', 'user_email', 'user_first_name', 'user_last_name',
            'department', 'department_name', 'position', 'employment_type', 'status',
            'hire_date', 'termination_date', 'termination_reason', 'salary',
            'date_of_birth', 'gender', 'marital_status', 'national_id', 'passport_number',
            'phone', 'secondary_phone', 'personal_email', 'address', 'city', 'state', 'country', 'postal_code',
            'emergency_contact', 'emergency_relation', 'emergency_phone',
            'bank_name', 'bank_account', 'bank_routing',
            'reporting_to', 'reporting_to_name', 'document_count',
            'created_at', 'updated_at'
        ]

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_reporting_to_name(self, obj):
        if obj.reporting_to:
            return f"{obj.reporting_to.user.first_name} {obj.reporting_to.user.last_name}"
        return None

    def get_document_count(self, obj):
        return obj.documents.count()


class LeaveBalanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    available_days = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = LeaveBalance
        fields = ['id', 'employee', 'employee_name', 'leave_type', 'year', 'total_days',
                  'used_days', 'pending_days', 'carry_forward', 'available_days']


class LeaveSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.user.get_full_name', read_only=True, allow_null=True)
    delegation_name = serializers.CharField(source='delegation_employee.user.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Leave
        fields = ['id', 'employee', 'employee_name', 'leave_type', 'start_date', 'end_date',
                  'total_days', 'reason', 'status', 'approved_by', 'approved_by_name', 'approved_at',
                  'rejection_reason', 'is_half_day', 'half_day_period', 'contact_number',
                  'delegation_employee', 'delegation_name', 'created_at', 'updated_at']


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_name', 'date', 'status', 'check_in', 'check_out',
                  'hours_worked', 'overtime_hours', 'late_minutes', 'early_leave_minutes',
                  'remarks', 'created_at', 'updated_at']


class OvertimeRecordSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.user.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = OvertimeRecord
        fields = ['id', 'employee', 'employee_name', 'date', 'hours', 'reason', 'status',
                  'approved_by', 'approved_by_name', 'approved_at', 'created_at']


class ReviewCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewCycle
        fields = ['id', 'name', 'description', 'start_date', 'end_date',
                  'self_review_due', 'manager_review_due', 'calibration_due',
                  'status', 'created_at', 'updated_at']


class GoalSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)

    class Meta:
        model = Goal
        fields = ['id', 'employee', 'employee_name', 'review_cycle', 'title', 'description',
                  'category', 'start_date', 'due_date', 'weight', 'target_value', 'current_value',
                  'unit', 'status', 'progress', 'progress_percentage', 'parent_goal', 'created_at', 'updated_at']


class PerformanceReviewSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    reviewer_name = serializers.CharField(source='reviewer.user.get_full_name', read_only=True, allow_null=True)
    cycle_name = serializers.CharField(source='review_cycle.name', read_only=True)

    class Meta:
        model = PerformanceReview
        fields = ['id', 'employee', 'employee_name', 'review_cycle', 'cycle_name', 'reviewer', 'reviewer_name',
                  'review_type', 'self_rating', 'self_comments', 'self_submitted_at',
                  'manager_rating', 'manager_comments', 'manager_submitted_at',
                  'overall_rating', 'overall_comments', 'status', 'submitted_at',
                  'strengths', 'areas_for_improvement', 'development_plan',
                  'created_at', 'updated_at']


class Feedback360Serializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    reviewer_name = serializers.SerializerMethodField()

    class Meta:
        model = Feedback360
        fields = ['id', 'employee', 'employee_name', 'reviewer', 'reviewer_name', 'review_cycle',
                  'relationship', 'comments', 'rating', 'is_anonymous', 'created_at']

    def get_reviewer_name(self, obj):
        if obj.is_anonymous:
            return 'Anonymous'
        return f"{obj.reviewer.user.first_name} {obj.reviewer.user.last_name}"


class TrainingSerializer(serializers.ModelSerializer):
    employees_count = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Training
        fields = ['id', 'name', 'description', 'provider', 'start_date', 'end_date', 'location',
                  'cost', 'status', 'status_display', 'employees_count', 'created_at', 'updated_at']

    def get_employees_count(self, obj):
        return obj.employees.count()


class TimeSheetEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSheetEntry
        fields = ['id', 'date', 'hours', 'project', 'task', 'description']


class TimeSheetSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    entries = TimeSheetEntrySerializer(many=True, read_only=True)

    class Meta:
        model = TimeSheet
        fields = ['id', 'employee', 'employee_name', 'week_start', 'week_end', 'total_hours',
                  'overtime_hours', 'status', 'approved_by', 'approved_at', 'notes', 'entries', 'created_at', 'updated_at']


class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = ['id', 'name', 'date', 'is_recurring', 'description', 'created_at']


class HREmployeeStatsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    active = serializers.IntegerField()
    on_leave = serializers.IntegerField()
    inactive = serializers.IntegerField()
    terminated = serializers.IntegerField()
    by_department = serializers.ListField()
    by_employment_type = serializers.DictField()


class LeaveStatsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    pending = serializers.IntegerField()
    approved = serializers.IntegerField()
    rejected = serializers.IntegerField()
    by_type = serializers.DictField()


class AttendanceStatsSerializer(serializers.Serializer):
    total_records = serializers.IntegerField()
    present_today = serializers.IntegerField()
    late_today = serializers.IntegerField()
    absent_today = serializers.IntegerField()
    average_hours = serializers.DecimalField(max_digits=5, decimal_places=2)
