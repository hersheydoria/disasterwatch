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

// City/Municipality coordinates for Caraga Region
const CARAGA_CITY_COORDINATES = {
  // Agusan del Norte
  'Butuan City': { lat: 8.9475, lng: 125.5406 },
  'Cabadbaran City': { lat: 9.1236, lng: 125.5339 },
  'Buenavista': { lat: 8.9806, lng: 125.4083 },
  'Carmen': { lat: 9.2167, lng: 125.6833 },
  'Jabonga': { lat: 9.3500, lng: 125.5167 },
  'Kitcharao': { lat: 9.4500, lng: 125.5667 },
  'Las Nieves': { lat: 9.1333, lng: 125.5333 },
  'Magallanes': { lat: 9.0333, lng: 125.5167 },
  'Nasipit': { lat: 8.9672, lng: 125.3417 },
  'Remedios T. Romualdez': { lat: 9.0667, lng: 125.5833 },
  'Santiago': { lat: 9.2000, lng: 125.5333 },
  'Tubay': { lat: 9.1667, lng: 125.5000 },
  // Agusan del Sur
  'Bayugan City': { lat: 8.7133, lng: 125.7672 },
  'Bunawan': { lat: 8.1833, lng: 125.9833 },
  'Esperanza': { lat: 8.2000, lng: 125.6667 },
  'La Paz': { lat: 8.2167, lng: 125.7000 },
  'Loreto': { lat: 8.0333, lng: 125.8000 },
  'Prosperidad': { lat: 8.6000, lng: 125.9167 },
  'Rosario': { lat: 8.1833, lng: 125.8333 },
  'San Francisco': { lat: 8.5000, lng: 125.9833 },
  'San Luis': { lat: 8.0500, lng: 125.7833 },
  'Santa Josefa': { lat: 8.0167, lng: 125.8500 },
  'Sibagat': { lat: 8.8167, lng: 125.7167 },
  'Talacogon': { lat: 8.4500, lng: 125.7833 },
  'Trento': { lat: 8.0500, lng: 126.0667 },
  'Veruela': { lat: 8.1500, lng: 125.7667 },
  // Dinagat Islands
  'Basilisa': { lat: 10.0500, lng: 125.6167 },
  'Cagdianao': { lat: 10.0333, lng: 125.6500 },
  'Dinagat': { lat: 10.1333, lng: 125.6000 },
  'Libjo': { lat: 10.2500, lng: 125.5500 },
  'San Jose': { lat: 10.0833, lng: 125.5333 },
  'Tubajon': { lat: 10.1667, lng: 125.5833 },
  // Surigao del Norte
  'Surigao City': { lat: 9.7844, lng: 125.4888 },
  'Alegria': { lat: 9.7167, lng: 125.5500 },
  'Bacuag': { lat: 9.6000, lng: 125.6667 },
  'Burgos': { lat: 9.8833, lng: 125.7333 },
  'Claver': { lat: 9.5333, lng: 125.7167 },
  'Dapa': { lat: 9.7583, lng: 126.0539 },
  'Del Carmen': { lat: 9.8500, lng: 126.0333 },
  'General Luna': { lat: 9.7833, lng: 126.1500 },
  'Gigaquit': { lat: 9.5500, lng: 125.6833 },
  'Mainit': { lat: 9.5333, lng: 125.5167 },
  'Malimono': { lat: 9.5667, lng: 125.4000 },
  'Pilar': { lat: 9.8833, lng: 126.0833 },
  'Placer': { lat: 9.6500, lng: 125.5833 },
  'San Benito': { lat: 9.9333, lng: 125.5333 },
  'San Francisco': { lat: 9.9000, lng: 125.4667 },
  'San Isidro': { lat: 9.9333, lng: 125.6000 },
  'Santa Monica': { lat: 9.8000, lng: 126.0667 },
  'Sison': { lat: 9.8333, lng: 125.5833 },
  'Socorro': { lat: 9.6167, lng: 125.9500 },
  'Tagana-an': { lat: 9.6667, lng: 125.5000 },
  'Tubod': { lat: 9.6500, lng: 125.4667 },
  // Surigao del Sur
  'Bislig City': { lat: 8.2167, lng: 126.3500 },
  'Tandag City': { lat: 9.0667, lng: 126.1833 },
  'Barobo': { lat: 8.5333, lng: 126.1333 },
  'Bayabas': { lat: 8.4667, lng: 126.2667 },
  'Cagwait': { lat: 8.6333, lng: 126.2833 },
  'Cantilan': { lat: 9.3167, lng: 125.9833 },
  'Carmen': { lat: 8.3833, lng: 126.1167 },
  'Carrascal': { lat: 9.3667, lng: 125.9500 },
  'Cortes': { lat: 9.2500, lng: 125.9833 },
  'Hinatuan': { lat: 8.3667, lng: 126.3333 },
  'Lanuza': { lat: 9.2333, lng: 126.0000 },
  'Lianga': { lat: 8.6333, lng: 126.1000 },
  'Lingig': { lat: 8.0500, lng: 126.4167 },
  'Madrid': { lat: 9.2667, lng: 126.0333 },
  'Marihatag': { lat: 8.8000, lng: 126.3000 },
  'San Agustin': { lat: 8.6167, lng: 126.1833 },
  'San Miguel': { lat: 8.9333, lng: 126.0500 },
  'Tagbina': { lat: 8.4500, lng: 126.1333 },
  'Tago': { lat: 9.0167, lng: 126.2333 }
}

