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
import { generateSafetyRecommendations, generateSafetyRoutes } from '../api/groqAI'

const emit = defineEmits(['navigate'])

// Caraga Region provinces and cities/municipalities data
const caragaData = {
  'Agusan del Norte': [
    'Butuan City',
    'Cabadbaran City',
    'Buenavista',
    'Carmen',
    'Jabonga',
    'Kitcharao',
    'Las Nieves',
    'Magallanes',
    'Nasipit',
    'Remedios T. Romualdez',
    'Santiago',
    'Tubay'
  ],
  'Agusan del Sur': [
    'Bayugan City',
    'Bunawan',
    'Esperanza',
    'La Paz',
    'Loreto',
    'Prosperidad',
    'Rosario',
    'San Francisco',
    'San Luis',
    'Santa Josefa',
    'Sibagat',
    'Talacogon',
    'Trento',
    'Veruela'
  ],
  'Dinagat Islands': [
    'Basilisa',
    'Cagdianao',
    'Dinagat',
    'Libjo',
    'Loreto',
    'San Jose',
    'Tubajon'
  ],
  'Surigao del Norte': [
    'Surigao City',
    'Alegria',
    'Bacuag',
    'Burgos',
    'Claver',
    'Dapa',
    'Del Carmen',
    'General Luna',
    'Gigaquit',
    'Mainit',
    'Malimono',
    'Pilar',
    'Placer',
    'San Benito',
    'San Francisco',
    'San Isidro',
    'Santa Monica',
    'Sison',
    'Socorro',
    'Tagana-an',
    'Tubod'
  ],
  'Surigao del Sur': [
    'Bislig City',
    'Tandag City',
    'Barobo',
    'Bayabas',
    'Cagwait',
    'Cantilan',
    'Carmen',
    'Carrascal',
    'Cortes',
    'Hinatuan',
    'Lanuza',
    'Lianga',
    'Lingig',
    'Madrid',
    'Marihatag',
    'San Agustin',
    'San Miguel',
    'Tagbina',
    'Tago'
  ]
}

// Selected location data
const selectedProvince = ref('Agusan del Norte')
const selectedCity = ref('Butuan City')
const selectedBarangay = ref('')
const loading = ref(false)
const aiLoading = ref(false)
const aiError = ref(null)

// Data from API
const provinces = ref(Object.keys(caragaData))
const cities = ref(caragaData['Agusan del Norte'])
const safetyTips = ref([])
const nearestShelters = ref([])
const aiRecommendations = ref([])
const evacuationRoutes = ref([])
const nearbyEarthquakes = ref([])

// AI-generated recommendations
const aiGeneratedData = ref(null)
const lastAiUpdate = ref(null)
const aiSafetyRoutes = ref(null)
const showRoutesModal = ref(false)

// Region and City mapping
const regionMap = ref({})
const cityByRegion = ref(caragaData)

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

// Preparedness tips - will be populated by AI
const preparednessTips = ref([])

// AI-generated dynamic content
const aiEvacuationRoutes = ref([])
const aiRecommendedShelter = ref(null)
const aiGeneralAdvice = ref(null)
const aiEmergencyAlternatives = ref(null)
const aiImportantReminders = ref([])

// Compute unique cities from selected province
const citiesForProvince = computed(() => {
  return caragaData[selectedProvince.value] || []
})

// Watch for province changes
watch(selectedProvince, (newProvince) => {
  console.log('Province changed to:', newProvince)
  const newCities = caragaData[newProvince] || []
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
      iconType: 'medical'
    })
  })

  return facilities.length > 0 ? facilities : [{
    name: 'Emergency Medical Services',
    address: 'Local Health Center',
    distance: '1 km',
    driveTime: '3 min',
    iconType: 'medical'
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
          tipsByCategory[category] = { category, items: [], iconType: 'lightbulb' }
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
    // Use hardcoded Caraga Region data
    console.log('Using Caraga Region provinces:', provinces.value)
    console.log('Initial cities for', selectedProvince.value, ':', cities.value)

    // Load data for default location
    await loadLocationBasedData()
  } catch (error) {
    console.error('Error loading initial data:', error)
  } finally {
    loading.value = false
  }
}

// Mount hook
onMounted(() => {
  console.log('SafetyRecommendations mounted')
  loadInitialData()
})

// Generate new AI recommendations using Groq API
async function generateNewRecommendations() {
  aiLoading.value = true
  aiError.value = null
  
  try {
    console.log('Generating new AI recommendations...')
    
    const result = await generateSafetyRecommendations({
      location: {
        city: selectedCity.value,
        province: selectedProvince.value,
        barangay: selectedBarangay.value
      },
      shelters: nearestShelters.value,
      earthquakes: nearbyEarthquakes.value,
      currentRisk: currentRisk.value,
      evacuationRoutes: evacuationRoutes.value
    })

    console.log('AI Response:', result)
    aiGeneratedData.value = result

    // Update risk assessment if AI provides one
    if (result.riskAssessment) {
      currentRisk.value = {
        ...currentRisk.value,
        level: result.riskAssessment.level,
        lastUpdated: new Date().toLocaleTimeString()
      }
    }

    // Update AI recommendations display
    if (result.shelterRecommendations && result.shelterRecommendations.length > 0) {
      aiRecommendations.value = result.shelterRecommendations.map((rec, idx) => ({
        id: idx + 1,
        title: rec.name,
        description: rec.reason,
        confidence: `${100 - (rec.priority * 10)}%`,
        riskLevel: rec.priority <= 2 ? 'high' : rec.priority <= 3 ? 'moderate' : 'low'
      }))
    }

    // Update evacuation routes if AI provides them
    if (result.evacuationAdvice) {
      const advice = result.evacuationAdvice
      if (advice.safetyTips && advice.safetyTips.length > 0) {
        // Add AI safety tips to evacuation routes display
        evacuationRoutes.value = evacuationRoutes.value.map((route, idx) => ({
          ...route,
          aiTip: advice.safetyTips[idx] || advice.safetyTips[0]
        }))
      }
    }

    // Update preparedness tips if AI provides them
    if (result.preparednessChecklist && result.preparednessChecklist.length > 0) {
      const aiTips = {
        category: 'AI Recommendations',
        icon: '🤖',
        items: result.preparednessChecklist.map(item => `${item.item} - ${item.reason}`)
      }
      // Add AI tips to the beginning
      const existingTips = preparednessTips.value.filter(t => t.category !== 'AI Recommendations')
      preparednessTips.value = [aiTips, ...existingTips]
    }

    lastAiUpdate.value = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    console.log('AI recommendations updated successfully')
  } catch (error) {
    console.error('Error generating AI recommendations:', error)
    aiError.value = error.message || 'Failed to generate recommendations. Please try again.'
  } finally {
    aiLoading.value = false
  }
}

