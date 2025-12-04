<template>
  <div class="container">
    <header class="topbar">
      <h2>Reports Overview</h2>
    </header>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search by report name or report type..."
          @input="handleSearchInput"
        />
      </div>
      <div class="filter-controls">
        <select v-model="filterDate">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
        </select>
        <button class="btn-green" @click="exportCSV">Export CSV</button>
        <button class="btn-blue" @click="exportPDF">Export PDF</button>
      </div>
    </div>

    <!-- Stats Cards -->
    <section class="stats-grid">
      <div class="stat">
        <div class="num">{{ stats.total }}</div>
        <div class="label">Total Reports</div>
      </div>
      <div class="stat blue-label">
        <div class="num">{{ stats.newEntries }}</div>
        <div class="label">New Entries</div>
      </div>
      <div class="stat orange-label">
        <div class="num">{{ stats.updated }}</div>
        <div class="label">Updated Made</div>
      </div>
      <div class="stat red-label">
        <div class="num">{{ stats.active }}</div>
        <div class="label">Active Alerts</div>
      </div>
    </section>

    <!-- Recent Reports Table -->
    <section class="table-section">
      <div class="table-header">
        <h3>Recent Reports</h3>
        <div class="table-info">
          <span class="showing-text">Showing 1 to 5 of 180 results</span>
          <div class="pagination">
            <button @click="handlePagination(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
            <button v-for="n in 3" :key="n" @click="handlePagination(n)" :class="{ active: currentPage === n }">{{ n }}</button>
            <button @click="handlePagination(currentPage + 1)">Next</button>
          </div>
        </div>
      </div>

      <table class="reports-table">
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Shelter Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Date & Time</th>
            <th>Updated By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in filteredReports" :key="report.id">
            <td><strong>#RPT-{{ String(report.id).padStart(4, '0') }}</strong></td>
            <td>{{ report.shelter_name }}</td>
            <td><span :class="['badge', report.status]">{{ report.status === 'active' ? 'Active' : report.status === 'updated' ? 'Updated' : 'Alert' }}</span></td>
            <td>{{ report.description }}</td>
            <td>{{ new Date(report.created_at).toLocaleString() }}</td>
            <td>{{ report.created_by }}</td>
            <td><a href="#" @click.prevent="viewReportDetails(report.id)" class="view-link">View Details</a></td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- AI Recommendation Logs -->
    <section class="ai-logs-section">
      <div class="ai-logs-header">
        <div>
          <h3>AI Recommendation Logs</h3>
          <p class="subtitle">Review logs of AI-generated suggestions by recommendation type</p>
        </div>
        <button class="btn-export" @click="exportLogs">Export</button>
      </div>

      <div class="logs-table-wrapper">
        <table class="logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Recommendation</th>
              <th>Affected Shelter</th>
              <th>Recommendation Status</th>
              <th>Risk Level</th>
              <th>Outcome</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rec in recommendations" :key="rec.id">
              <td>{{ new Date(rec.created_at).toLocaleString() }}</td>
              <td>
                <div class="user-cell">
                  <div class="user-avatar">{{ rec.user_name.substring(0, 2).toUpperCase() }}</div>
                  <div>
                    <div class="user-name">{{ rec.user_name }}</div>
                    <div class="user-role">{{ rec.shelter_name }}</div>
                  </div>
                </div>
              </td>
              <td>{{ rec.recommendation_type }}</td>
              <td>{{ rec.shelter_name }}</td>
              <td><span :class="['status-badge', getStatusBadgeClass(rec.status)]">{{ rec.status === 'high' ? 'High Risk' : rec.status === 'medium' ? 'Medium Risk' : 'Low Risk' }}</span></td>
              <td><span :class="['risk-' + rec.risk_level.toLowerCase()]">{{ rec.risk_level }}</span></td>
              <td><span :class="['outcome', getOutcomeClass(rec.outcome)]">{{ rec.outcome.toUpperCase() }}</span></td>
              <td><button class="action-btn" @click="viewLogDetails(rec.id)">⊙</button></td>
            </tr>
          </tbody>
        </table>

        <div class="logs-pagination">
          <span class="showing-text">Showing 1 to 5 of 120 results</span>
          <div class="pagination">
            <button>Previous</button>
            <button class="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>Next</button>
          </div>
        </div>
      </div>
    </section>

        <div v-if="showReportModal" class="modal-backdrop">
          <div class="modal-card">
            <header>
              <div>
                <h4>Report Details</h4>
                <p>Displaying information for #RPT-{{ selectedReport ? String(selectedReport.id).padStart(4, '0') : '0000' }}</p>
              </div>
              <button class="close-btn" @click="closeReportModal">×</button>
            </header>
            <div class="modal-body">
              <div class="modal-detail-row">
                <span class="label">Shelter</span>
                <span class="value">{{ selectedReport?.shelter_name }}</span>
              </div>
              <div class="modal-detail-row">
                <span class="label">Type</span>
                <span class="value" :class="['badge', selectedReport?.status]">{{ selectedReport?.status }}</span>
              </div>
              <div class="modal-detail-row">
                <span class="label">Description</span>
                <span class="value">{{ selectedReport?.description }}</span>
              </div>
              <div class="modal-detail-row">
                <span class="label">Date & Time</span>
                <span class="value">{{ selectedReport ? new Date(selectedReport.created_at).toLocaleString() : '' }}</span>
              </div>
              <div class="modal-detail-row">
                <span class="label">Updated By</span>
                <span class="value">{{ selectedReport?.created_by }}</span>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-cancel" @click="closeReportModal">Close</button>
            </div>
          </div>
        </div>

        <div v-if="showLogModal" class="modal-backdrop">
          <div class="modal-card">
            <header>
              <div>
                <h4>Recommendation Log</h4>
                <p>{{ selectedLog?.recommendation_type }} · {{ selectedLog?.shelter_name }}</p>
              </div>
              <button class="close-btn" @click="closeLogModal">×</button>
            </header>
            <div class="modal-body">
              <div class="modal-detail-row">
                <span class="label">Timestamp</span>
                <span class="value">{{ selectedLog ? new Date(selectedLog.created_at).toLocaleString() : '' }}</span>
              </div>
              <div class="modal-detail-row">
                <span class="label">User</span>
                <span class="value">{{ selectedLog?.user_name }}</span>
              </div>
              <div class="modal-detail-row">
                <span class="label">Status</span>
                <span class="value status-badge" :class="getStatusBadgeClass(selectedLog?.status)">{{ selectedLog ? (selectedLog.status === 'high' ? 'High Risk' : selectedLog.status === 'medium' ? 'Medium Risk' : 'Low Risk') : '' }}</span>
              </div>
              <div class="modal-detail-row">
                <span class="label">Risk Level</span>
                <span class="value" :class="selectedLog?.risk_level ? 'risk-' + selectedLog.risk_level.toLowerCase() : ''">{{ selectedLog?.risk_level }}</span>
              </div>
              <div class="modal-detail-row">
                <span class="label">Outcome</span>
                <span class="value outcome" :class="getOutcomeClass(selectedLog?.outcome)">{{ selectedLog?.outcome?.toUpperCase() }}</span>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-cancel" @click="closeLogModal">Close</button>
            </div>
          </div>
        </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getReports, getAIRecommendations } from '../api/client'

