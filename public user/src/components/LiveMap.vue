<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getShelters, getEarthquakes, getRegions, getEarthquakePredictions } from '../api/client'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

// Map state
const selectedPin = ref(null)
const activeFilters = ref({
  earthquakeZones: true,
  shelters: true,
  hospitals: true,
  predictions: true
})

// Map configuration
const mapCenter = ref([8.8, 125.5]) // Center of Caraga Region
const mapZoom = ref(9)
const mapOptions = ref({
  zoomControl: false,
  attributionControl: true
})

// Map instance
const mapContainer = ref(null)
let map = null
const markers = ref([])

// Define emits for navigation
const emit = defineEmits(['navigate'])

// Data from API
const earthquakeZones = ref([])
const shelters = ref([])
const hospitals = ref([])
const predictions = ref([])
const loading = ref(false)

// Fetch data from API
async function loadMapData() {
  loading.value = true
  try {
    // Fetch earthquakes
    const eqResponse = await getEarthquakes(1)
    const eqData = Array.isArray(eqResponse) ? eqResponse : eqResponse.results || []
    earthquakeZones.value = eqData.map(eq => ({
      id: eq.id,
      name: eq.event_id || `Earthquake at ${eq.latitude}, ${eq.longitude}`,
      riskLevel: eq.magnitude >= 6.5 ? 'high' : eq.magnitude >= 5.5 ? 'moderate' : 'low',
      lat: parseFloat(eq.latitude),
      lng: parseFloat(eq.longitude),
      magnitude: eq.magnitude,
      frequency: `Magnitude ${eq.magnitude} earthquake`,
      timestamp: eq.triggered_at,
      type: 'earthquake'
    }))

    // Fetch shelters
    const shelterResponse = await getShelters(1)
    const shelterData = Array.isArray(shelterResponse) ? shelterResponse : shelterResponse.results || []
    shelters.value = shelterData.map(shelter => ({
      id: shelter.id,
      name: shelter.name,
      type: 'shelter',
      lat: parseFloat(shelter.latitude) || 8.8,
      lng: parseFloat(shelter.longitude) || 125.5,
      capacity: shelter.capacity,
      current: shelter.current_occupancy,
      contact: shelter.contact_number || 'N/A',
      address: shelter.address,
      status: shelter.status
    }))

    // Fetch AI predictions
    const predictionsResponse = await getEarthquakePredictions()
    predictions.value = predictionsResponse.predictions || []

    // Real hospitals in Caraga region (based on public health facilities)
    hospitals.value = [
      {
        id: 'h1',
        name: 'Butuan Medical Center',
        type: 'hospital',
        lat: 8.9750,
        lng: 125.5350,
        beds: 200,
        emergency: true,
        contact: '+63-85-225-5555',
        address: 'Butuan City, Agusan del Norte'
      },
      {
        id: 'h2',
        name: 'Surigao City Hospital',
        type: 'hospital',
        lat: 9.7726,
        lng: 125.5028,
        beds: 150,
        emergency: true,
        contact: '+63-86-239-2640',
        address: 'Surigao City, Surigao del Norte'
      },
      {
        id: 'h3',
        name: 'Tandag Medical Center',
        type: 'hospital',
        lat: 8.4639,
        lng: 126.1956,
        beds: 80,
        emergency: true,
        contact: '+63-86-216-0200',
        address: 'Tandag, Surigao del Sur'
      },
      {
        id: 'h4',
        name: 'Prosperidad District Hospital',
        type: 'hospital',
        lat: 8.2564,
        lng: 125.7325,
        beds: 60,
        emergency: true,
        contact: '+63-85-813-8810',
        address: 'Prosperidad, Agusan del Sur'
      },
      {
        id: 'h5',
        name: 'Bayugan City Hospital',
        type: 'hospital',
        lat: 8.3647,
        lng: 125.5389,
        beds: 100,
        emergency: true,
        contact: '+63-85-842-2112',
        address: 'Bayugan City, Agusan del Sur'
      },
      {
        id: 'h6',
        name: 'Bislig District Hospital',
        type: 'hospital',
        lat: 8.1483,
        lng: 126.2667,
        beds: 50,
        emergency: true,
        contact: '+63-86-399-1091',
        address: 'Bislig, Surigao del Sur'
      },
      {
        id: 'h7',
        name: 'Cabadbaran City Hospital',
        type: 'hospital',
        lat: 9.4042,
        lng: 125.4467,
        beds: 120,
        emergency: true,
        contact: '+63-85-342-2100',
        address: 'Cabadbaran City, Agusan del Norte'
      },
      {
        id: 'h8',
        name: 'General Luna District Hospital',
        type: 'hospital',
        lat: 9.8111,
        lng: 125.8889,
        beds: 45,
        emergency: true,
        contact: '+63-86-232-9201',
        address: 'General Luna, Siargao, Surigao del Norte'
      }
    ]
  } catch (error) {
    console.error('Error loading map data:', error)
  } finally {
    loading.value = false
  }
}

