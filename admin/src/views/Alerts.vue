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
            <div class="num">5</div>
            <div class="label">Total Earthquakes</div>
          </div>
          <div class="stat critical">
            <div class="num">2</div>
            <div class="label">Major (6.0+)</div>
          </div>
          <div class="stat warning">
            <div class="num">3</div>
            <div class="label">Aftershocks</div>
          </div>
          <div class="stat success">
            <div class="num">12</div>
            <div class="label">Evacuees</div>
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
                <tr>
                  <td><strong>#EQ-2024-001</strong></td>
                  <td>Butuan City</td>
                  <td><span class="badge earthquake">Main Shock</span></td>
                  <td>
                    <span class="severity critical">
                      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                      6.8 Mag
                    </span>
                  </td>
                  <td>15 km</td>
                  <td>2024-01-15 14:32 PM</td>
                  <td><span class="status-pill active">Active Alert</span></td>
                  <td>
                    <button class="action-btn" @click="acknowledgeAlert('#EQ-2024-001')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                    <button class="action-btn view" @click="viewAlertDetails('#EQ-2024-001')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><strong>#EQ-2024-002</strong></td>
                  <td>Agusan del Norte</td>
                  <td><span class="badge aftershock">Aftershock</span></td>
                  <td>
                    <span class="severity high">
                      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                      5.4 Mag
                    </span>
                  </td>
                  <td>18 km</td>
                  <td>2024-01-15 14:47 PM</td>
                  <td><span class="status-pill active">Active Alert</span></td>
                  <td>
                    <button class="action-btn" @click="acknowledgeAlert('#EQ-2024-002')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                    <button class="action-btn view" @click="viewAlertDetails('#EQ-2024-002')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><strong>#EQ-2024-003</strong></td>
                  <td>Surigao del Sur</td>
                  <td><span class="badge aftershock">Aftershock</span></td>
                  <td>
                    <span class="severity medium">
                      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                      4.9 Mag
                    </span>
                  </td>
                  <td>12 km</td>
                  <td>2024-01-15 15:03 PM</td>
                  <td><span class="status-pill active">Active Alert</span></td>
                  <td>
                    <button class="action-btn" @click="acknowledgeAlert('#EQ-2024-003')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                    <button class="action-btn view" @click="viewAlertDetails('#EQ-2024-003')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><strong>#EQ-2024-004</strong></td>
                  <td>Agusan del Sur</td>
                  <td><span class="badge aftershock">Aftershock</span></td>
                  <td>
                    <span class="severity medium">
                      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                      4.5 Mag
                    </span>
                  </td>
                  <td>20 km</td>
                  <td>2024-01-15 16:20 PM</td>
                  <td><span class="status-pill acknowledged">Aftershock</span></td>
                  <td>
                    <button class="action-btn view" @click="viewAlertDetails('#EQ-2024-004')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><strong>#EQ-2024-005</strong></td>
                  <td>Cabadbaran City</td>
                  <td><span class="badge mainshock">Main Event</span></td>
                  <td>
                    <span class="severity critical">
                      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                      6.2 Mag
                    </span>
                  </td>
                  <td>22 km</td>
                  <td>2024-01-14 09:30 AM</td>
                  <td><span class="status-pill resolved">Resolved</span></td>
                  <td>
                    <button class="action-btn view" @click="viewAlertDetails('#EQ-2024-005')">
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
import { ref } from 'vue'

const searchQuery = ref('')
const magnitudeFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)

function handleSearch(event) {
  console.log('Searching earthquakes:', searchQuery.value)
}

function handleMagnitudeFilter() {
  console.log('Filtering by magnitude:', magnitudeFilter.value)
}

function handleStatusFilter() {
  console.log('Filtering by status:', statusFilter.value)
}

function acknowledgeAlert(alertId) {
  console.log('Acknowledged earthquake alert:', alertId)
  // Can be expanded to update alert status in backend
}

function viewAlertDetails(alertId) {
  console.log('Viewing details for earthquake:', alertId)
  // Can be expanded to show earthquake details modal with seismic data
}

function refreshAlerts() {
  console.log('Refreshing earthquake alerts for Caraga region...')
  // Can be expanded to fetch latest earthquake data from PHIVOLCS API or similar
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    console.log('Going to page:', currentPage.value)
  }
}

function nextPage() {
  currentPage.value++
  console.log('Going to page:', currentPage.value)
}

function goToPage(page) {
  currentPage.value = page
  console.log('Going to page:', page)
}
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
