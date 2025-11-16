# DisasterWatch - Frontend Only

A disaster management and earthquake tracking web application built with Vue.js. This is a frontend-only version with mock data for demonstration purposes.

## 🎯 Project Overview

DisasterWatch provides:
- **Earthquake tracking** display for the Caraga region
- **Evacuation shelter** location and information
- **AI-powered safety recommendations** based on location
- **Risk assessment** and preparedness guidance
- **Emergency resources** and medical facilities

## 📁 Project Structure

```
disasterwatch/
├── admin/                     # Admin Dashboard (Vue.js)
│   ├── src/
│   │   ├── api/client.js      # API methods (mock data)
│   │   ├── views/             # Dashboard, Shelters, Alerts, Reports
│   │   └── components/        # Reusable components
│   └── package.json
│
├── public user/               # Public User App (Vue.js)
│   ├── src/
│   │   ├── api/client.js      # Public API methods (mock data)
│   │   ├── components/        # HomePage, LiveMap, SafetyRecommendations
│   │   └── views/
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 16+**
- **npm** or **yarn**

### Setup Admin Dashboard

```bash
cd admin
npm install
npm run dev
```

Admin Dashboard runs at: **http://localhost:5173/**

### Setup Public User App

```bash
cd "public user"
npm install
npm run dev
```

Public User App runs at: **http://localhost:5174/** (or next available port)

## 📱 Application Features

### Admin Dashboard
- **Dashboard Overview** - Statistics and metrics
- **Shelter Management** - View shelter information
- **Earthquake Data** - Earthquake information display
- **Settings** - System configuration

### Public User App
- **Home Page** - Welcome and introduction
- **Safety Recommendations** - AI-powered disaster preparedness tips
- **Shelter Finder** - Locate nearby evacuation shelters
- **Earthquake Information** - Local earthquake data
- **Safety Resources** - Emergency contacts and guides

## 🛠️ Technology Stack

### Frontend
- **Vue.js 3** - Reactive UI framework
- **Vite** - Lightning-fast build tool
- **CSS3** - Responsive styling
- **JavaScript ES6+** - Modern JavaScript

### Data
- **Mock Data** - Built-in demonstration data
- **LocalStorage** - Client-side data persistence

## 📊 Mock Data

The application includes mock data for:
- **Regions**: Agusan del Norte, Surigao del Sur, Davao Oriental, Misamis Oriental
- **Shelters**: Multiple evacuation centers with capacity information
- **Earthquakes**: Sample seismic event data for the region
- **Safety Tips**: Disaster preparedness recommendations

## 🎨 Features Implemented

### Core Features
✅ Location-based safety recommendations
✅ Earthquake information display
✅ Evacuation shelter locator
✅ Risk assessment for locations
✅ Dynamic medical facilities finder
✅ Province/City/Barangay selection
✅ AI-powered recommendation system
✅ Safety preparedness tips

### UI/UX Features
✅ Responsive design (mobile, tablet, desktop)
✅ Real-time data updates
✅ Search and filter functionality
✅ Error handling and validation
✅ Loading states
✅ Accessibility features
✅ Intuitive navigation

### Technical Features
✅ Component-based architecture
✅ Vue 3 Composition API
✅ Mock data with realistic structure
✅ Location-based data filtering
✅ Responsive API client
✅ Error logging and handling

## 🚀 Running the Application

### Development Mode
```bash
# Admin Dashboard
cd admin
npm install
npm run dev

# Public User App (in separate terminal)
cd "public user"
npm install
npm run dev
```

### Building for Production
```bash
# Admin
cd admin
npm run build

# Public User
cd "public user"
npm run build
```

The built files will be in the `dist/` directory of each app.

## 🔧 File Structure

### API Client (`src/api/client.js`)
The API client contains mock data for:
- Regions and their cities
- Shelters with capacity and location info
- Earthquake events with magnitude and depth
- Safety tips and recommendations

### Components
- `SafetyRecommendations.vue` - Main component for location-based recommendations
- `HomePage.vue` - Public app home page
- `LiveMap.vue` - Earthquake data visualization
- `Dashboard.vue` - Admin overview

## 📝 Customization

To add more mock data, edit `src/api/client.js` and update:
1. `mockRegions` - Add new provinces and cities
2. `mockEarthquakes` - Add earthquake events
3. API functions - Modify data filtering logic

## 📞 Support

For issues or questions:
1. Check browser console for error messages
2. Verify Node.js and npm are installed correctly
3. Clear browser cache if data appears outdated
4. Check that both apps are running on separate ports

## 📄 License

Proprietary - DisasterWatch System

## 👥 Development

**DisasterWatch** - Keeping Communities Safe During Disasters 🌍
