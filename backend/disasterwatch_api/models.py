"""
Models for DisasterWatch Application
Maps to the PostgreSQL schema created in schema.sql
"""
from django.db import models
from django.contrib.auth.models import User

class CustomUser(models.Model):
    """Custom user model that maps to the PostgreSQL users table"""
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('coordinator', 'Coordinator'),
    ]
    
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password_hash = models.CharField(max_length=255)
    full_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='coordinator')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

    class Meta:
        db_table = 'users'
        managed = False  # Don't let Django manage this table

class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'regions'


class Shelter(models.Model):
    SHELTER_TYPES = [
        ('school', 'School'),
        ('gym', 'Gym'),
        ('church', 'Church'),
        ('community_center', 'Community Center'),
        ('pavilion', 'Pavilion'),
        ('hall', 'Hall'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('full', 'Full'),
        ('maintenance', 'Maintenance'),
    ]

    name = models.CharField(max_length=150)
    address = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    shelter_type = models.CharField(max_length=50, choices=SHELTER_TYPES)
    capacity = models.IntegerField()
    current_occupancy = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    contact_person = models.CharField(max_length=100, blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'shelters'


class Earthquake(models.Model):
    EVENT_TYPES = [
        ('main_shock', 'Main Shock'),
        ('aftershock', 'Aftershock'),
        ('foreshock', 'Foreshock'),
    ]

    event_id = models.CharField(max_length=50, unique=True)
    magnitude = models.DecimalField(max_digits=3, decimal_places=1)
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    depth = models.DecimalField(max_digits=5, decimal_places=2)
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    description = models.TextField(blank=True, null=True)
    triggered_at = models.DateTimeField()
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event_id} - {self.magnitude} Magnitude"

    class Meta:
        db_table = 'earthquakes'


class Alert(models.Model):
    ALERT_TYPES = [
        ('earthquake', 'Earthquake'),
        ('fire', 'Fire'),
        ('power_outage', 'Power Outage'),
        ('overcrowding', 'Overcrowding'),
        ('equipment_failure', 'Equipment Failure'),
        ('security_breach', 'Security Breach'),
        ('other', 'Other'),
    ]
    
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('acknowledged', 'Acknowledged'),
        ('resolved', 'Resolved'),
    ]

    alert_id = models.CharField(max_length=50, unique=True)
    earthquake = models.ForeignKey(Earthquake, on_delete=models.CASCADE, blank=True, null=True)
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE, blank=True, null=True)
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    description = models.TextField(blank=True, null=True)
    triggered_at = models.DateTimeField()
    acknowledged_at = models.DateTimeField(blank=True, null=True)
    resolved_at = models.DateTimeField(blank=True, null=True)
    acknowledged_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.alert_id

    class Meta:
        db_table = 'alerts'


class Evacuee(models.Model):
    STATUS_CHOICES = [
        ('evacuated', 'Evacuated'),
        ('safe', 'Safe'),
        ('departed', 'Departed'),
        ('pending', 'Pending'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    check_in_time = models.DateTimeField(blank=True, null=True)
    check_out_time = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='evacuated')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        db_table = 'evacuees'


class Report(models.Model):
    REPORT_TYPES = [
        ('incident', 'Incident'),
        ('capacity', 'Capacity'),
        ('status_update', 'Status Update'),
        ('inventory', 'Inventory'),
        ('maintenance', 'Maintenance'),
        ('safety', 'Safety'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('updated', 'Updated'),
        ('resolved', 'Resolved'),
    ]

    report_id = models.CharField(max_length=50, unique=True)
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE, blank=True, null=True)
    earthquake = models.ForeignKey(Earthquake, on_delete=models.CASCADE, blank=True, null=True)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.report_id

    class Meta:
        db_table = 'reports'


class AIRecommendation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('implemented', 'Implemented'),
        ('rejected', 'Rejected'),
        ('in_progress', 'In Progress'),
    ]

    recommendation_id = models.CharField(max_length=50, unique=True)
    earthquake = models.ForeignKey(Earthquake, on_delete=models.CASCADE, blank=True, null=True)
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE, blank=True, null=True)
    recommendation_text = models.TextField()
    confidence_score = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    implemented_at = models.DateTimeField(blank=True, null=True)
    implemented_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.recommendation_id

    class Meta:
        db_table = 'ai_recommendations'


class SafetyTip(models.Model):
    CATEGORIES = [
        ('before_earthquake', 'Before Earthquake'),
        ('during_earthquake', 'During Earthquake'),
        ('after_earthquake', 'After Earthquake'),
        ('evacuation', 'Evacuation'),
        ('shelter_safety', 'Shelter Safety'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORIES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'safety_tips'


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50)
    related_entity_type = models.CharField(max_length=50, blank=True, null=True)
    related_entity_id = models.IntegerField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'notifications'
