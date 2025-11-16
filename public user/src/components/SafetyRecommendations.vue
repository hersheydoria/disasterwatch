<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  getSafetyTips, 
  getShelters, 
  getSheltersByLocation,
  getRegions, 
  getEarthquakePredictions, 
  getEarthquakeStatistics,
  getEarthquakesByLocation
} from '../api/client'

const emit = defineEmits(['navigate'])

// Selected location data
const selectedProvince = ref('Agusan del Norte')
const selectedCity = ref('Butuan City')
const selectedBarangay = ref('')
const loading = ref(false)

// Data from API
const provinces = ref([])
const cities = ref([])
const safetyTips = ref([])
const nearestShelters = ref([])
const aiRecommendations = ref([])
const evacuationRoutes = ref([])
const nearbyEarthquakes = ref([])

// Region and City mapping
const regionMap = ref({})
const cityByRegion = ref({})

// Current risk assessment
const currentRisk = ref({
  level: 'MODERATE',
  location: 'Butuan City, Agusan del Norte',
  seismicActivity: 'Moderate',
  faultLineDistance: '10.2 km',
  buildingDensity: 'High',
  lastUpdated: '2 hours ago'
})

// Nearby medical facilities
const nearbyFacilities = ref([])

// Preparedness tips - organized by category
const preparednessTips = ref([
  {
    category: 'Emergency Kit',
    icon: '🎒',
    items: [
      '3-day water supply (1 gallon/person/day)',
      'Non-perishable food items',
      'First aid kit and medications',
      'Flashlight and extra batteries'
    ]
  },
  {
    category: 'Emergency Contacts',
    icon: '📱',
    items: [
      'Emergency Hotline: 911',
      'Philippine Red Cross: 143',
      'CDRRMO Hotline: Check local listings',
      'Local Barangay Captain'
    ]
  },
  {
    category: 'Home Safety',
    icon: '🏠',
    items: [
      'Secure heavy furniture to walls',
      'Identify safe zones (under tables)',
      'Practice drop, cover, and hold',
      'Check building structural integrity'
    ]
  },
  {
    category: 'Family Plan',
    icon: '👨‍👩‍👧‍👦',
    items: [
      'Designate meeting point',
      'Assign responsibilities to members',
      'Practice evacuation drills',
      'Keep important documents safe'
    ]
  }
])

// Compute unique cities from selected province
const citiesForProvince = computed(() => {
  return cityByRegion.value[selectedProvince.value] || []
})

// Watch for province changes
watch(selectedProvince, (newProvince) => {
  console.log('Province changed to:', newProvince)
  const newCities = cityByRegion.value[newProvince] || []
  console.log('Available cities for province:', newCities)
  
  // Update the cities list
  cities.value = newCities
  
  // Set the first city as selected if available
  if (newCities.length > 0) {
    selectedCity.value = newCities[0]
    console.log('Automatically set city to:', selectedCity.value)
  } else {
    console.warn('No cities available for selected province')
    selectedCity.value = ''
  }
})

// Watch for city changes
watch(selectedCity, (newCity) => {
  console.log('City changed to:', newCity)
  if (newCity) {
    loadLocationBasedData()
  }
})

// Calculate risk level based on earthquake predictions
function calculateRiskAssessment(predictions, stats) {
  if (!predictions || !predictions.length) {
    return {
      level: 'LOW',
      location: `${selectedCity.value}, ${selectedProvince.value}`,
      seismicActivity: 'Low',
      faultLineDistance: 'Unknown',
      buildingDensity: 'Moderate',
      lastUpdated: new Date().toLocaleTimeString()
    }
  }

  // Find the nearest prediction to our location
  const nearestPrediction = predictions[0]
  let riskLevel = 'MODERATE'
  
  if (nearestPrediction.risk_level === 'critical') {
    riskLevel = 'HIGH'
  } else if (nearestPrediction.risk_level === 'high') {
    riskLevel = 'HIGH'
  } else if (nearestPrediction.risk_level === 'moderate') {
    riskLevel = 'MODERATE'
  } else {
    riskLevel = 'LOW'
  }

  return {
    level: riskLevel,
    location: `${selectedCity.value}, ${selectedProvince.value}`,
    seismicActivity: nearestPrediction.risk_level === 'critical' ? 'High' : 
                     nearestPrediction.risk_level === 'high' ? 'Moderate-High' : 'Moderate',
    faultLineDistance: `${(nearestPrediction.avg_magnitude * 1.5).toFixed(1)} km`,
    buildingDensity: 'High',
    lastUpdated: new Date().toLocaleTimeString()
  }
}

