<script setup>
import { ref, computed } from 'vue'

// Map state
const selectedPin = ref(null)
const activeFilters = ref({
  earthquakeZones: true,
  shelters: true,
  hospitals: true
})

// Define emits for navigation
const emit = defineEmits(['navigate'])

// Mock earthquake risk zones data
const earthquakeZones = ref([
  {
    id: 1,
    name: 'Butuan Bay Zone',
    riskLevel: 'high',
    lat: 8.9801,
    lng: 125.5381,
    magnitude: 7.2,
    frequency: 'High seismic activity'
  },
  {
    id: 2,
    name: 'Agusan Marsh Zone',
    riskLevel: 'moderate',
    lat: 8.6,
    lng: 125.4,
    magnitude: 6.5,
    frequency: 'Moderate seismic activity'
  },
  {
    id: 3,
    name: 'Surigao Fault Zone',
    riskLevel: 'high',
    lat: 9.5,
    lng: 125.8,
    magnitude: 7.0,
    frequency: 'High seismic activity'
  },
  {
    id: 4,
    name: 'Cabadbaran Basin',
    riskLevel: 'moderate',
    lat: 9.1,
    lng: 125.5,
    magnitude: 6.0,
    frequency: 'Moderate seismic activity'
  },
  {
    id: 5,
    name: 'Butuan Strait',
    riskLevel: 'low',
    lat: 9.0,
    lng: 125.6,
    magnitude: 5.5,
    frequency: 'Low seismic activity'
  }
])

// Mock evacuation shelters
const shelters = ref([
  {
    id: 's1',
    name: 'Butuan Sports Complex',
    type: 'shelter',
    lat: 8.9695,
    lng: 125.5319,
    capacity: 5000,
    current: 1200,
    contact: '+63-85-225-3888',
    address: 'Butuan City'
  },
  {
    id: 's2',
    name: 'Butuan High School',
    type: 'shelter',
    lat: 8.9780,
    lng: 125.5400,
    capacity: 2000,
    current: 450,
    contact: '+63-85-225-2000',
    address: 'Butuan City'
  },
  {
    id: 's3',
    name: 'Surigao Convention Center',
    type: 'shelter',
    lat: 9.5,
    lng: 125.8,
    capacity: 3000,
    current: 800,
    contact: '+63-86-231-1111',
    address: 'Surigao City'
  },
  {
    id: 's4',
    name: 'Cabadbaran Cultural Center',
    type: 'shelter',
    lat: 9.1,
    lng: 125.5,
    capacity: 1500,
    current: 300,
    contact: '+63-85-342-5555',
    address: 'Cabadbaran City'
  }
])

