from rest_framework import serializers
from .models import Customer, Contact, Opportunity, Activity


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = [
            'id', 'customer', 'first_name', 'last_name', 'email', 'phone',
            'position', 'is_primary', 'created_at', 'updated_at'
        ]


class CustomerSerializer(serializers.ModelSerializer):
    contact_count = serializers.SerializerMethodField()
    opportunity_count = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = [
            'id', 'name', 'email', 'phone', 'company', 'address', 'city', 'country',
            'status', 'source', 'website', 'notes', 'contact_count', 'opportunity_count',
            'created_at', 'updated_at'
        ]

    def get_contact_count(self, obj):
        return obj.contacts.count()

    def get_opportunity_count(self, obj):
        return obj.opportunities.count()


class OpportunitySerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    contact_name = serializers.SerializerMethodField()

    class Meta:
        model = Opportunity
        fields = [
            'id', 'name', 'customer', 'customer_name', 'contact', 'contact_name',
            'stage', 'amount', 'probability', 'expected_close_date', 'actual_close_date',
            'description', 'created_at', 'updated_at'
        ]

    def get_contact_name(self, obj):
        if obj.contact:
            return f"{obj.contact.first_name} {obj.contact.last_name}"
        return None


class ActivitySerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    opportunity_name = serializers.CharField(source='opportunity.name', read_only=True, allow_null=True)

    class Meta:
        model = Activity
        fields = [
            'id', 'customer', 'customer_name', 'opportunity', 'opportunity_name',
            'activity_type', 'subject', 'description', 'due_date', 'completed_at',
            'is_completed', 'created_at', 'updated_at'
        ]
