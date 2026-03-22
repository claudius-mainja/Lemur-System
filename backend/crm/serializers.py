from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Lead, LeadActivity, Contact, ContactHistory, Opportunity,
    StageConfiguration, DealHistory, EmailTemplate, EmailCampaign,
    EmailLog, SalesDashboard
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class LeadActivitySerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = LeadActivity
        fields = [
            'id', 'lead', 'activity_type', 'subject', 'description',
            'outcome', 'duration', 'scheduled_at', 'completed_at',
            'is_completed', 'created_by', 'created_by_name',
            'organization', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'organization']


class LeadSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True, allow_null=True)
    activity_count = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = [
            'id', 'name', 'email', 'phone', 'company', 'source',
            'status', 'score', 'assigned_to', 'assigned_to_name',
            'notes', 'activity_count', 'organization',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['score', 'organization']

    def get_activity_count(self, obj):
        return obj.activities.count()

    def create(self, validated_data):
        validated_data['organization'] = self.context['request'].user.organization
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class LeadDetailSerializer(LeadSerializer):
    activities = LeadActivitySerializer(many=True, read_only=True)

    class Meta(LeadSerializer.Meta):
        fields = LeadSerializer.Meta.fields + ['activities']


class ContactHistorySerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = ContactHistory
        fields = [
            'id', 'contact', 'action', 'description',
            'old_value', 'new_value', 'metadata',
            'created_by', 'created_by_name', 'organization', 'created_at'
        ]
        read_only_fields = ['created_by', 'organization']


class ContactSerializer(serializers.ModelSerializer):
    opportunity_count = serializers.SerializerMethodField()
    email_log_count = serializers.SerializerMethodField()

    class Meta:
        model = Contact
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
            'company', 'position', 'address', 'city', 'state',
            'country', 'postal_code', 'notes', 'is_primary',
            'is_active', 'opportunity_count', 'email_log_count',
            'organization', 'created_at', 'updated_at'
        ]
        read_only_fields = ['organization']

    def get_opportunity_count(self, obj):
        return obj.opportunities.count()

    def get_email_log_count(self, obj):
        return obj.email_logs.count()

    def create(self, validated_data):
        validated_data['organization'] = self.context['request'].user.organization
        return super().create(validated_data)


class ContactDetailSerializer(ContactSerializer):
    history = ContactHistorySerializer(many=True, read_only=True)

    class Meta(ContactSerializer.Meta):
        fields = ContactSerializer.Meta.fields + ['history']


class DealHistorySerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = DealHistory
        fields = [
            'id', 'opportunity', 'action', 'description',
            'old_value', 'new_value', 'metadata',
            'created_by', 'created_by_name', 'organization', 'created_at'
        ]
        read_only_fields = ['created_by', 'organization']


class OpportunitySerializer(serializers.ModelSerializer):
    contact_name = serializers.SerializerMethodField()
    customer_name = serializers.CharField(source='customer.name', read_only=True, allow_null=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True, allow_null=True)
    weighted_value = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    history_count = serializers.SerializerMethodField()

    class Meta:
        model = Opportunity
        fields = [
            'id', 'name', 'customer', 'customer_name', 'contact',
            'contact_name', 'value', 'probability', 'stage',
            'expected_close_date', 'actual_close_date', 'notes',
            'assigned_to', 'assigned_to_name', 'weighted_value',
            'history_count', 'organization', 'created_at', 'updated_at'
        ]
        read_only_fields = ['organization']

    def get_contact_name(self, obj):
        if obj.contact:
            return obj.contact.full_name
        return None

    def get_history_count(self, obj):
        return obj.history.count()

    def create(self, validated_data):
        validated_data['organization'] = self.context['request'].user.organization
        validated_data['created_by'] = self.context['request'].user
        opportunity = super().create(validated_data)
        DealHistory.objects.create(
            opportunity=opportunity,
            action='created',
            description=f'Opportunity "{opportunity.name}" created',
            created_by=self.context['request'].user,
            organization=opportunity.organization
        )
        return opportunity


class OpportunityDetailSerializer(OpportunitySerializer):
    history = DealHistorySerializer(many=True, read_only=True)

    class Meta(OpportunitySerializer.Meta):
        fields = OpportunitySerializer.Meta.fields + ['history']


