"""
Serializers for DisasterWatch API
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from disasterwatch_api.models import (
    Region, Shelter, Earthquake, Alert, Evacuee, Report,
    AIRecommendation, SafetyTip, Notification
)


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name', 'code', 'description', 'created_at']


class ShelterSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source='region.name', read_only=True)
    
    class Meta:
        model = Shelter
        fields = ['id', 'name', 'address', 'latitude', 'longitude', 'region', 'region_name',
                  'shelter_type', 'capacity', 'current_occupancy', 'status', 'contact_person',
                  'contact_number', 'notes', 'created_at', 'updated_at']


class EarthquakeSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source='region.name', read_only=True)
    
    class Meta:
        model = Earthquake
        fields = ['id', 'event_id', 'magnitude', 'latitude', 'longitude', 'depth', 'region',
                  'region_name', 'event_type', 'description', 'triggered_at', 'recorded_at']


class AlertSerializer(serializers.ModelSerializer):
    shelter_name = serializers.CharField(source='shelter.name', read_only=True)
    earthquake_event_id = serializers.CharField(source='earthquake.event_id', read_only=True)
    
    class Meta:
        model = Alert
        fields = ['id', 'alert_id', 'earthquake', 'earthquake_event_id', 'shelter', 'shelter_name',
                  'alert_type', 'severity', 'status', 'description', 'triggered_at',
                  'acknowledged_at', 'resolved_at', 'acknowledged_by', 'created_at', 'updated_at']


class EvacueeSerializer(serializers.ModelSerializer):
    shelter_name = serializers.CharField(source='shelter.name', read_only=True)
    
    class Meta:
        model = Evacuee
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'age', 'gender',
                  'address', 'shelter', 'shelter_name', 'check_in_time', 'check_out_time',
                  'status', 'notes', 'created_at', 'updated_at']


class ReportSerializer(serializers.ModelSerializer):
    shelter_name = serializers.CharField(source='shelter.name', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Report
        fields = ['id', 'report_id', 'shelter', 'shelter_name', 'earthquake', 'report_type',
                  'title', 'description', 'created_by', 'created_by_username', 'status',
                  'created_at', 'updated_at']


class AIRecommendationSerializer(serializers.ModelSerializer):
    shelter_name = serializers.CharField(source='shelter.name', read_only=True)
    
    class Meta:
        model = AIRecommendation
        fields = ['id', 'recommendation_id', 'earthquake', 'shelter', 'shelter_name',
                  'recommendation_text', 'confidence_score', 'status', 'implemented_at',
                  'implemented_by', 'created_at', 'updated_at']


class SafetyTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyTip
        fields = ['id', 'title', 'description', 'category', 'is_active', 'created_at', 'updated_at']


class NotificationSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'user', 'user_username', 'title', 'message', 'notification_type',
                  'related_entity_type', 'related_entity_id', 'is_read', 'read_at', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined']