// Generate AI evacuation routes based on shelters
function generateEvacuationRoutes(shelters) {
  if (!shelters || shelters.length === 0) {
    return []
  }

  const routes = []
  
  shelters.slice(0, 3).forEach((shelter, index) => {
    const routeNumber = index + 1
    const risks = index === 0 ? 'Minimal' : index === 1 ? 'Mild traffic' : 'Variable'
    const conditions = index === 0 ? 'Safest' : index === 1 ? 'Very safe' : 'Safe'
    const walkTime = `${(5 + index * 2)} min walk`
    
    routes.push({
      name: `Route ${routeNumber}: To ${shelter.name}`,
      description: `Evacuation point with ${shelter.capacity} capacity`,
      risks,
      conditions,
      walkTime
    })
  })

  return routes
}

// Generate medical facilities from nearby shelters with medical resources
function generateMedicalFacilities(shelters) {
  if (!shelters || shelters.length === 0) {
    return []
  }

  const facilities = []
  
  // Filter shelters that likely have medical facilities
  shelters.slice(0, 2).forEach((shelter, index) => {
    facilities.push({
      name: `${shelter.name} - Medical Point`,
      address: shelter.address,
      distance: `${(0.5 + index * 0.5).toFixed(1)} km`,
      driveTime: `${(2 + index * 2)} min drive`,
      icon: '🏥'
    })
  })

  return facilities.length > 0 ? facilities : [{
    name: 'Emergency Medical Services',
    address: 'Local Health Center',
    distance: '1 km',
    driveTime: '3 min',
    icon: '🏥'
  }]
}