const reports = ref([
  { id: 1, shelter_name: 'Butuan City Multipurpose Hall', status: 'active', description: 'Capacity utilization at 65%', created_at: new Date(Date.now() - 2*60*60*1000).toISOString(), created_by: 'Admin' },
  { id: 2, shelter_name: 'Surigao City Evacuation Center', status: 'updated', description: 'Emergency supplies restocked', created_at: new Date(Date.now() - 5*60*60*1000).toISOString(), created_by: 'Coordinator A' },
  { id: 3, shelter_name: 'Tandag Multipurpose Center', status: 'alert', description: 'Medical staff shortage reported', created_at: new Date(Date.now() - 12*60*60*1000).toISOString(), created_by: 'Coordinator B' },
  { id: 4, shelter_name: 'Cabadbaran Evacuation Center', status: 'updated', description: 'Structural inspection completed', created_at: new Date(Date.now() - 24*60*60*1000).toISOString(), created_by: 'Admin' },
  { id: 5, shelter_name: 'Bislig Community Center', status: 'active', description: 'Earthquake aftershock monitoring active', created_at: new Date(Date.now() - 48*60*60*1000).toISOString(), created_by: 'Coordinator C' }
])

const recommendations = ref([
  { id: 1, created_at: new Date(Date.now() - 2*60*60*1000).toISOString(), user_name: 'System AI', recommendation_type: 'Capacity Increase', shelter_name: 'Butuan City Hall', status: 'high', risk_level: 'HIGH', outcome: 'implemented' },
  { id: 2, created_at: new Date(Date.now() - 6*60*60*1000).toISOString(), user_name: 'System AI', recommendation_type: 'Supply Restock', shelter_name: 'Surigao City Center', status: 'medium', risk_level: 'MEDIUM', outcome: 'pending' },
  { id: 3, created_at: new Date(Date.now() - 12*60*60*1000).toISOString(), user_name: 'System AI', recommendation_type: 'Staff Training', shelter_name: 'Tandag Center', status: 'high', risk_level: 'HIGH', outcome: 'scheduled' },
  { id: 4, created_at: new Date(Date.now() - 24*60*60*1000).toISOString(), user_name: 'System AI', recommendation_type: 'Maintenance Check', shelter_name: 'Cabadbaran Center', status: 'medium', risk_level: 'MEDIUM', outcome: 'completed' },
  { id: 5, created_at: new Date(Date.now() - 48*60*60*1000).toISOString(), user_name: 'System AI', recommendation_type: 'Equipment Update', shelter_name: 'Bislig Center', status: 'low', risk_level: 'LOW', outcome: 'dismissed' }
])
const currentPage = ref(1)
const filterDate = ref('Last 7 days')
const searchQuery = ref('')
const loading = ref(false)
const showReportModal = ref(false)
const showLogModal = ref(false)
const selectedReport = ref(null)
const selectedLog = ref(null)

