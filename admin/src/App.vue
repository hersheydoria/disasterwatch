<template>
  <div class="app-wrap">
    <template v-if="loggedIn">
      <!-- Mobile Header with Hamburger -->
      <header class="mobile-header">
        <button class="hamburger-btn" @click="toggleSidebar" title="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="mobile-logo">DisasterWatch</div>
        <div class="mobile-header-spacer"></div>
      </header>

      <!-- Sidebar with Drawer on Mobile -->
      <Sidebar 
        :currentRoute="route" 
        @navigate="onNavigate"
        :isOpen="sidebarOpen"
        @toggle="toggleSidebar"
        @close="closeSidebar"
      />

      <!-- Sidebar Backdrop (for closing on mobile) -->
      <div v-if="sidebarOpen" class="sidebar-backdrop" @click="closeSidebar"></div>

      <!-- Main Content -->
      <component :is="currentView" />
    </template>
    <Login @login="onLogin" v-else />
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import Shelters from './views/Shelters.vue'
import AddShelter from './views/AddShelter.vue'
import Reports from './views/Reports.vue'
import Alerts from './views/Alerts.vue'
import Settings from './views/Settings.vue'

const loggedIn = ref(localStorage.getItem('adminLoggedIn') === 'true')
const route = ref('dashboard')
const sidebarOpen = ref(false)

function onLogin(){
  loggedIn.value = true
  localStorage.setItem('adminLoggedIn', 'true')
}

function onNavigate(to){ 
  if(to === 'login'){
    loggedIn.value = false
    localStorage.removeItem('adminLoggedIn')
    route.value = 'dashboard'
  } else {
    route.value = to
  }
  closeSidebar()
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

// Provide navigate function to child views
provide('navigate', onNavigate)

const currentView = computed(()=>{
  if(route.value === 'add-shelter') return AddShelter
  if(route.value === 'shelters') return Shelters
  if(route.value === 'reports') return Reports
  if(route.value === 'alerts') return Alerts
  if(route.value === 'settings') return Settings
  if(route.value === 'dashboard') return Dashboard
  // fallback to dashboard for other routes until implemented
  return Dashboard
})
</script>

<style scoped>
.app-wrap{ display:flex; min-height:100vh; }
/* ensure the rendered view expands to fill remaining space */
.app-wrap > *:not(.sidebar){ flex:1 }

/* Mobile Header */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #eef0f2;
  z-index: 98;
  align-items: center;
  padding: 0 12px;
  gap: 12px;
}

.hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ff6b1a;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hamburger-btn svg {
  width: 32px;
  height: 32px;
}

.mobile-logo {
  font-size: 16px;
  font-weight: 700;
  color: #222;
  flex: 1;
  text-align: center;
}

.mobile-header-spacer {
  width: 32px;
  flex-shrink: 0;
}

/* Sidebar Backdrop */
.sidebar-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 99;
  top: 56px;
}

@media (max-width: 480px) {
  .mobile-header {
    display: flex;
  }

  .app-wrap {
    flex-direction: column;
  }
  
  .app-wrap > *:not(.sidebar):not(.sidebar-backdrop) {
    margin-top: 56px;
  }

  .sidebar-backdrop {
    display: block;
  }
}
</style>
