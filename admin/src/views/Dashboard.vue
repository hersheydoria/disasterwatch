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
            <a class="view-all" href="#" @click.prevent="viewRecentActivities">View All</a>
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
          <div class="ai-actions">
            <button class="generate-btn" @click="generateNewRecommendations" :disabled="loading.ai">
              <svg v-if="!loading.ai" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
              </svg>
              <span v-if="loading.ai" class="spinner"></span>
              {{ loading.ai ? 'Generating...' : 'Generate New Recommendations' }}
            </button>
            <button class="view-logs" @click="viewAllLogs">View All Logs</button>
          </div>
        </div>

        <!-- AI Error Message -->
        <div v-if="aiError" class="ai-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ aiError }}</span>
          <button @click="aiError = null">×</button>
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
              <div class="ai-lead">{{ aiInsights.mostRecommendedShelter.name }}</div>
              <div class="muted">{{ aiInsights.mostRecommendedShelter.region }} — {{ aiInsights.mostRecommendedShelter.reason }}</div>
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
              <div class="ai-lead">{{ aiInsights.mostAffectedArea.name }}</div>
              <div class="muted">{{ aiInsights.mostAffectedArea.region }} — {{ aiInsights.mostAffectedArea.reason }}</div>
              <span :class="['risk-badge', aiInsights.mostAffectedArea.riskLevel]">{{ aiInsights.mostAffectedArea.riskLevel?.toUpperCase() }} RISK</span>
            </div>
          </div>

          <div class="ai-card">
            <div class="num-big">{{ aiInsights.accuracyRate }}%</div>
            <div>
              <div class="ai-lead">Accuracy Rate</div>
              <div class="bar"><div class="fill" :style="{ width: aiInsights.accuracyRate + '%' }"></div></div>
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
              <div class="muted">{{ aiInsights.lastSynced }}</div>
            </div>
          </div>
        </div>

        <!-- AI Recommendations List -->
        <div v-if="aiInsights.recommendations.length > 0" class="ai-recommendations">
          <h4>Latest Recommendations</h4>
          <div class="recommendations-list">
            <div v-for="(rec, idx) in aiInsights.recommendations.slice(0, 3)" :key="idx" class="rec-item" :class="rec.priority">
              <div class="rec-header">
                <span class="rec-shelter">{{ rec.shelter }}</span>
                <span class="rec-priority" :class="rec.priority">{{ rec.priority?.toUpperCase() }}</span>
              </div>
              <p class="rec-text">{{ rec.recommendation }}</p>
              <div class="rec-footer">
                <span class="rec-region">{{ rec.region }}</span>
                <span class="rec-confidence">Confidence: {{ rec.confidence }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { inject, reactive, ref, watch, onMounted } from 'vue'
import { shelters } from '../stores/shelterStore'
import { generateAIRecommendations } from '../api/groqAI'

const navigate = inject('navigate', () => {})

const stats = reactive({
  totalShelters: 0,
  activeShelters: 0,
  fullCapacityShelters: 0,
  maintenanceShelters: 0,
  activeAlerts: 0,
  totalEvacuees: 0
})

const sheltersData = shelters
const alertsData = ref([
  { id: 1, location: 'Butuan City', magnitude: 4.6, depth: '12 km', status: 'active', time: '5 mins ago' },
  { id: 2, location: 'Surigao Strait', magnitude: 3.9, depth: '28 km', status: 'monitor', time: '1 hour ago' },
  { id: 3, location: 'Davao Oriental Coast', magnitude: 4.1, depth: '16 km', status: 'active', time: '3 hours ago' }
])
const earthquakesData = ref([
  { id: 1, magnitude: 4.2, depth: '12 km', location: 'Agusan del Norte', time: 'Today, 08:15 AM' },
  { id: 2, magnitude: 3.8, depth: '20 km', location: 'Surigao City', time: 'Today, 06:40 AM' },
  { id: 3, magnitude: 4.5, depth: '10 km', location: 'Tandag City', time: 'Yesterday, 11:21 PM' }
])

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

const aiInsights = ref({
  mostRecommendedShelter: {
    name: 'Agusan City Gym',
    region: 'Agusan del Norte',
    reason: 'Most Recommended Shelter'
  },
  mostAffectedArea: {
    name: 'Brgy. Sanghan',
    region: 'Cabadbaran City',
    reason: 'Most Affected Area (AI Detected)',
    riskLevel: 'medium'
  },
  accuracyRate: 84,
  lastSynced: 'Oct 18, 2025, 10:30 AM',
  recommendations: [
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
  ]
})

const loading = reactive({ stats: true, ai: false })
const aiError = ref(null)

watch(
  sheltersData,
  (newShelters, oldShelters) => {
    updateStats(newShelters)
    if (oldShelters && newShelters.length > oldShelters.length) {
      const latest = newShelters[0]
      recentActivities.value.unshift({
        title: 'Shelter Added',
        description: `${latest.name} has been registered`,
        time: 'Just now'
      })
      if (recentActivities.value.length > 6) {
        recentActivities.value.pop()
      }
    }
  },
  { immediate: true }
)

function updateStats(items = []) {
  stats.totalShelters = items.length
  stats.activeShelters = items.filter((s) => s.status === 'active').length
  stats.fullCapacityShelters = items.filter((s) => s.status === 'full').length
  stats.maintenanceShelters = items.filter((s) => ['maintenance', 'inactive'].includes(s.status)).length
  stats.totalEvacuees = items.reduce((sum, s) => sum + (s.current_occupancy || 0), 0)
  stats.activeAlerts = alertsData.value.filter((a) => a.status === 'active').length
}

onMounted(() => {
  loading.stats = false
})

async function generateNewRecommendations() {
  loading.ai = true
  aiError.value = null
  
  try {
    const result = await generateAIRecommendations({
      shelters: sheltersData.value,
      earthquakes: earthquakesData.value,
      alerts: alertsData.value,
      stats: { ...stats }
    })

    // Update AI insights with the response
    if (result.mostRecommendedShelter) {
      aiInsights.value.mostRecommendedShelter = {
        name: result.mostRecommendedShelter.name,
        region: result.mostRecommendedShelter.region,
        reason: result.mostRecommendedShelter.reason || 'Most Recommended Shelter'
      }
    }

    if (result.mostAffectedArea) {
      aiInsights.value.mostAffectedArea = {
        name: result.mostAffectedArea.name,
        region: result.mostAffectedArea.region || 'Caraga Region',
        reason: result.mostAffectedArea.reason || 'AI Detected Risk Area',
        riskLevel: result.mostAffectedArea.riskLevel || 'medium'
      }
    }

    if (result.accuracyRate) {
      aiInsights.value.accuracyRate = result.accuracyRate
    }

    if (result.recommendations && result.recommendations.length > 0) {
      aiInsights.value.recommendations = result.recommendations
    }

    // Update last synced time
    aiInsights.value.lastSynced = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    // Add to recent activities
    recentActivities.value.unshift({
      title: 'AI Analysis',
      description: result.summary || 'New AI recommendations generated successfully',
      time: 'Just now'
    })

    console.log('AI Recommendations generated:', result)
  } catch (error) {
    console.error('Error generating AI recommendations:', error)
    aiError.value = error.message || 'Failed to generate recommendations'
  } finally {
    loading.ai = false
  }
}

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
  console.log('View All Logs clicked - Total AI insights:', aiInsights.value.recommendations.length)
  navigate('reports')
}