const filteredReports = computed(() => {
  let filtered = reports.value

  if (searchQuery.value) {
    filtered = filtered.filter(report => 
      report.shelter_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      report.status.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})

const stats = computed(() => ({
  total: reports.value.length,
  newEntries: reports.value.filter(r => r.status === 'alert').length,
  updated: reports.value.filter(r => r.status === 'updated').length,
  active: reports.value.filter(r => r.status === 'active').length
}))

function exportCSV() {
  if (filteredReports.value.length === 0) {
    alert('No reports to export')
    return
  }

  const headers = ['Report ID', 'Shelter Name', 'Type', 'Description', 'Date', 'Updated By']
  const rows = filteredReports.value.map(r => [
    `#RPT-${String(r.id).padStart(4, '0')}`,
    r.shelter_name,
    r.status,
    r.description,
    new Date(r.created_at).toLocaleString(),
    r.created_by
  ])

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `reports-${Date.now()}.csv`
  a.click()
  console.log('Exported', filteredReports.value.length, 'reports to CSV')
  alert(`Exported ${filteredReports.value.length} reports to CSV.`)
}

function exportPDF() {
  console.log('PDF export - Exporting', filteredReports.value.length, 'reports')
  alert('PDF export functionality coming soon')
}

function handleSearchInput(event) {
  searchQuery.value = event.target.value
  console.log('Searching reports:', searchQuery.value, '- Found:', filteredReports.value.length, 'results')
}

function viewReportDetails(reportId) {
  console.log(`Viewing details for report: ${reportId}`)
  const report = reports.value.find(r => r.id === reportId)
  if (report) {
    selectedReport.value = report
    showReportModal.value = true
  }
}

function handlePagination(page) {
  currentPage.value = page
}

function exportLogs() {
  if (recommendations.value.length === 0) {
    alert('No logs to export')
    return
  }

  const headers = ['Timestamp', 'User', 'Recommendation', 'Shelter', 'Status', 'Risk Level', 'Outcome']
  const rows = recommendations.value.map(r => [
    new Date(r.created_at).toLocaleString(),
    r.user_name,
    r.recommendation_type,
    r.shelter_name,
    r.status,
    r.risk_level,
    r.outcome
  ])

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `recommendations-${Date.now()}.csv`
  a.click()
  alert('AI recommendation logs exported to CSV.')
}

function viewLogDetails(logId) {
  console.log(`Viewing details for log: ${logId}`)
  const log = recommendations.value.find(r => r.id === logId)
  if (log) {
    selectedLog.value = log
    showLogModal.value = true
  }
}

function closeReportModal() {
  showReportModal.value = false
  selectedReport.value = null
}

function closeLogModal() {
  showLogModal.value = false
  selectedLog.value = null
}

async function loadReports() {
  loading.value = true
  try {
    const response = await getReports(1)
    reports.value = Array.isArray(response) ? response : response.results || []
  } catch (error) {
    console.error('Error loading reports:', error)
  } finally {
    loading.value = false
  }
}

async function loadRecommendations() {
  try {
    const response = await getAIRecommendations(1)
    recommendations.value = Array.isArray(response) ? response : response.results || []
  } catch (error) {
    console.error('Error loading recommendations:', error)
  }
}

function getRiskClass(riskLevel) {
  if (riskLevel === 'high') return 'risk-high'
  if (riskLevel === 'medium') return 'risk-medium'
  return 'risk-low'
}

function getStatusBadgeClass(status) {
  if (status === 'high') return 'high'
  if (status === 'medium') return 'medium'
  return 'low'
}

function getOutcomeClass(outcome) {
  if (outcome === 'valid') return 'valid'
  if (outcome === 'pending') return 'pending'
  return 'invalid'
}

onMounted(async () => {
  await loadReports()
  await loadRecommendations()
})
</script>

<style scoped>
.container {
  padding: 2rem;
  overflow-y: auto;
}

.topbar {
  margin-bottom: 2rem;
}

.topbar h2 {
  font-size: 24px;
  font-weight: 600;
  color: #222;
  margin: 0;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-box {
  flex: 1;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
}

.search-box input::placeholder {
  color: #999;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-controls select {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  cursor: pointer;
}

.btn-green {
  background: #22c55e;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-green:hover {
  background: #16a34a;
}

.btn-blue {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-blue:hover {
  background: #2563eb;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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

.stat.blue-label .num {
  color: #3b82f6;
}

.stat.orange-label .num {
  color: #ff6b1a;
}

.stat.red-label .num {
  color: #ef4444;
}

/* Table Section */
.table-section {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.table-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin: 0;
}

.table-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.showing-text {
  font-size: 12px;
  color: #7a7f84;
}

.pagination {
  display: flex;
  gap: 0.5rem;
}

.pagination button {
  padding: 0.5rem 0.75rem;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination button:hover {
  background: #eee;
}

.pagination button.active {
  background: #ff6b1a;
  color: #fff;
  border-color: #ff6b1a;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.reports-table thead {
  border-bottom: 2px solid #f0f0f0;
}

.reports-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: #555;
  background: #fafafa;
}

.reports-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.reports-table tbody tr:hover {
  background: #fafafa;
}

.badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.badge.active {
  background: #d1fae5;
  color: #065f46;
}

.badge.updated {
  background: #fed7aa;
  color: #92400e;
}

.badge.alert {
  background: #fee2e2;
  color: #7f1d1d;
}

.view-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.view-link:hover {
  text-decoration: underline;
}

/* AI Logs Section */
.ai-logs-section {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.ai-logs-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.ai-logs-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 13px;
  color: #7a7f84;
  margin: 0;
}

.btn-export {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-export:hover {
  background: #2563eb;
}

.logs-table-wrapper {
  overflow-x: auto;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.logs-table thead {
  border-bottom: 2px solid #f0f0f0;
}

.logs-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: #555;
  background: #fafafa;
  white-space: nowrap;
}

.logs-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.logs-table tbody tr:hover {
  background: #fafafa;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #ff6b1a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
}

.user-name {
  font-weight: 600;
  color: #222;
  font-size: 12px;
}

.user-role {
  font-size: 11px;
  color: #7a7f84;
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.high {
  background: #fee2e2;
  color: #7f1d1d;
}

.status-badge.medium {
  background: #fef3c7;
  color: #78350f;
}

.status-badge.low {
  background: #d1fae5;
  color: #065f46;
}

.risk-high {
  color: #ef4444;
  font-weight: 600;
  font-size: 11px;
}

.risk-medium {
  color: #f59e0b;
  font-weight: 600;
  font-size: 11px;
}

.risk-low {
  color: #22c55e;
  font-weight: 600;
  font-size: 11px;
}

.outcome {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.outcome.valid {
  background: #d1fae5;
  color: #065f46;
}

.outcome.pending {
  background: #fef3c7;
  color: #78350f;
}

.action-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
}

.action-btn:hover {
  color: #ff6b1a;
}

.logs-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 40;
}

.modal-card {
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 25px 45px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-card header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.modal-card h4 {
  margin: 0;
  font-size: 18px;
  color: #111;
}

.modal-card p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #475569;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.modal-detail-row {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 13px;
}

.modal-detail-row .label {
  font-weight: 600;
  color: #475569;
}

.modal-detail-row .value {
  max-width: 60%;
  text-align: right;
  color: #0f172a;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-cancel {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  padding: 0.6rem 1.2rem;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  color: #475569;
  cursor: pointer;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-controls {
    flex-wrap: wrap;
  }

  .logs-table {
    font-size: 11px;
  }

  .logs-table th,
  .logs-table td {
    padding: 0.75rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .filter-bar {
    flex-direction: column;
  }

  .search-box {
    order: -1;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .reports-table {
    font-size: 12px;
  }

  .reports-table th,
  .reports-table td {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0.75rem;
  }

  .page-title {
    font-size: 18px;
  }

  .page-desc {
    font-size: 12px;
  }

  .filter-bar {
    flex-direction: column;
    gap: 10px;
  }

  .filter-bar select,
  .filter-bar input {
    width: 100%;
    font-size: 14px;
  }

  .search-box {
    width: 100%;
  }

  .search-box input {
    font-size: 14px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-value {
    font-size: 18px;
  }

  .stat-label {
    font-size: 11px;
  }

  .table-header {
    flex-direction: column;
    gap: 10px;
  }

  .table-header button {
    width: 100%;
  }

  .reports-table {
    font-size: 11px;
  }

  .reports-table thead {
    display: none;
  }

  .reports-table tbody,
  .reports-table tr,
  .reports-table td {
    display: block;
    width: 100%;
  }

  .reports-table tr {
    margin-bottom: 12px;
    border: 1px solid #e6e9ec;
    border-radius: 8px;
    padding: 10px;
  }

  .reports-table td {
    padding: 8px 0;
    border: none;
    text-align: left;
  }

  .reports-table td:before {
    content: attr(data-label);
    font-weight: 600;
    display: inline-block;
    width: 40%;
    color: #666;
  }
}
</style>
