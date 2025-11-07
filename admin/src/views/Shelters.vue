<template>
  <div class="page-wrap">
    <main class="main">
      <div class="container">
        <header class="page-head">
          <div>
            <h2>Evacuation Shelters</h2>
            <p class="desc">Manage evacuation areas and shelter information</p>
          </div>
          <div class="head-right">
            <button class="btn-refresh" @click="refreshData">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                <polyline points="23 4 23 10 17 10"/>
                <polyline points="1 20 1 14 7 14"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
              Refresh Data
            </button>
          </div>
        </header>
        
        <div class="filters">
          <input placeholder="Search shelters..." class="search" @input="handleSearch" />
          <select class="status" @change="handleStatusFilter">
            <option>All Status</option>
            <option>Active</option>
            <option>Full</option>
          </select>
          <button class="btn add" @click="addShelter">+ Add New Shelter</button>
        </div>

        <section class="stats-grid small">
          <div class="stat"> <div class="num">{{ shelters.length }}</div> <div class="label">Total Shelters</div> </div>
          <div class="stat green"> <div class="num">{{ shelters.filter(s => s.status === 'active').length }}</div> <div class="label">Active</div> </div>
          <div class="stat"> <div class="num">{{ shelters.reduce((sum, s) => sum + s.capacity, 0) }}</div> <div class="label">Total Capacity</div> </div>
          <div class="stat red"> <div class="num">{{ shelters.filter(s => s.status === 'full').length }}</div> <div class="label">At Capacity</div> </div>
        </section>

        <section class="table-panel">
          <div class="panel">
            <h3>Shelter Locations</h3>
            <table class="shelter-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Capacity</th>
                  <th>Current</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="shelter in filteredShelters" :key="shelter.id">
                  <td>
                    <div class="shelter-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9,22 9,12 15,12 15,22"/>
                      </svg>
                    </div>
                    <div class="s-name">{{ shelter.name }}<div class="sub">{{ shelter.shelter_type }}</div></div>
                  </td>
                  <td><div class="loc">{{ shelter.address }}</div><div class="muted">{{ shelter.region }}</div></td>
                  <td><span :class="['pill', shelter.status === 'active' ? 'active' : shelter.status === 'full' ? 'full' : 'inactive']">{{ shelter.status === 'active' ? 'Active' : shelter.status === 'full' ? 'Full' : 'Inactive' }}</span></td>
                  <td>{{ shelter.max_capacity }}</td>
                  <td>
                    <div class="capacity-bar">
                      <div class="fill" :style="{width: Math.round((shelter.current_occupancy / shelter.max_capacity) * 100) + '%', background: shelter.status === 'active' ? '#3b82f6' : shelter.status === 'full' ? '#ef4444' : '#d1d5db'}"></div>
                    </div>
                    <div class="num">{{ shelter.current_occupancy }}</div>
                  </td>
                  <td><a class="edit" href="#" @click.prevent="editShelter(shelter.name)">Edit →</a></td>
                </tr>
              </tbody>
            </table>
            <div class="pagination">
              <span>Showing 1–5 of 24 results</span>
              <div class="pager">
                <button>Previous</button>
                <button class="active">1</button>
                <button>2</button>
                <button>3</button>
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
import { getShelters } from '../api/client'

const navigate = inject('navigate', () => {})

const shelters = ref([])
const filteredShelters = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')

onMounted(async () => {
  await loadShelters()
})

async function loadShelters() {
  loading.value = true
  try {
    const response = await getShelters(1)
    const data = response.results || response
    shelters.value = Array.isArray(data) ? data : []
    filteredShelters.value = shelters.value
  } catch (error) {
    console.error('Error loading shelters:', error)
    shelters.value = []
    filteredShelters.value = []
  } finally {
    loading.value = false
  }
}

function addShelter() {
  navigate('add-shelter')
}

function editShelter(shelter) {
  console.log(`Editing shelter: ${shelter.name}`)
  // Can be expanded to navigate to edit form with shelter data
}

async function refreshData() {
  console.log('Refreshing shelter data...')
  await loadShelters()
  filterShelters()
}

function handleSearch(event) {
  searchQuery.value = event.target.value.toLowerCase()
  filterShelters()
}

function handleStatusFilter(event) {
  statusFilter.value = event.target.value.toLowerCase()
  filterShelters()
}

