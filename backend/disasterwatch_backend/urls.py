"""
DisasterWatch URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from disasterwatch_api.views import (
    LoginView, UserViewSet, RegionViewSet, ShelterViewSet, EarthquakeViewSet,
    AlertViewSet, EvacueeViewSet, ReportViewSet, SafetyTipsViewSet,
    AIRecommendationsViewSet, NotificationsViewSet,
    EarthquakePredictionView, EarthquakeStatisticsView
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'regions', RegionViewSet, basename='regions')
router.register(r'shelters', ShelterViewSet, basename='shelters')
router.register(r'earthquakes', EarthquakeViewSet, basename='earthquakes')
router.register(r'alerts', AlertViewSet, basename='alerts')
router.register(r'evacuees', EvacueeViewSet, basename='evacuees')
router.register(r'reports', ReportViewSet, basename='reports')
router.register(r'safety-tips', SafetyTipsViewSet, basename='safety-tips')
router.register(r'ai-recommendations', AIRecommendationsViewSet, basename='ai-recommendations')
router.register(r'notifications', NotificationsViewSet, basename='notifications')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/predictions/', EarthquakePredictionView.as_view(), name='predictions'),
    path('api/statistics/', EarthquakeStatisticsView.as_view(), name='statistics'),
    path('api/', include(router.urls)),
]