// Computed properties
const filteredZones = computed(() => {
  return activeFilters.value.earthquakeZones ? earthquakeZones.value : []
})

const filteredShelters = computed(() => {
  return activeFilters.value.shelters ? shelters.value : []
})

const filteredHospitals = computed(() => {
  return activeFilters.value.hospitals ? hospitals.value : []
})

const filteredPredictions = computed(() => {
  return activeFilters.value.predictions ? predictions.value : []
})

const currentRiskLevel = computed(() => {
  const risks = filteredZones.value.map(z => z.riskLevel)
  if (risks.includes('high')) return 'HIGH'
  if (risks.includes('moderate')) return 'MODERATE'
  return 'LOW'
})

const riskColor = computed(() => {
  const level = currentRiskLevel.value
  if (level === 'HIGH') return '#FF4444'
  if (level === 'MODERATE') return '#FF9933'
  return '#44AA44'
})

const getZoneColor = (riskLevel) => {
  const colors = {
    high: '#FF4444',
    moderate: '#FF9933',
    low: '#44AA44'
  }
  return colors[riskLevel] || '#999'
}

const getZoneIcon = (riskLevel) => {
  const color = getZoneColor(riskLevel)
  const svg = `
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="12" fill="${color}" stroke="white" stroke-width="3"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

const getShelterIcon = () => {
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="30" height="30" rx="4" ry="4" fill="white" stroke="#FF7A00" stroke-width="3"/>
      <path d="M12 15l8-8 8 8v12a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2z" fill="#FF7A00"/>
      <polyline points="18,27 18,17 22,17 22,27" stroke="white" stroke-width="2" fill="none"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

const getHospitalIcon = () => {
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="30" height="30" rx="4" ry="4" fill="white" stroke="#00AA00" stroke-width="3"/>
      <rect x="11" y="11" width="18" height="18" rx="2" fill="#00AA00"/>
      <rect x="17" y="17" width="6" height="6" fill="white"/>
      <rect x="20" y="14" width="2" height="12" fill="white"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

const toggleFilter = (filter) => {
  activeFilters.value[filter] = !activeFilters.value[filter]
}

const selectPin = (pin) => {
  selectedPin.value = pin
}

const closeInfo = () => {
  selectedPin.value = null
}

const getMapStyle = (item) => {
  if (item.type === 'zone') {
    return {
      backgroundColor: getZoneColor(item.riskLevel),
      boxShadow: `0 0 ${item.riskLevel === 'high' ? 15 : 10}px ${getZoneColor(item.riskLevel)}`
    }
  }
  return {}
}

const getCapacityPercent = (current, capacity) => {
  return Math.round((current / capacity) * 100)
}

// Initialize map when component mounts
onMounted(async () => {
  if (mapContainer.value) {
    map = L.map(mapContainer.value).setView(mapCenter.value, mapZoom.value)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
    
    console.log('Map initialized successfully')
  }
  
  await loadMapData()
  console.log('Map data loaded:', {
    earthquakes: earthquakeZones.value.length,
    shelters: shelters.value.length,
    hospitals: hospitals.value.length,
    predictions: predictions.value.length
  })
  
  console.log('Filtered data:', {
    zones: filteredZones.value.length,
    shelters: filteredShelters.value.length,
    hospitals: filteredHospitals.value.length,
    predictions: filteredPredictions.value.length
  })
  
  // Now that map is initialized and data is loaded, update markers
  updateMarkers()
})

// Clean up map when component unmounts
onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

// Update markers when filters change
const updateMarkers = () => {
  if (!map) {
    console.error('Map not initialized')
    return
  }
  
  console.log('updateMarkers called - clearing', markers.value.length, 'existing markers')
  
  // Clear existing markers
  markers.value.forEach(marker => map.removeLayer(marker))
  markers.value = []
  
  console.log('Adding new markers:', {
    zones: filteredZones.value.length,
    shelters: filteredShelters.value.length,
    hospitals: filteredHospitals.value.length,
    predictions: filteredPredictions.value.length
  })
  
  // Add zone markers
  filteredZones.value.forEach(zone => {
    try {
      console.log(`Adding zone: ${zone.name} at [${zone.lat}, ${zone.lng}]`)
      const marker = L.circleMarker([zone.lat, zone.lng], {
        color: getZoneColor(zone.riskLevel),
        fillColor: getZoneColor(zone.riskLevel),
        fillOpacity: 0.8,
        radius: 15
      }).addTo(map)
      
      marker.bindPopup(`
        <div class="popup-content">
          <h4>${zone.name}</h4>
          <p><strong>Risk Level:</strong> ${zone.riskLevel.toUpperCase()}</p>
          <p><strong>Magnitude:</strong> ${zone.magnitude}</p>
          <p><strong>Activity:</strong> ${zone.frequency}</p>
        </div>
      `)
      
      marker.on('click', () => selectPin({ ...zone, type: 'zone' }))
      markers.value.push(marker)
    } catch (error) {
      console.error(`Error adding zone marker: ${zone.name}`, error)
    }
  })
  
  // Add shelter markers
  filteredShelters.value.forEach(shelter => {
    try {
      const shelterIcon = L.divIcon({
        html: `<div style="background: white; border: 3px solid #FF7A00; border-radius: 6px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 24 24" fill="none" stroke="#FF7A00" stroke-width="2" style="width: 20px; height: 20px;">
            <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        </div>`,
        className: 'custom-shelter-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      })
      
      console.log(`Adding shelter: ${shelter.name} at [${shelter.lat}, ${shelter.lng}]`)
      const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon }).addTo(map)
      marker.bindPopup(`
        <div class="popup-content">
          <h4>${shelter.name}</h4>
          <p><strong>Type:</strong> Evacuation Shelter</p>
          <p><strong>Capacity:</strong> ${shelter.capacity}</p>
          <p><strong>Current:</strong> ${shelter.current}</p>
          <p><strong>Contact:</strong> ${shelter.contact}</p>
        </div>
      `)
      
      marker.on('click', () => selectPin(shelter))
      markers.value.push(marker)
    } catch (error) {
      console.error(`Error adding shelter marker: ${shelter.name}`, error)
    }
  })
  
  // Add hospital markers
  filteredHospitals.value.forEach(hospital => {
    try {
      const hospitalIcon = L.divIcon({
        html: `<div style="background: white; border: 3px solid #00AA00; border-radius: 6px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00AA00" stroke-width="2" style="width: 20px; height: 20px;">
            <rect x="3" y="6" width="18" height="12" rx="2"/>
            <path d="M9 12h6"/>
            <path d="M12 9v6"/>
          </svg>
        </div>`,
        className: 'custom-hospital-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      })
      
      console.log(`Adding hospital: ${hospital.name} at [${hospital.lat}, ${hospital.lng}]`)
      const marker = L.marker([hospital.lat, hospital.lng], { icon: hospitalIcon }).addTo(map)
      marker.bindPopup(`
        <div class="popup-content">
          <h4>${hospital.name}</h4>
          <p><strong>Type:</strong> Medical Facility</p>
          <p><strong>Beds:</strong> ${hospital.beds}</p>
          <p><strong>Status:</strong> ${hospital.emergency ? 'Operational' : 'Closed'}</p>
          <p><strong>Contact:</strong> ${hospital.contact}</p>
        </div>
      `)
      
      marker.on('click', () => selectPin(hospital))
      markers.value.push(marker)
    } catch (error) {
      console.error(`Error adding hospital marker: ${hospital.name}`, error)
    }
  })

  // Add AI prediction markers
  filteredPredictions.value.forEach(prediction => {
    try {
      const predictionColor = prediction.risk_level === 'critical' ? '#FF0000' : 
                             prediction.risk_level === 'high' ? '#FF4444' :
                             prediction.risk_level === 'moderate' ? '#FF9933' : '#FFD700'
      
      const predictionIcon = L.divIcon({
        html: `<div style="background: white; border: 3px solid ${predictionColor}; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${predictionColor};">
          <svg viewBox="0 0 24 24" fill="${predictionColor}" stroke="none" style="width: 18px; height: 18px;">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>`,
        className: 'custom-prediction-icon',
        iconSize: [35, 35],
        iconAnchor: [17, 35]
      })
      
      console.log(`Adding prediction: ${prediction.name} at [${prediction.latitude}, ${prediction.longitude}]`)
      const marker = L.marker([prediction.latitude, prediction.longitude], { icon: predictionIcon }).addTo(map)
      marker.bindPopup(`
        <div class="popup-content">
          <h4>${prediction.name}</h4>
          <p><strong>Type:</strong> AI Prediction</p>
          <p><strong>Risk Level:</strong> ${prediction.risk_level.toUpperCase()}</p>
          <p><strong>Risk Score:</strong> ${prediction.risk_score}/100</p>
          <p><strong>Predicted Magnitude:</strong> ${prediction.predicted_magnitude_range}</p>
          <p><strong>Confidence:</strong> ${prediction.confidence.toFixed(1)}%</p>
          <p><strong>Historical Events:</strong> ${prediction.historical_count}</p>
          <p><strong>Analysis Method:</strong> ${prediction.analysis_method || 'Seismic pattern analysis'}</p>
          <p><strong>Description:</strong> ${prediction.description}</p>
        </div>
      `)
      
      marker.on('click', () => selectPin(prediction))
      markers.value.push(marker)
    } catch (error) {
      console.error(`Error adding prediction marker: ${prediction.name}`, error)
    }
  })

  console.log('updateMarkers complete - total markers:', markers.value.length)
}

// Watch for filter changes and update markers
watch([filteredZones, filteredShelters, filteredHospitals, filteredPredictions], updateMarkers)
</script>

<template>
  <div class="livemap-container">
    <!-- Main Layout Container -->
    <div class="livemap-wrapper">
      <!-- Left Sidebar Panel -->
      <div class="sidebar-panel">
        <!-- Header Section -->
        <div class="sidebar-header">
          <h1 class="page-title">Caraga Region Earthquake Risk Map</h1>
          <p class="page-subtitle">Real-time monitoring of seismic activity and emergency resources</p>
        </div>

        <!-- Risk Level Indicator -->
        <div class="risk-indicator">
          <div class="risk-badge" :style="{ backgroundColor: riskColor }">
            <span class="risk-label">{{ currentRiskLevel }} RISK</span>
          </div>
          <div class="risk-meta">
            <p>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Moderate Risk Level
            </p>
            <p>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Population: 2.8M
            </p>
          </div>
        </div>

        <!-- Map Filters -->
        <div class="filters-section">
          <h3 class="section-title">Map Filters</h3>
          <div class="filter-buttons">
            <button
              :class="['filter-btn', { active: activeFilters.earthquakeZones }]"
              @click="toggleFilter('earthquakeZones')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="filter-icon">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Risk Zones
            </button>
            <button
              :class="['filter-btn', { active: activeFilters.shelters }]"
              @click="toggleFilter('shelters')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="filter-icon">
                <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Evacuation Shelters
            </button>
            <button
              :class="['filter-btn', { active: activeFilters.hospitals }]"
              @click="toggleFilter('hospitals')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="filter-icon">
                <rect x="3" y="6" width="18" height="12" rx="2"/>
                <path d="M9 12h6"/>
                <path d="M12 9v6"/>
              </svg>
              Hospitals
            </button>
            <button
              :class="['filter-btn', { active: activeFilters.predictions }]"
              @click="toggleFilter('predictions')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="filter-icon">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
                <path d="M9 3h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"/>
              </svg>
              AI Predictions
            </button>
          </div>
        </div>

        <!-- Map Legend -->
        <div class="legend-section">
          <h3 class="section-title">Map Legend</h3>
          <div class="legend-items">
            <div class="legend-item">
              <div class="legend-color high"></div>
              <span>High Risk Zone</span>
            </div>
            <div class="legend-item">
              <div class="legend-color moderate"></div>
              <span>Moderate Risk Zone</span>
            </div>
            <div class="legend-item">
              <div class="legend-color low"></div>
              <span>Low Risk Zone</span>
            </div>
            <div class="legend-item">
              <div class="legend-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              </div>
              <span>Evacuation Shelter</span>
            </div>
            <div class="legend-item">
              <div class="legend-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="6" width="18" height="12" rx="2"/>
                  <path d="M9 12h6"/>
                  <path d="M12 9v6"/>
                </svg>
              </div>
              <span>Hospital</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #FF4444; box-shadow: 0 0 8px #FF4444; border-radius: 50%;"></div>
              <span>AI Prediction Zone</span>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="quick-stats">
          <h3 class="section-title">Quick Stats</h3>
          <div class="stats-list">
            <div class="stat">
              <span class="stat-label">Total Shelters</span>
              <span class="stat-value">24</span>
            </div>
            <div class="stat">
              <span class="stat-label">Total Capacity</span>
              <span class="stat-value">12,500</span>
            </div>
            <div class="stat">
              <span class="stat-label">Hospitals</span>
              <span class="stat-value">15</span>
            </div>
            <div class="stat">
              <span class="stat-label">Coverage Area</span>
              <span class="stat-value">18,847 km²</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Container -->
      <div class="map-container">
        <!-- Map Header Bar -->
        <div class="map-header">
          <div class="header-left">
            <span class="last-updated">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="status-icon">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
              Last Updated: 7 minutes ago
            </span>
            <span class="system-status">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="status-icon">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              System Active
            </span>
          </div>
          <div class="header-right">
            <button class="action-btn secondary-btn" @click="emit('navigate', 'home')">← Back</button>
            <button class="action-btn primary-btn" @click="emit('navigate', 'safety')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-icon">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              View Safety Recommendation
            </button>
          </div>
        </div>

        <!-- Map Canvas -->
        <div ref="mapContainer" class="map-canvas">
          <!-- Zoom Controls -->
          <div class="zoom-controls">
            <button class="zoom-btn" @click="mapZoom++">+</button>
            <button class="zoom-btn" @click="mapZoom--">-</button>
          </div>
        </div>

        <!-- Info Panel - Floating on Map -->
        <div v-if="selectedPin" class="info-panel">
          <button class="close-btn" @click="closeInfo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div v-if="selectedPin.type === 'zone'" class="zone-info">
            <h2 class="info-title">{{ selectedPin.name }}</h2>
            <div class="info-badge" :style="{ backgroundColor: getZoneColor(selectedPin.riskLevel) }">
              {{ selectedPin.riskLevel.toUpperCase() }} RISK
            </div>
            <div class="info-details">
              <div class="detail-row">
                <span class="detail-label">Estimated Magnitude:</span>
                <span class="detail-value">{{ selectedPin.magnitude }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Activity Level:</span>
                <span class="detail-value">{{ selectedPin.frequency }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Coordinates:</span>
                <span class="detail-value">{{ selectedPin.lat.toFixed(4) }}, {{ selectedPin.lng.toFixed(4) }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="selectedPin.type === 'shelter'" class="shelter-info">
            <h2 class="info-title">{{ selectedPin.name }}</h2>
            <div class="info-badge shelter-badge">EVACUATION SHELTER</div>
            <div class="info-details">
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">{{ selectedPin.address }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Capacity:</span>
                <span class="detail-value">{{ selectedPin.capacity }} persons</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Currently Occupied:</span>
                <span class="detail-value">{{ selectedPin.current }}/{{ selectedPin.capacity }}</span>
              </div>
              <div class="capacity-bar">
                <div
                  class="capacity-fill"
                  :style="{ width: getCapacityPercent(selectedPin.current, selectedPin.capacity) + '%' }"
                ></div>
              </div>
              <div class="detail-row">
                <span class="detail-label">Occupancy:</span>
                <span class="detail-value">{{ getCapacityPercent(selectedPin.current, selectedPin.capacity) }}%</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Contact:</span>
                <span class="detail-value contact">{{ selectedPin.contact }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="selectedPin.type === 'hospital'" class="hospital-info">
            <h2 class="info-title">{{ selectedPin.name }}</h2>
            <div class="info-badge hospital-badge">MEDICAL FACILITY</div>
            <div class="info-details">
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">{{ selectedPin.address }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Emergency Beds:</span>
                <span class="detail-value">{{ selectedPin.beds }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value" :style="{ color: selectedPin.emergency ? '#00AA00' : '#666' }">
                  <svg v-if="selectedPin.emergency" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="status-icon">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                  {{ selectedPin.emergency ? 'OPERATIONAL' : 'CLOSED' }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Contact:</span>
                <span class="detail-value contact">{{ selectedPin.contact }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.livemap-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 0;
  display: flex;
  flex-direction: column;
}

.livemap-wrapper {
  display: flex;
  flex: 1;
  gap: 0;
}

/* Left Sidebar Panel */
.sidebar-panel {
  width: 320px;
  background: white;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-header {
  border-bottom: 2px solid #FF7A00;
  padding-bottom: 1.5rem;
}

.page-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.page-subtitle {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

/* Risk Indicator */
.risk-indicator {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.risk-badge {
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  color: white;
}

.risk-label {
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
}

.risk-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.risk-meta p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inline-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* Filters Section */
.filters-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.filter-btn {
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.filter-btn:hover:not(:disabled) {
  border-color: #FF7A00;
  color: #FF7A00;
  background: #fff9f5;
}

.filter-btn.active {
  background: #FF7A00;
  color: white;
  border-color: #FF7A00;
}

.filter-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Legend Section */
.legend-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.9rem;
  color: #666;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-color.high {
  background: #FF4444;
}

.legend-color.moderate {
  background: #FF9933;
}

.legend-color.low {
  background: #44AA44;
}

.legend-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.legend-icon svg {
  width: 100%;
  height: 100%;
}

/* Quick Stats */
.quick-stats {
  border-top: 1px solid #eee;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.stat-label {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #FF7A00;
  margin-top: 0.3rem;
}

/* Map Container */
.map-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #e8f4f8;
  position: relative;
}

/* Map Header Bar */
.map-header {
  background: white;
  border-bottom: 1px solid #ddd;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.header-left {
  display: flex;
  gap: 2rem;
  align-items: center;
  font-size: 0.9rem;
}

.last-updated {
  color: #FF7A00;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.system-status {
  color: #44AA44;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.status-icon {
  width: 0.8rem;
  height: 0.8rem;
  flex-shrink: 0;
}

.header-right {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.secondary-btn {
  background: #f0f0f0;
  color: #333;
}

.secondary-btn:hover {
  background: #e0e0e0;
}

.primary-btn {
  background: #FF7A00;
  color: white;
}

.primary-btn:hover {
  background: #E56A00;
}

/* Map Canvas */
.map-canvas {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.map-canvas :deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  z-index: 1;
}

.map-canvas :deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.map-canvas :deep(.custom-shelter-icon),
.map-canvas :deep(.custom-hospital-icon),
.map-canvas :deep(.custom-prediction-icon) {
  background: none !important;
  border: none !important;
}

.map-canvas :deep(.custom-shelter-icon div),
.map-canvas :deep(.custom-hospital-icon div),
.map-canvas :deep(.custom-prediction-icon div) {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.map-canvas :deep(.custom-shelter-icon div:hover),
.map-canvas :deep(.custom-hospital-icon div:hover),
.map-canvas :deep(.custom-prediction-icon div:hover) {
  transform: scale(1.2);
}

.popup-content {
  padding: 0.5rem;
}

.popup-content h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

.popup-content p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
  color: #666;
}

/* Zoom Controls */
.zoom-controls {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
}

.zoom-btn {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: white;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 700;
  color: #666;
  transition: all 0.3s ease;
}

.zoom-btn:hover {
  background: #FF7A00;
  color: white;
  border-color: #FF7A00;
}

/* Info Panel */
.info-panel {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 50;
  max-height: 70vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #FF7A00;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #E56A00;
}

.close-btn svg {
  width: 16px;
  height: 16px;
}

.zone-info,
.shelter-info,
.hospital-info {
  padding: 1.5rem;
}

.info-title {
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 0.8rem 0;
  padding-right: 2rem;
  font-weight: 700;
}

.info-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
  background: #FF7A00;
}

.shelter-badge {
  background: #FF9933;
}

.hospital-badge {
  background: #00AA00;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  gap: 0.5rem;
}

.detail-label {
  color: #666;
  font-weight: 500;
}

.detail-value {
  color: #333;
  font-weight: 600;
  text-align: right;
}

.detail-value.contact {
  color: #FF7A00;
  cursor: pointer;
}

.detail-value.contact:hover {
  text-decoration: underline;
}

.capacity-bar {
  width: 100%;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.capacity-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF9933, #FF7A00);
}

.status-icon {
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0.3rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .sidebar-panel {
    width: 280px;
    padding: 1.5rem 1.2rem;
    gap: 1.5rem;
  }

  .page-title {
    font-size: 1.1rem;
  }

  .stats-list {
    grid-template-columns: 1fr;
  }

  .map-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-right {
    width: 100%;
  }

  .action-btn {
    flex: 1;
  }
}

@media (max-width: 1024px) {
  .livemap-wrapper {
    flex-direction: column;
  }

  .sidebar-panel {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    padding: 1.5rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    column-gap: 2rem;
  }

  .sidebar-header {
    grid-column: 1 / -1;
  }

  .quick-stats {
    grid-column: 1 / -1;
  }

  .map-container {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .livemap-container {
    padding-top: 0;
  }

  .sidebar-panel {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 1rem;
  }

  .page-subtitle {
    font-size: 0.8rem;
  }

  .map-header {
    padding: 1rem;
    flex-direction: column;
  }

  .header-left {
    gap: 1rem;
    font-size: 0.8rem;
  }

  .action-btn {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }

  .info-panel {
    width: 280px;
    left: 1rem;
    bottom: 1rem;
  }

  .map-header {
    padding: 0.8rem;
  }

  .zoom-controls {
    right: 1rem;
  }

  .zoom-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .sidebar-panel {
    padding: 1rem;
  }

  .page-title {
    font-size: 0.95rem;
  }

  .stats-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-panel {
    width: calc(100% - 2rem);
    left: 1rem;
    right: 1rem;
    max-height: 50vh;
  }

  .map-header {
    padding: 0.8rem;
  }

  .header-left {
    gap: 0.5rem;
    flex-direction: column;
    font-size: 0.75rem;
  }

  .header-right {
    flex-direction: column;
    width: 100%;
  }

  .action-btn {
    padding: 0.6rem;
    font-size: 0.8rem;
    width: 100%;
  }
}
</style>