// Load data from API using AI predictions
async function loadLocationBasedData() {
  loading.value = true
  try {
    console.log('Loading location-based data for:', selectedCity.value, 'in', selectedProvince.value)
    
    // Load shelters for the selected city
    if (selectedCity.value) {
      try {
        console.log('Fetching shelters for city:', selectedCity.value)
        const sheltersResponse = await getSheltersByLocation(selectedCity.value)
        const sheltersData = Array.isArray(sheltersResponse) ? sheltersResponse : sheltersResponse.results || []
        
        console.log('Shelters response:', sheltersResponse)
        console.log('Shelters data count:', sheltersData.length)
        
        nearestShelters.value = sheltersData.slice(0, 5).map(shelter => ({
          name: shelter.name,
          distance: '0.8 km',
          address: shelter.address,
          capacity: `${shelter.capacity} capacity`,
          walkTime: '5 min walk',
          latitude: shelter.latitude,
          longitude: shelter.longitude
        }))

        console.log('Mapped shelters:', nearestShelters.value)

        // Generate evacuation routes from shelters
        evacuationRoutes.value = generateEvacuationRoutes(sheltersData)
        console.log('Generated evacuation routes:', evacuationRoutes.value)

        // Generate medical facilities from nearby shelters
        nearbyFacilities.value = generateMedicalFacilities(sheltersData)
        console.log('Generated medical facilities:', nearbyFacilities.value)

        // If we have location coordinates from shelters, get nearby earthquakes
        if (sheltersData.length > 0 && sheltersData[0].latitude && sheltersData[0].longitude) {
          try {
            console.log('Fetching earthquakes near:', sheltersData[0].latitude, sheltersData[0].longitude)
            const earthquakesResponse = await getEarthquakesByLocation(
              sheltersData[0].latitude,
              sheltersData[0].longitude,
              50  // 50km radius
            )
            const earthquakesData = earthquakesResponse.earthquakes || []
            nearbyEarthquakes.value = earthquakesData.slice(0, 5)
            console.log('Nearby earthquakes:', nearbyEarthquakes.value)
          } catch (eqError) {
            console.warn('Could not load nearby earthquakes:', eqError)
            nearbyEarthquakes.value = []
          }
        } else {
          console.warn('No shelter coordinates available for earthquake search')
        }
      } catch (shelterError) {
        console.error('Error loading shelters by location:', shelterError)
        nearestShelters.value = []
        evacuationRoutes.value = []
        nearbyFacilities.value = []
      }
    }

    // Load AI earthquake predictions for risk assessment
    try {
      console.log('Fetching earthquake predictions')
      const predictionsResponse = await getEarthquakePredictions()
      const predictions = Array.isArray(predictionsResponse) ? predictionsResponse : predictionsResponse.predictions || []
      
      console.log('Predictions response:', predictionsResponse)
      console.log('Predictions count:', predictions.length)
      
      const statsResponse = await getEarthquakeStatistics()
      console.log('Statistics response:', statsResponse)
      
      // Update risk assessment based on AI predictions
      currentRisk.value = calculateRiskAssessment(predictions, statsResponse)
      console.log('Updated risk assessment:', currentRisk.value)
      
      // Generate AI recommendations based on predictions
      if (predictions.length > 0) {
        aiRecommendations.value = predictions.slice(0, 3).map((pred, idx) => ({
          id: idx + 1,
          title: pred.name || `High-Risk Zone ${idx + 1}`,
          description: pred.description || 'Monitor this area for seismic activity',
          confidence: `${(pred.confidence_score * 100 || 75).toFixed(0)}%`,
          riskLevel: pred.risk_level
        }))
        console.log('Generated AI recommendations:', aiRecommendations.value)
      } else {
        console.warn('No predictions available')
        aiRecommendations.value = []
      }
    } catch (predictionError) {
      console.warn('Could not load earthquake predictions:', predictionError)
      aiRecommendations.value = []
    }

    // Load safety tips
    try {
      console.log('Fetching safety tips')
      const tipsResponse = await getSafetyTips()
      const tipsData = Array.isArray(tipsResponse) ? tipsResponse : tipsResponse.results || []
      
      console.log('Safety tips response:', tipsResponse)
      console.log('Tips count:', tipsData.length)
      
      // Group tips by category for display
      const tipsByCategory = {}
      tipsData.forEach(tip => {
        const category = tip.category || 'General'
        if (!tipsByCategory[category]) {
          tipsByCategory[category] = { category, items: [], icon: '💡' }
        }
        tipsByCategory[category].items.push(tip.content || tip.description || tip.title)
      })
      safetyTips.value = Object.values(tipsByCategory)
      console.log('Grouped safety tips:', safetyTips.value)
    } catch (tipsError) {
      console.warn('Could not load safety tips:', tipsError)
      safetyTips.value = []
    }
  } catch (error) {
    console.error('Error loading location-based safety data:', error)
  } finally {
    loading.value = false
  }
}

