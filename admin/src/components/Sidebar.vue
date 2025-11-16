<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <img src="../assets/logo.png" alt="logo" />
      <span>DisasterWatch</span>
    </div>

    <nav class="nav">
        <a :class="{active: currentRoute==='dashboard'}" @click.prevent="navigate('dashboard')">Dashboard</a>
        <a :class="{active: currentRoute==='shelters'}" @click.prevent="navigate('shelters')">Shelters</a>
        <a :class="{active: currentRoute==='alerts'}" @click.prevent="navigate('alerts')">Alerts</a>
        <a :class="{active: currentRoute==='reports'}" @click.prevent="navigate('reports')">Reports</a>
        <a :class="{active: currentRoute==='settings'}" @click.prevent="navigate('settings')">Settings</a>
      </nav>

    <div class="sidebar-user">
      <div class="avatar">U</div>
      <div class="meta"><div class="name">User</div><div class="role">Coordinator</div></div>
      <button class="logout-btn" @click="logout" title="Logout">
        <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
const emit = defineEmits(['navigate', 'logout'])
const props = defineProps({
  currentRoute: {
    type: String,
    default: 'dashboard'
  }
})

function navigate(to){
  emit('navigate', to)
}

function logout(){
  emit('navigate', 'login')
}
</script>

<style scoped>
.sidebar{ width:220px; background:#fff; border-right:1px solid #eef0f2; padding:16px 18px; display:flex; flex-direction:column; position:sticky; top:0; height:100vh; overflow:auto }
.sidebar-brand{ display:flex; align-items:center; gap:10px; font-weight:700; justify-content:flex-start; margin-bottom:8px }
.sidebar-brand img{ width:34px; height:34px }
.sidebar-brand span{ font-size:15px }
.nav{ margin-top:12px; display:flex; flex-direction:column; gap:8px }
.nav a{ padding:10px; border-radius:8px; color:#6b7075; cursor:pointer; text-decoration:none; transition:all 0.2s }
.nav a:hover{ color:#ff6b1a }
.nav a.active{ background:#fff7f1; color:#ff6b1a; font-weight:600 }
.sidebar-user{ display:flex; gap:12px; align-items:center; margin-top:auto; padding-top:16px; border-top:1px solid #eef0f2 }
.avatar{ width:40px; height:40px; background:#ff6b1a; color:#fff; display:flex; align-items:center; justify-content:center; border-radius:50%; font-weight:600; flex-shrink:0 }
.meta{ flex:1 }
.meta .name{ font-size:13px; font-weight:600; color:#222 }
.meta .role{ font-size:11px; color:#999 }
.logout-btn{ background:#ff6b1a; border:none; border-radius:8px; width:40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.3s; padding:0; flex-shrink:0 }
.logout-btn:hover{ background:#e55a0a; box-shadow:0 4px 12px rgba(255,107,26,0.3) }
.logout-btn:active{ transform:scale(0.95) }
.logout-icon{ width:22px; height:22px; color:#fff; stroke-linecap:round; stroke-linejoin:round }

@media (max-width:960px){
  .sidebar{ width:100%; flex-direction:row; align-items:center; position:static; height:auto; padding:12px 16px }
  .sidebar-brand{ margin-bottom:0; margin-right:auto }
  .nav{ margin-top:0; flex-direction:row; gap:4px }
  .sidebar-user{ margin-top:0; border-top:none; padding-top:0 }
  .logout-btn{ width:36px; height:36px }
  .logout-icon{ width:20px; height:20px }
}
</style>