// Export PDF function
function exportPDF() {
  console.log('Exporting PDF...')
  alert('PDF export functionality coming soon!')
}

// Share function
function shareRecommendations() {
  console.log('Sharing recommendations...')
  if (navigator.share) {
    navigator.share({
      title: 'Earthquake Safety Recommendations',
      text: `Safety recommendations for ${selectedCity.value}, ${selectedProvince.value}`,
      url: window.location.href
    }).catch(console.error)
  } else {
    // Fallback: copy to clipboard
    const text = `Earthquake Safety Recommendations for ${selectedCity.value}, ${selectedProvince.value}\nRisk Level: ${currentRisk.value.level}`
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!')
    }).catch(() => {
      alert('Share not supported on this browser')
    })
  }
}

// Get AI Recommendations for selected location (sidebar button)
async function getAIRecommendations() {
  if (!selectedCity.value || !selectedProvince.value) {
    aiError.value = 'Please select a province and city first.'
    return
  }
  
  aiLoading.value = true
  aiError.value = null
  
  try {
    console.log('Getting AI safety routes for:', selectedCity.value, 'in', selectedProvince.value)
    
    // First load location data if not already loaded
    if (nearestShelters.value.length === 0) {
      await loadLocationBasedData()
    }
    
    // Generate AI safety routes to evacuation centers
    const routeResult = await generateSafetyRoutes({
      location: {
        city: selectedCity.value,
        province: selectedProvince.value
      },
      barangay: selectedBarangay.value,
      shelters: nearestShelters.value,
      currentRisk: currentRisk.value
    })

    console.log('AI Safety Routes:', routeResult)
    
    // Populate the dynamic content sections
    aiSafetyRoutes.value = routeResult
    aiRecommendedShelter.value = routeResult.recommendedShelter || null
    aiEvacuationRoutes.value = routeResult.routes || []
    aiGeneralAdvice.value = routeResult.generalAdvice || null
    aiEmergencyAlternatives.value = routeResult.emergencyAlternatives || null
    aiImportantReminders.value = routeResult.importantReminders || []
    
    // Convert general advice to preparedness tips format
    if (routeResult.generalAdvice) {
      const tips = []
      if (routeResult.generalAdvice.beforeLeaving?.length) {
        tips.push({
          category: 'Before Leaving',
          iconType: 'home',
          items: routeResult.generalAdvice.beforeLeaving
        })
      }
      if (routeResult.generalAdvice.duringEvacuation?.length) {
        tips.push({
          category: 'During Evacuation',
          iconType: 'walking',
          items: routeResult.generalAdvice.duringEvacuation
        })
      }
      if (routeResult.generalAdvice.onArrival?.length) {
        tips.push({
          category: 'On Arrival',
          iconType: 'flag',
          items: routeResult.generalAdvice.onArrival
        })
      }
      if (routeResult.importantReminders?.length) {
        tips.push({
          category: 'Important Reminders',
          iconType: 'pin',
          items: routeResult.importantReminders
        })
      }
      preparednessTips.value = tips
    }

    lastAiUpdate.value = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    
  } catch (error) {
    console.error('Error getting AI safety routes:', error)
    aiError.value = error.message || 'Failed to get safety routes. Please try again.'
  } finally {
    aiLoading.value = false
  }
}

// Close routes modal
function closeRoutesModal() {
  showRoutesModal.value = false
}