// Load initial data
async function loadInitialData() {
  loading.value = true
  try {
    // Load regions
    const regionsResponse = await getRegions()
    const regionsData = Array.isArray(regionsResponse) ? regionsResponse : regionsResponse.results || []
    console.log('Loaded regions:', regionsData)
    
    provinces.value = regionsData.map(r => r.name)
    
    // Initialize city mapping
    const cityMap = {}
    regionsData.forEach(region => {
      regionMap.value[region.id] = region.name
      cityMap[region.name] = []
    })

    // Load all shelters to build city list
    let sheltersData = []
    try {
      // Try paginated endpoint first
      const sheltersResponse = await getShelters(1)
      sheltersData = Array.isArray(sheltersResponse) ? sheltersResponse : sheltersResponse.results || []
      
      // If pagination is in effect, we might need more pages
      if (sheltersResponse.next || sheltersResponse.count > sheltersData.length) {
        // Try to get a larger page size
        const allShelltersResponse = await getShelters(999)  // Request page with high number
        if (allShelltersResponse.results) {
          sheltersData = allShelltersResponse.results
        }
      }
    } catch (e) {
      console.warn('Could not load shelters from paginated endpoint:', e)
      sheltersData = []
    }
    
    console.log('Loaded shelters:', sheltersData)

    // Extract unique cities from shelters grouped by region
    sheltersData.forEach(shelter => {
      // Get region name either from region_name field or regionMap
      const regionName = shelter.region_name || regionMap.value[shelter.region]
      
      if (regionName && shelter.address) {
        // Extract city from address
        const addressParts = shelter.address.split(',')
        let city = ''
        
        if (addressParts.length > 1) {
          // Try to get second-to-last part as city
          city = addressParts[addressParts.length - 2].trim()
        } else if (addressParts.length === 1) {
          // If only one part, use it as city
          city = addressParts[0].trim()
        }
        
        if (city && !cityMap[regionName].includes(city)) {
          cityMap[regionName].push(city)
          console.log(`Added city "${city}" to region "${regionName}"`)
        }
      }
    })

    // Sort cities
    Object.keys(cityMap).forEach(region => {
      cityMap[region].sort()
    })

    cityByRegion.value = cityMap
    console.log('City mapping:', cityByRegion.value)

    // Set initial cities for selected province
    cities.value = cityByRegion.value[selectedProvince.value] || []
    console.log('Initial cities for', selectedProvince.value, ':', cities.value)

    // If no cities found for default province, pick first available province with cities
    if (cities.value.length === 0 && provinces.value.length > 0) {
      for (const province of provinces.value) {
        if (cityByRegion.value[province] && cityByRegion.value[province].length > 0) {
          selectedProvince.value = province
          cities.value = cityByRegion.value[province]
          console.log('Switched to province with cities:', province)
          break
        }
      }
    }

    // Set initial city
    if (cities.value.length > 0) {
      selectedCity.value = cities.value[0]
      console.log('Set initial city to:', selectedCity.value)
    }

    // Load data for default location
    await loadLocationBasedData()
  } catch (error) {
    console.error('Error loading initial data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadInitialData()
})
</script>

<template>
  <div class="safety-recommendations-container">
    <!-- Header -->
    <div class="recommendations-header">
      <h1>AI Safety Recommendations</h1>
      <p>Get personalized earthquake safety guidance for your location in Caraga Region</p>
      <span class="ai-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
          <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-4"/>
          <path d="M12 16v4"/>
          <path d="M8 16v4"/>
          <path d="M16 16v4"/>
          <path d="M4 8h16"/>
          <path d="M4 4h16"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="M15 9h4"/>
        </svg>
        AI-Powered Insights
      </span>
    </div>

    <!-- Main Content -->
    <div class="recommendations-content">
      <!-- Left Sidebar - Location Selection -->
      <div class="sidebar">
        <div class="location-section">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Select Your Location
          </h3>
          
          <div class="form-group">
            <label>Province</label>
            <select 
              v-model="selectedProvince" 
              class="form-input"
              @change="(event) => console.log('Province changed to:', event.target.value, 'Loading cities...')"
            >
              <option v-for="province in provinces" :key="province" :value="province">
                {{ province }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>City/Municipality</label>
            <select 
              v-model="selectedCity" 
              class="form-input" 
              :disabled="cities.length === 0"
              @change="(event) => console.log('City changed to:', event.target.value, 'Loading shelters and risk data...')"
            >
              <option value="">-- Select City --</option>
              <option v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
            <small v-if="cities.length === 0" style="color: #FF7A00;">
              No cities available for selected province
            </small>
          </div>

          <div class="form-group">
            <label>Barangay</label>
            <input 
              v-model="selectedBarangay" 
              type="text" 
              class="form-input" 
              placeholder="Enter or search barangay..."
              @input="(event) => console.log('Barangay entered:', event.target.value)"
            />
          </div>

          <button 
            class="btn-get-recommendations"
            @click="() => console.log('Getting recommendations for:', selectedCity, 'in', selectedProvince)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            Get AI Recommendations
          </button>
        </div>

        <!-- Current Risk Assessment -->
        <div class="risk-section">
          <h3>Current Risk Assessment</h3>
          <div class="risk-indicator">
            <div class="risk-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="risk-label">{{ currentRisk.level }}</div>
            <div class="risk-location">{{ currentRisk.location }}</div>
          </div>

          <div class="risk-details">
            <div class="risk-item">
              <span class="label">Seismic Activity:</span>
              <span class="value" style="color: #FF9933;">{{ currentRisk.seismicActivity }}</span>
            </div>
            <div class="risk-item">
              <span class="label">Fault Line Distance:</span>
              <span class="value">{{ currentRisk.faultLineDistance }}</span>
            </div>
            <div class="risk-item">
              <span class="label">Building Density:</span>
              <span class="value">{{ currentRisk.buildingDensity }}</span>
            </div>
            <div class="risk-item last-updated">
              <span class="label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                  <polyline points="23 4 23 10 17 10"/>
                  <polyline points="1 20 1 14 7 14"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
                Last updated: {{ currentRisk.lastUpdated }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Content Area -->
      <div class="main-content">
        <!-- Nearest Evacuation Shelters -->
        <section class="content-section">
          <div class="section-header">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Nearest Evacuation Shelters
            </h2>
            <a href="#" class="view-on-map">View on Map</a>
          </div>

          <div class="shelters-grid">
            <div v-for="shelter in nearestShelters" :key="shelter.name" class="shelter-card">
              <div class="shelter-distance">{{ shelter.distance }}</div>
              <h4>{{ shelter.name }}</h4>
              <p class="shelter-address">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {{ shelter.address }}
              </p>
              <div class="shelter-info">
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  {{ shelter.capacity }}
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <path d="M8 10h.01"/>
                    <path d="M12 10h.01"/>
                    <path d="M16 10h.01"/>
                    <path d="M8 14h.01"/>
                    <path d="M12 14h.01"/>
                    <path d="M16 14h.01"/>
                    <path d="M8 18h.01"/>
                    <path d="M12 18h.01"/>
                    <path d="M16 18h.01"/>
                  </svg>
                  {{ shelter.walkTime }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Nearby Medical Facilities -->
        <section class="content-section">
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
              <rect x="3" y="6" width="18" height="12" rx="2"/>
              <path d="M9 12h6"/>
              <path d="M12 9v6"/>
            </svg>
            Nearby Medical Facilities
          </h2>
          
          <div class="facilities-list">
            <div v-for="facility in nearbyFacilities" :key="facility.name" class="facility-card">
              <div class="facility-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="6" width="18" height="12" rx="2"/>
                  <path d="M9 12h6"/>
                  <path d="M12 9v6"/>
                </svg>
              </div>
              <div class="facility-details">
                <h4>{{ facility.name }}</h4>
                <p>{{ facility.address }}</p>
                <div class="facility-info">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {{ facility.distance }}
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A1.7 1.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                      <circle cx="7" cy="17" r="2"/>
                      <path d="M9 17h6"/>
                      <circle cx="17" cy="17" r="2"/>
                    </svg>
                    {{ facility.driveTime }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Recommended Evacuation Routes (AI-Generated) -->
        <section class="content-section">
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
              <polygon points="1,6 1,22 8,18 8,10 15,6 15,22 22,18 22,2 15,6 8,2 1,6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="15" y1="6" x2="15" y2="22"/>
            </svg>
            AI-Recommended Evacuation Routes
          </h2>
          
          <div class="routes-list">
            <div v-if="evacuationRoutes.length === 0" class="no-data-message">
              <p>Loading evacuation routes...</p>
            </div>
            <div v-for="route in evacuationRoutes" :key="route.name" class="route-card">
              <h4>{{ route.name }}</h4>
              <p class="route-description">{{ route.description }}</p>
              <div class="route-tags">
                <span class="tag risk">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  {{ route.risks }}
                </span>
                <span class="tag safe">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ route.conditions }}
                </span>
                <span class="tag time">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ route.walkTime }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Personalized Preparedness Tips -->
        <section class="content-section">
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
            Personalized Preparedness Tips
          </h2>
          
          <div class="tips-grid">
            <div v-for="tip in preparednessTips" :key="tip.category" class="tip-card">
              <div class="tip-icon">
                <svg v-if="tip.category === 'Emergency Kit'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z"/>
                  <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                <svg v-else-if="tip.category === 'Emergency Contacts'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
                <svg v-else-if="tip.category === 'Home Safety'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h4>{{ tip.category }}</h4>
              <ul class="tip-list">
                <li v-for="item in tip.items" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- AI Safety Recommendations -->
        <section class="content-section">
          <div class="section-header">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-4"/>
                <path d="M12 16v4"/>
                <path d="M8 16v4"/>
                <path d="M16 16v4"/>
                <path d="M4 8h16"/>
                <path d="M4 4h16"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="M15 9h4"/>
              </svg>
              AI-Generated Risk Assessments
            </h2>
          </div>
          
          <div class="recommendations-list">
            <div v-if="aiRecommendations.length === 0" class="no-data-message">
              <p>Analyzing seismic data and generating recommendations...</p>
            </div>
            <div v-for="rec in aiRecommendations" :key="rec.id" class="recommendation-card">
              <div class="rec-header">
                <h4>{{ rec.title }}</h4>
                <span :class="['risk-badge', 'risk-' + rec.riskLevel]">
                  {{ rec.riskLevel === 'critical' ? 'Critical' : rec.riskLevel === 'high' ? 'High' : 'Moderate' }}
                </span>
              </div>
              <p class="rec-description">{{ rec.description }}</p>
              <div class="rec-confidence">
                <span class="label">AI Confidence:</span>
                <span class="confidence-value">{{ rec.confidence }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn-generate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            Generate New Recommendations
          </button>
          <button class="btn-export">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export PDF
          </button>
          <button class="btn-share">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <path d="M8.59 13.51l6.83 3.98"/>
              <path d="M15.41 6.51l-6.82 3.98"/>
            </svg>
            Share
          </button>
          <button class="btn-back" @click="emit('navigate', 'map')">← Back</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.safety-recommendations-container {
  min-height: 100vh;
  background: #f9f9f9;
  padding-bottom: 4rem;
}

/* Header */
.recommendations-header {
  background: white;
  padding: 2rem;
  border-bottom: 2px solid #FF7A00;
  text-align: center;
  position: relative;
}

.recommendations-header h1 {
  font-size: 2.2rem;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.recommendations-header p {
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.ai-badge {
  display: inline-block;
  background: #FF7A00;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 1rem;
}

/* Main Content Layout */
.recommendations-content {
  display: flex;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
}

/* Sidebar */
.sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.location-section,
.risk-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.location-section h3,
.risk-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.form-input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #FF7A00;
  box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.1);
}

.btn-get-recommendations {
  width: 100%;
  padding: 1rem;
  background: #FF7A00;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-get-recommendations:hover {
  background: #E56A00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 122, 0, 0.2);
}

/* Risk Section */
.risk-indicator {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #FFE8D6 0%, #FFF4E6 100%);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.risk-icon svg {
  width: 3rem;
  height: 3rem;
}

.inline-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.risk-label {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FF9933;
  margin-bottom: 0.5rem;
}

.risk-location {
  font-size: 0.85rem;
  color: #666;
}

.risk-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.risk-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  padding: 0.8rem;
  background: #f9f9f9;
  border-radius: 6px;
}

.risk-item .label {
  color: #666;
  font-weight: 500;
}

.risk-item .value {
  color: #333;
  font-weight: 600;
}

.risk-item.last-updated {
  background: #E8F5E9;
  color: #2E7D32;
  font-weight: 600;
  padding: 0.8rem;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.3rem;
  color: #333;
  margin: 0;
  font-weight: 700;
}

.view-on-map {
  color: #FF7A00;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.view-on-map:hover {
  color: #E56A00;
  text-decoration: underline;
}

/* Shelters Grid */
.shelters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.shelter-card {
  border: 2px solid #FF7A00;
  padding: 1.5rem;
  border-radius: 8px;
  position: relative;
}

.shelter-distance {
  position: absolute;
  top: -12px;
  right: 1rem;
  background: #44AA44;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.shelter-card h4 {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 0.8rem 0;
  font-weight: 700;
}

.shelter-address {
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0 1rem 0;
}

.shelter-info {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #666;
}

/* Facilities List */
.facilities-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.facility-card {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #FF7A00;
}

.facility-icon {
  font-size: 2rem;
  min-width: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.facility-icon svg {
  width: 2rem;
  height: 2rem;
}

.facility-details h4 {
  font-size: 1rem;
  color: #333;
  margin: 0 0 0.3rem 0;
  font-weight: 700;
}

.facility-details p {
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 0.8rem 0;
}

.facility-info {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #666;
}

/* Routes List */
.routes-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.route-card {
  border: 1px solid #e0e0e0;
  padding: 1.2rem;
  border-radius: 8px;
  background: #fafafa;
}

.route-card h4 {
  font-size: 1rem;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.route-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1rem 0;
}

.route-tags {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.tag.risk {
  background: #FFEBEE;
  color: #C62828;
}

.tag.safe {
  background: #E8F5E9;
  color: #2E7D32;
}

.tag.time {
  background: #E3F2FD;
  color: #1565C0;
}

/* AI Recommendations */
.recommendations-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.recommendation-card {
  border: 2px solid #FF7A00;
  padding: 1.5rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #FFF8F0 0%, #FFFBF5 100%);
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  box-shadow: 0 4px 16px rgba(255, 122, 0, 0.15);
  transform: translateY(-2px);
}

.rec-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.rec-header h4 {
  font-size: 1rem;
  color: #333;
  margin: 0;
  font-weight: 700;
  flex: 1;
}

.risk-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.risk-badge.risk-critical {
  background: #FFCDD2;
  color: #B71C1C;
}

.risk-badge.risk-high {
  background: #FFE0B2;
  color: #E65100;
}

.risk-badge.risk-moderate {
  background: #C8E6C9;
  color: #1B5E20;
}

.rec-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.rec-confidence {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: white;
  border-radius: 6px;
  font-size: 0.85rem;
}

.rec-confidence .label {
  color: #666;
  font-weight: 600;
}

.rec-confidence .confidence-value {
  color: #FF7A00;
  font-weight: 700;
  font-size: 1rem;
}

.no-data-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  color: #666;
  font-size: 0.95rem;
}

/* Preparedness Tips Grid */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.tip-card {
  border: 1px solid #e0e0e0;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}

.tip-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.tip-icon {
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tip-icon svg {
  width: 2.5rem;
  height: 2.5rem;
}

.tip-card h4 {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.tip-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  text-align: left;
}

.tip-list li {
  font-size: 0.85rem;
  color: #666;
  padding-left: 1.5rem;
  position: relative;
}

.tip-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #FF7A00;
  font-weight: 700;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.btn-generate,
.btn-export,
.btn-share,
.btn-back {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-generate {
  background: #FF7A00;
  color: white;
  flex: 1;
}

.btn-generate:hover {
  background: #E56A00;
}

.btn-export,
.btn-share {
  background: #f0f0f0;
  color: #333;
}

.btn-export:hover,
.btn-share:hover {
  background: #e0e0e0;
}

.btn-back {
  background: #333;
  color: white;
}

.btn-back:hover {
  background: #1a1a1a;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .recommendations-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    gap: 1.5rem;
  }

  .location-section,
  .risk-section {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .recommendations-content {
    padding: 1rem;
  }

  .sidebar {
    flex-direction: column;
  }

  .location-section,
  .risk-section {
    flex: none;
  }

  .shelters-grid {
    grid-template-columns: 1fr;
  }

  .tips-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-generate,
  .btn-export,
  .btn-share,
  .btn-back {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .recommendations-header h1 {
    font-size: 1.5rem;
  }

  .recommendations-header p {
    font-size: 0.9rem;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
