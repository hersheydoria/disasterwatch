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
            <button class="btn-refresh">🔄 Refresh Data</button>
          </div>
        </header>
        
        <div class="filters">
          <input placeholder="Search shelters..." class="search" />
          <select class="status">
            <option>All Status</option>
            <option>Active</option>
            <option>Full</option>
          </select>
          <button class="btn add" @click="addShelter">+ Add New Shelter</button>
        </div>

        <section class="stats-grid small">
          <div class="stat"> <div class="num">24</div> <div class="label">Total Shelters</div> </div>
          <div class="stat green"> <div class="num">18</div> <div class="label">Active</div> </div>
          <div class="stat"> <div class="num">2,450</div> <div class="label">Total Capacity</div> </div>
          <div class="stat red"> <div class="num">3</div> <div class="label">At Capacity</div> </div>
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
                <tr>
                  <td>
                    <div class="shelter-icon">🏫</div>
                    <div class="s-name">Central High School<div class="sub">Primary Shelter</div></div>
                  </td>
                  <td><div class="loc">1234 Main Street</div><div class="muted">Downtown District</div></td>
                  <td><span class="pill active">Active</span></td>
                  <td>500</td>
                  <td>
                    <div class="capacity-bar">
                      <div class="fill" style="width:47%; background:#ff9e64"></div>
                    </div>
                    <div class="num">234</div>
                  </td>
                  <td><a class="edit">Edit →</a></td>
                </tr>
                <tr>
                  <td>
                    <div class="shelter-icon">🏢</div>
                    <div class="s-name">Community Center East<div class="sub">Secondary Shelter</div></div>
                  </td>
                  <td><div class="loc">567 Oak Avenue</div><div class="muted">East Side</div></td>
                  <td><span class="pill active">Active</span></td>
                  <td>200</td>
                  <td>
                    <div class="capacity-bar">
                      <div class="fill" style="width:44%; background:#10b981"></div>
                    </div>
                    <div class="num">89</div>
                  </td>
                  <td><a class="edit">Edit →</a></td>
                </tr>
                <tr>
                  <td>
                    <div class="shelter-icon">⛪</div>
                    <div class="s-name">St. Mary's Church<div class="sub">Emergency Shelter</div></div>
                  </td>
                  <td><div class="loc">890 Pine Street</div><div class="muted">West District</div></td>
                  <td><span class="pill full">Full</span></td>
                  <td>150</td>
                  <td>
                    <div class="capacity-bar">
                      <div class="fill" style="width:100%; background:#ef4444"></div>
                    </div>
                    <div class="num">150</div>
                  </td>
                  <td><a class="edit">Edit →</a></td>
                </tr>
                <tr>
                  <td>
                    <div class="shelter-icon">🏞️</div>
                    <div class="s-name">Riverside Park Pavilion<div class="sub">Emergency Shelter</div></div>
                  </td>
                  <td><div class="loc">123 River Road</div><div class="muted">Riverside</div></td>
                  <td><span class="pill inactive">Inactive</span></td>
                  <td>75</td>
                  <td>
                    <div class="capacity-bar">
                      <div class="fill" style="width:0%; background:#d1d5db"></div>
                    </div>
                    <div class="num">0</div>
                  </td>
                  <td><a class="edit">Edit →</a></td>
                </tr>
                <tr>
                  <td>
                    <div class="shelter-icon">🏟️</div>
                    <div class="s-name">Sports Complex Arena<div class="sub">Large Capacity Shelter</div></div>
                  </td>
                  <td><div class="loc">456 Stadium Drive</div><div class="muted">Sports District</div></td>
                  <td><span class="pill active">Active</span></td>
                  <td>800</td>
                  <td>
                    <div class="capacity-bar">
                      <div class="fill" style="width:39%; background:#3b82f6"></div>
                    </div>
                    <div class="num">312</div>
                  </td>
                  <td><a class="edit">Edit →</a></td>
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
import { inject } from 'vue'
const navigate = inject('navigate', () => {})
function addShelter() {
  navigate('add-shelter')
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
.btn-refresh{ background:#fff; border:1px solid #e6e9ec; padding:8px 12px; border-radius:8px; cursor:pointer }

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

.shelter-icon{ display:inline-block; width:36px; height:36px; background:#fff7f1; border-radius:8px; text-align:center; line-height:36px; margin-right:10px; font-size:18px }
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
