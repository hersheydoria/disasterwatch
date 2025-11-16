<template>
  <div class="dashboard-wrap">

    <main class="main">
      <div class="container">
      <header class="topbar">
        <h2>Dashboard Overview</h2>
      </header>

      <section class="stats-grid">
        <div class="stat"> <div class="num">{{ stats.totalShelters }}</div> <div class="label">Total Shelters</div> </div>
        <div class="stat green"> <div class="num">{{ stats.activeShelters }}</div> <div class="label">Active Shelters</div> </div>
        <div class="stat red"> <div class="num">{{ stats.fullCapacityShelters }}</div> <div class="label">Full Capacity</div> </div>
        <div class="stat"> <div class="num">{{ stats.maintenanceShelters }}</div> <div class="label">Under Maintenance</div> </div>
        <div class="stat orange"> <div class="num">{{ stats.activeAlerts }}</div> <div class="label">Active Alerts</div> </div>
        <div class="stat blue"> <div class="num">{{ stats.totalEvacuees }}</div> <div class="label">Total Evacuees</div> </div>
      </section>

      <section class="panels">
        <div class="panel activities">
          <div class="panel-head">
            <span>Recent Activities</span>
            <a class="view-all">View All</a>
          </div>
          <ul>
            <li v-for="(activity, idx) in recentActivities" :key="idx">
              <strong>{{ activity.title }}:</strong> {{ activity.description }} 
              <span class="time">{{ activity.time }}</span>
            </li>
            <li v-if="recentActivities.length === 0"><em>No recent activities</em></li>
          </ul>
        </div>

        <div class="panel">
          <div class="panel-head">
            <span>Quick Actions</span>
          </div>
          <div class="actions-grid">
            <button class="qa" @click="addNewShelter">
              <span class="icon-cta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </span>
              <div class="qa-text"><div class="text">Add New Shelter</div><div class="sub">Register a new evacuation</div></div>
            </button>
            <button class="qa" @click="viewAllShelters">
              <span class="icon-cta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
                  <path d="M13 13l-4-4"/>
                  <path d="M9 13l4-4"/>
                </svg>
              </span>
              <div class="qa-text"><div class="text">View All Shelters</div><div class="sub">Manage existing</div></div>
            </button>
            <button class="qa" @click="generateReport">
              <span class="icon-cta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </span>
              <div class="qa-text"><div class="text">Generate Report</div><div class="sub">Create detailed analytics</div></div>
            </button>
            <button class="qa" @click="viewAlerts">
              <span class="icon-cta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </span>
              <div class="qa-text"><div class="text">View Alerts</div><div class="sub">Monitor active warnings</div></div>
            </button>
          </div>
        </div>
      </section>

      <section class="ai-section">
        <div class="ai-header">
          <div>
            <h3>AI Safety Insights</h3>
            <p class="muted">Real-time analysis of AI-driven recommendations and system performance</p>
          </div>
          <button class="view-logs" @click="viewAllLogs">View All Logs</button>
        </div>

        <div class="ai-grid">
          <div class="ai-card">
            <div class="ai-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <div>
              <div class="ai-lead">Agusan City Gym</div>
              <div class="muted">Agusan del Norte — Most Recommended Shelter</div>
            </div>
          </div>

          <div class="ai-card">
            <div class="ai-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <div class="ai-lead">Brgy. Sanghan</div>
              <div class="muted">Cabadbaran City — Most Affected Area (AI Detected)</div>
            </div>
          </div>

          <div class="ai-card">
            <div class="num-big">84%</div>
            <div>
              <div class="ai-lead">Accuracy Rate</div>
              <div class="bar"><div class="fill" style="width:84%"></div></div>
              <div class="muted">AI Suggestions Accuracy</div>
            </div>
          </div>

          <div class="ai-card">
            <div class="ai-icon-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <div class="ai-lead">Auto-synced</div>
              <div class="muted">Oct 18, 2025, 10:30 AM</div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { inject, reactive, onMounted, ref } from 'vue'
import { getShelters, getAlerts, getRecentEarthquakes } from '../api/client'

const navigate = inject('navigate', () => {})

const stats = reactive({
  totalShelters: 150,
  activeShelters: 142,
  fullCapacityShelters: 3,
  maintenanceShelters: 5,
  activeAlerts: 2,
  totalEvacuees: 340
})

const recentActivities = ref([
  {
    title: 'Shelter Updated',
    description: 'Butuan City Multipurpose Hall - Capacity increased to 500',
    time: '2 hours ago'
  },
  {
    title: 'Earthquake Alert',
    description: 'Magnitude 4.5 earthquake detected near Butuan City',
    time: '4 hours ago'
  },
  {
    title: 'Shelter Status',
    description: 'Surigao City Evacuation Center - Status changed to Active',
    time: '6 hours ago'
  },
  {
    title: 'Alert Issued',
    description: 'Earthquake Watch alert for Surigao del Sur region',
    time: '1 day ago'
  },
  {
    title: 'Maintenance Completed',
    description: 'Tandag Evacuation Center - Maintenance completed',
    time: '2 days ago'
  }
])

