<template>
  <div class="alerts-wrap">
    <main class="main">
      <div class="container">
        <header class="page-head">
          <div>
            <h2>Caraga Region - Earthquake Alerts</h2>
            <p class="desc">Monitor and manage earthquake alerts and aftershocks in the Caraga Region</p>
          </div>
          <button class="btn-refresh" @click="refreshAlerts">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            Refresh Alerts
          </button>
        </header>

        <div class="filters">
          <input 
            v-model="searchQuery" 
            placeholder="Search by location or shelter..." 
            class="search" 
            @input="handleSearch"
          />
          <select v-model="magnitudeFilter" class="filter-select" @change="handleMagnitudeFilter">
            <option value="">All Magnitudes</option>
            <option value="7plus">7.0+</option>
            <option value="6to7">6.0 - 6.9</option>
            <option value="5to6">5.0 - 5.9</option>
            <option value="under5">Below 5.0</option>
          </select>
          <select v-model="statusFilter" class="filter-select" @change="handleStatusFilter">
            <option value="">All Status</option>
            <option value="active">Active Alert</option>
            <option value="aftershock">Aftershock</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <section class="stats-grid small">
          <div class="stat">
            <div class="num">{{ stats.total }}</div>
            <div class="label">Total Earthquakes</div>
          </div>
          <div class="stat critical">
            <div class="num">{{ stats.major }}</div>
            <div class="label">Major (6.0+)</div>
          </div>
          <div class="stat warning">
            <div class="num">{{ stats.aftershocks }}</div>
            <div class="label">Aftershocks</div>
          </div>
          <div class="stat success">
            <div class="num">{{ stats.active }}</div>
            <div class="label">Active Alerts</div>
          </div>
        </section>

        <section class="alerts-panel">
          <div class="panel">
            <h3>Alert List</h3>
            <table class="alerts-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Location (Caraga)</th>
                  <th>Type</th>
                  <th>Magnitude</th>
                  <th>Depth (km)</th>
                  <th>Triggered At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="alert in filteredAlerts" :key="alert.id">
                  <td><strong>#EQ-{{ String(alert.id).padStart(4, '0') }}</strong></td>
                  <td>{{ alert.location }}</td>
                  <td><span class="badge" :class="alert.alert_type.toLowerCase() === 'aftershock' ? 'aftershock' : 'earthquake'">{{ getAlertType(alert.alert_type) }}</span></td>
                  <td>
                    <span class="severity" :class="getSeverityClass(alert.magnitude)">
                      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                      {{ alert.magnitude.toFixed(1) }} Mag
                    </span>
                  </td>
                  <td>{{ alert.depth }} km</td>
                  <td>{{ new Date(alert.timestamp).toLocaleString() }}</td>
                  <td><span class="status-pill" :class="alert.status">{{ alert.status === 'active' ? 'Active Alert' : alert.status === 'acknowledged' ? 'Acknowledged' : 'Resolved' }}</span></td>
                  <td>
                    <button v-if="alert.status === 'active'" class="action-btn" @click="handleAcknowledgeAlert(alert.id)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                    <button class="action-btn view" @click="viewAlertDetails(alert.id)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="pagination">
              <span>Showing 1–5 of 5 results</span>
              <div class="pager">
                <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
                <button 
                  v-for="n in 1" 
                  :key="n" 
                  @click="goToPage(n)"
                  :class="{ active: currentPage === n }"
                >
                  {{ n }}
                </button>
                <button @click="nextPage" :disabled="currentPage === 1">Next</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAlerts, acknowledgeAlert } from '../api/client'