class StageConfigurationSerializer(serializers.ModelSerializer):
    opportunity_count = serializers.SerializerMethodField()
    total_value = serializers.SerializerMethodField()

    class Meta:
        model = StageConfiguration
        fields = [
            'id', 'name', 'stage_key', 'probability', 'color',
            'order', 'is_default', 'is_active',
            'opportunity_count', 'total_value',
            'organization', 'created_at', 'updated_at'
        ]
        read_only_fields = ['organization']

    def get_opportunity_count(self, obj):
        return obj.opportunity_set.count()

    def get_total_value(self, obj):
        from django.db.models import Sum
        result = obj.opportunity_set.aggregate(total=Sum('value'))
        return float(result['total'] or 0)


class EmailTemplateSerializer(serializers.ModelSerializer):
    campaign_count = serializers.SerializerMethodField()

    class Meta:
        model = EmailTemplate
        fields = [
            'id', 'name', 'subject', 'body', 'category',
            'variables', 'is_active', 'campaign_count',
            'organization', 'created_at', 'updated_at'
        ]
        read_only_fields = ['organization']

    def get_campaign_count(self, obj):
        return obj.campaigns.count()


class EmailCampaignSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)
    template_name = serializers.CharField(source='template.name', read_only=True, allow_null=True)
    open_rate = serializers.FloatField(read_only=True)
    click_rate = serializers.FloatField(read_only=True)

    class Meta:
        model = EmailCampaign
        fields = [
            'id', 'name', 'subject', 'body', 'template',
            'template_name', 'target_segment', 'sent_count',
            'delivered_count', 'open_count', 'click_count',
            'bounce_count', 'unsubscribe_count', 'status',
            'open_rate', 'click_rate', 'scheduled_at', 'sent_at',
            'created_by', 'created_by_name', 'organization',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'sent_count', 'delivered_count', 'open_count',
            'click_count', 'bounce_count', 'unsubscribe_count',
            'sent_at', 'created_by', 'organization'
        ]


class EmailLogSerializer(serializers.ModelSerializer):
    campaign_name = serializers.CharField(source='campaign.name', read_only=True, allow_null=True)
    template_name = serializers.CharField(source='template.name', read_only=True, allow_null=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)
    lead_name = serializers.CharField(source='lead.name', read_only=True, allow_null=True)
    contact_name = serializers.SerializerMethodField()

    class Meta:
        model = EmailLog
        fields = [
            'id', 'campaign', 'campaign_name', 'template',
            'template_name', 'recipient_email', 'recipient_name',
            'subject', 'body', 'status', 'sent_at', 'delivered_at',
            'opened_at', 'clicked_at', 'bounced_at', 'error_message',
            'metadata', 'lead', 'lead_name', 'contact', 'contact_name',
            'created_by', 'created_by_name', 'organization', 'created_at'
        ]
        read_only_fields = ['created_by', 'organization']

    def get_contact_name(self, obj):
        if obj.contact:
            return obj.contact.full_name
        return None


class SalesDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesDashboard
        fields = [
            'id', 'date', 'total_leads', 'new_leads', 'qualified_leads',
            'active_opportunities', 'pipeline_value', 'closed_won_value',
            'closed_lost_value', 'conversion_rate', 'average_deal_size',
            'organization', 'created_at', 'updated_at'
        ]
        read_only_fields = ['organization']


class PipelineStageSerializer(serializers.Serializer):
    stage = serializers.CharField()
    stage_name = serializers.CharField()
    count = serializers.IntegerField()
    value = serializers.DecimalField(max_digits=14, decimal_places=2)
    probability = serializers.IntegerField()
    color = serializers.CharField()


class SalesAnalyticsSerializer(serializers.Serializer):
    total_leads = serializers.IntegerField()
    new_leads = serializers.IntegerField()
    qualified_leads = serializers.IntegerField()
    total_opportunities = serializers.IntegerField()
    active_opportunities = serializers.IntegerField()
    closed_won_count = serializers.IntegerField()
    closed_lost_count = serializers.IntegerField()
    pipeline_value = serializers.DecimalField(max_digits=14, decimal_places=2)
    weighted_pipeline_value = serializers.DecimalField(max_digits=14, decimal_places=2)
    closed_won_value = serializers.DecimalField(max_digits=14, decimal_places=2)
    closed_lost_value = serializers.DecimalField(max_digits=14, decimal_places=2)
    average_deal_size = serializers.DecimalField(max_digits=14, decimal_places=2)
    conversion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    win_rate = serializers.DecimalField(max_digits=5, decimal_places=2)


class ForecastSerializer(serializers.Serializer):
    month = serializers.CharField()
    expected_value = serializers.DecimalField(max_digits=14, decimal_places=2)
    best_case_value = serializers.DecimalField(max_digits=14, decimal_places=2)
    opportunity_count = serializers.IntegerField()
