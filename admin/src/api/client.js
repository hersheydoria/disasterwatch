// Admin API Client
// Handles all API calls to the Django backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Get JWT token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Get auth headers
function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// Fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();

  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers }
    });

    // Handle 401 - token expired or invalid
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Unauthorized - please login again');
    }

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

// Authentication endpoints
export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Shelters endpoints
export async function getShelters(page = 1) {
  return fetchAPI(`/shelters/?page=${page}`);
}

export async function getShelterById(id) {
  return fetchAPI(`/shelters/${id}/`);
}

export async function getSheltersByRegion(regionId) {
  return fetchAPI(`/shelters/by_region/?region_id=${regionId}`);
}

export async function getSheltersByStatus(status) {
  return fetchAPI(`/shelters/by_status/?status=${status}`);
}

export async function createShelter(shelterData) {
  return fetchAPI('/shelters/', {
    method: 'POST',
    body: JSON.stringify(shelterData)
  });
}

export async function updateShelter(id, shelterData) {
  return fetchAPI(`/shelters/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(shelterData)
  });
}

export async function deleteShelter(id) {
  return fetchAPI(`/shelters/${id}/`, {
    method: 'DELETE'
  });
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

// Alerts endpoints
export async function getAlerts(page = 1) {
  return fetchAPI(`/alerts/?page=${page}`);
}

export async function getAlertsByStatus(status) {
  return fetchAPI(`/alerts/by_status/?status=${status}`);
}

export async function acknowledgeAlert(alertId) {
  return fetchAPI(`/alerts/${alertId}/acknowledge/`, {
    method: 'POST'
  });
}

// Evacuees endpoints
export async function getEvacuees(page = 1) {
  return fetchAPI(`/evacuees/?page=${page}`);
}

export async function getEvacueesByShelter(shelterId) {
  return fetchAPI(`/evacuees/by_shelter/?shelter_id=${shelterId}`);
}

export async function createEvacuee(evacueeData) {
  return fetchAPI('/evacuees/', {
    method: 'POST',
    body: JSON.stringify(evacueeData)
  });
}

// Reports endpoints
export async function getReports(page = 1) {
  return fetchAPI(`/reports/?page=${page}`);
}

export async function getReportsByShelter(shelterId) {
  return fetchAPI(`/reports/by_shelter/?shelter_id=${shelterId}`);
}

export async function createReport(reportData) {
  return fetchAPI('/reports/', {
    method: 'POST',
    body: JSON.stringify(reportData)
  });
}

// Safety Tips endpoints
export async function getSafetyTips(page = 1) {
  return fetchAPI(`/safety-tips/?page=${page}`);
}

export async function getSafetyTipsByCategory(category) {
  return fetchAPI(`/safety-tips/by_category/?category=${category}`);
}

// AI Recommendations endpoints
export async function getAIRecommendations(page = 1) {
  return fetchAPI(`/ai-recommendations/?page=${page}`);
}

export async function getAIRecommendationsByShelter(shelterId) {
  return fetchAPI(`/ai-recommendations/by_shelter/?shelter_id=${shelterId}`);
}

// Notifications endpoints
export async function getNotifications(page = 1) {
  return fetchAPI(`/notifications/?page=${page}`);
}

export async function getUnreadNotifications() {
  return fetchAPI('/notifications/unread/');
}

export async function markNotificationAsRead(notificationId) {
  return fetchAPI(`/notifications/${notificationId}/mark_as_read/`, {
    method: 'POST'
  });
}

// Regions endpoints
export async function getRegions() {
  return fetchAPI('/regions/');
}

// Users endpoints
export async function getUsers() {
  return fetchAPI('/users/');
}

export async function getUserById(id) {
  return fetchAPI(`/users/${id}/`);
}

export default {
  login,
  logout,
  getShelters,
  getShelterById,
  getSheltersByRegion,
  getSheltersByStatus,
  createShelter,
  updateShelter,
  deleteShelter,
  getEarthquakes,
  getRecentEarthquakes,
  getEarthquakesByRegion,
  getAlerts,
  getAlertsByStatus,
  acknowledgeAlert,
  getEvacuees,
  getEvacueesByShelter,
  createEvacuee,
  getReports,
  getReportsByShelter,
  createReport,
  getSafetyTips,
  getSafetyTipsByCategory,
  getAIRecommendations,
  getAIRecommendationsByShelter,
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  getRegions,
  getUsers,
  getUserById
};
