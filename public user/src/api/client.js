// Public User API Client
// Handles all API calls to the Django backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Shelters endpoints (public - no auth needed)
export async function getShelters(page = 1) {
  return fetchAPI(`/shelters/?page=${page}`);
}

export async function getSheltersByRegion(regionId) {
  return fetchAPI(`/shelters/by_region/?region_id=${regionId}`);
}

export async function getSheltersByStatus(status) {
  return fetchAPI(`/shelters/by_status/?status=${status}`);
}

export async function getSheltersByLocation(city) {
  return fetchAPI(`/shelters/by_location/?city=${encodeURIComponent(city)}`);
}

// Earthquakes endpoints
export async function getEarthquakes(page = 1) {
  return fetchAPI(`/earthquakes/?page=${page}`);
}

export async function getRecentEarthquakes() {
  return fetchAPI('/earthquakes/recent/');
}

export async function getEarthquakesByRegion(regionId) {
  return fetchAPI(`/earthquakes/by_region/?region_id=${regionId}`);
}

export async function getEarthquakesByLocation(latitude, longitude, radiusKm = 50) {
  return fetchAPI(`/earthquakes/by_location/?latitude=${latitude}&longitude=${longitude}&radius=${radiusKm}`);
}

// Alerts endpoints
export async function getAlerts(page = 1) {
  return fetchAPI(`/alerts/?page=${page}`);
}

export async function getAlertsByStatus(status) {
  return fetchAPI(`/alerts/by_status/?status=${status}`);
}

// Safety Tips endpoints (public)
export async function getSafetyTips(page = 1) {
  return fetchAPI(`/safety-tips/?page=${page}`);
}

export async function getSafetyTipsByCategory(category) {
  return fetchAPI(`/safety-tips/by_category/?category=${category}`);
}

// Earthquake Predictions (AI-based analysis)
export async function getEarthquakePredictions() {
  return fetchAPI('/predictions/');
}

export async function getEarthquakeStatistics() {
  return fetchAPI('/statistics/');
}

// Regions endpoints
export async function getRegions() {
  return fetchAPI('/regions/');
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