// View shelters on map with AI recommended shelter highlighted
function viewSheltersOnMap() {
  // Build shelter data to display on map
  const mapData = {
    shelters: nearestShelters.value,
    location: {
      city: selectedCity.value,
      province: selectedProvince.value,
      barangay: selectedBarangay.value
    },
    // Include AI recommended shelter if available
    aiRecommendedShelter: aiRecommendedShelter.value ? {
      name: aiRecommendedShelter.value.name,
      reason: aiRecommendedShelter.value.reason,
      safetyScore: aiRecommendedShelter.value.safetyScore,
      distance: aiRecommendedShelter.value.distance,
      capacity: aiRecommendedShelter.value.capacity,
      isAiRecommended: true
    } : null,
    // Include evacuation routes if available
    evacuationRoutes: aiEvacuationRoutes.value.map(route => ({
      shelterName: route.shelterName,
      safetyLevel: route.safetyLevel,
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      directions: route.directions
    }))
  }

  // Store data in localStorage for the map to use
  localStorage.setItem('viewShelters', JSON.stringify(mapData))
  
  // Navigate to the map page
  emit('navigate', 'map')
}
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
            @click="getAIRecommendations"
            :disabled="aiLoading"
          >
            <svg v-if="!aiLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <svg v-else class="inline-icon spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ aiLoading ? 'Loading...' : 'Get AI Recommendations' }}
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
        <!-- AI Loading State -->
        <div v-if="aiLoading" class="ai-loading-state">
          <div class="loading-spinner-large"></div>
          <h3>Generating AI Safety Recommendations...</h3>
          <p>Analyzing evacuation routes and safety data for {{ selectedCity }}, {{ selectedProvince }}</p>
        </div>

        <!-- Prompt to Generate Recommendations -->
        <div v-else-if="!aiSafetyRoutes && !aiLoading" class="ai-prompt-section">
          <div class="prompt-card">
            <div class="prompt-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-4"/>
                <path d="M12 16v4"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="M15 9h4"/>
              </svg>
            </div>
            <h3>Get AI-Powered Safety Recommendations</h3>
            <p>Click the "Get AI Recommendations" button in the sidebar to generate personalized evacuation routes, shelter recommendations, and safety tips for your selected location.</p>
            <button class="btn-generate-prompt" @click="getAIRecommendations">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Get AI Recommendations
            </button>
          </div>
        </div>

        <!-- AI Generated Content -->
        <template v-else>
          <!-- AI Recommended Shelter - HERO SECTION -->
          <section v-if="aiRecommendedShelter" class="hero-shelter-section">
            <div class="hero-shelter-banner">
              <div class="hero-badge">
                <span class="badge-icon">🏆</span>
                <span class="badge-text">TOP AI RECOMMENDATION</span>
              </div>
              
              <div class="hero-shelter-content">
                <div class="hero-shelter-main">
                  <div class="hero-shelter-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                  </div>
                  <div class="hero-shelter-info">
                    <h2 class="hero-shelter-name">{{ aiRecommendedShelter.name }}</h2>
                    <p class="hero-shelter-reason">{{ aiRecommendedShelter.reason }}</p>
                    <div class="hero-shelter-tags">
                      <span class="hero-tag verified">
                        <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                        AI Verified Safe
                      </span>
                      <span class="hero-tag distance" v-if="aiRecommendedShelter.distance">
                        <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {{ aiRecommendedShelter.distance }}
                      </span>
                      <span class="hero-tag capacity" v-if="aiRecommendedShelter.capacity">
                        <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        {{ aiRecommendedShelter.capacity }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="hero-shelter-score">
                  <div class="hero-score-ring" :style="{ '--score-percent': (aiRecommendedShelter.safetyScore || 95) + '%' }">
                    <div class="hero-score-inner">
                      <span class="hero-score-value">{{ aiRecommendedShelter.safetyScore || 95 }}</span>
                      <span class="hero-score-label">Safety</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="hero-shelter-actions">
                <button class="hero-btn-primary" @click="viewSheltersOnMap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                    <line x1="8" y1="2" x2="8" y2="18"/>
                    <line x1="16" y1="6" x2="16" y2="22"/>
                  </svg>
                  View on Map
                </button>
                <button class="hero-btn-secondary" @click="getAIRecommendations">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </section>

          <!-- AI Safe Evacuation Routes -->
          <section v-if="aiEvacuationRoutes.length > 0" class="routes-section-enhanced">
            <div class="routes-section-header">
              <div class="routes-header-content">
                <div class="routes-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"/>
                  </svg>
                </div>
                <div>
                  <h2>AI Safe Evacuation Routes</h2>
                  <p class="routes-subtitle">{{ aiEvacuationRoutes.length }} optimized routes generated based on current conditions</p>
                </div>
              </div>
              <div class="routes-legend">
                <span class="legend-item safest"><span class="legend-dot"></span> Safest</span>
                <span class="legend-item safe"><span class="legend-dot"></span> Safe</span>
                <span class="legend-item moderate"><span class="legend-dot"></span> Moderate</span>
              </div>
            </div>
            
            <div class="routes-timeline">
              <div v-for="(route, idx) in aiEvacuationRoutes" :key="idx" 
                   class="route-card-enhanced" 
                   :class="'safety-' + (route.safetyLevel?.toLowerCase() || 'moderate')">
                
                <div class="route-rank-badge">
                  <span class="rank-number">{{ idx + 1 }}</span>
                  <span class="rank-label">{{ idx === 0 ? 'BEST' : idx === 1 ? '2ND' : '3RD' }}</span>
                </div>
                
                <div class="route-card-content">
                  <div class="route-card-header">
                    <div class="route-title-section">
                      <h3 class="route-shelter-name">{{ route.shelterName }}</h3>
                      <div class="route-badges">
                        <span class="safety-level-badge" :class="'level-' + (route.safetyLevel?.toLowerCase() || 'moderate')">
                          {{ route.safetyLevel || 'SAFE' }}
                        </span>
                        <span class="route-accessibility" v-if="route.accessibility">
                          ♿ {{ route.accessibility }}
                        </span>
                      </div>
                    </div>
                    <div class="route-quick-stats">
                      <div class="quick-stat">
                        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span class="stat-value">{{ route.estimatedTime }}</span>
                      </div>
                      <div class="quick-stat">
                        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span class="stat-value">{{ route.distance }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p class="route-overview">{{ route.description }}</p>
                  
                  <div class="route-details-enhanced">
                    <!-- Step by Step Directions -->
                    <div class="route-detail-block directions-block">
                      <div class="detail-block-header">
                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <h4>Step-by-Step Directions</h4>
                      </div>
                      <div class="directions-steps">
                        <div v-for="(step, stepIdx) in route.directions" :key="stepIdx" class="direction-step">
                          <div class="step-number">{{ stepIdx + 1 }}</div>
                          <div class="step-content">{{ step }}</div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Hazards Warning -->
                    <div v-if="route.hazardsToAvoid?.length" class="route-detail-block hazards-block">
                      <div class="detail-block-header">
                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        <h4>Hazards to Avoid</h4>
                      </div>
                      <div class="hazards-list">
                        <div v-for="(hazard, hIdx) in route.hazardsToAvoid" :key="hIdx" class="hazard-item">
                          <svg class="hazard-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                          <span>{{ hazard }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Landmarks -->
                    <div v-if="route.landmarks?.length" class="route-detail-block landmarks-block">
                      <div class="detail-block-header">
                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M12 3L2 10h20L12 3z"/><line x1="12" y1="14" x2="12" y2="21"/></svg>
                        <h4>Key Landmarks</h4>
                      </div>
                      <div class="landmarks-pills">
                        <span v-for="(landmark, lIdx) in route.landmarks" :key="lIdx" class="landmark-pill">
                          {{ landmark }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Safety Tips -->
                    <div v-if="route.tips?.length" class="route-detail-block tips-block">
                      <div class="detail-block-header">
                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/></svg>
                        <h4>Safety Tips</h4>
                      </div>
                      <div class="tips-list">
                        <div v-for="(tip, tIdx) in route.tips" :key="tIdx" class="tip-item">
                          <svg class="tip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>{{ tip }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- AI Evacuation Guidelines - ENHANCED -->
          <section v-if="preparednessTips.length > 0" class="guidelines-section-enhanced">
            <div class="guidelines-header">
              <div class="guidelines-header-content">
                <div class="guidelines-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div>
                  <h2>AI Evacuation Guidelines</h2>
                  <p class="guidelines-subtitle">Essential preparedness tips personalized for your situation</p>
                </div>
              </div>
              <div class="guidelines-badge">
                <span class="badge-pulse"></span>
                <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>AI Generated</span>
              </div>
            </div>
            
            <div class="guidelines-content">
              <div class="guidelines-grid">
                <div v-for="(tip, index) in preparednessTips" :key="tip.category" 
                     class="guideline-card"
                     :class="'card-variant-' + (index % 4)">
                  <div class="guideline-card-header">
                    <div class="guideline-icon-circle">
                      <svg v-if="tip.iconType === 'home'" class="guideline-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      <svg v-else-if="tip.iconType === 'walking'" class="guideline-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="2"/><path d="M10 22V14l-2-2m4-4l2 2v10m-6-8l-2 4m8-4l2 4"/></svg>
                      <svg v-else-if="tip.iconType === 'flag'" class="guideline-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                      <svg v-else-if="tip.iconType === 'pin'" class="guideline-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <svg v-else class="guideline-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/></svg>
                    </div>
                    <div class="guideline-number">#{{ index + 1 }}</div>
                  </div>
                  
                  <h3 class="guideline-title">{{ tip.category }}</h3>
                  
                  <div class="guideline-items">
                    <div v-for="(item, idx) in tip.items" :key="idx" class="guideline-item">
                      <div class="item-check">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span class="item-text">{{ item }}</span>
                    </div>
                  </div>
                  
                  <div class="guideline-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: '100%' }"></div>
                    </div>
                    <span class="progress-label">{{ tip.items.length }} tips</span>
                  </div>
                </div>
              </div>
              
              <div class="guidelines-footer">
                <div class="footer-tip">
                  <svg class="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/></svg>
                  <span>Review these guidelines regularly and share with your family members</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Emergency Alternatives - ENHANCED -->
          <section v-if="aiEmergencyAlternatives" class="emergency-section-enhanced">
            <div class="emergency-header">
              <div class="emergency-alert-strip">
                <span class="alert-dot"></span>
                <span class="alert-dot"></span>
                <span class="alert-dot"></span>
              </div>
              <div class="emergency-header-content">
                <div class="emergency-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div>
                  <h2>
                    <svg class="section-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                    Emergency Alternatives
                  </h2>
                  <p class="emergency-subtitle">Backup plans if your primary evacuation is compromised</p>
                </div>
              </div>
              <div class="emergency-priority-badge">
                <svg class="priority-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>HIGH PRIORITY</span>
              </div>
            </div>
            
            <div class="emergency-content">
              <div class="emergency-scenarios">
                <!-- Blocked Route Scenario -->
                <div class="scenario-card blocked-route">
                  <div class="scenario-icon-box">
                    <svg class="scenario-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="6" x2="6" y2="18"/><line x1="18" y1="6" x2="18" y2="18"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                  </div>
                  <div class="scenario-content">
                    <div class="scenario-header">
                      <h3>If Main Route is Blocked</h3>
                      <span class="scenario-tag">Plan B</span>
                    </div>
                    <p class="scenario-description">{{ aiEmergencyAlternatives.ifMainRouteBlocked }}</p>
                    <div class="scenario-action">
                      <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>Alternative route will be highlighted on the map</span>
                    </div>
                  </div>
                </div>
                
                <!-- Shelter Full Scenario -->
                <div class="scenario-card shelter-full">
                  <div class="scenario-icon-box">
                    <svg class="scenario-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <div class="scenario-content">
                    <div class="scenario-header">
                      <h3>If Shelter is Full</h3>
                      <span class="scenario-tag">Plan C</span>
                    </div>
                    <p class="scenario-description">{{ aiEmergencyAlternatives.ifShelterFull }}</p>
                    <div class="scenario-action">
                      <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <span>Contact emergency hotline for guidance</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="emergency-hotline">
                <div class="hotline-content">
                  <div class="hotline-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div class="hotline-info">
                    <span class="hotline-label">24/7 Emergency Hotline</span>
                    <span class="hotline-number">911 / 8888</span>
                  </div>
                  <div class="hotline-action">
                    <button class="btn-call">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </template>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn-generate" @click="getAIRecommendations" :disabled="aiLoading">
            <span v-if="aiLoading" class="spinner"></span>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            {{ aiLoading ? 'Generating...' : 'Regenerate Recommendations' }}
          </button>
          <button class="btn-export" @click="exportPDF">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export PDF
          </button>
          <button class="btn-share" @click="shareRecommendations">
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

        <!-- AI Error Message -->
        <div v-if="aiError" class="ai-error-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ aiError }}</span>
          <button @click="aiError = null">×</button>
        </div>

        <!-- AI Last Updated -->
        <div v-if="lastAiUpdate" class="ai-last-updated">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          AI Recommendations last updated: {{ lastAiUpdate }}
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

/* ENHANCED Guidelines Section */
.guidelines-section-enhanced {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 2rem;
}

.guidelines-header {
  background: linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.guidelines-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.guidelines-icon-wrapper {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guidelines-icon-wrapper svg {
  width: 28px;
  height: 28px;
  stroke: white;
}

.guidelines-header h2 {
  color: white;
  font-size: 1.4rem;
  margin: 0;
  font-weight: 700;
}

.guidelines-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
}

.guidelines-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 30px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  flex-shrink: 0;
}

.badge-pulse {
  width: 8px;
  height: 8px;
  background: #FCD34D;
  border-radius: 50%;
  animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.guidelines-content {
  padding: 2rem;
}

.guidelines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.guideline-card {
  background: #FAFAFA;
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.guideline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.guideline-card.card-variant-0 {
  border-color: #FF7A00;
  background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
}

.guideline-card.card-variant-1 {
  border-color: #3B82F6;
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
}

.guideline-card.card-variant-2 {
  border-color: #10B981;
  background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
}

.guideline-card.card-variant-3 {
  border-color: #8B5CF6;
  background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%);
}

.guideline-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.guideline-icon-circle {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.guideline-emoji {
  font-size: 1.8rem;
}

.guideline-svg-icon {
  width: 28px;
  height: 28px;
  stroke: #6366F1;
}

.card-variant-0 .guideline-svg-icon {
  stroke: #6366F1;
}

.card-variant-1 .guideline-svg-icon {
  stroke: #10B981;
}

.card-variant-2 .guideline-svg-icon {
  stroke: #F59E0B;
}

.card-variant-3 .guideline-svg-icon {
  stroke: #8B5CF6;
}

.guideline-number {
  font-size: 0.8rem;
  font-weight: 700;
  color: #9CA3AF;
  background: white;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
}

.guideline-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 1.25rem 0;
}

.guideline-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.guideline-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.item-check {
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #10B981, #34D399);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-check svg {
  width: 12px;
  height: 12px;
  stroke: white;
}

.item-text {
  font-size: 0.9rem;
  color: #4B5563;
  line-height: 1.5;
}

.guideline-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px dashed #E5E7EB;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #E5E7EB;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10B981, #34D399);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.card-variant-0 .progress-fill {
  background: linear-gradient(90deg, #FF7A00, #FF9500);
}

.card-variant-1 .progress-fill {
  background: linear-gradient(90deg, #3B82F6, #60A5FA);
}

.card-variant-3 .progress-fill {
  background: linear-gradient(90deg, #8B5CF6, #A78BFA);
}

.progress-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9CA3AF;
  white-space: nowrap;
}

.guidelines-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E5E7EB;
}

.footer-tip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #FEF3C7;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  color: #92400E;
  font-size: 0.9rem;
}

.footer-icon {
  width: 20px;
  height: 20px;
  stroke: #92400E;
  flex-shrink: 0;
}

/* ENHANCED Emergency Section */
.emergency-section-enhanced {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 25px rgba(239, 68, 68, 0.15);
  overflow: hidden;
  margin-bottom: 2rem;
  border: 2px solid #FCA5A5;
}

.emergency-header {
  background: linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #F87171 100%);
  padding: 0;
  position: relative;
}

.emergency-alert-strip {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
}

.alert-dot {
  width: 8px;
  height: 8px;
  background: #FCD34D;
  border-radius: 50%;
  animation: blink-alert 1s infinite;
}

.alert-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.alert-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink-alert {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.3; }
}

.emergency-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
}

.emergency-icon-wrapper {
  width: 55px;
  height: 55px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-emergency 2s infinite;
}

@keyframes pulse-emergency {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.emergency-icon-wrapper svg {
  width: 30px;
  height: 30px;
  stroke: white;
}

.emergency-header h2 {
  color: white;
  font-size: 1.4rem;
  margin: 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title-icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  flex-shrink: 0;
}

.emergency-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
}

.emergency-priority-badge {
  position: absolute;
  top: 3rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #FCD34D;
  color: #92400E;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.priority-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: currentColor;
  flex-shrink: 0;
}

.emergency-content {
  padding: 2rem;
}

.emergency-scenarios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.scenario-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: #FAFAFA;
  border: 2px solid #E5E7EB;
  transition: all 0.3s ease;
}

