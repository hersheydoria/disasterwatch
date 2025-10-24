<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['navigate'])

// Selected location data
const selectedProvince = ref('Agusan del Norte')
const selectedCity = ref('Butuan City')
const selectedBarangay = ref('')

// Mock data for locations
const provinces = ref(['Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur'])
const cities = ref([
  'Butuan City',
  'Surigao City',
  'Cabadbaran City',
  'Bislig City',
  'Tandag City'
])

// Current risk assessment
const currentRisk = ref({
  level: 'MODERATE',
  location: 'Butuan City, Agusan del Norte',
  seismicActivity: 'Moderate',
  faultLineDistance: '10.2 km',
  buildingDensity: 'High',
  lastUpdated: '2 hours ago'
})

// Nearest evacuation shelters
const nearestShelters = ref([
  {
    name: 'Butuan Sports Complex',
    distance: '0.8 km',
    address: 'Langihan, Butuan City',
    capacity: '5,000 capacity',
    walkTime: '5 min walk'
  },
  {
    name: 'Butuan Central Elementary School',
    distance: '1.2 km',
    address: 'Poblacion, Butuan City',
    capacity: '2,500 capacity',
    walkTime: '8 min walk'
  }
])

// Nearby medical facilities
const nearbyFacilities = ref([
  {
    name: 'Caraga Regional Hospital',
    address: 'J.C. Aquino Ave, Butuan City',
    distance: '1.5 km',
    driveTime: '4 min drive',
    icon: '🏥'
  },
  {
    name: 'Butuan Medical Center',
    address: 'Montella Blvd, Butuan City',
    distance: '0.9 km',
    driveTime: '3 min drive',
    icon: '🏥'
  }
])

// Recommended evacuation routes
const evacuationRoutes = ref([
  {
    name: 'Primary Route: To Butuan Sports Complex',
    description: 'Via Langihan Road → Sports Complex Entrance',
    risks: 'High-traffic',
    conditions: 'Safe',
    walkTime: '5 min walk'
  },
  {
    name: 'Alternative Route: To Central Elementary School',
    description: 'Via Procisador Road → School Main Gate',
    risks: 'Mild roads',
    conditions: 'Moderate safe',
    walkTime: '7 min walk'
  }
])

// Preparedness tips
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
      'Butuan CDRRMO (090-342-5555)',
      'Philippine Red Cross: 143',
      'Emergency Hotline: 911',
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
</script>

<template>
  <div class="safety-recommendations-container">
    <!-- Header -->
    <div class="recommendations-header">
      <h1>AI Safety Recommendations</h1>
      <p>Get personalized earthquake safety guidance for your location in Caraga Region</p>
      <span class="ai-badge">🤖 AI-Powered Insights</span>
    </div>

    <!-- Main Content -->
    <div class="recommendations-content">
      <!-- Left Sidebar - Location Selection -->
      <div class="sidebar">
        <div class="location-section">
          <h3>📍 Select Your Location</h3>
          
          <div class="form-group">
            <label>Province</label>
            <select v-model="selectedProvince" class="form-input">
              <option v-for="province in provinces" :key="province" :value="province">
                {{ province }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>City/Municipality</label>
            <select v-model="selectedCity" class="form-input">
              <option v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Barangay</label>
            <input 
              v-model="selectedBarangay" 
              type="text" 
              class="form-input" 
              placeholder="Enter or search barangay..."
            />
          </div>

          <button class="btn-get-recommendations">
            🔍 Get AI Recommendations
          </button>
        </div>

        <!-- Current Risk Assessment -->
        <div class="risk-section">
          <h3>Current Risk Assessment</h3>
          <div class="risk-indicator">
            <div class="risk-icon">⚠️</div>
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
              <span class="label">🔄 Last updated: {{ currentRisk.lastUpdated }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Content Area -->
      <div class="main-content">
        <!-- Nearest Evacuation Shelters -->
        <section class="content-section">
          <div class="section-header">
            <h2>🏢 Nearest Evacuation Shelters</h2>
            <a href="#" class="view-on-map">View on Map</a>
          </div>

          <div class="shelters-grid">
            <div v-for="shelter in nearestShelters" :key="shelter.name" class="shelter-card">
              <div class="shelter-distance">{{ shelter.distance }}</div>
              <h4>{{ shelter.name }}</h4>
              <p class="shelter-address">📍 {{ shelter.address }}</p>
              <div class="shelter-info">
                <span>👥 {{ shelter.capacity }}</span>
                <span>🚶 {{ shelter.walkTime }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Nearby Medical Facilities -->
        <section class="content-section">
          <h2>🏥 Nearby Medical Facilities</h2>
          
          <div class="facilities-list">
            <div v-for="facility in nearbyFacilities" :key="facility.name" class="facility-card">
              <div class="facility-icon">{{ facility.icon }}</div>
              <div class="facility-details">
                <h4>{{ facility.name }}</h4>
                <p>{{ facility.address }}</p>
                <div class="facility-info">
                  <span>📍 {{ facility.distance }}</span>
                  <span>🚗 {{ facility.driveTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Recommended Evacuation Routes -->
        <section class="content-section">
          <h2>🗺️ Recommended Evacuation Routes</h2>
          
          <div class="routes-list">
            <div v-for="route in evacuationRoutes" :key="route.name" class="route-card">
              <h4>{{ route.name }}</h4>
              <p class="route-description">{{ route.description }}</p>
              <div class="route-tags">
                <span class="tag risk">🚨 {{ route.risks }}</span>
                <span class="tag safe">✓ {{ route.conditions }}</span>
                <span class="tag time">⏱️ {{ route.walkTime }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Personalized Preparedness Tips -->
        <section class="content-section">
          <h2>🎯 Personalized Preparedness Tips</h2>
          
          <div class="tips-grid">
            <div v-for="tip in preparednessTips" :key="tip.category" class="tip-card">
              <div class="tip-icon">{{ tip.icon }}</div>
              <h4>{{ tip.category }}</h4>
              <ul class="tip-list">
                <li v-for="item in tip.items" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn-generate">📄 Generate New Recommendations</button>
          <button class="btn-export">📥 Export PDF</button>
          <button class="btn-share">📤 Share</button>
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

.risk-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
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
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
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