function filterShelters() {
  let filtered = shelters.value

  if (searchQuery.value) {
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(searchQuery.value) ||
      s.address.toLowerCase().includes(searchQuery.value)
    )
  }

  if (statusFilter.value !== 'all status' && statusFilter.value !== 'all') {
    filtered = filtered.filter(s => s.status.toLowerCase() === statusFilter.value)
  }

  filteredShelters.value = filtered
}

function getCapacityColor(current, capacity) {
  const percentage = (current / capacity) * 100
  if (percentage >= 100) return '#ef4444'
  if (percentage >= 75) return '#ff9e64'
  if (percentage >= 50) return '#3b82f6'
  return '#10b981'
}
</script>

<style scoped>
.page-wrap{ display:flex; min-height:100vh; background:#f5f7fa }
.main{ flex:1; padding:28px; overflow:auto; max-height:100vh }
.container{ max-width:1200px; margin:0 auto }

.page-head{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px }
.page-head h2{ margin:0; font-size:20px }
.page-head .desc{ color:#7a7f84; font-size:13px; margin:4px 0 0 }
.head-right{ display:flex; gap:12px }
.btn-refresh{ background:#fff; border:1px solid #e6e9ec; padding:8px 12px; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:6px }
.btn-refresh svg{ width:16px; height:16px }

.filters{ display:flex; gap:12px; align-items:center; margin-bottom:18px }
.search{ flex:1; max-width:250px; padding:10px; border-radius:8px; border:1px solid #e6e9ec; font-size:14px }
.status{ padding:10px; border-radius:8px; border:1px solid #e6e9ec; font-size:14px }
.btn.add{ background:#ff6b1a; color:#fff; border:0; padding:10px 14px; border-radius:8px; cursor:pointer; font-weight:600 }

.stats-grid.small{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px }
.stat{ background:#fff; padding:18px; border-radius:10px; box-shadow:0 6px 14px rgba(20,30,40,0.03) }
.stat .num{ font-size:24px; font-weight:700; color:#111 }
.stat .label{ color:#7a7f84; font-size:13px; margin-top:6px }

.panel{ background:#fff; padding:20px; border-radius:10px; box-shadow:0 6px 14px rgba(20,30,40,0.03) }
.panel h3{ margin:0 0 16px; font-size:16px }

.shelter-table{ width:100%; border-collapse:collapse }
.shelter-table th{ text-align:left; padding:14px; border-bottom:1px solid #e6e9ec; font-weight:700; font-size:13px; color:#6b7075 }
.shelter-table td{ padding:14px; border-bottom:1px solid #f1f3f5 }

.shelter-icon{ display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px; background:#fff7f1; border-radius:8px; margin-right:10px }
.shelter-icon svg{ width:20px; height:20px }
.s-name{ display:inline-block; font-weight:600 }
.s-name .sub{ font-size:12px; color:#7a7f84; font-weight:400; margin-top:2px }

.loc{ font-weight:600; font-size:14px }
.muted{ color:#7a7f84; font-size:13px }

.capacity-bar{ height:6px; background:#eef2f6; border-radius:3px; margin-bottom:4px }
.capacity-bar .fill{ height:100%; border-radius:3px }
.num{ font-size:12px; color:#7a7f84 }

.pill{ padding:6px 10px; border-radius:999px; font-weight:700; font-size:12px }
.pill.active{ background:#ecfff4; color:#065f46 }
.pill.full{ background:#fff1f2; color:#981b1b }
.pill.inactive{ background:#f3f4f6; color:#6b7075 }

.edit{ color:#ff6b1a; cursor:pointer; font-weight:600; text-decoration:none }
.edit:hover{ text-decoration:underline }

.pagination{ display:flex; justify-content:space-between; align-items:center; margin-top:18px; padding-top:14px; border-top:1px solid #f1f3f5 }
.pager{ display:flex; gap:8px }
.pager button{ padding:8px 12px; border:1px solid #e6e9ec; border-radius:6px; background:#fff; cursor:pointer }
.pager button.active{ background:#ff6b1a; color:#fff; border-color:#ff6b1a; font-weight:700 }

@media (max-width:960px){
  .stats-grid.small{ grid-template-columns:repeat(2,1fr) }
  .filters{ flex-wrap:wrap }
  .search{ flex:0 1 100% }
}
</style>