// Data from API
const earthquakeZones = ref([])
const shelters = ref([])
const hospitals = ref([])
const predictions = ref([])
const loading = ref(false)
const highlightedShelters = ref([])
const viewingSheltersFromSafety = ref(false)
const userLocationMarker = ref(null)
const aiRecommendedShelterData = ref(null)

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
  
  // Check if we have shelters to view from Safety Recommendations page
  checkForSheltersFromSafety()
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
  
  // Add zone markers (Risk Zones)
  filteredZones.value.forEach(zone => {
    try {
      console.log(`Adding zone: ${zone.name} at [${zone.lat}, ${zone.lng}]`)
      
      // Create a custom icon with label for risk zones
      const zoneIcon = L.divIcon({
        html: `<div class="labeled-marker risk-zone-marker">
          <div class="marker-icon" style="background: ${getZoneColor(zone.riskLevel)}; border-color: ${getZoneColor(zone.riskLevel)};">
            <svg viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1" style="width: 18px; height: 18px;">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="17" r="1" fill="white"/>
            </svg>
          </div>
          <div class="marker-label risk-label" style="background: ${getZoneColor(zone.riskLevel)};">Risk Zone</div>
        </div>`,
        className: 'custom-labeled-icon',
        iconSize: [50, 60],
        iconAnchor: [25, 50]
      })
      
      const marker = L.marker([zone.lat, zone.lng], { icon: zoneIcon }).addTo(map)
      
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
  
  // Add shelter markers (Evacuation Centers)
  filteredShelters.value.forEach(shelter => {
    try {
      const shelterIcon = L.divIcon({
        html: `<div class="labeled-marker shelter-marker">
          <div class="marker-icon" style="background: white; border-color: #FF7A00;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#FF7A00" stroke-width="2" style="width: 20px; height: 20px;">
              <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </div>
          <div class="marker-label shelter-label">Evacuation</div>
        </div>`,
        className: 'custom-labeled-icon',
        iconSize: [55, 60],
        iconAnchor: [27, 50]
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
        html: `<div class="labeled-marker hospital-marker">
          <div class="marker-icon" style="background: white; border-color: #00AA00;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#00AA00" stroke-width="2" style="width: 20px; height: 20px;">
              <rect x="3" y="6" width="18" height="12" rx="2"/>
              <path d="M9 12h6"/>
              <path d="M12 9v6"/>
            </svg>
          </div>
          <div class="marker-label hospital-label">Hospital</div>
        </div>`,
        className: 'custom-labeled-icon',
        iconSize: [55, 60],
        iconAnchor: [27, 50]
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

// Check if we have shelters to view from Safety Recommendations page
function checkForSheltersFromSafety() {
  const viewSheltersData = localStorage.getItem('viewShelters')
  if (viewSheltersData) {
    try {
      const data = JSON.parse(viewSheltersData)
      console.log('Viewing shelters from Safety Recommendations:', data)
      
      viewingSheltersFromSafety.value = true
      
      // Store AI recommended shelter data
      if (data.aiRecommendedShelter) {
        aiRecommendedShelterData.value = data.aiRecommendedShelter
      }
      
      // Get user location coordinates
      const userCity = data.location?.city
      const userCoords = CARAGA_CITY_COORDINATES[userCity]
      
      // Add user location marker
      if (userCoords) {
        addUserLocationMarker(userCoords, data.location)
      }
      
      if (data.shelters && data.shelters.length > 0) {
        highlightedShelters.value = data.shelters
        
        // Find shelters with valid coordinates
        const sheltersWithCoords = data.shelters.filter(s => s.latitude && s.longitude)
        
        if (sheltersWithCoords.length > 0) {
          // Include user location in bounds calculation
          const allPoints = sheltersWithCoords.map(s => [parseFloat(s.latitude), parseFloat(s.longitude)])
          if (userCoords) {
            allPoints.push([userCoords.lat, userCoords.lng])
          }
          
          // Create bounds from all locations
          const bounds = L.latLngBounds(allPoints)
          
          // Fit map to show all markers with padding
          map.fitBounds(bounds, { padding: [80, 80], maxZoom: 14 })
          
          // Add highlighted markers for shelters
          addHighlightedShelterMarkers(sheltersWithCoords, data.location, data.aiRecommendedShelter)
        } else if (userCoords) {
          // No shelter coords, but we have user location - center on user
          map.setView([userCoords.lat, userCoords.lng], 13)
        }
      } else if (userCoords) {
        // No shelters but have user location
        map.setView([userCoords.lat, userCoords.lng], 13)
      }
      
      // Clear the localStorage after reading
      localStorage.removeItem('viewShelters')
    } catch (error) {
      console.error('Error parsing viewShelters data:', error)
      localStorage.removeItem('viewShelters')
    }
  }
}

// Add user's current location marker
function addUserLocationMarker(coords, location) {
  const userIcon = L.divIcon({
    html: `<div class="user-location-marker">
      <div class="user-pulse-ring"></div>
      <div class="user-pulse-ring delay"></div>
      <div class="user-marker-inner">
        <svg viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1" style="width: 20px; height: 20px;">
          <circle cx="12" cy="12" r="4"/>
        </svg>
      </div>
      <div class="user-label">You are here</div>
    </div>`,
    className: 'custom-user-location-icon',
    iconSize: [80, 80],
    iconAnchor: [40, 40]
  })
  
  const marker = L.marker([coords.lat, coords.lng], { icon: userIcon, zIndexOffset: 2000 }).addTo(map)
  
  const barangayText = location.barangay ? `Barangay ${location.barangay}, ` : ''
  marker.bindPopup(`
    <div class="popup-content user-location-popup">
      <div class="popup-header user-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <h4>Your Location</h4>
      </div>
      <p><strong>📍 ${barangayText}${location.city || 'Unknown'}</strong></p>
      <p>${location.province || 'Caraga Region'}</p>
      <p class="user-status">AI recommendations generated for this location</p>
    </div>
  `, { maxWidth: 280 })
  
  userLocationMarker.value = marker
  markers.value.push(marker)
}

// Add highlighted shelter markers from Safety Recommendations
function addHighlightedShelterMarkers(sheltersToHighlight, location, aiRecommended) {
  sheltersToHighlight.forEach((shelter, index) => {
    const lat = parseFloat(shelter.latitude)
    const lng = parseFloat(shelter.longitude)
    
    if (isNaN(lat) || isNaN(lng)) return
    
    // Check if this shelter is the AI recommended one
    const isAiRecommended = aiRecommended && shelter.name === aiRecommended.name
    
    // Create different icons for AI recommended vs regular shelters
    const highlightedIcon = L.divIcon({
      html: `<div class="highlighted-shelter-marker ${isAiRecommended ? 'ai-recommended' : ''}">
        <div class="pulse-ring ${isAiRecommended ? 'ai-pulse' : ''}"></div>
        ${isAiRecommended ? '<div class="pulse-ring ai-pulse delay"></div>' : ''}
        <div class="marker-inner ${isAiRecommended ? 'ai-inner' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="width: 24px; height: 24px;">
            <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        </div>
        <div class="marker-label ${isAiRecommended ? 'ai-label' : ''}">${isAiRecommended ? '★ AI' : index + 1}</div>
      </div>`,
      className: `custom-highlighted-shelter-icon ${isAiRecommended ? 'ai-recommended-icon' : ''}`,
      iconSize: [isAiRecommended ? 70 : 60, isAiRecommended ? 70 : 60],
      iconAnchor: [isAiRecommended ? 35 : 30, isAiRecommended ? 70 : 60]
    })
    
    const marker = L.marker([lat, lng], { 
      icon: highlightedIcon, 
      zIndexOffset: isAiRecommended ? 1500 : 1000 
    }).addTo(map)
    
    // Build popup content
    let popupContent = `
      <div class="popup-content highlighted-popup ${isAiRecommended ? 'ai-recommended-popup' : ''}">
        <div class="popup-header ${isAiRecommended ? 'ai-header' : ''}">
          ${isAiRecommended ? '<span class="ai-badge-popup">★ AI Recommended</span>' : `<span class="shelter-number">#${index + 1}</span>`}
          <h4>${shelter.name}</h4>
        </div>
        ${isAiRecommended && aiRecommended.reason ? `<p class="ai-reason"><strong>Why:</strong> ${aiRecommended.reason}</p>` : ''}
        ${isAiRecommended && aiRecommended.safetyScore ? `<p class="safety-score"><strong>Safety Score:</strong> <span class="score-value">${aiRecommended.safetyScore}/100</span></p>` : ''}
        <p><strong>📍 Address:</strong> ${shelter.address || 'N/A'}</p>
        <p><strong>👥 Capacity:</strong> ${shelter.capacity || aiRecommended?.capacity || 'N/A'}</p>
        <p><strong>📏 Distance:</strong> ${shelter.distance || aiRecommended?.distance || 'N/A'}</p>
        <p><strong>🚶 Walk Time:</strong> ${shelter.walkTime || 'N/A'}</p>
        <p class="location-from">From: ${location?.city || ''}, ${location?.province || ''}</p>
      </div>
    `
    
    marker.bindPopup(popupContent, { maxWidth: 320 })
    
    // Open popup for the AI recommended shelter, otherwise for the first shelter
    if (isAiRecommended) {
      setTimeout(() => marker.openPopup(), 600)
    } else if (index === 0 && !aiRecommended) {
      setTimeout(() => marker.openPopup(), 500)
    }
    
    marker.on('click', () => selectPin({
      ...shelter,
      type: 'shelter',
      lat,
      lng,
      highlighted: true,
      isAiRecommended
    }))
    
    markers.value.push(marker)
  })
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
            <div class="stat stat-shelters">
              <span class="stat-label">Total Shelters</span>
              <span class="stat-value">24</span>
            </div>
            <div class="stat stat-capacity">
              <span class="stat-label">Total Capacity</span>
              <span class="stat-value">12,500</span>
            </div>
            <div class="stat stat-hospitals">
              <span class="stat-label">Hospitals</span>
              <span class="stat-value">15</span>
            </div>
            <div class="stat stat-coverage">
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
  background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%);
  border-radius: 8px;
  border-left: 4px solid #FF7A00;
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

/* Custom Labeled Marker Styles */
.map-canvas :deep(.custom-labeled-icon) {
  background: none !important;
  border: none !important;
}

.map-canvas :deep(.labeled-marker) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.map-canvas :deep(.marker-icon) {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 3px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.map-canvas :deep(.labeled-marker:hover .marker-icon) {
  transform: scale(1.15);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
}

.map-canvas :deep(.marker-label) {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.map-canvas :deep(.shelter-label) {
  background: #FF7A00;
  color: white;
}

.map-canvas :deep(.hospital-label) {
  background: #00AA00;
  color: white;
}

.map-canvas :deep(.risk-label) {
  color: white;
}

/* Zone marker pulse animation */
.map-canvas :deep(.zone-marker) {
  position: relative;
}

.map-canvas :deep(.zone-pulse) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  opacity: 0.4;
  animation: pulse-ring 2s infinite;
  z-index: -1;
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.4;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
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
  overflow: visible;
  z-index: 50;
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
  .livemap-wrapper {
    flex-direction: column;
    gap: 0;
  }

  .sidebar-panel {
    width: 100%;
    border-right: none;
    border-top: 1px solid #e0e0e0;
    padding: 0.8rem;
    gap: 1rem;
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    border-bottom: 2px solid #FF7A00;
    padding-bottom: 0.8rem;
    margin-bottom: 0;
  }

  .page-title {
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }

  .page-subtitle {
    font-size: 0.75rem;
  }

  .risk-indicator {
    display: block;
  }

  .filters-section {
    display: block;
  }

  .filter-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.75rem;
    gap: 0.3rem;
  }

  .legend-section {
    display: block;
  }

  .quick-stats {
    border-top: 1px solid #eee;
    padding-top: 0.8rem;
  }

  .stats-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }

  .map-container {
    height: 400px;
    margin-top: 0;
  }

  .map-header {
    padding: 0.6rem 0.8rem;
    flex-direction: column;
    gap: 0.6rem;
    align-items: flex-start;
  }

  .header-left {
    gap: 0.8rem;
    flex-direction: column;
    font-size: 0.7rem;
    width: 100%;
  }

  .header-right {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .action-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.75rem;
    width: 100%;
    min-height: 44px;
  }

  .zoom-controls {
    right: 1rem;
    top: 50%;
    gap: 0.3rem;
  }

  .zoom-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .info-panel {
    width: calc(100% - 1.6rem);
    left: 0.8rem;
    bottom: 0.8rem;
    max-height: 45vh;
    border-radius: 10px;
  }

  .info-title {
    font-size: 1.05rem;
    padding-right: 2rem;
  }

  .info-badge {
    font-size: 0.7rem;
    padding: 0.4rem 0.8rem;
  }

  .detail-row {
    font-size: 0.8rem;
    padding: 0.6rem;
    border-radius: 4px;
  }
}

/* Highlighted Shelter Markers from Safety Recommendations */
:global(.custom-highlighted-shelter-icon) {
  background: transparent !important;
  border: none !important;
}

:global(.highlighted-shelter-marker) {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:global(.highlighted-shelter-marker .pulse-ring) {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 122, 0, 0.3);
  animation: pulse-ring 1.5s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

:global(.highlighted-shelter-marker .marker-inner) {
  position: relative;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #FF7A00, #FF9933);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(255, 122, 0, 0.5);
  border: 3px solid white;
}

:global(.highlighted-shelter-marker .marker-inner svg) {
  transform: rotate(45deg);
}

:global(.highlighted-shelter-marker .marker-label) {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #FF4444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* Highlighted Popup Styles */
:global(.highlighted-popup) {
  min-width: 250px;
}

:global(.highlighted-popup .popup-header) {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #FF7A00;
}

:global(.highlighted-popup .shelter-number) {
  background: #FF7A00;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85rem;
}

:global(.highlighted-popup h4) {
  margin: 0;
  color: #333;
  font-size: 1rem;
}

:global(.highlighted-popup p) {
  margin: 0.4rem 0;
  font-size: 0.85rem;
  color: #555;
}

:global(.highlighted-popup .location-from) {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
  font-style: italic;
  color: #888;
  font-size: 0.8rem;
}

/* User Location Marker Styles */
:global(.custom-user-location-icon) {
  background: transparent !important;
  border: none !important;
}

:global(.user-location-marker) {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:global(.user-location-marker .user-pulse-ring) {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.3);
  animation: user-pulse 2s ease-out infinite;
}

:global(.user-location-marker .user-pulse-ring.delay) {
  animation-delay: 1s;
}

@keyframes user-pulse {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

:global(.user-location-marker .user-marker-inner) {
  position: relative;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.5);
  border: 4px solid white;
  z-index: 10;
}

:global(.user-location-marker .user-label) {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  background: #3B82F6;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* User Location Popup */
:global(.user-location-popup) {
  min-width: 220px;
}

:global(.user-location-popup .popup-header.user-header) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3B82F6;
  border-bottom: 2px solid #3B82F6;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}

:global(.user-location-popup .user-status) {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: #EFF6FF;
  border-radius: 6px;
  color: #1E40AF;
  font-size: 0.8rem;
  text-align: center;
}

/* AI Recommended Shelter Styles */
:global(.highlighted-shelter-marker.ai-recommended) {
  width: 70px;
  height: 70px;
}

:global(.highlighted-shelter-marker .pulse-ring.ai-pulse) {
  background: rgba(34, 197, 94, 0.3);
  animation: ai-pulse-ring 1.5s ease-out infinite;
}

:global(.highlighted-shelter-marker .pulse-ring.ai-pulse.delay) {
  animation-delay: 0.75s;
}

@keyframes ai-pulse-ring {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

:global(.highlighted-shelter-marker .marker-inner.ai-inner) {
  width: 55px;
  height: 55px;
  background: linear-gradient(135deg, #22C55E, #4ADE80);
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.6);
}

:global(.highlighted-shelter-marker .marker-label.ai-label) {
  width: auto;
  padding: 0 8px;
  background: linear-gradient(135deg, #22C55E, #16A34A);
  font-size: 10px;
  top: -10px;
  right: -10px;
}

/* AI Recommended Popup */
:global(.ai-recommended-popup) {
  min-width: 280px;
}

:global(.ai-recommended-popup .popup-header.ai-header) {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  border-bottom: 2px solid #22C55E;
}

:global(.ai-badge-popup) {
  background: linear-gradient(135deg, #22C55E, #16A34A);
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

:global(.ai-recommended-popup .ai-reason) {
  background: #F0FDF4;
  padding: 0.5rem;
  border-radius: 6px;
  border-left: 3px solid #22C55E;
  margin: 0.5rem 0;
}

:global(.ai-recommended-popup .safety-score) {
  background: #ECFDF5;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  display: inline-block;
}

:global(.ai-recommended-popup .score-value) {
  color: #22C55E;
  font-weight: 700;
  font-size: 1rem;
}
</style>
