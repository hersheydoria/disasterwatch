// Public User API Client - Frontend Only (No Backend)
// Uses mock data for demonstration

// Mock data for regions and cities
const mockRegions = {
  'Agusan del Norte': {
    cities: ['Butuan City', 'Cabadbaran', 'Las Navas', 'Magallanes'],
    shelters: [
      { id: 1, name: 'Butuan City Multipurpose Hall', city: 'Butuan City', capacity: 500, status: 'operational' },
      { id: 2, name: 'Cabadbaran Evacuation Center', city: 'Cabadbaran', capacity: 300, status: 'operational' }
    ]
  },
  'Surigao del Sur': {
    cities: ['Tandag', 'Bislig', 'San Agustin', 'Carrascal'],
    shelters: [
      { id: 3, name: 'Tandag Evacuation Center', city: 'Tandag', capacity: 400, status: 'operational' },
      { id: 4, name: 'Bislig Community Center', city: 'Bislig', capacity: 250, status: 'operational' }
    ]
  },
  'Davao Oriental': {
    cities: ['Mati', 'Tagum', 'Lupon', 'Cateel'],
    shelters: [
      { id: 5, name: 'Mati Sports Complex', city: 'Mati', capacity: 600, status: 'operational' },
      { id: 6, name: 'Tagum Convention Center', city: 'Tagum', capacity: 450, status: 'operational' }
    ]
  },
  'Misamis Oriental': {
    cities: ['Cagayan de Oro', 'Gingoog', 'Initao', 'Iligan'],
    shelters: [
      { id: 7, name: 'CDO Sports Complex', city: 'Cagayan de Oro', capacity: 800, status: 'operational' },
      { id: 8, name: 'Gingoog Evacuation Center', city: 'Gingoog', capacity: 350, status: 'operational' }
    ]
  }
}

// Mock earthquake data
const mockEarthquakes = [
  { id: 1, magnitude: 5.2, depth: 12.5, location: 'Butuan', latitude: 8.97, longitude: 125.53, timestamp: '2024-01-15 08:30', intensity: 'Moderate' },
  { id: 2, magnitude: 4.8, depth: 15.0, location: 'Bislig', latitude: 8.75, longitude: 126.09, timestamp: '2024-01-14 14:20', intensity: 'Weak' },
  { id: 3, magnitude: 5.5, depth: 18.0, location: 'Tandag', latitude: 8.62, longitude: 126.35, timestamp: '2024-01-13 10:15', intensity: 'Moderate' }
]

// Shelters endpoints (mock data)
export async function getShelters(page = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allShelters = Object.values(mockRegions).flatMap(region => region.shelters)
      resolve({ results: allShelters })
    }, 100)
  })
}

export async function getSheltersByRegion(regionId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const shelters = mockRegions[regionId]?.shelters || []
      resolve({ results: shelters })
    }, 100)
  })
}

export async function getSheltersByStatus(status) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allShelters = Object.values(mockRegions).flatMap(region => region.shelters)
      const filtered = allShelters.filter(s => s.status === status)
      resolve({ results: filtered })
    }, 100)
  })
}

export async function getSheltersByLocation(city) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allShelters = Object.values(mockRegions).flatMap(region => region.shelters)
      const filtered = allShelters.filter(s => s.city.toLowerCase() === city.toLowerCase())
      resolve({ results: filtered })
    }, 100)
  })
}

// Earthquakes endpoints (mock data)
export async function getEarthquakes(page = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ results: mockEarthquakes })
    }, 100)
  })
}

export async function getRecentEarthquakes() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ results: mockEarthquakes.slice(0, 3) })
    }, 100)
  })
}

export async function getEarthquakesByRegion(regionId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ results: mockEarthquakes.slice(0, 2) })
    }, 100)
  })
}

export async function getEarthquakesByLocation(latitude, longitude, radiusKm = 50) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ results: mockEarthquakes })
    }, 100)
  })
}

// Alerts endpoints (mock data)
export async function getAlerts(page = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ results: [] })
    }, 100)
  })
}

export async function getAlertsByStatus(status) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ results: [] })
    }, 100)
  })
}

// Safety Tips endpoints (mock data)
export async function getSafetyTips(page = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ results: [] })
    }, 100)
  })
}

export async function getSafetyTipsByCategory(category) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ results: [] })
    }, 100)
  })
}

// Earthquake Predictions (mock data)
export async function getEarthquakePredictions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ results: [] })
    }, 100)
  })
}

export async function getEarthquakeStatistics() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalEarthquakes: mockEarthquakes.length,
        averageMagnitude: 5.17,
        highestMagnitude: 5.5,
        averageDepth: 15.17
      })
    }, 100)
  })
}

// Regions endpoints (mock data)
export async function getRegions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const regions = Object.keys(mockRegions).map(name => ({
        id: name,
        name: name,
        cities: mockRegions[name].cities
      }))
      resolve({ results: regions })
    }, 100)
  })
}

export default {
  getShelters,
  getSheltersByRegion,
  getSheltersByStatus,
  getSheltersByLocation,
  getEarthquakes,
  getRecentEarthquakes,
  getEarthquakesByRegion,
  getEarthquakesByLocation,
  getAlerts,
  getAlertsByStatus,
  getSafetyTips,
  getSafetyTipsByCategory,
  getEarthquakePredictions,
  getEarthquakeStatistics,
  getRegions
};
