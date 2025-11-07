#!/usr/bin/env python
"""
Script to add sample earthquake data to the DisasterWatch database
This script creates earthquake records for the Caraga region with various magnitudes
to display on the LiveMap component.
"""

import os
import django
from datetime import datetime, timedelta
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'disasterwatch_backend.settings')
django.setup()

from disasterwatch_api.models import Region, Earthquake

def add_sample_earthquakes():
    """Add sample earthquake data to the database"""
    
    # Get or create Caraga region
    caraga_region, created = Region.objects.get_or_create(
        name='Caraga',
        defaults={
            'code': 'CAR',
            'description': 'Caraga Administrative Region'
        }
    )
    print(f"Region: {caraga_region.name} (created={created})")
    
    # Sample earthquake data for Caraga region with realistic coordinates
    # Caraga region bounds: ~8.0 to 9.5 latitude, ~125.0 to 126.5 longitude
    earthquakes_data = [
        {
            'event_id': 'EQ001-2025-11',
            'magnitude': Decimal('6.8'),
            'latitude': Decimal('8.9750'),
            'longitude': Decimal('125.5350'),
            'depth': Decimal('15.5'),
            'event_type': 'main_shock',
            'description': 'Significant earthquake near Butuan City',
            'days_ago': 2
        },
        {
            'event_id': 'EQ002-2025-11',
            'magnitude': Decimal('5.2'),
            'latitude': Decimal('8.2422'),
            'longitude': Decimal('125.2449'),
            'depth': Decimal('22.3'),
            'event_type': 'aftershock',
            'description': 'Aftershock following main earthquake',
            'days_ago': 2
        },
        {
            'event_id': 'EQ003-2025-11',
            'magnitude': Decimal('7.1'),
            'latitude': Decimal('9.2100'),
            'longitude': Decimal('125.7800'),
            'depth': Decimal('18.0'),
            'event_type': 'main_shock',
            'description': 'High magnitude earthquake in northern Caraga',
            'days_ago': 5
        },
        {
            'event_id': 'EQ004-2025-11',
            'magnitude': Decimal('4.8'),
            'latitude': Decimal('8.6200'),
            'longitude': Decimal('125.4100'),
            'depth': Decimal('12.8'),
            'event_type': 'aftershock',
            'description': 'Minor aftershock in central region',
            'days_ago': 1
        },
        {
            'event_id': 'EQ005-2025-11',
            'magnitude': Decimal('5.9'),
            'latitude': Decimal('8.4500'),
            'longitude': Decimal('125.6200'),
            'depth': Decimal('25.5'),
            'event_type': 'main_shock',
            'description': 'Moderate earthquake in eastern Caraga',
            'days_ago': 7
        },
        {
            'event_id': 'EQ006-2025-11',
            'magnitude': Decimal('4.3'),
            'latitude': Decimal('8.1800'),
            'longitude': Decimal('125.3300'),
            'depth': Decimal('20.0'),
            'event_type': 'aftershock',
            'description': 'Light aftershock near Butuan region',
            'days_ago': 3
        },
        {
            'event_id': 'EQ007-2025-11',
            'magnitude': Decimal('6.2'),
            'latitude': Decimal('9.0500'),
            'longitude': Decimal('125.4500'),
            'depth': Decimal('16.2'),
            'event_type': 'main_shock',
            'description': 'Moderate-strong earthquake in Caraga',
            'days_ago': 10
        },
        {
            'event_id': 'EQ008-2025-11',
            'magnitude': Decimal('5.5'),
            'latitude': Decimal('8.3200'),
            'longitude': Decimal('125.5800'),
            'depth': Decimal('19.5'),
            'event_type': 'main_shock',
            'description': 'Moderate earthquake in central Caraga',
            'days_ago': 14
        }
    ]
    
    # Create earthquakes
    created_count = 0
    skipped_count = 0
    
    for eq_data in earthquakes_data:
        # Calculate triggered_at time
        days_ago = eq_data.pop('days_ago')
        triggered_at = datetime.now() - timedelta(days=days_ago)
        eq_data['triggered_at'] = triggered_at
        eq_data['region'] = caraga_region
        
        # Check if earthquake already exists
        if Earthquake.objects.filter(event_id=eq_data['event_id']).exists():
            print(f"  ⊘ Skipped: {eq_data['event_id']} (already exists)")
            skipped_count += 1
            continue
        
        # Create earthquake
        try:
            earthquake = Earthquake.objects.create(**eq_data)
            created_count += 1
            print(f"  ✓ Created: {earthquake.event_id} - Magnitude {earthquake.magnitude} - {earthquake.description}")
        except Exception as e:
            print(f"  ✗ Error creating {eq_data['event_id']}: {str(e)}")
    
    print(f"\n✓ Summary: {created_count} earthquakes created, {skipped_count} skipped")
    return created_count, skipped_count

if __name__ == '__main__':
    print("=" * 70)
    print("DisasterWatch - Sample Earthquake Data Loader")
    print("=" * 70)
    
    try:
        created, skipped = add_sample_earthquakes()
        print("\n✓ Sample earthquake data loading completed successfully!")
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()
