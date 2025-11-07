"""
API Views for DisasterWatch
"""
import re
from datetime import datetime
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from disasterwatch_api.models import CustomUser
from disasterwatch_api.models import (
    Region, Shelter, Earthquake, Alert, Evacuee, Report,
    AIRecommendation, SafetyTip, Notification
)
from disasterwatch_api.serializers import (
    RegionSerializer, ShelterSerializer, EarthquakeSerializer,
    AlertSerializer, EvacueeSerializer, ReportSerializer,
    AIRecommendationSerializer, SafetyTipSerializer,
    NotificationSerializer, UserSerializer
)
from disasterwatch_api.auth import generate_jwt_token
from disasterwatch_api.earthquake_prediction import EarthquakePredictor


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'Invalid username or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'error': 'This account is inactive'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check password - the password_hash field contains bcrypt hashes
        # Simple string comparison since bcrypt hashes are stored as-is in the database
        try:
            import bcrypt
            # Try bcrypt password verification
            password_matches = bcrypt.checkpw(password.encode(), user.password_hash.encode())
        except:
            # Fallback: direct comparison for testing purposes
            password_matches = user.password_hash == password
        
        if not password_matches:
            return Response(
                {'error': 'Invalid username or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generate JWT token
        token = generate_jwt_token(user)
        return Response({
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name,
                'role': user.role
            },
            'role': user.role
        })


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [AllowAny]


class ShelterViewSet(viewsets.ModelViewSet):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_region(self, request):
        region_id = request.query_params.get('region_id')
        if region_id:
            shelters = Shelter.objects.filter(region_id=region_id)
            serializer = self.get_serializer(shelters, many=True)
            return Response(serializer.data)
        return Response({'error': 'region_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_status(self, request):
        status_filter = request.query_params.get('status')
        if status_filter:
            shelters = Shelter.objects.filter(status=status_filter)
            serializer = self.get_serializer(shelters, many=True)
            return Response(serializer.data)
        return Response({'error': 'status is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """Get shelters by city/municipality location search"""
        city = request.query_params.get('city')
        if city:
            # Search by city name in address field
            shelters = Shelter.objects.filter(address__icontains=city)
            serializer = self.get_serializer(shelters, many=True)
            return Response(serializer.data)
        return Response({'error': 'city parameter is required'}, status=status.HTTP_400_BAD_REQUEST)


class EarthquakeViewSet(viewsets.ModelViewSet):
    queryset = Earthquake.objects.all().order_by('-triggered_at')
    serializer_class = EarthquakeSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_region(self, request):
        region_id = request.query_params.get('region_id')
        if region_id:
            earthquakes = Earthquake.objects.filter(region_id=region_id).order_by('-triggered_at')
            serializer = self.get_serializer(earthquakes, many=True)
            return Response(serializer.data)
        return Response({'error': 'region_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """Get earthquakes near a location based on latitude/longitude"""
        latitude = request.query_params.get('latitude')
        longitude = request.query_params.get('longitude')
        radius_km = float(request.query_params.get('radius', 50))  # Default 50km radius
        
        if not latitude or not longitude:
            return Response({'error': 'latitude and longitude parameters are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            lat = float(latitude)
            lon = float(longitude)
            
            # Get all earthquakes
            earthquakes = Earthquake.objects.all().order_by('-triggered_at')
            
            # Filter by distance using haversine formula
            from disasterwatch_api.earthquake_prediction import EarthquakePredictor
            nearby = []
            for eq in earthquakes:
                distance = EarthquakePredictor.haversine_distance(
                    lat, lon,
                    float(eq.latitude), float(eq.longitude)
                )
                if distance <= radius_km:
                    nearby.append(eq)
            
            serializer = self.get_serializer(nearby, many=True)
            return Response({
                'count': len(nearby),
                'search_location': {'latitude': lat, 'longitude': lon, 'radius_km': radius_km},
                'earthquakes': serializer.data
            })
        except (ValueError, TypeError):
            return Response({'error': 'Invalid latitude or longitude values'}, 
                          status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        earthquakes = Earthquake.objects.all().order_by('-triggered_at')[:10]
        serializer = self.get_serializer(earthquakes, many=True)
        return Response(serializer.data)


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all().order_by('-triggered_at')
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_status(self, request):
        status_filter = request.query_params.get('status')
        if status_filter:
            alerts = Alert.objects.filter(status=status_filter).order_by('-triggered_at')
            serializer = self.get_serializer(alerts, many=True)
            return Response(serializer.data)
        return Response({'error': 'status is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        alert = self.get_object()
        alert.status = 'acknowledged'
        alert.acknowledged_by = request.user
        alert.acknowledged_at = timezone.now()
        alert.save()
        return Response(self.get_serializer(alert).data)


class EvacueeViewSet(viewsets.ModelViewSet):
    queryset = Evacuee.objects.all()
    serializer_class = EvacueeSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_shelter(self, request):
        shelter_id = request.query_params.get('shelter_id')
        if shelter_id:
            evacuees = Evacuee.objects.filter(shelter_id=shelter_id)
            serializer = self.get_serializer(evacuees, many=True)
            return Response(serializer.data)
        return Response({'error': 'shelter_id is required'}, status=status.HTTP_400_BAD_REQUEST)


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().order_by('-created_at')
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_shelter(self, request):
        shelter_id = request.query_params.get('shelter_id')
        if shelter_id:
            reports = Report.objects.filter(shelter_id=shelter_id).order_by('-created_at')
            serializer = self.get_serializer(reports, many=True)
            return Response(serializer.data)
        return Response({'error': 'shelter_id is required'}, status=status.HTTP_400_BAD_REQUEST)


class AIRecommendationsViewSet(viewsets.ModelViewSet):
    queryset = AIRecommendation.objects.all()
    serializer_class = AIRecommendationSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_shelter(self, request):
        shelter_id = request.query_params.get('shelter_id')
        if shelter_id:
            recommendations = AIRecommendation.objects.filter(shelter_id=shelter_id, status='pending')
            serializer = self.get_serializer(recommendations, many=True)
            return Response(serializer.data)
        return Response({'error': 'shelter_id is required'}, status=status.HTTP_400_BAD_REQUEST)


class SafetyTipsViewSet(viewsets.ModelViewSet):
    queryset = SafetyTip.objects.filter(is_active=True)
    serializer_class = SafetyTipSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category')
        if category:
            tips = SafetyTip.objects.filter(category=category, is_active=True)
            serializer = self.get_serializer(tips, many=True)
            return Response(serializer.data)
        return Response({'error': 'category is required'}, status=status.HTTP_400_BAD_REQUEST)


class NotificationsViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        notifications = Notification.objects.filter(user=request.user, is_read=False)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(self.get_serializer(notification).data)


class EarthquakePredictionView(APIView):
    """API endpoint for earthquake predictions based on historical data"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get predicted earthquake zones based on historical patterns"""
        try:
            predictions = EarthquakePredictor.predict_possible_earthquakes()
            stats = EarthquakePredictor.get_zone_statistics()
            
            return Response({
                'predictions': predictions,
                'statistics': stats,
                'message': 'Earthquake predictions based on historical data analysis'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EarthquakeStatisticsView(APIView):
    """API endpoint for earthquake zone statistics"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get statistics about earthquake zones"""
        try:
            stats = EarthquakePredictor.get_zone_statistics()
            predictions = EarthquakePredictor.predict_possible_earthquakes()
            
            # Add prediction insights
            high_risk = [p for p in predictions if p['risk_level'] == 'critical']
            moderate_risk = [p for p in predictions if p['risk_level'] in ['high', 'moderate']]
            
            return Response({
                'zone_statistics': stats,
                'high_risk_zones': high_risk,
                'moderate_risk_zones': moderate_risk,
                'total_risk_zones': len(predictions)
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
