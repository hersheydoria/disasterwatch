# Frontend to Backend Integration Guide

## Overview

Both the Admin dashboard (`admin/`) and Public user app (`public user/`) have been configured to connect to the Django backend API running on `http://localhost:8000/api/`.

## Configuration

### Environment Variables

Both applications have `.env.local` files configured with:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

This automatically connects to your Django backend.

## API Client

Each app has an `api/client.js` file that provides all backend API methods:

### Admin App (`admin/src/api/client.js`)

Full-featured API client with authentication:

```javascript
import api from '@/api/client'

// Login
await api.login(username, password)

// Shelters (requires auth)
await api.getShelters(page)
await api.getShelterById(id)
await api.getSheltersByRegion(regionId)
await api.createShelter(data)
await api.updateShelter(id, data)
await api.deleteShelter(id)

// Earthquakes (requires auth)
await api.getEarthquakes(page)
await api.getRecentEarthquakes()
await api.getEarthquakesByRegion(regionId)

// Alerts (requires auth)
await api.getAlerts(page)
await api.getAlertsByStatus(status)
await api.acknowledgeAlert(alertId)

// Evacuees (requires auth)
await api.getEvacuees(page)
await api.getEvacueesByShelter(shelterId)
await api.createEvacuee(data)

// Reports (requires auth)
await api.getReports(page)
await api.getReportsByShelter(shelterId)
await api.createReport(data)

// Safety Tips (requires auth)
await api.getSafetyTips(page)
await api.getSafetyTipsByCategory(category)

// AI Recommendations (requires auth)
await api.getAIRecommendations(page)
await api.getAIRecommendationsByShelter(shelterId)

// Notifications (requires auth)
await api.getNotifications(page)
await api.getUnreadNotifications()
await api.markNotificationAsRead(id)

// Regions
await api.getRegions()

// Users
await api.getUsers()
await api.getUserById(id)
```

### Public User App (`public user/src/api/client.js`)

Simplified API client for public endpoints (no authentication):

```javascript
import api from '@/api/client'

// Shelters (public)
await api.getShelters(page)
await api.getSheltersByRegion(regionId)
await api.getSheltersByStatus(status)

// Earthquakes (public)
await api.getEarthquakes(page)
await api.getRecentEarthquakes()
await api.getEarthquakesByRegion(regionId)

// Alerts (public)
await api.getAlerts(page)
await api.getAlertsByStatus(status)

// Safety Tips (public)
await api.getSafetyTips(page)
await api.getSafetyTipsByCategory(category)

// Regions (public)
await api.getRegions()
```

## Components Updated

### Admin Dashboard

1. **Login.vue** - Connects to Django authentication endpoint
   - Calls `login()` API method
   - Stores JWT token and user info in localStorage
   - Shows error messages on login failure

2. **Dashboard.vue** - Fetches real data from backend
   - Loads shelter statistics from API
   - Displays earthquake alerts
   - Shows recent activities
   - All numbers are now dynamic from the database

3. **Shelters.vue** - Displays shelters from database
   - Fetches shelters on component mount
   - Implements search filtering
   - Implements status filtering
   - Shows capacity bars based on occupancy data

### Public User App

Components can now fetch data:

```javascript
// Example in HomePage.vue
import { getRecentEarthquakes, getShelters } from '@/api/client'

onMounted(async () => {
  const earthquakes = await getRecentEarthquakes()
  const shelters = await getShelters(1)
})
```

## Authentication Flow

### Login Process

1. User enters username and password
2. Frontend calls `POST /api/auth/login/`
3. Backend verifies credentials against database
4. Backend returns JWT token and user info
5. Frontend stores token in localStorage
6. Token is automatically included in all subsequent requests via `Authorization: Bearer <token>` header

### Test Credentials

Login with any of these accounts:
- **admin** / **admin123** (Administrator)
- **coordinator_butuan** / **coordinator_butuan123** (Coordinator)
- **coordinator_agusan_norte** / **coordinator_agusan_norte123** (Coordinator)
- And other coordinator accounts...

### Token Management

- JWT tokens expire in 7 days
- If token expires, user is redirected to login
- Token is automatically attached to all authenticated requests

## API Response Format

### Paginated Responses

```json
{
  "count": 36,
  "next": "http://api.example.com/api/shelters/?page=2",
  "previous": null,
  "results": [
    { "id": 1, "name": "Shelter 1", ... },
    { "id": 2, "name": "Shelter 2", ... }
  ]
}
```

### Single Object Response

```json
{
  "id": 1,
  "name": "Central High School",
  "address": "1234 Main Street",
  "capacity": 500,
  "current_occupancy": 234,
  "status": "active",
  "region": 1,
  "region_name": "Agusan del Norte",
  ...
}
```

### Error Response

```json
{
  "error": "Invalid username or password"
}
```

## Error Handling

The API client automatically handles common errors:

- **401 Unauthorized**: Token expired or invalid → redirects to login
- **Network errors**: Caught and logged to console
- **Server errors**: Error message displayed from backend

## How to Update Components

### Fetching Data

```vue
<script setup>
import { onMounted, ref } from 'vue'
import { getShelters } from '@/api/client'

const shelters = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const response = await getShelters(1)
    shelters.value = response.results || response
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-for="shelter in shelters" :key="shelter.id">
    {{ shelter.name }}
  </div>
</template>
```

### Sending Data

```vue
<script setup>
import { createShelter } from '@/api/client'

async function addNewShelter() {
  try {
    const newShelter = await createShelter({
      name: 'New Shelter',
      address: '123 Main St',
      region_id: 1,
      shelter_type: 'gym',
      capacity: 200
    })
    console.log('Shelter created:', newShelter)
  } catch (error) {
    console.error('Error creating shelter:', error)
  }
}
</script>
```

## Running the Applications

### Start Backend

```bash
cd backend
python manage.py runserver
```

Backend runs at: `http://localhost:8000/`

### Start Admin Dashboard

```bash
cd admin
npm run dev
```

Admin runs at: `http://localhost:5173/`

### Start Public User App

```bash
cd "public user"
npm run dev
```

Public app runs at: `http://localhost:5174/` (or next available port)

## CORS Configuration

Backend CORS is already configured to allow:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

If you change these ports, update `CORS_ALLOWED_ORIGINS` in `backend/disasterwatch_backend/settings.py`

## Troubleshooting

### "Network Error" or "Cannot Connect to API"

1. Verify Django backend is running: `python manage.py runserver`
2. Check that backend is on `http://localhost:8000/`
3. Verify CORS is configured correctly
4. Check browser console for exact error message

### "401 Unauthorized"

1. Login credentials are incorrect
2. Token has expired (stored in localStorage)
3. Clear localStorage and login again: 
   ```javascript
   localStorage.clear()
   ```

### "Unexpected token <" Error

Usually means HTML is being returned instead of JSON. Check:
1. API endpoint URL is correct
2. Backend is running
3. Endpoint exists in Django URLs

### Login Not Working

1. Verify admin user exists in database:
   ```bash
   python manage.py shell
   from django.contrib.auth.models import User
   User.objects.all()
   ```

2. Reset migrations if needed:
   ```bash
   python manage.py migrate zero
   python manage.py migrate
   ```

## Next Steps

1. ✅ Backend is running and connected
2. ⏳ Update remaining components (Alerts, Reports, LiveMap, etc.)
3. ⏳ Add form validation and error handling
4. ⏳ Implement loading states for better UX
5. ⏳ Add real-time updates using WebSockets (optional)
6. ⏳ Deploy to production

---

**All components are now ready to consume real data from your Django backend!**