.scenario-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.scenario-card.blocked-route {
  border-color: #FBBF24;
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
}

.scenario-card.shelter-full {
  border-color: #F87171;
  background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
}

.scenario-icon-box {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.scenario-emoji {
  font-size: 1.8rem;
}

.scenario-svg-icon {
  width: 28px;
  height: 28px;
  stroke: #6B7280;
}

.blocked-route .scenario-svg-icon {
  stroke: #D97706;
}

.shelter-full .scenario-svg-icon {
  stroke: #DC2626;
}

.scenario-content {
  flex: 1;
}

.scenario-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.scenario-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

.scenario-tag {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #374151;
  color: white;
}

.scenario-description {
  font-size: 0.95rem;
  color: #4B5563;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.scenario-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6B7280;
  padding-top: 0.75rem;
  border-top: 1px dashed #D1D5DB;
}

.action-icon {
  width: 18px;
  height: 18px;
  stroke: #6B7280;
  flex-shrink: 0;
}

.emergency-hotline {
  background: linear-gradient(135deg, #1F2937 0%, #374151 100%);
  border-radius: 16px;
  padding: 1.5rem;
}

.hotline-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.hotline-icon {
  width: 50px;
  height: 50px;
  background: #22C55E;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ring-phone 1.5s ease-in-out infinite;
}

@keyframes ring-phone {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(-10deg); }
  20%, 40% { transform: rotate(10deg); }
  50% { transform: rotate(0deg); }
}

.hotline-icon svg {
  width: 24px;
  height: 24px;
  stroke: white;
}

.hotline-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.hotline-label {
  font-size: 0.85rem;
  color: #9CA3AF;
  font-weight: 500;
}

.hotline-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  letter-spacing: 1px;
}

