"""
Admin configuration for DisasterWatch
"""
from django.contrib import admin
from disasterwatch_api.models import (
    Region, Shelter, Earthquake, Alert, Evacuee, Report,
    AIRecommendation, SafetyTip, Notification
)


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'code']
    search_fields = ['name', 'code']


@admin.register(Shelter)
class ShelterAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'region', 'shelter_type', 'capacity', 'current_occupancy', 'status']
    list_filter = ['status', 'shelter_type', 'region']
    search_fields = ['name', 'address']


@admin.register(Earthquake)
class EarthquakeAdmin(admin.ModelAdmin):
    list_display = ['id', 'event_id', 'magnitude', 'depth', 'region', 'event_type', 'triggered_at']
    list_filter = ['event_type', 'region']
    search_fields = ['event_id', 'description']
    date_hierarchy = 'triggered_at'


@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['id', 'alert_id', 'alert_type', 'severity', 'status', 'triggered_at']
    list_filter = ['status', 'severity', 'alert_type']
    search_fields = ['alert_id', 'description']
    date_hierarchy = 'triggered_at'


@admin.register(Evacuee)
class EvacueeAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'shelter', 'status', 'check_in_time']
    list_filter = ['status', 'shelter']
    search_fields = ['first_name', 'last_name', 'email', 'phone_number']
    date_hierarchy = 'check_in_time'


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'report_id', 'report_type', 'shelter', 'created_by', 'status', 'created_at']
    list_filter = ['status', 'report_type']
    search_fields = ['report_id', 'title', 'description']
    date_hierarchy = 'created_at'


@admin.register(AIRecommendation)
class AIRecommendationAdmin(admin.ModelAdmin):
    list_display = ['id', 'recommendation_id', 'shelter', 'status', 'confidence_score']
    list_filter = ['status']
    search_fields = ['recommendation_id', 'recommendation_text']


@admin.register(SafetyTip)
class SafetyTipAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'category', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['title', 'description']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title', 'notification_type', 'is_read', 'created_at']
    list_filter = ['is_read', 'notification_type']
    search_fields = ['title', 'message']
    date_hierarchy = 'created_at'
