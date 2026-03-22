from rest_framework import serializers
from .models import (
    EmailTemplate, AudienceSegment, EmailCampaign, CampaignVariant,
    Workflow, WorkflowStep, LandingPage, LandingPageSubmission,
    FormTemplate, MarketingAsset, ABTest
)


class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = ['id', 'name', 'subject', 'body', 'category', 'preheader_text',
                  'footer_text', 'is_active', 'created_at', 'updated_at']


class AudienceSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudienceSegment
        fields = ['id', 'name', 'description', 'criteria', 'contact_count',
                  'is_active', 'created_at', 'updated_at']


class CampaignVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignVariant
        fields = ['id', 'campaign', 'name', 'subject', 'body', 'test_percentage',
                  'sent_count', 'opened_count', 'clicked_count']


class EmailCampaignSerializer(serializers.ModelSerializer):
    template_name = serializers.CharField(source='template.name', read_only=True, allow_null=True)
    segment_name = serializers.CharField(source='segment.name', read_only=True, allow_null=True)
    open_rate = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    click_rate = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = EmailCampaign
        fields = ['id', 'name', 'subject', 'template', 'template_name', 'segment', 'segment_name',
                  'body', 'scheduled_at', 'sent_at', 'status', 'sent_count', 'delivered_count',
                  'opened_count', 'clicked_count', 'unsubscribed_count', 'bounced_count',
                  'open_rate', 'click_rate', 'created_by', 'created_by_name', 'created_at', 'updated_at']


class WorkflowStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowStep
        fields = ['id', 'workflow', 'name', 'action', 'config', 'delay_minutes', 'position']


class WorkflowSerializer(serializers.ModelSerializer):
    steps = WorkflowStepSerializer(many=True, read_only=True)

    class Meta:
        model = Workflow
        fields = ['id', 'name', 'description', 'trigger_type', 'trigger_config', 'status',
                  'enrolled_count', 'completed_count', 'steps', 'created_at', 'updated_at']


class LandingPageSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPageSubmission
        fields = ['id', 'landing_page', 'form_data', 'ip_address', 'user_agent', 'created_at']


class LandingPageSerializer(serializers.ModelSerializer):
    submissions = LandingPageSubmissionSerializer(many=True, read_only=True)

    class Meta:
        model = LandingPage
        fields = ['id', 'name', 'slug', 'title', 'headline', 'subheadline', 'body_content',
                  'hero_image', 'call_to_action_text', 'call_to_action_url', 'form_fields',
                  'thank_you_message', 'meta_description', 'status', 'view_count',
                  'submission_count', 'submissions', 'created_at', 'updated_at']


class FormTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormTemplate
        fields = ['id', 'name', 'fields', 'style_config', 'is_active', 'created_at', 'updated_at']


class MarketingAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketingAsset
        fields = ['id', 'name', 'asset_type', 'file', 'url', 'size', 'mime_type',
                  'tags', 'created_at']


class ABTestSerializer(serializers.ModelSerializer):
    open_rate_a = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    open_rate_b = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = ABTest
        fields = ['id', 'name', 'campaign', 'subject_a', 'subject_b', 'test_percentage',
                  'winner_subject', 'opens_a', 'opens_b', 'clicks_a', 'clicks_b',
                  'open_rate_a', 'open_rate_b', 'status', 'decided_at', 'created_at']