const alerts = ref([
  {
    id: 1,
    location: 'Butuan City, Agusan del Norte',
    alert_type: 'Mainshock',
    magnitude: 4.5,
    depth: 12,
    timestamp: new Date(Date.now() - 2*60*60*1000).toISOString(),
    status: 'active'
  },
  {
    id: 2,
    location: 'Surigao City, Surigao del Norte',
    alert_type: 'Mainshock',
    magnitude: 3.8,
    depth: 15,
    timestamp: new Date(Date.now() - 5*60*60*1000).toISOString(),
    status: 'acknowledged'
  },
  {
    id: 3,
    location: 'Tandag, Surigao del Sur',
    alert_type: 'Mainshock',
    magnitude: 5.2,
    depth: 18,
    timestamp: new Date(Date.now() - 24*60*60*1000).toISOString(),
    status: 'resolved'
  },
  {
    id: 4,
    location: 'Butuan City, Agusan del Norte',
    alert_type: 'Aftershock',
    magnitude: 3.2,
    depth: 10,
    timestamp: new Date(Date.now() - 3*60*60*1000).toISOString(),
    status: 'active'
  },
  {
    id: 5,
    location: 'Bislig, Surigao del Sur',
    alert_type: 'Aftershock',
    magnitude: 2.9,
    depth: 14,
    timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
    status: 'resolved'
  }
])

const searchQuery = ref('')
const magnitudeFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const loading = ref(false)