// Mock hospitals
const hospitals = ref([
  {
    id: 'h1',
    name: 'Butuan Medical Center',
    type: 'hospital',
    lat: 8.9750,
    lng: 125.5350,
    beds: 150,
    emergency: true,
    contact: '+63-85-225-5555',
    address: 'Butuan City'
  },
  {
    id: 'h2',
    name: 'Surigao Medical Center',
    type: 'hospital',
    lat: 9.5,
    lng: 125.8,
    beds: 120,
    emergency: true,
    contact: '+63-86-231-2222',
    address: 'Surigao City'
  },
  {
    id: 'h3',
    name: 'Cabadbaran District Hospital',
    type: 'hospital',
    lat: 9.1,
    lng: 125.5,
    beds: 80,
    emergency: true,
    contact: '+63-85-342-7777',
    address: 'Cabadbaran City'
  }
])

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
            <p>⚠️ Moderate Risk Level</p>
            <p>👥 Population: 2.8M</p>
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
              📍 Risk Zones
            </button>
            <button
              :class="['filter-btn', { active: activeFilters.shelters }]"
              @click="toggleFilter('shelters')"
            >
              🏢 Evacuation Shelters
            </button>
            <button
              :class="['filter-btn', { active: activeFilters.hospitals }]"
              @click="toggleFilter('hospitals')"
            >
              🏥 Hospitals
            </button>
            <button
              :class="['filter-btn', { active: activeFilters.earthquakeZones }]"
              disabled
            >
              📰 Recent Earthquakes
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
              <div class="legend-icon">🏢</div>
              <span>Evacuation Shelter</span>
            </div>
            <div class="legend-item">
              <div class="legend-icon">🏥</div>
              <span>Hospital</span>
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
            <span class="last-updated">🔴 Last Updated: 7 minutes ago</span>
            <span class="system-status">✅ System Active</span>
          </div>
          <div class="header-right">
            <button class="action-btn secondary-btn" @click="emit('navigate', 'home')">← Back</button>
            <button class="action-btn primary-btn" @click="emit('navigate', 'safety')">🔍 View Safety Recommendation</button>
          </div>
        </div>

        <!-- Map Canvas -->
        <div class="map-canvas">
          <!-- Earthquake Risk Zones -->
          <div
            v-for="zone in filteredZones"
            :key="zone.id"
            class="map-pin zone-pin"
            :style="{
              left: `${((zone.lng - 125.4) / 0.5) * 80 + 10}%`,
              top: `${((9.5 - zone.lat) / 0.6) * 90 + 5}%`,
              backgroundColor: getZoneColor(zone.riskLevel),
              boxShadow: `0 0 ${zone.riskLevel === 'high' ? 15 : 10}px ${getZoneColor(zone.riskLevel)}`
            }"
            @click="selectPin({ ...zone, type: 'zone' })"
            :title="zone.name"
          ></div>

          <!-- Evacuation Shelters -->
          <div
            v-for="shelter in filteredShelters"
            :key="shelter.id"
            class="map-pin shelter-pin"
            :style="{
              left: `${((shelter.lng - 125.4) / 0.5) * 80 + 10}%`,
              top: `${((9.5 - shelter.lat) / 0.6) * 90 + 5}%`
            }"
            @click="selectPin(shelter)"
            title="Evacuation Shelter"
          >
            🏢
          </div>

          <!-- Hospitals -->
          <div
            v-for="hospital in filteredHospitals"
            :key="hospital.id"
            class="map-pin hospital-pin"
            :style="{
              left: `${((hospital.lng - 125.4) / 0.5) * 80 + 10}%`,
              top: `${((9.5 - hospital.lat) / 0.6) * 90 + 5}%`
            }"
            @click="selectPin(hospital)"
            title="Hospital"
          >
            🏥
          </div>

          <!-- Map Background Grid -->
          <div class="map-grid"></div>

          <!-- Zoom Controls -->
          <div class="zoom-controls">
            <button class="zoom-btn">+</button>
            <button class="zoom-btn">−</button>
          </div>
        </div>

        <!-- Info Panel - Floating on Map -->
        <div v-if="selectedPin" class="info-panel">
          <button class="close-btn" @click="closeInfo">✕</button>

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
                  {{ selectedPin.emergency ? '🟢 OPERATIONAL' : 'CLOSED' }}
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
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
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
}

.system-status {
  color: #44AA44;
  font-weight: 500;
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

.map-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(0deg, transparent 24%, rgba(200, 200, 200, 0.05) 25%, rgba(200, 200, 200, 0.05) 26%, transparent 27%, transparent 74%, rgba(200, 200, 200, 0.05) 75%, rgba(200, 200, 200, 0.05) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(200, 200, 200, 0.05) 25%, rgba(200, 200, 200, 0.05) 26%, transparent 27%, transparent 74%, rgba(200, 200, 200, 0.05) 75%, rgba(200, 200, 200, 0.05) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  pointer-events: none;
}

/* Map Pins */
.map-pin {
  position: absolute;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.zone-pin {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid white;
}

.zone-pin:hover {
  transform: translate(-50%, -50%) scale(1.3);
  z-index: 20;
}

.shelter-pin {
  width: 40px;
  height: 40px;
  background: white;
  border: 3px solid #FF7A00;
  border-radius: 6px;
  font-size: 1.5rem;
}

.shelter-pin:hover {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 0 20px rgba(255, 122, 0, 0.5);
  z-index: 20;
}

.hospital-pin {
  width: 40px;
  height: 40px;
  background: white;
  border: 3px solid #00AA00;
  border-radius: 6px;
  font-size: 1.5rem;
}

.hospital-pin:hover {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 0 20px rgba(0, 170, 0, 0.5);
  z-index: 20;
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
  z-index: 15;
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
