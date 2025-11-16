<template>
  <div class="app-wrap">
    <template v-if="loggedIn">
      <Sidebar :currentRoute="route" @navigate="onNavigate" />
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
</style>
