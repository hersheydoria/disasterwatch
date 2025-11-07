# DisasterWatch Django Backend

A Django REST API backend for the DisasterWatch earthquake disaster management system.

## Features

- **Authentication**: JWT token-based authentication for coordinators and admins
- **Shelter Management**: CRUD operations for earthquake shelters
- **Earthquake Tracking**: Real-time earthquake data and seismic information
- **Alert System**: Alert management for earthquakes and shelter incidents
- **Evacuee Management**: Track evacuees at shelters
- **Reports**: Generate and manage incident reports
- **AI Recommendations**: AI-powered safety recommendations
- **Safety Tips**: Educational content for disaster preparedness
- **Notifications**: Real-time notifications for users

## Installation

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- pip

### Setup

1. **Clone and navigate to the backend directory**:
```bash
cd c:\Users\User\OneDrive\Desktop\web\disasterwatch\backend
```

2. **Create virtual environment**:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Create .env file** (copy from .env.example):
```bash
cp .env.example .env
```

5. **Update .env with your PostgreSQL credentials**:
```
DB_NAME=disasterwatch
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

6. **Run migrations**:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. **Create superuser**:
```bash
python manage.py createsuperuser
```

8. **Run development server**:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login with username and password

### Resources
- `GET /api/shelters/` - List all shelters
- `GET /api/earthquakes/` - List all earthquakes
- `GET /api/alerts/` - List all alerts
- `GET /api/evacuees/` - List all evacuees
- `GET /api/reports/` - List all reports
- `GET /api/safety-tips/` - List all safety tips
- `GET /api/ai-recommendations/` - List AI recommendations
- `GET /api/notifications/` - List user notifications

### Custom Actions
- `GET /api/shelters/by_region/?region_id=1` - Get shelters by region
- `GET /api/shelters/by_status/?status=active` - Get shelters by status
- `GET /api/earthquakes/recent/` - Get recent earthquakes
- `GET /api/alerts/by_status/?status=active` - Get alerts by status
- `POST /api/alerts/{id}/acknowledge/` - Acknowledge an alert
- `POST /api/notifications/{id}/mark_as_read/` - Mark notification as read

## Admin Panel

Access Django admin at `http://localhost:8000/admin/` with your superuser credentials.

## Database Schema

The backend connects to the PostgreSQL `disasterwatch` database with the following main tables:
- `users` - Coordinators and Admins
- `regions` - Geographic regions
- `shelters` - Evacuation shelters
- `earthquakes` - Seismic data
- `alerts` - Alert system
- `evacuees` - Evacuee records
- `reports` - Incident reports
- `ai_recommendations` - AI suggestions
- `safety_tips` - Educational content
- `notifications` - User notifications

## Frontend Integration

### Login Request
```javascript
POST http://localhost:8000/api/auth/login/
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Response
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@disasterwatch.com",
    "first_name": "System",
    "last_name": "Administrator"
  },
  "role": "admin"
}
```

### Using the Token
Include the token in the Authorization header for all subsequent requests:
```javascript
Authorization: Bearer <token>
```

## Development

### Create superuser from command line:
```bash
python manage.py shell
from django.contrib.auth.models import User
User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
```

### Insert test data:
```bash
python manage.py shell
from disasterwatch_api.models import Region
Region.objects.create(name='Caraga', code='CAR', description='Caraga Region')
```

## Deployment

For production:
1. Set `DEBUG=False` in .env
2. Use a production database
3. Configure proper CORS settings
4. Use environment variables for secrets
5. Run migrations in production database
6. Collect static files: `python manage.py collectstatic`

## License

Proprietary - DisasterWatch System
