<template>
  <div class="container">
    <header class="topbar">
      <h2>Reports Overview</h2>
    </header>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="search-box">
        <input v-model="searchQuery" type="text" placeholder="Search by report name or report type..." />
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
        <div class="num">128</div>
        <div class="label">Total Reports</div>
      </div>
      <div class="stat blue-label">
        <div class="num">32</div>
        <div class="label">New Entries</div>
      </div>
      <div class="stat orange-label">
        <div class="num">18</div>
        <div class="label">Updated Made</div>
      </div>
      <div class="stat red-label">
        <div class="num">5</div>
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
          <tr>
            <td><strong>#RPT-2024-001</strong></td>
            <td>Central Community Center</td>
            <td><span class="badge active">Active</span></td>
            <td>Facility needs updating with emergency inventory supplies</td>
            <td>2024-01-15 11:15 AM</td>
            <td>Sarah Johnson</td>
            <td><a href="#" @click.prevent="viewReportDetails('#RPT-2024-001')" class="view-link">View Details</a></td>
          </tr>
          <tr>
            <td><strong>#RPT-2024-002</strong></td>
            <td>Barangay Emergency Hub</td>
            <td><span class="badge updated">Updated</span></td>
            <td>Capacity updated to 80 people (full maintenance)</td>
            <td>2024-01-13 01:12 PM</td>
            <td>Mike Chan</td>
            <td><a href="#" @click.prevent="viewReportDetails('#RPT-2024-002')" class="view-link">View Details</a></td>
          </tr>
          <tr>
            <td><strong>#RPT-2024-003</strong></td>
            <td>Downtown Safe Haven</td>
            <td><span class="badge alert">Alert</span></td>
            <td>System failure, damage and infrastructure issues</td>
            <td>2024-01-12 10:09 AM</td>
            <td>Emily Rodriguez</td>
            <td><a href="#" @click.prevent="viewReportDetails('#RPT-2024-003')" class="view-link">View Details</a></td>
          </tr>
          <tr>
            <td><strong>#RPT-2024-004</strong></td>
            <td>East Hi Valley Shelter</td>
            <td><span class="badge active">Active</span></td>
            <td>New temporary shelter setup for flood relief</td>
            <td>2024-01-10 04:30 AM</td>
            <td>David Park</td>
            <td><a href="#" @click.prevent="viewReportDetails('#RPT-2024-004')" class="view-link">View Details</a></td>
          </tr>
          <tr>
            <td><strong>#RPT-2024-005</strong></td>
            <td>Eastside Community Hall</td>
            <td><span class="badge updated">Updated</span></td>
            <td>Supply inventory updated and supplies replenished</td>
            <td>2024-01-14 14:31 PM</td>
            <td>Lisa Wang</td>
            <td><a href="#" @click.prevent="viewReportDetails('#RPT-2024-005')" class="view-link">View Details</a></td>
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
            <tr>
              <td>Oct 18, 2024 11:30 AM</td>
              <td>
                <div class="user-cell">
                  <div class="user-avatar">SJ</div>
                  <div>
                    <div class="user-name">Sarah Johnson</div>
                    <div class="user-role">Downtown Ctr A</div>
                  </div>
                </div>
              </td>
              <td>Facility Capacity Planning</td>
              <td>Central Community Center</td>
              <td><span class="status-badge high">High Risk</span></td>
              <td><span class="risk-high">High Risk</span></td>
              <td><span class="outcome valid">VALID</span></td>
              <td><button class="action-btn">⊙</button></td>
            </tr>
            <tr>
              <td>Oct 18, 2024 11:45 PM</td>
              <td>
                <div class="user-cell">
                  <div class="user-avatar">MR</div>
                  <div>
                    <div class="user-name">Mike Rodriguez</div>
                    <div class="user-role">Barangay Ctr B</div>
                  </div>
                </div>
              </td>
              <td>Resource Allocation</td>
              <td>Riverside Emergency Shelter</td>
              <td><span class="status-badge medium">Medium Risk</span></td>
              <td><span class="risk-medium">Medium Risk</span></td>
              <td><span class="outcome valid">VALID</span></td>
              <td><button class="action-btn">⊙</button></td>
            </tr>
            <tr>
              <td>Oct 18, 2024 01:45 AM</td>
              <td>
                <div class="user-cell">
                  <div class="user-avatar">EC</div>
                  <div>
                    <div class="user-name">Emily Chen</div>
                    <div class="user-role">North Safe H</div>
                  </div>
                </div>
              </td>
              <td>Distribution Optimization</td>
              <td>North Safe House</td>
              <td><span class="status-badge low">Low Risk</span></td>
              <td><span class="risk-low">Low Risk</span></td>
              <td><span class="outcome valid">VALID</span></td>
              <td><button class="action-btn">⊙</button></td>
            </tr>
            <tr>
              <td>Oct 18, 2024 03:45 PM</td>
              <td>
                <div class="user-cell">
                  <div class="user-avatar">DW</div>
                  <div>
                    <div class="user-name">David Wilson</div>
                    <div class="user-role">East End, Zone E</div>
                  </div>
                </div>
              </td>
              <td>Predictive Maintenance</td>
              <td>East End Community Hub</td>
              <td><span class="status-badge high">High Risk</span></td>
              <td><span class="risk-high">High Risk</span></td>
              <td><span class="outcome pending">Pending</span></td>
              <td><button class="action-btn">⊙</button></td>
            </tr>
            <tr>
              <td>Oct 18, 2024 04:45 PM</td>
              <td>
                <div class="user-cell">
                  <div class="user-avatar">LT</div>
                  <div>
                    <div class="user-name">Lisa Thompson</div>
                    <div class="user-role">Milton Valley, Zone E</div>
                  </div>
                </div>
              </td>
              <td>Emergency Protocols</td>
              <td>Milton Valley Shelter</td>
              <td><span class="status-badge medium">Medium Risk</span></td>
              <td><span class="risk-medium">Medium Risk</span></td>
              <td><span class="outcome valid">VALID</span></td>
              <td><button class="action-btn">⊙</button></td>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentPage = ref(1)
const filterDate = ref('Last 7 days')
const searchQuery = ref('')

function exportCSV() {
  console.log('Exporting to CSV...')
  // CSV export functionality - can be expanded later
}

function exportPDF() {
  console.log('Exporting to PDF...')
  // PDF export functionality - can be expanded later
}

function viewReportDetails(reportId) {
  console.log(`Viewing details for report: ${reportId}`)
  // Report details modal - can be expanded later
}

function handlePagination(page) {
  currentPage.value = page
  console.log(`Navigating to page: ${page}`)
}

function exportLogs() {
  console.log('Exporting logs...')
  // Export logs functionality - can be expanded later
}

function viewLogDetails(logId) {
  console.log(`Viewing details for log: ${logId}`)
  // Log details functionality - can be expanded later
}
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
</style>
