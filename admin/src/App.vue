<template>
  <Login v-if="!loggedIn" @login="onLogin" />

  <div v-else class="app-wrap">
    <Sidebar :currentRoute="route" @navigate="onNavigate" @logout="onLogout" />
    <component :is="currentView" />
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted } from 'vue'
import Login from './views/Login.vue'
import Sidebar from './components/Sidebar.vue'
import Dashboard from './views/Dashboard.vue'
import Shelters from './views/Shelters.vue'
import AddShelter from './views/AddShelter.vue'
import Reports from './views/Reports.vue'
import Settings from './views/Settings.vue'

const loggedIn = ref(false)
const route = ref('dashboard')

function onLogin(){
  loggedIn.value = true
  localStorage.setItem('loggedIn', 'true')
}

function onNavigate(to){ 
  route.value = to
  localStorage.setItem('currentRoute', to)
}

function onLogout(){
  loggedIn.value = false
  localStorage.removeItem('loggedIn')
  localStorage.removeItem('currentRoute')
  route.value = 'dashboard'
}

// Restore login state and current route from localStorage on mount
onMounted(()=>{
  if(localStorage.getItem('loggedIn') === 'true'){
    loggedIn.value = true
    const savedRoute = localStorage.getItem('currentRoute')
    if(savedRoute){
      route.value = savedRoute
    }
  }
})

// Provide navigate function to child views
provide('navigate', onNavigate)

const currentView = computed(()=>{
  if(route.value === 'add-shelter') return AddShelter
  if(route.value === 'shelters') return Shelters
  if(route.value === 'reports') return Reports
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
