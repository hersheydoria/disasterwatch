# Django Backend Setup Guide for DisasterWatch

## Quick Start

### Step 1: Install Python Dependencies

```bash
cd c:\Users\User\OneDrive\Desktop\web\disasterwatch\backend
pip install -r requirements.txt
```

### Step 2: Configure Database Connection

Create a `.env` file in the backend directory with your PostgreSQL credentials:

```
DB_NAME=disasterwatch
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
```

### Step 3: Run Migrations

If you haven't already created tables using the SQL schema, the Django models will create them:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 4: Create Django Superuser (Admin)

```bash
python manage.py createsuperuser
```

This will prompt you to create a superuser account for accessing Django admin.

### Step 5: Start the Development Server

```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000/`

---

## Important: Password Hashing

The login endpoint expects bcrypt hashes. Your PostgreSQL accounts have bcrypt hashes already stored.

### Login Test

Make a POST request to: `http://localhost:8000/api/auth/login/`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@disasterwatch.com"
  },
  "role": "admin"
}
```

---

## Connecting Frontend to Backend

### 1. Update Admin Login Component

In your Vue.js admin app (`admin/src/views/Login.vue`):

```javascript
async loginUser() {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      this.loginSuccessful = true;
      // Navigate to dashboard
    } else {
      this.loginError = data.error;
    }
  } catch (error) {
    this.loginError = 'Network error. Is the backend running?';
  }
}
```

### 2. Create API Client Helper

Create `admin/src/api/client.js`:

```javascript
export const API_BASE_URL = 'http://localhost:8000/api';

export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...options.headers }
  });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  
  return response.json();
}
```

### 3. Fetch Shelters in Dashboard

```javascript
import { fetchAPI } from '@/api/client.js';

async mounted() {
  const shelters = await fetchAPI('/shelters/');
  this.shelters = shelters.results;
}
```

### 4. Configure CORS

The backend already has CORS enabled for:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000`

---

## API Endpoints Reference

### Authentication
- **POST** `/api/auth/login/` - Login

### Shelters
- **GET** `/api/shelters/` - List all shelters
- **POST** `/api/shelters/` - Create shelter
- **GET** `/api/shelters/{id}/` - Get shelter details
- **PUT** `/api/shelters/{id}/` - Update shelter
- **DELETE** `/api/shelters/{id}/` - Delete shelter
- **GET** `/api/shelters/by_region/?region_id=1` - Get shelters by region
- **GET** `/api/shelters/by_status/?status=active` - Get shelters by status

### Earthquakes
- **GET** `/api/earthquakes/` - List all earthquakes
- **GET** `/api/earthquakes/recent/` - Get 10 recent earthquakes
- **GET** `/api/earthquakes/by_region/?region_id=1` - Get earthquakes by region

### Alerts
- **GET** `/api/alerts/` - List all alerts
- **POST** `/api/alerts/` - Create alert
- **GET** `/api/alerts/by_status/?status=active` - Get alerts by status
- **POST** `/api/alerts/{id}/acknowledge/` - Acknowledge alert

### Evacuees
- **GET** `/api/evacuees/` - List all evacuees
- **POST** `/api/evacuees/` - Create evacuee
- **GET** `/api/evacuees/by_shelter/?shelter_id=1` - Get evacuees by shelter

### Reports
- **GET** `/api/reports/` - List all reports
- **POST** `/api/reports/` - Create report
- **GET** `/api/reports/by_shelter/?shelter_id=1` - Get reports by shelter

### Safety Tips
- **GET** `/api/safety-tips/` - List all safety tips
- **GET** `/api/safety-tips/by_category/?category=during_earthquake` - Get tips by category

### Notifications
- **GET** `/api/notifications/` - List user notifications
- **GET** `/api/notifications/unread/` - Get unread notifications
- **POST** `/api/notifications/{id}/mark_as_read/` - Mark as read

### AI Recommendations
- **GET** `/api/ai-recommendations/` - List recommendations
- **GET** `/api/ai-recommendations/by_shelter/?shelter_id=1` - Get by shelter

---

## Troubleshooting

### "Connection refused" Error
- Make sure PostgreSQL is running
- Check your DB credentials in .env
- Verify the database name is `disasterwatch`

### "CORS Error" in Browser
- Make sure Django server is running on `http://localhost:8000`
- Check that the frontend URL is in `CORS_ALLOWED_ORIGINS`

### "No such table" Error
- Run migrations: `python manage.py migrate`
- Check if PostgreSQL has the tables created from schema.sql

### Password Validation Fails
- Ensure you're using bcrypt-hashed passwords
- Check that the password in frontend matches exactly with database

---

## Admin Panel

Access at: `http://localhost:8000/admin/`

Log in with your superuser credentials created in Step 4.

You can:
- View and manage all database records
- Create new regions, shelters, earthquakes, alerts, etc.
- Monitor user activity
- Manage permissions

---

## Next Steps

1. ✅ Backend running on `http://localhost:8000`
2. ⏳ Connect admin frontend to login endpoint
3. ⏳ Fetch shelters, earthquakes, alerts from API
4. ⏳ Public frontend can fetch safety tips and earthquake data
5. ⏳ Deploy to production server