function viewRecentActivities() {
  console.log('Viewing recent activity log...')
  navigate('reports')
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

.ai-actions {
  display: flex;
  gap: 0.75rem;
}

.generate-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.generate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.generate-btn svg {
  width: 16px;
  height: 16px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

/* AI Error */
.ai-error {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: #dc2626;
  font-size: 13px;
}

.ai-error svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.ai-error span {
  flex: 1;
}

.ai-error button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #dc2626;
  padding: 0;
  line-height: 1;
}

/* Risk Badge */
.risk-badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  margin-top: 0.5rem;
}

.risk-badge.high {
  background: #fef2f2;
  color: #dc2626;
}

.risk-badge.medium {
  background: #fffbeb;
  color: #d97706;
}

.risk-badge.low {
  background: #f0fdf4;
  color: #16a34a;
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
  .ai-header { flex-direction: column; gap: 1rem; }
  .ai-actions { width: 100%; }
  .generate-btn, .view-logs { flex: 1; justify-content: center; }
}

@media (max-width: 768px) {
  .container { padding: 0.8rem; }
  .topbar h2 { font-size: 18px; }
  .stats-grid { gap: 1rem; grid-template-columns: repeat(2, 1fr); }
  .stat { padding: 1rem; }
  .stat .num { font-size: 24px; }
  .stat .label { font-size: 12px; }
  .panel { padding: 1rem; }
  .panel-head { font-size: 14px; }
  .actions-grid { grid-template-columns: 1fr; gap: 0.8rem; }
  .qa { padding: 0.8rem; }
  .ai-header { gap: 0.8rem; }
  .ai-actions { gap: 0.5rem; flex-wrap: wrap; }
  .generate-btn, .view-logs { padding: 0.4rem 0.8rem; font-size: 12px; }
  .recommendations-list { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .container { padding: 0.5rem; }
  .topbar h2 { font-size: 16px; margin-bottom: 1rem; }
  .stats-grid { gap: 0.8rem; grid-template-columns: 1fr; }
  .stat { padding: 0.8rem; }
  .stat .num { font-size: 18px; }
  .stat .label { font-size: 11px; }
  .panels { gap: 1rem; }
  .panel { padding: 0.8rem; }
  .panel-head { font-size: 13px; margin-bottom: 0.75rem; }
  .actions-grid { grid-template-columns: 1fr; gap: 0.6rem; }
  .qa { padding: 0.6rem; gap: 0.75rem; }
  .qa-text .text { font-size: 12px; }
  .qa-text .sub { font-size: 10px; }
  .icon-cta svg { width: 20px; height: 20px; }
  .ai-section { padding: 1rem; }
  .ai-header { flex-direction: column; gap: 0.8rem; }
  .ai-header h3 { font-size: 14px; }
  .ai-header p { font-size: 12px; }
  .ai-actions { width: 100%; gap: 0.5rem; flex-wrap: wrap; }
  .generate-btn, .view-logs { padding: 0.6rem; font-size: 11px; flex: 1; min-height: 40px; }
  .ai-grid { gap: 0.8rem; }
  .ai-card { padding: 0.8rem; gap: 0.6rem; }
  .ai-icon svg { width: 24px; height: 24px; }
  .ai-lead { font-size: 12px; }
  .muted { font-size: 11px; }
  .num-big { font-size: 24px; }
  .rec-item { padding: 0.8rem; }
  .rec-header { font-size: 12px; }
  .rec-priority { font-size: 9px; }
  .rec-text { font-size: 11px; }
  .rec-footer { font-size: 10px; }
  .activities li { font-size: 12px; padding: 0.5rem 0; }
  .time { font-size: 11px; }
}

/* AI Recommendations List */
.ai-recommendations {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.ai-recommendations h4 {
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin: 0 0 1rem 0;
}

.recommendations-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.rec-item {
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  border-left: 3px solid #999;
}

.rec-item.high {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.rec-item.medium {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.rec-item.low {
  border-left-color: #22c55e;
  background: #f0fdf4;
}

.rec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.rec-shelter {
  font-size: 13px;
  font-weight: 600;
  color: #222;
}

.rec-priority {
  font-size: 10px;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.rec-priority.high {
  background: #fecaca;
  color: #dc2626;
}

.rec-priority.medium {
  background: #fde68a;
  color: #d97706;
}

.rec-priority.low {
  background: #bbf7d0;
  color: #16a34a;
}

.rec-text {
  font-size: 12px;
  color: #555;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
}

.rec-footer {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #7a7f84;
}

@media (max-width: 1200px) {
  .recommendations-list {
    grid-template-columns: 1fr;
  }
}
</style>
