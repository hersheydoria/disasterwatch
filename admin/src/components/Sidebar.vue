<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <img src="../assets/logo.png" alt="logo" />
        <span>DisasterWatch</span>
      </div>
      <button class="hamburger-close" @click="$emit('close')" title="Close menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <nav class="nav">
      <a :class="{active: currentRoute==='dashboard'}" @click.prevent="handleNavClick('dashboard')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Dashboard</span>
      </a>
      <a :class="{active: currentRoute==='shelters'}" @click.prevent="handleNavClick('shelters')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>Shelters</span>
      </a>
      <a :class="{active: currentRoute==='alerts'}" @click.prevent="handleNavClick('alerts')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span>Alerts</span>
      </a>
      <a :class="{active: currentRoute==='reports'}" @click.prevent="handleNavClick('reports')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Reports</span>
      </a>
      <a :class="{active: currentRoute==='settings'}" @click.prevent="handleNavClick('settings')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24M1 12h6m6 0h6m-15.78 7.78l4.24-4.24m5.08 0l4.24 4.24"></path>
        </svg>
        <span>Settings</span>
      </a>
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
import { defineProps, defineEmits } from 'vue'

const emit = defineEmits(['navigate', 'logout', 'close', 'toggle'])
const props = defineProps({
  currentRoute: {
    type: String,
    default: 'dashboard'
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

function handleNavClick(to) {
  emit('navigate', to)
  emit('close')
}

function logout(){
  emit('navigate', 'login')
  emit('close')
}
</script>

<style scoped>
.sidebar{ width:220px; background:#fff; border-right:1px solid #eef0f2; padding:16px 18px; display:flex; flex-direction:column; position:sticky; top:0; height:100vh; overflow:auto }
.sidebar-brand{ display:flex; align-items:center; gap:10px; font-weight:700; justify-content:flex-start; margin-bottom:8px }
.sidebar-brand img{ width:34px; height:34px }
.sidebar-brand span{ font-size:15px }
.sidebar-header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:16px }
.hamburger-close{ display:none; background:none; border:none; cursor:pointer; color:#ff6b1a; padding:0; width:24px; height:24px }
.hamburger-close svg{ width:24px; height:24px }
.nav{ margin-top:12px; display:flex; flex-direction:column; gap:8px }
.nav a{ padding:10px; border-radius:8px; color:#6b7075; cursor:pointer; text-decoration:none; transition:all 0.2s; display:flex; align-items:center; gap:12px }
.nav a:hover{ color:#ff6b1a }
.nav a.active{ background:#fff7f1; color:#ff6b1a; font-weight:600 }
.nav-icon{ width:20px; height:20px; flex-shrink:0 }
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
  .sidebar-header{ width:100% }
  .nav{ margin-top:0; flex-direction:row; gap:4px }
  .nav a{ flex:1; justify-content:center; padding:8px; font-size:12px }
  .nav-icon{ width:18px; height:18px }
  .sidebar-user{ margin-top:0; border-top:none; padding-top:0 }
  .logout-btn{ width:36px; height:36px }
  .logout-icon{ width:20px; height:20px }
}

@media (max-width: 768px) {
  .sidebar { padding: 10px 12px; }
  .sidebar-brand span { font-size: 13px; }
  .nav { gap: 2px; }
  .nav a { padding: 8px; font-size: 12px; }
  .nav a span { font-size: 12px; }
  .meta .name { font-size: 12px; }
  .meta .role { font-size: 10px; }
}

@media (max-width: 480px) {
  /* Show close button */
  .hamburger-close {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Transform sidebar into drawer */
  .sidebar {
    position: fixed;
    top: 56px;
    left: 0;
    width: 280px;
    height: calc(100vh - 56px);
    flex-direction: column;
    padding: 16px 12px;
    z-index: 101;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    margin-left: 0;
    border-right: 1px solid #eef0f2;
    border-bottom: none;
    box-shadow: 2px 0 12px rgba(0,0,0,0.15);
    overflow-y: auto;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .sidebar-brand {
    gap: 10px;
    margin-bottom: 0;
    flex: 1;
  }

  .sidebar-brand img {
    width: 32px;
    height: 32px;
  }

  .sidebar-brand span {
    font-size: 16px;
    font-weight: 700;
  }

  /* Vertical navigation list */
  .nav {
    gap: 8px;
    margin-top: 12px;
    flex-direction: column;
  }

  .nav a {
    padding: 12px;
    font-size: 14px;
    border-radius: 8px;
    gap: 12px;
    align-items: center;
    width: 100%;
    flex-direction: row;
  }

  .nav a span {
    font-size: 14px;
  }

  .nav-icon {
    width: 22px;
    height: 22px;
  }

  .sidebar-user {
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid #eef0f2;
    gap: 12px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .meta {
    flex: 1;
  }

  .meta .name {
    font-size: 13px;
  }

  .meta .role {
    font-size: 11px;
  }

  .logout-btn {
    width: 40px;
    height: 40px;
  }

  .logout-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