const filteredAlerts = computed(() => {
  let filtered = alerts.value

  if (searchQuery.value) {
    filtered = filtered.filter(alert => 
      alert.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (magnitudeFilter.value) {
    filtered = filtered.filter(alert => {
      const mag = alert.magnitude
      if (magnitudeFilter.value === '7plus') return mag >= 7
      if (magnitudeFilter.value === '6to7') return mag >= 6 && mag < 7
      if (magnitudeFilter.value === '5to6') return mag >= 5 && mag < 6
      if (magnitudeFilter.value === 'under5') return mag < 5
      return true
    })
  }

  if (statusFilter.value) {
    filtered = filtered.filter(alert => alert.status === statusFilter.value)
  }

  return filtered
})

const stats = computed(() => ({
  total: alerts.value.length,
  major: alerts.value.filter(a => a.magnitude >= 6).length,
  aftershocks: alerts.value.filter(a => a.alert_type === 'Aftershock').length,
  active: alerts.value.filter(a => a.status === 'active').length
}))

function handleSearch(event) {
  searchQuery.value = event.target.value
  const count = filteredAlerts.value.length
  console.log('Searching for:', searchQuery.value, '- Showing', count, 'results')
}

function handleMagnitudeFilter() {
  const count = filteredAlerts.value.length
  console.log('Filter: Magnitude', magnitudeFilter.value, '- Showing', count, 'results')
}

function handleStatusFilter() {
  const count = filteredAlerts.value.length
  console.log('Filter: Status', statusFilter.value, '- Showing', count, 'results')
}

async function handleAcknowledgeAlert(alertId) {
  try {
    const alert = alerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.status = 'acknowledged'
    }
    console.log('Alert acknowledged:', alertId)
  } catch (error) {
    console.error('Error acknowledging alert:', error)
  }
}

function viewAlertDetails(alertId) {
  console.log('Viewing details for earthquake:', alertId)
}

async function refreshAlerts() {
  await loadAlerts()
}

async function loadAlerts() {
  loading.value = true
  try {
    const response = await getAlerts(1)
    const newAlerts = Array.isArray(response) ? response : response.results || []
    if (newAlerts.length > 0) {
      alerts.value = newAlerts
    }
  } catch (error) {
    console.error('Error loading alerts:', error)
  } finally {
    loading.value = false
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  currentPage.value++
}

function goToPage(page) {
  currentPage.value = page
}

function getAlertType(type) {
  if (type.toLowerCase() === 'mainshock') return 'Main Shock'
  if (type.toLowerCase() === 'aftershock') return 'Aftershock'
  return type
}

function getSeverityClass(magnitude) {
  if (magnitude >= 6) return 'critical'
  if (magnitude >= 5) return 'high'
  if (magnitude >= 4) return 'medium'
  return 'low'
}

onMounted(async () => {
  await loadAlerts()
})
</script>

<style scoped>
.alerts-wrap {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.main {
  flex: 1;
  padding: 28px;
  overflow: auto;
  max-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-head h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.page-head .desc {
  color: #7a7f84;
  font-size: 13px;
  margin: 4px 0 0;
}

.btn-refresh {
  background: #fff;
  border: 1px solid #e6e9ec;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-refresh:hover {
  border-color: #ff6b1a;
  background: #fff7f1;
}

.btn-refresh svg {
  width: 16px;
  height: 16px;
}

/* Filters */
.filters {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
}

.search {
  flex: 1;
  max-width: 300px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e6e9ec;
  font-size: 14px;
}

.filter-select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e6e9ec;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
}

/* Stats Grid */
.stats-grid.small {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.stat {
  background: #fff;
  padding: 18px;
  border-radius: 10px;
  box-shadow: 0 6px 14px rgba(20, 30, 40, 0.03);
  text-align: center;
}

.stat .num {
  font-size: 24px;
  font-weight: 700;
  color: #111;
}

.stat .label {
  color: #7a7f84;
  font-size: 13px;
  margin-top: 6px;
}

.stat.critical .num {
  color: #ef4444;
}

.stat.warning .num {
  color: #f59e0b;
}

.stat.success .num {
  color: #22c55e;
}

/* Panel */
.alerts-panel {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 14px rgba(20, 30, 40, 0.03);
  padding: 20px;
}

.panel h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
}

/* Table */
.alerts-table {
  width: 100%;
  border-collapse: collapse;
}

.alerts-table th {
  text-align: left;
  padding: 14px;
  border-bottom: 1px solid #e6e9ec;
  font-weight: 700;
  font-size: 13px;
  color: #6b7075;
}

.alerts-table td {
  padding: 14px;
  border-bottom: 1px solid #f1f3f5;
}

.badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
}

.badge.fire {
  background: #fecaca;
  color: #7f1d1d;
}

.badge.earthquake {
  background: #dbeafe;
  color: #0c4a6e;
}

.badge.aftershock {
  background: #fef3c7;
  color: #78350f;
}

.badge.mainshock {
  background: #fecaca;
  color: #7f1d1d;
}

.badge.power {
  background: #fbbf24;
  color: #78350f;
}

.badge.capacity {
  background: #fca5a5;
  color: #7f1d1d;
}

.badge.equipment {
  background: #fed7aa;
  color: #92400e;
}

.badge.security {
  background: #c7d2fe;
  color: #3730a3;
}

.severity {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
}

.severity svg {
  width: 8px;
  height: 8px;
}

.severity.critical {
  background: #fecaca;
  color: #7f1d1d;
}

.severity.high {
  background: #fca5a5;
  color: #7f1d1d;
}

.severity.medium {
  background: #fed7aa;
  color: #92400e;
}

.severity.low {
  background: #d1fae5;
  color: #065f46;
}

.status-pill {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
}

.status-pill.active {
  background: #fecaca;
  color: #7f1d1d;
}

.status-pill.acknowledged {
  background: #fef3c7;
  color: #78350f;
}

.status-pill.resolved {
  background: #d1fae5;
  color: #065f46;
}

/* Actions */
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.action-btn svg {
  width: 16px;
  height: 16px;
  color: #666;
}

.action-btn:hover {
  background: #f0f0f0;
}

.action-btn:hover svg {
  color: #ff6b1a;
}

.action-btn.view svg {
  color: #3b82f6;
}

.action-btn.view:hover {
  background: #eff6ff;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #f1f3f5;
}

.pager {
  display: flex;
  gap: 8px;
}

.pager button {
  padding: 8px 12px;
  border: 1px solid #e6e9ec;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.pager button:hover:not(:disabled) {
  border-color: #ff6b1a;
  background: #fff7f1;
}

.pager button.active {
  background: #ff6b1a;
  color: #fff;
  border-color: #ff6b1a;
  font-weight: 700;
}

.pager button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 960px) {
  .stats-grid.small {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters {
    flex-wrap: wrap;
  }

  .search {
    flex: 0 1 100%;
  }

  .alerts-table {
    font-size: 12px;
  }

  .alerts-table th,
  .alerts-table td {
    padding: 10px;
  }
}

@media (max-width: 768px) {
  .main {
    padding: 14px;
  }

  .page-head {
    flex-direction: column;
    gap: 14px;
  }

  .stats-grid.small {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