const aiInsights = ref([
  {
    shelter: 'Agusan City Gym',
    region: 'Agusan del Norte',
    recommendation: 'High risk area - Increase shelter capacity by 20%',
    confidence: '94%',
    priority: 'high'
  },
  {
    shelter: 'Surigao City Convention Center',
    region: 'Surigao City',
    recommendation: 'Monitor structural integrity - Next inspection due in 30 days',
    confidence: '87%',
    priority: 'medium'
  },
  {
    shelter: 'Tandag Multipurpose Center',
    region: 'Surigao del Sur',
    recommendation: 'Supply stock adequate for 6 months - Reorder after 120 days',
    confidence: '92%',
    priority: 'low'
  }
])

const loading = reactive({ stats: true })

onMounted(async () => {
  try {
    // Fetch shelters data
    const sheltersResponse = await getShelters(1)
    const shelters = sheltersResponse.results || sheltersResponse

    stats.totalShelters = sheltersResponse.count || shelters.length || 150
    stats.activeShelters = shelters.filter(s => s.status === 'active' || s.status === 'operational').length || 142
    stats.fullCapacityShelters = shelters.filter(s => s.status === 'full').length || 3
    stats.maintenanceShelters = shelters.filter(s => s.status === 'maintenance').length || 5
    stats.totalEvacuees = shelters.reduce((sum, s) => sum + (s.current_occupancy || 0), 0) || 340

    // Fetch alerts data
    const alertsResponse = await getAlerts(1)
    const alerts = alertsResponse.results || alertsResponse || []
    stats.activeAlerts = alerts.filter(a => a.status === 'active').length || 2

    loading.stats = false
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    loading.stats = false
  }
})

function addNewShelter() {
  console.log('Adding new shelter...')
  navigate('add-shelter')
}

function viewAllShelters() {
  console.log('Viewing all shelters...')
  navigate('shelters')
}

function generateReport() {
  console.log('Generating report...')
  console.log('Current shelter stats:', stats)
  navigate('reports')
}

function viewAlerts() {
  console.log('Viewing alerts...')
  console.log('Active alerts:', stats.activeAlerts)
  navigate('alerts')
}

function viewAllLogs() {
  console.log('View All Logs clicked - Total AI insights:', aiInsights.value.length)
}
</script>

<style scoped>
.dashboard-wrap { display: flex; min-height: 100vh; background: #f5f7fa; }

.main { flex: 1; overflow: auto; }

.container { padding: 2rem; overflow-y: auto; }

.topbar { margin-bottom: 2rem; }
.topbar h2 { font-size: 24px; font-weight: 600; color: #222; margin: 0; }

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  text-align: center;
}

.stat .num {
  font-size: 32px;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.5rem;
}

.stat .label {
  font-size: 13px;
  color: #7a7f84;
  font-weight: 500;
}

.stat.green .num { color: #22c55e; }
.stat.red .num { color: #ef4444; }
.stat.orange .num { color: #ff6b1a; }
.stat.blue .num { color: #3b82f6; }

/* Panels Section */
.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.panel {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #222;
  font-size: 15px;
}

.view-all {
  color: #ff6b1a;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  font-size: 13px;
}

.activities ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activities li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
}

.activities li:last-child {
  border-bottom: none;
}

.time {
  float: right;
  color: #999;
  font-size: 12px;
}

/* Quick Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.qa {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.qa:hover {
  background: #f0f0f0;
  border-color: #ff6b1a;
}

.icon-cta {
  font-size: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-cta svg {
  width: 24px;
  height: 24px;
}

.qa-text {
  flex: 1;
}

.qa-text .text {
  font-size: 13px;
  font-weight: 600;
  color: #222;
  margin-bottom: 0.25rem;
}

.qa-text .sub {
  font-size: 11px;
  color: #999;
}

/* AI Section */
.ai-section {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.ai-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin: 0 0 0.5rem 0;
}

.ai-header p {
  margin: 0;
  font-size: 13px;
  color: #7a7f84;
}

.view-logs {
  padding: 0.5rem 1rem;
  background: #ff6b1a;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.view-logs:hover {
  background: #e55a0a;
}

/* AI Grid */
.ai-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.ai-card {
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.ai-icon {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.ai-icon svg {
  width: 28px;
  height: 28px;
}

.ai-lead {
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin-bottom: 0.25rem;
}

.muted {
  color: #7a7f84;
  font-size: 12px;
  line-height: 1.4;
}

.num-big {
  font-size: 28px;
  font-weight: 700;
  color: #ff6b1a;
  margin-bottom: 0.5rem;
}

.bar {
  height: 6px;
  background: #e8e8e8;
  border-radius: 3px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.bar .fill {
  height: 100%;
  background: #ff6b1a;
}

.ai-icon-sm {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.ai-icon-sm svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 960px) {
  .dashboard-wrap { flex-direction: column; }
  .container { padding: 1rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .panels { grid-template-columns: 1fr; }
  .ai-grid { grid-template-columns: 1fr; }
}
</style>