.hotline-action {
  flex-shrink: 0;
}

.btn-call {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #22C55E;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-call:hover {
  background: #16A34A;
  transform: scale(1.05);
}

.btn-call svg {
  width: 18px;
  height: 18px;
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

/* AI Tips List (dynamic) */
.tips-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.tips-list .tip-card {
  display: flex;
  gap: 1rem;
  text-align: left;
  border-left: 4px solid #FF7A00;
}

.tips-list .tip-card .tip-icon {
  min-width: 40px;
  margin-bottom: 0;
}

.tips-list .tip-card .tip-content {
  flex: 1;
}

.tips-list .tip-card .tip-content h4 {
  margin: 0 0 0.5rem 0;
}

.tips-list .tip-card .tip-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
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

  /* Hero Shelter Responsive */
  .hero-shelter-banner {
    padding: 1.5rem;
  }

  .hero-shelter-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-shelter-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
  }

  .hero-shelter-name {
    font-size: 1.4rem;
  }

  .hero-shelter-tags {
    justify-content: center;
  }

  .hero-shelter-score {
    align-self: center;
  }

  .hero-score-ring {
    width: 100px;
    height: 100px;
  }

  .hero-score-inner {
    width: 76px;
    height: 76px;
  }

  .hero-score-value {
    font-size: 1.6rem;
  }

  .hero-shelter-actions {
    flex-direction: column;
    width: 100%;
  }

  .hero-btn-primary,
  .hero-btn-secondary {
    justify-content: center;
    width: 100%;
  }

  /* Enhanced Routes Responsive */
  .routes-section-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem;
  }

  .routes-legend {
    width: 100%;
    justify-content: flex-start;
  }

  .routes-timeline {
    padding: 1.25rem;
  }

  .route-card-enhanced {
    flex-direction: column;
    align-items: center;
  }

  .route-rank-badge {
    width: 50px;
    height: 50px;
  }

  .rank-number {
    font-size: 1.2rem;
  }

  .route-card-content {
    width: 100%;
  }

  .route-card-header {
    flex-direction: column;
  }

  .route-quick-stats {
    width: 100%;
    justify-content: flex-start;
  }

  .route-details-enhanced {
    grid-template-columns: 1fr;
  }

  /* Guidelines Responsive */
  .guidelines-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem;
  }

  .guidelines-badge {
    align-self: flex-start;
  }

  .guidelines-content {
    padding: 1.25rem;
  }

  .guidelines-grid {
    grid-template-columns: 1fr;
  }

  .guideline-card {
    padding: 1.25rem;
  }

  .guideline-icon-circle {
    width: 50px;
    height: 50px;
  }

  .guideline-emoji {
    font-size: 1.5rem;
  }

  /* Emergency Section Responsive */
  .emergency-header-content {
    padding: 1.25rem;
  }

  .emergency-priority-badge {
    position: static;
    margin: 0 1.25rem 1rem 1.25rem;
  }

  .emergency-content {
    padding: 1.25rem;
  }

  .emergency-scenarios {
    grid-template-columns: 1fr;
  }

  .scenario-card {
    flex-direction: column;
    text-align: center;
  }

  .scenario-header {
    flex-direction: column;
  }

  .hotline-content {
    flex-direction: column;
    text-align: center;
  }

  .hotline-info {
    align-items: center;
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
  /* Header */
  .recommendations-header {
    padding: 1.2rem;
  }

  .recommendations-header h1 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }

  .recommendations-header p {
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .ai-badge-header {
    font-size: 0.7rem;
    padding: 0.4rem 0.6rem;
  }

  /* Main Content Layout */
  .recommendations-content {
    padding: 1.2rem;
    gap: 1rem;
    flex-direction: column;
  }

  /* Sidebar */
  .sidebar {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;
  }

  .location-section {
    grid-column: 1/-1;
  }

  .location-section h3,
  .risk-section h3 {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }

  /* Hero Shelter Section */
  .hero-shelter-banner {
    padding: 1.2rem;
    border-radius: 8px;
  }

  .hero-shelter-content {
    flex-direction: column;
    gap: 1rem;
  }

  .hero-shelter-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
  }

  .hero-shelter-name {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .hero-shelter-description {
    font-size: 0.8rem;
  }

  .hero-shelter-tags {
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .hero-shelter-tag {
    font-size: 0.7rem;
    padding: 0.4rem 0.6rem;
  }

  .hero-shelter-score {
    align-self: center;
  }

  .hero-score-ring {
    width: 80px;
    height: 80px;
  }

  .hero-score-inner {
    width: 64px;
    height: 64px;
  }

  .hero-score-value {
    font-size: 1.4rem;
  }

  .hero-score-label {
    font-size: 0.65rem;
  }

  .hero-shelter-actions {
    width: 100%;
    flex-direction: column;
    gap: 0.8rem;
  }

  .hero-btn-primary,
  .hero-btn-secondary {
    width: 100%;
    min-height: 44px;
    font-size: 0.8rem;
    padding: 0.8rem;
    justify-content: center;
  }

  /* Routes Section */
  .routes-section-header {
    flex-direction: column;
    gap: 0.8rem;
    padding: 1rem;
  }

  .routes-section-title {
    font-size: 1.1rem;
  }

  .routes-legend {
    width: 100%;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .route-legend-item {
    font-size: 0.7rem;
    padding: 0.4rem 0.6rem;
  }

  .routes-timeline {
    padding: 1rem;
  }

  .route-card-enhanced {
    flex-direction: column;
    gap: 0.8rem;
    align-items: center;
    padding: 1rem;
  }

  .route-rank-badge {
    width: 44px;
    height: 44px;
    min-height: 44px;
    min-width: 44px;
    font-size: 0.8rem;
  }

  .rank-number {
    font-size: 1rem;
  }

  .route-card-content {
    width: 100%;
    text-align: center;
  }

  .route-card-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .route-title {
    font-size: 0.95rem;
  }

  .route-duration {
    font-size: 0.75rem;
  }

  .route-quick-stats {
    width: 100%;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .route-stat-item {
    font-size: 0.7rem;
    padding: 0.4rem 0.6rem;
  }

  .route-details-enhanced {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  /* Guidelines Section */
  .guidelines-header {
    flex-direction: column;
    gap: 0.8rem;
    padding: 1rem;
  }

  .guidelines-title {
    font-size: 1.1rem;
  }

  .guidelines-badge {
    align-self: flex-start;
    font-size: 0.7rem;
    padding: 0.4rem 0.6rem;
  }

  .guidelines-content {
    padding: 1rem;
  }

  .guidelines-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .guideline-card {
    padding: 1rem;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .guideline-icon-circle {
    width: 44px;
    height: 44px;
    min-height: 44px;
    min-width: 44px;
    margin-bottom: 0.5rem;
  }

  .guideline-emoji {
    font-size: 1.3rem;
  }

  .guideline-title {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .guideline-description {
    font-size: 0.75rem;
    line-height: 1.4;
  }

  /* Emergency Section */
  .emergency-header-content {
    padding: 1rem;
  }

  .emergency-header-content h2 {
    font-size: 1.1rem;
  }

  .emergency-priority-badge {
    font-size: 0.7rem;
    padding: 0.4rem 0.6rem;
    margin-bottom: 0.8rem;
  }

  .emergency-content {
    padding: 1rem;
  }

  .emergency-scenarios {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .scenario-card {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }

  .scenario-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .scenario-title {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .scenario-description {
    font-size: 0.75rem;
    line-height: 1.4;
  }

  .scenario-action {
    font-size: 0.75rem;
    padding: 0.6rem 1rem;
    margin-top: 0.5rem;
  }

  /* Hotline Info */
  .hotline-content {
    flex-direction: column;
    text-align: center;
    gap: 0.8rem;
    padding: 1rem;
  }

  .hotline-number {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .hotline-info {
    align-items: center;
    justify-content: center;
  }

  .hotline-info p {
    font-size: 0.8rem;
  }

  .hotline-copy-btn {
    min-height: 44px;
    font-size: 0.75rem;
    padding: 0.6rem;
  }

  /* Grid Adjustments */
  .tips-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .shelters-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  /* Section Header */
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0;
  }

  .section-header-title {
    font-size: 1rem;
  }

  .section-header-badge {
    font-size: 0.7rem;
    padding: 0.3rem 0.5rem;
  }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 1rem;
  }

  .btn-generate,
  .btn-export,
  .btn-share,
  .btn-back {
    width: 100%;
    min-height: 44px;
    font-size: 0.8rem;
    padding: 0.8rem;
    flex: none;
  }

  /* AI Messages */
  .ai-error-message {
    font-size: 0.75rem;
    padding: 0.8rem;
    gap: 0.5rem;
  }

  .ai-last-updated {
    font-size: 0.75rem;
    padding: 0.6rem 0.8rem;
  }

  /* AI Summary */
  .ai-summary {
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
  }

  .ai-summary h4 {
    font-size: 0.95rem;
    margin-bottom: 0.8rem;
  }

  .ai-summary p {
    font-size: 0.8rem;
    margin-bottom: 0.8rem;
  }

  .immediate-actions {
    padding: 0.8rem;
    margin-top: 0.8rem;
  }

  .immediate-actions li {
    font-size: 0.75rem;
    line-height: 1.4;
  }
}

/* AI Loading Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinning {
  animation: spin 0.8s linear infinite;
}

.btn-generate:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* AI Error Message */
.ai-error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-top: 1rem;
  color: #dc2626;
  font-size: 0.9rem;
}

.ai-error-message svg {
  flex-shrink: 0;
}

.ai-error-message span {
  flex: 1;
}

.ai-error-message button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #dc2626;
  padding: 0;
  line-height: 1;
}

/* AI Last Updated */
.ai-last-updated {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  margin-top: 1rem;
  color: #16a34a;
  font-size: 0.85rem;
  font-weight: 500;
}

/* AI Summary Section */
.ai-summary {
  background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%);
  border: 2px solid #FF7A00;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.ai-summary h4 {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
}

.ai-summary p {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.immediate-actions {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.immediate-actions h5 {
  font-size: 0.95rem;
  color: #333;
  margin: 0 0 0.75rem 0;
  font-weight: 600;
}

.immediate-actions ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.immediate-actions li {
  font-size: 0.9rem;
  color: #555;
  padding-left: 1.5rem;
  position: relative;
}

.immediate-actions li::before {
  content: '⚡';
  position: absolute;
  left: 0;
}

/* Routes Modal Styles */
.routes-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.routes-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.routes-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #FF7A00;
  background: linear-gradient(135deg, #FF7A00 0%, #FF9933 100%);
  border-radius: 16px 16px 0 0;
}

.routes-modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.routes-modal-header h2 .inline-icon {
  width: 28px;
  height: 28px;
}

.close-modal-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.close-modal-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-modal-btn svg {
  width: 24px;
  height: 24px;
  stroke: white;
}

.routes-modal-content {
  flex: 1;
  padding: 1.5rem 2rem;
  overflow: visible;
}

/* HERO Shelter Section - More Noticeable */
.hero-shelter-section {
  margin-bottom: 2rem;
}

.hero-shelter-banner {
  background: linear-gradient(135deg, #FF7A00 0%, #FF9500 50%, #FFB347 100%);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(255, 122, 0, 0.3);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 10px 40px rgba(255, 122, 0, 0.3); }
  50% { box-shadow: 0 15px 50px rgba(255, 122, 0, 0.5); }
}

.hero-shelter-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  pointer-events: none;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.badge-icon {
  font-size: 1.2rem;
}

.badge-text {
  letter-spacing: 1px;
}

.hero-shelter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.hero-shelter-main {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  flex: 1;
}

.hero-shelter-icon {
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.hero-shelter-icon svg {
  width: 35px;
  height: 35px;
  stroke: #FF7A00;
}

.hero-shelter-info {
  flex: 1;
}

.hero-shelter-name {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-shelter-reason {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.hero-shelter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.tag-icon {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  flex-shrink: 0;
}

.hero-tag.verified {
  background: rgba(34, 197, 94, 0.3);
}

.hero-shelter-score {
  flex-shrink: 0;
}

.hero-score-ring {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    #22C55E 0%,
    #22C55E var(--score-percent, 95%),
    rgba(255, 255, 255, 0.3) var(--score-percent, 95%)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.hero-score-inner {
  width: 90px;
  height: 90px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero-score-value {
  font-size: 2rem;
  font-weight: 800;
  color: #22C55E;
  line-height: 1;
}

.hero-score-label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
}

.hero-shelter-actions {
  display: flex;
  gap: 1rem;
}

.hero-btn-primary,
.hero-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-size: 0.95rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-btn-primary {
  background: white;
  color: #FF7A00;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.hero-btn-primary svg,
.hero-btn-secondary svg {
  width: 18px;
  height: 18px;
}

.hero-btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.hero-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Legacy Recommended Shelter Card */
.recommended-shelter-card {
  background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
  border: 2px solid #FF7A00;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
}

.recommended-badge {
  position: absolute;
  top: -10px;
  left: 20px;
  background: #FF7A00;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.recommended-shelter-card h3 {
  margin: 0.5rem 0 0.75rem;
  color: #333;
  font-size: 1.25rem;
}

.recommended-shelter-card p {
  margin: 0 0 1rem;
  color: #666;
  line-height: 1.5;
}

.safety-score {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.score-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.score-bar {
  flex: 1;
  height: 10px;
  background: #E5E7EB;
  border-radius: 5px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF7A00, #22C55E);
  border-radius: 5px;
  transition: width 0.5s ease-out;
}

.score-value {
  font-size: 1rem;
  font-weight: 700;
  color: #22C55E;
}

/* Routes List */
.routes-list {
  margin-bottom: 1.5rem;
}

.routes-list > h3 {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.route-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;
}

/* ENHANCED Routes Section */
.routes-section-enhanced {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 2rem;
}

.routes-section-header {
  background: linear-gradient(135deg, #1E3A5F 0%, #2D5A87 100%);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.routes-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.routes-icon-wrapper {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.routes-icon-wrapper svg {
  width: 28px;
  height: 28px;
  stroke: white;
}

.routes-section-header h2 {
  color: white;
  font-size: 1.4rem;
  margin: 0;
  font-weight: 700;
}

.routes-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
}

.routes-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  font-weight: 500;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-item.safest .legend-dot { background: #22C55E; }
.legend-item.safe .legend-dot { background: #3B82F6; }
.legend-item.moderate .legend-dot { background: #F59E0B; }

.routes-timeline {
  padding: 2rem;
}

.route-card-enhanced {
  position: relative;
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px dashed #E5E7EB;
}

.route-card-enhanced:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.route-rank-badge {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF7A00, #FF9500);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 122, 0, 0.3);
}

.route-card-enhanced.safety-safest .route-rank-badge {
  background: linear-gradient(135deg, #16A34A, #22C55E);
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.route-card-enhanced.safety-safe .route-rank-badge {
  background: linear-gradient(135deg, #2563EB, #3B82F6);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.route-card-enhanced.safety-moderate .route-rank-badge {
  background: linear-gradient(135deg, #D97706, #F59E0B);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.rank-number {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
}

.rank-label {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.route-card-content {
  flex: 1;
  background: #FAFAFA;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid #FF7A00;
}

.route-card-enhanced.safety-safest .route-card-content {
  border-left-color: #22C55E;
}

.route-card-enhanced.safety-safe .route-card-content {
  border-left-color: #3B82F6;
}

.route-card-enhanced.safety-moderate .route-card-content {
  border-left-color: #F59E0B;
}

.route-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.route-shelter-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 0.5rem 0;
}

.route-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.safety-level-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.safety-level-badge.level-safest {
  background: #DCFCE7;
  color: #166534;
}

.safety-level-badge.level-safe {
  background: #DBEAFE;
  color: #1E40AF;
}

.safety-level-badge.level-moderate {
  background: #FEF3C7;
  color: #92400E;
}

.route-accessibility {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #F3F4F6;
  color: #4B5563;
}

.route-quick-stats {
  display: flex;
  gap: 1rem;
}

.quick-stat {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 18px;
  height: 18px;
  stroke: #6B7280;
  flex-shrink: 0;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

.route-overview {
  color: #4B5563;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E5E7EB;
}

.route-details-enhanced {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.route-detail-block {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.detail-block-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.detail-icon {
  width: 20px;
  height: 20px;
  stroke: #6B7280;
  flex-shrink: 0;
}

.detail-block-header h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #374151;
  margin: 0;
}

/* Directions Steps */
.directions-steps {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.direction-step {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.step-number {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #FF7A00, #FF9500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  font-size: 0.9rem;
  color: #4B5563;
  line-height: 1.5;
}

/* Hazards Block */
.hazards-block {
  background: #FEF2F2;
  border: 1px solid #FECACA;
}

.hazards-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hazard-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.9rem;
  color: #991B1B;
}

.hazard-icon {
  width: 16px;
  height: 16px;
  stroke: #DC2626;
  flex-shrink: 0;
}

/* Landmarks Block */
.landmarks-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.landmark-pill {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background: #EFF6FF;
  color: #1E40AF;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Tips Block */
.tips-block {
  background: #ECFDF5;
  border: 1px solid #A7F3D0;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tip-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.9rem;
  color: #166534;
}

.tip-icon {
  width: 16px;
  height: 16px;
  stroke: #22C55E;
  flex-shrink: 0;
}

.route-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.route-card.safety-safest {
  border-left: 4px solid #22C55E;
}

.route-card.safety-safe {
  border-left: 4px solid #3B82F6;
}

.route-card.safety-moderate {
  border-left: 4px solid #F59E0B;
}

.route-card.safety-use_with_caution {
  border-left: 4px solid #EF4444;
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.route-info h4 {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
  color: #333;
}

.safety-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.safety-badge.level-safest {
  background: #DCFCE7;
  color: #166534;
}

.safety-badge.level-safe {
  background: #DBEAFE;
  color: #1E40AF;
}

.safety-badge.level-moderate {
  background: #FEF3C7;
  color: #92400E;
}

.safety-badge.level-use_with_caution {
  background: #FEE2E2;
  color: #991B1B;
}

.route-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #666;
}

.route-description {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 1rem;
}

.route-directions,
.route-hazards,
.route-tips {
  margin-bottom: 1rem;
}

.route-directions h5,
.route-hazards h5,
.route-landmarks h5,
.route-tips h5 {
  font-size: 0.85rem;
  color: #333;
  margin: 0 0 0.5rem;
}

.route-directions ol {
  margin: 0;
  padding-left: 1.5rem;
}

.route-directions li {
  font-size: 0.85rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 0.25rem;
}

.route-hazards ul,
.route-tips ul {
  margin: 0;
  padding-left: 1.25rem;
  list-style: none;
}

.route-hazards li {
  font-size: 0.85rem;
  color: #DC2626;
  line-height: 1.5;
  position: relative;
  padding-left: 0.5rem;
}

.route-hazards li::before {
  content: '⚠️';
  position: absolute;
  left: -1.25rem;
}

.route-tips li {
  font-size: 0.85rem;
  color: #555;
  line-height: 1.5;
  position: relative;
  padding-left: 0.5rem;
}

.route-tips li::before {
  content: '✓';
  position: absolute;
  left: -1rem;
  color: #22C55E;
  font-weight: bold;
}

.route-landmarks {
  margin-bottom: 1rem;
}

.landmarks-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.landmark-tag {
  background: #F3F4F6;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

/* General Advice Section */
.general-advice-section {
  margin-bottom: 1.5rem;
}

.general-advice-section > h3 {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.advice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.advice-card {
  background: #F9FAFB;
  border-radius: 10px;
  padding: 1rem;
}

.advice-card.before {
  border-top: 3px solid #3B82F6;
}

.advice-card.during {
  border-top: 3px solid #F59E0B;
}

.advice-card.arrival {
  border-top: 3px solid #22C55E;
}

.advice-card h5 {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  color: #333;
}

.advice-card ul {
  margin: 0;
  padding-left: 1rem;
  list-style: disc;
}

.advice-card li {
  font-size: 0.8rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 0.25rem;
}

/* Emergency Alternatives */
.emergency-alternatives {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.emergency-alternatives h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: #991B1B;
}

.alternative-item {
  margin-bottom: 0.75rem;
}

.alternative-item:last-child {
  margin-bottom: 0;
}

.alternative-item strong {
  font-size: 0.85rem;
  color: #333;
}

.alternative-item p {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #555;
}

/* Important Reminders */
.important-reminders {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 10px;
  padding: 1rem;
}

.important-reminders h3 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  color: #92400E;
}

.important-reminders ul {
  margin: 0;
  padding-left: 1.25rem;
  list-style: none;
}

.important-reminders li {
  font-size: 0.85rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 0.25rem;
  position: relative;
}

.important-reminders li::before {
  content: '📌';
  position: absolute;
  left: -1.5rem;
}

/* Modal Footer */
.routes-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-top: 1px solid #E5E7EB;
  background: #F9FAFB;
  border-radius: 0 0 16px 16px;
}

.ai-generated-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #666;
}

.ai-generated-notice .inline-icon {
  width: 16px;
  height: 16px;
}

.btn-close-modal {
  background: #FF7A00;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-close-modal:hover {
  background: #E56E00;
}

/* Responsive adjustments for modal */
@media (max-width: 768px) {
  .routes-modal {
    max-height: 95vh;
    border-radius: 12px;
  }
  
  .routes-modal-header,
  .routes-modal-content,
  .routes-modal-footer {
    padding: 1rem;
  }
  
  .routes-modal-header h2 {
    font-size: 1.1rem;
  }
  
  .route-header {
    flex-direction: column;
  }
  
  .advice-grid {
    grid-template-columns: 1fr;
  }
  
  .routes-modal-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
