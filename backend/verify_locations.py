#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'disasterwatch_backend.settings')
django.setup()

from disasterwatch_api.models import Shelter, Earthquake

print("=" * 80)
print("CARAGA REGION EMERGENCY RESOURCES - LOCATION VERIFICATION")
print("=" * 80)

CARAGA_BOUNDS = {'min_lat': 8.0, 'max_lat': 10.0, 'min_lng': 124.5, 'max_lng': 126.5}
print("\nCaraga Region Bounds:")
print(f"  Latitude:  {CARAGA_BOUNDS['min_lat']} - {CARAGA_BOUNDS['max_lat']}")
print(f"  Longitude: {CARAGA_BOUNDS['min_lng']} - {CARAGA_BOUNDS['max_lng']}")

print("\n" + "=" * 80)
print("SHELTERS (from Database)")
print("=" * 80)

shelters = Shelter.objects.all().order_by('name')
for i, s in enumerate(shelters, 1):
    lat = float(s.latitude)
    lng = float(s.longitude)
    in_bounds = (CARAGA_BOUNDS['min_lat'] <= lat <= CARAGA_BOUNDS['max_lat'] and 
                 CARAGA_BOUNDS['min_lng'] <= lng <= CARAGA_BOUNDS['max_lng'])
    status = "OK" if in_bounds else "ERROR - OUTSIDE BOUNDS"
    print(f"\n{i}. {s.name}")
    print(f"   Location: {s.address}")
    print(f"   Coordinates: ({lat:.4f}, {lng:.4f})")
    print(f"   Capacity: {s.capacity} people")
    print(f"   Type: {s.shelter_type}")
    print(f"   Status: {status}")

print("\n" + "=" * 80)
print("EARTHQUAKES (from Database)")
print("=" * 80)

earthquakes = Earthquake.objects.all().order_by('event_id')
for i, eq in enumerate(earthquakes, 1):
    lat = float(eq.latitude)
    lng = float(eq.longitude)
    in_bounds = (CARAGA_BOUNDS['min_lat'] <= lat <= CARAGA_BOUNDS['max_lat'] and 
                 CARAGA_BOUNDS['min_lng'] <= lng <= CARAGA_BOUNDS['max_lng'])
    status = "OK" if in_bounds else "ERROR - OUTSIDE BOUNDS"
    print(f"\n{i}. {eq.event_id}")
    print(f"   Magnitude: {eq.magnitude}")
    print(f"   Coordinates: ({lat:.4f}, {lng:.4f})")
    print(f"   Depth: {eq.depth} km")
    print(f"   Triggered at: {eq.triggered_at}")
    print(f"   Status: {status}")

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"Total Shelters: {shelters.count()}")
print(f"Total Earthquakes: {earthquakes.count()}")

all_valid = all((8.0 <= float(s.latitude) <= 10.0 and 124.5 <= float(s.longitude) <= 126.5) for s in shelters)
all_valid = all_valid and all((8.0 <= float(e.latitude) <= 10.0 and 124.5 <= float(e.longitude) <= 126.5) for e in earthquakes)

if all_valid:
    print("Result: ALL LOCATIONS ARE CORRECT!")
else:
    print("Result: SOME LOCATIONS ARE OUTSIDE CARAGA BOUNDS!")

print("=" * 80)
