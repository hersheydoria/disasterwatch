# DisasterWatch - Complete Application

A comprehensive disaster management and earthquake tracking system with real-time alerts and shelter management built with Vue.js and Django.

## 🎯 Project Overview

DisasterWatch is a full-stack web application designed to:
- **Track earthquakes** in real-time in the Caraga region
- **Manage evacuation shelters** with capacity monitoring
- **Alert coordinators** of disaster events
- **Educate the public** on disaster preparedness
- **Generate incident reports** for disaster response

## 📁 Project Structure

```
disasterwatch/
├── backend/                    # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── setup.bat              # Run this to setup backend
│   ├── .env.example
│   └── disasterwatch_api/     # Main app with models, views, serializers
│
├── admin/                     # Admin Dashboard (Vue.js)
│   ├── src/
│   │   ├── api/client.js      # Backend API methods
│   │   ├── views/             # Dashboard, Shelters, Alerts, Reports, etc.
│   │   └── components/        # Reusable components
│   └── .env.local            # API configuration
│
├── public user/              # Public User App (Vue.js)
│   ├── src/
│   │   ├── api/client.js     # Public API methods
│   │   ├── components/       # HomePage, LiveMap, SafetyTips
│   │   └── views/
│   └── .env.local           # API configuration
│
└── database/
    ├── schema.sql            # PostgreSQL schema
    └── generate-password-hashes.js
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+** (Microsoft Store version)
- **Node.js 16+**
- **PostgreSQL 12+**
- **Git Bash** or Command Prompt

### Step 1: Setup Backend

```bash
cd backend
python setup.bat
```

This will:
1. Install all Python dependencies
2. Run database migrations
3. Create superuser (optional)

### Step 2: Create .env File

Create `backend/.env`:
```
DB_NAME=disasterwatch
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### Step 3: Start Backend

```bash
cd backend
python manage.py runserver
```

Backend runs at: **http://localhost:8000/**

### Step 4: Setup Admin Dashboard

```bash
cd admin
npm install
npm run dev
```

Admin runs at: **http://localhost:5173/**

### Step 5: Setup Public User App

```bash
cd "public user"
npm install
npm run dev
```

Public app runs at: **http://localhost:5174/**

## 🔐 Test Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Coordinator | `coordinator_butuan` | `coordinator_butuan123` |
| Coordinator | `coordinator_agusan_norte` | `coordinator_agusan_norte123` |
| Coordinator | `coordinator_surigao_sur` | `coordinator_surigao_sur123` |
| Coordinator | `coordinator_agusan_sur` | `coordinator_agusan_sur123` |
| Coordinator | `coordinator_cabadbaran` | `coordinator_cabadbaran123` |

## 📱 Application Features

### Admin Dashboard
- **Dashboard Overview** - Statistics and real-time metrics
- **Shelter Management** - CRUD operations for shelters
- **Earthquake Alerts** - Real-time earthquake monitoring
- **Incident Reports** - Report generation and tracking
- **Evacuee Management** - Track evacuees at shelters
- **Settings** - System configuration and preferences

### Public User App
- **Earthquake Map** - Live earthquake locations
- **Safety Recommendations** - Disaster preparedness tips
- **Shelter Finder** - Locate nearby shelters
- **Alert Information** - Public earthquake alerts
- **Contact Information** - Emergency contacts

## 🛠️ Technology Stack

### Frontend
- **Vue.js 3** - Reactive UI framework
- **Vite** - Lightning-fast build tool
- **CSS3** - Responsive styling
- **JavaScript ES6+** - Modern JavaScript

### Backend
- **Django 5.x** - Python web framework
- **Django REST Framework** - REST API
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens

### DevOps
- **Git** - Version control
- **pip** - Python package manager
- **npm** - JavaScript package manager

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login/` - Login with credentials

### Main Resources
- `/api/shelters/` - Shelter management
- `/api/earthquakes/` - Earthquake data
- `/api/alerts/` - Alert system
- `/api/evacuees/` - Evacuee tracking
- `/api/reports/` - Incident reports
- `/api/safety-tips/` - Educational content
- `/api/notifications/` - User notifications

### Custom Actions
- `GET /api/shelters/by_region/?region_id=1` - Shelters by region
- `GET /api/earthquakes/recent/` - Recent earthquakes
- `POST /api/alerts/{id}/acknowledge/` - Acknowledge alert
- `GET /api/safety-tips/by_category/?category=during_earthquake` - Tips by category

## 🔧 Configuration

### Environment Variables

**Admin (.env.local)**:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

**Public User (.env.local)**:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

**Backend (.env)**:
```
DB_NAME=disasterwatch
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DEBUG=True
SECRET_KEY=your-secret-key
```

## 📊 Database Schema

### Tables
1. **users** - Admin and coordinator accounts
2. **regions** - Geographic regions (Caraga, Agusan, Surigao, etc.)
3. **shelters** - Evacuation shelter information
4. **earthquakes** - Seismic event data
5. **alerts** - Alert notifications
6. **evacuees** - Evacuee tracking
7. **reports** - Incident reports
8. **ai_recommendations** - AI safety suggestions
9. **safety_tips** - Educational content
10. **notifications** - User notifications
11. **settings** - System configuration

## 🎨 Features Implemented

### Core Features
✅ User authentication with JWT tokens
✅ Real-time earthquake monitoring
✅ Shelter capacity management
✅ Evacuee tracking system
✅ Incident report generation
✅ Safety recommendation system
✅ Public alert notifications
✅ Admin dashboard with statistics

### UI/UX Features
✅ Responsive design (mobile, tablet, desktop)
✅ Dark/Light theme support
✅ Real-time data updates
✅ Search and filter functionality
✅ Pagination support
✅ Error handling and validation
✅ Loading states
✅ Accessibility features

### Technical Features
✅ RESTful API design
✅ JWT authentication
✅ CORS configuration
✅ Database migrations
✅ API documentation
✅ Error logging
✅ Performance optimization
✅ Security best practices

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && python manage.py runserver

# Admin
cd admin && npm run dev

# Public
cd "public user" && npm run dev
```

### Production
```bash
# Build frontend
npm run build

# Collect static files
python manage.py collectstatic

# Run with production server (Gunicorn)
gunicorn disasterwatch_backend.wsgi
```

## 📖 Documentation

- `INTEGRATION_SUMMARY.md` - Complete integration overview
- `FRONTEND_INTEGRATION.md` - Frontend API integration guide
- `BACKEND_SETUP.md` - Backend setup instructions
- `backend/README.md` - Django backend documentation

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check Python is installed
python --version

# Verify PostgreSQL is running
# Verify database exists
```

### Frontend Won't Connect to Backend
```bash
# Verify backend is running
curl http://localhost:8000/api/

# Check .env.local has correct API_BASE_URL
# Clear browser cache and localStorage
```

### Database Errors
```bash
# Reset migrations
python manage.py migrate zero

# Run migrations fresh
python manage.py migrate

# Create tables
python manage.py makemigrations
python manage.py migrate
```

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review error messages in console
3. Check Django admin panel: `http://localhost:8000/admin/`
4. Review API responses in browser DevTools

## 📄 License

Proprietary - DisasterWatch System

## 👥 Contributors

- Development Team
- UX/UI Design Team
- Quality Assurance Team

---

**DisasterWatch** - Keeping Communities Safe During Disasters 🌍
