import { ref } from 'vue'

const baseAlerts = [
  {
    id: 1,
    location: 'Butuan City, Agusan del Norte',
    alert_type: 'Mainshock',
    magnitude: 4.5,
    depth: 12,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 2,
    location: 'Surigao City, Surigao del Norte',
    alert_type: 'Mainshock',
    magnitude: 3.8,
    depth: 15,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'acknowledged'
  },
  {
    id: 3,
    location: 'Tandag, Surigao del Sur',
    alert_type: 'Mainshock',
    magnitude: 5.2,
    depth: 18,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'resolved'
  },
  {
    id: 4,
    location: 'Butuan City, Agusan del Norte',
    alert_type: 'Aftershock',
    magnitude: 3.2,
    depth: 10,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: 5,
    location: 'Bislig, Surigao del Sur',
    alert_type: 'Aftershock',
    magnitude: 2.9,
    depth: 14,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'resolved'
  }
]

const alerts = ref(baseAlerts.map((alert) => ({ ...alert })))

function refreshAlerts() {
  const randomOffset = () => Math.floor(Math.random() * 10) * 60 * 1000
  const statuses = ['active', 'acknowledged', 'resolved']
  const refreshed = baseAlerts.map((alert, index) => ({
    ...alert,
    id: Date.now() + index,
    timestamp: new Date(Date.now() - randomOffset()).toISOString(),
    status: statuses[index % statuses.length]
  }))
  alerts.value = refreshed
  return alerts.value
}

function acknowledgeAlert(alertId) {
  const target = alerts.value.find((a) => a.id === alertId)
  if (target) {
    target.status = 'acknowledged'
  }
  return target
}

export { alerts, refreshAlerts, acknowledgeAlert }
