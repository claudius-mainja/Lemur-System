from rest_framework import serializers
from .models import (
    Ticket, TicketReply, TicketComment, SLAConfig, SLAViolation,
    KnowledgeBaseCategory, KnowledgeBaseArticle, ArticleFeedback,
    EscalationRule, EscalationHistory, ServiceReport, CustomerPortal, SatisfactionSurvey
)


class TicketReplySerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = TicketReply
        fields = ['id', 'ticket', 'author', 'author_name', 'content', 'is_internal',
                   'attachments', 'created_at', 'updated_at']


class TicketSerializer(serializers.ModelSerializer):
    replies = TicketReplySerializer(many=True, read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Ticket
        fields = ['id', 'ticket_number', 'subject', 'description', 'customer_name',
                   'customer_email', 'customer_phone', 'status', 'priority', 'source',
                   'category', 'assigned_to', 'assigned_to_name', 'first_response_at',
                   'resolved_at', 'closed_at', 'replies', 'created_at', 'updated_at']


class TicketListSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Ticket
        fields = ['id', 'ticket_number', 'subject', 'customer_name', 'customer_email',
                   'status', 'priority', 'category', 'assigned_to_name', 'created_at']


class SLAConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SLAConfig
        fields = ['id', 'name', 'description', 'response_time_hours', 'resolution_time_hours',
                   'priority', 'is_active', 'created_at', 'updated_at']


class SLAViolationSerializer(serializers.ModelSerializer):
    ticket_subject = serializers.CharField(source='ticket.subject', read_only=True)

    class Meta:
        model = SLAViolation
        fields = ['id', 'ticket', 'ticket_subject', 'sla_config', 'violation_type',
                   'expected_time', 'actual_time', 'created_at']


class KnowledgeBaseArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True, allow_null=True)
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)

    class Meta:
        model = KnowledgeBaseArticle
        fields = ['id', 'title', 'slug', 'content', 'summary', 'category', 'category_name',
                  'tags', 'author', 'author_name', 'status', 'view_count', 'helpful_yes',
                  'helpful_no', 'created_at', 'updated_at']


class KnowledgeBaseCategorySerializer(serializers.ModelSerializer):
    article_count = serializers.SerializerMethodField()

    class Meta:
        model = KnowledgeBaseCategory
        fields = ['id', 'name', 'slug', 'description', 'parent', 'order',
                   'article_count', 'created_at', 'updated_at']

    def get_article_count(self, obj):
        return obj.articles.filter(status='published').count()


class ArticleFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleFeedback
        fields = ['id', 'article', 'helpful', 'ip_address', 'created_at']


class EscalationRuleSerializer(serializers.ModelSerializer):
    target_user_name = serializers.CharField(source='target_user.get_full_name', read_only=True)

    class Meta:
        model = EscalationRule
        fields = ['id', 'name', 'description', 'trigger_condition', 'escalation_level',
                   'target_user', 'target_user_name', 'notify_manager', 'priority_boost',
                   'is_active', 'created_at', 'updated_at']


class EscalationHistorySerializer(serializers.ModelSerializer):
    ticket_subject = serializers.CharField(source='ticket.subject', read_only=True)
    from_user_name = serializers.CharField(source='from_user.get_full_name', read_only=True, allow_null=True)
    to_user_name = serializers.CharField(source='to_user.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = EscalationHistory
        fields = ['id', 'ticket', 'ticket_subject', 'rule', 'from_user', 'from_user_name',
                  'to_user', 'to_user_name', 'reason', 'created_at']


class ServiceReportSerializer(serializers.ModelSerializer):
    generated_by_name = serializers.CharField(source='generated_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = ServiceReport
        fields = ['id', 'name', 'report_type', 'date_from', 'date_to', 'data',
                  'generated_by', 'generated_by_name', 'created_at']


class SatisfactionSurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = SatisfactionSurvey
        fields = ['id', 'ticket', 'rating', 'feedback', 'response_time_rating',
                   'resolution_rating', 'agent_rating', 'created_at']
