<template>
  <div class="container">
    <header class="topbar">
      <h2>System Settings</h2>
    </header>

    <!-- Tab Navigation -->
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab" 
        :class="['tab', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tabLabels[tab] }}
      </button>
    </div>

    <!-- Account Settings Tab -->
    <div v-if="activeTab === 'account'" class="tab-content">
      <section class="settings-section">
        <h3>Account Settings</h3>

        <div class="settings-grid">
          <!-- Profile Picture -->
          <div class="profile-section">
            <h4>Profile Information</h4>
            <div class="profile-upload">
              <div class="avatar-large">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23ff6b1a' width='100' height='100'/%3E%3Ctext x='50' y='60' font-size='50' fill='white' text-anchor='middle' dominant-baseline='middle' font-weight='bold'%3EU%3C/text%3E%3C/svg%3E" alt="avatar" />
              </div>
              <div class="upload-info">
                <button class="btn-upload">Upload New Photo</button>
                <p class="upload-hint">JPG, PNG or GIF size max 2MB</p>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="User" value="User" />
            </div>

            <div class="form-group">
              <label>Role/Position</label>
              <input type="text" placeholder="Emergency Coordinator" value="Emergency Coordinator" />
            </div>

            <div class="form-group">
              <label>Email Address</label>
              <input type="email" value="user.user@disasterwatch.ph" />
            </div>

            <div class="form-group">
              <label>Contact Number</label>
              <input type="tel" placeholder="+63 917 123 4567" value="+63 917 123 4567" />
            </div>

            <div class="form-group">
              <label>Time Zone</label>
              <select>
                <option selected>Asia/Manila (GMT+8)</option>
                <option>UTC</option>
                <option>Asia/Bangkok (GMT+7)</option>
              </select>
            </div>

            <!-- Buttons -->
            <div class="form-actions">
              <button class="btn-save">Save Changes</button>
              <button class="btn-reset">Reset</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Notification Preferences Tab -->
    <div v-if="activeTab === 'notifications'" class="tab-content">
      <section class="settings-section">
        <h3>Notification Preferences</h3>

        <div class="notification-settings">
          <!-- Email Notifications -->
          <div class="notification-card">
            <div class="notification-card-header">
              <div class="notification-title">
                <svg class="icon email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <h4>Email Notifications</h4>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.email" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <p class="notification-card-desc">Get notified by email when new reports are generated or available</p>
          </div>

          <!-- SMS Notifications -->
          <div class="notification-card">
            <div class="notification-card-header">
              <div class="notification-title">
                <svg class="icon sms-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <h4>SMS Notifications</h4>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.sms" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <p class="notification-card-desc">SMS alerts for critical incidents. Receive urgent notifications via text message for critical issues</p>
          </div>

          <!-- Push Notifications -->
          <div class="notification-card">
            <div class="notification-card-header">
              <div class="notification-title">
                <svg class="icon push-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <h4>Push Notifications</h4>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationSettings.push" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <p class="notification-card-desc">Push notifications on dashboard. Show real-time notifications in your browser while using the dashboard</p>
          </div>

          <!-- Notification Frequency -->
          <div class="notification-card">
            <div class="notification-card-header">
              <div class="notification-title">
                <svg class="icon frequency-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="9"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <h4>Notification Frequency</h4>
              </div>
            </div>
            <p class="notification-card-desc">How often would you like to receive notifications?</p>
            <select v-model="notificationSettings.frequency" class="frequency-select">
              <option value="instant">Instant - Receive notifications immediately</option>
              <option value="hourly">Hourly - Receive notifications every hour</option>
              <option value="daily">Daily - Receive notifications once per day</option>
              <option value="weekly">Weekly - Receive notifications once per week</option>
            </select>
          </div>

          <!-- Test Notifications -->
          <div class="notification-card test-card">
            <h4>Test Your Settings</h4>
            <p class="test-desc">Send a test notification to verify your preferences are working correctly.</p>
            <button class="btn-test-notification">Send Test Notifications</button>
          </div>

          <!-- Save Settings -->
          <div class="notification-card save-card">
            <p class="save-desc">Save your notification preferences. Changes will be applied immediately after saving</p>
            <div class="save-actions">
              <button class="btn-cancel">Cancel</button>
              <button class="btn-save-notif">Save Changes</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- System Configuration Tab -->
    <div v-if="activeTab === 'system'" class="tab-content">
      <section class="settings-section">
        <div class="system-config-grid">
          <!-- Left Column: General Settings -->
          <div class="config-column">
            <div class="config-block">
              <div class="block-header">
                <svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24M1 12h6m6 0h6m-15.78 7.78l4.24-4.24m5.08 0l4.24 4.24"/>
                </svg>
                <div>
                  <h4>General Settings</h4>
                  <p class="block-desc">Basic system configuration</p>
                </div>
              </div>

              <div class="form-group">
                <label>System Name</label>
                <input type="text" value="DisasterWatch" />
              </div>

              <div class="form-group">
                <label>Default Language</label>
                <select>
                  <option selected>English</option>
                  <option>Filipino</option>
                  <option>Spanish</option>
                </select>
              </div>

              <div class="form-group">
                <label>Data Refresh Interval</label>
                <div class="input-with-hint">
                  <input type="number" value="15" min="1" max="60" />
                  <span class="hint-text">minutes</span>
                </div>
              </div>
            </div>

            <!-- Data Backup Section -->
            <div class="config-block backup-block">
              <div class="block-header">
                <svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                <div>
                  <h4>Data Backup</h4>
                  <p class="block-desc">Backup and restore system data</p>
                </div>
              </div>

              <div class="backup-buttons">
                <button class="btn-backup">Backup Now</button>
                <button class="btn-restore">Restore from Backup</button>
              </div>

              <p class="backup-info">Last backup: December 18, 2024 at 2:45 PM<br/>Automated backups run daily at 2:00 AM. Manual backups are recommended before major system updates.</p>
            </div>

            <!-- System Status -->
            <div class="config-block status-block">
              <div class="block-header">
                <svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <h4>System Status</h4>
                  <p class="block-desc">Current system health and performance</p>
                  <span class="status-indicator">All Systems Operational</span>
                </div>
              </div>

              <div class="status-metrics">
                <div class="metric">
                  <div class="metric-value">99.9%</div>
                  <div class="metric-label">Uptime</div>
                </div>
                <div class="metric">
                  <div class="metric-value">2.1s</div>
                  <div class="metric-label">Response Time</div>
                </div>
                <div class="metric">
                  <div class="metric-value">1,247</div>
                  <div class="metric-label">Active Users</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Map Configuration -->
          <div class="config-column">
            <div class="config-block map-config-block">
              <div class="block-header">
                <svg class="block-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                  <line x1="9" y1="3" x2="9" y2="18"/>
                  <line x1="15" y1="6" x2="15" y2="21"/>
                </svg>
                <div>
                  <h4>Map Configuration</h4>
                  <p class="block-desc">Map display and API settings</p>
                </div>
              </div>

              <div class="form-group">
                <label>Default View</label>
                <select>
                  <option selected>City</option>
                  <option>Province</option>
                  <option>Region</option>
                  <option>Country</option>
                </select>
              </div>

              <div class="form-group">
                <label>API Key</label>
                <input type="password" placeholder="Enter your map API key" />
              </div>

              <div class="map-status">
                <span class="status-badge success">Test Map Connection</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Security & Privacy Tab -->
    <div v-if="activeTab === 'security'" class="tab-content">
      <section class="settings-section">
        <div class="security-main">
          <!-- Change Password Section -->
          <div class="security-block">
            <div class="security-block-header">
              <svg class="security-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <h3>Change Password</h3>
            </div>

            <div class="form-group">
              <label>Current Password</label>
              <div class="password-input-wrapper">
                <input type="password" placeholder="Enter your password" />
                <button class="toggle-password-btn" type="button">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>New Password</label>
              <div class="password-input-wrapper">
                <input type="password" placeholder="Enter new password" />
                <button class="toggle-password-btn" type="button">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>Confirm New Password</label>
              <div class="password-input-wrapper">
                <input type="password" placeholder="Confirm new password" />
                <button class="toggle-password-btn" type="button">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>

            <button class="btn-update-password">Update Password</button>
          </div>

          <!-- Login Activity Section -->
          <div class="security-block">
            <div class="security-block-header">
              <svg class="security-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              <h3>Login Activity</h3>
              <span class="activity-filter">Last 30 days</span>
            </div>

            <table class="login-activity-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>IP Address</th>
                  <th>Device</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Jan 19, 2024</td>
                  <td>3:24 PM</td>
                  <td>192.168.1.105</td>
                  <td>
                    <div class="device-info">
                      <svg class="device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                      Chrome on Windows
                    </div>
                  </td>
                  <td><span class="status-badge current">Current Session</span></td>
                </tr>
                <tr>
                  <td>Jan 18, 2024</td>
                  <td>9:22 AM</td>
                  <td>192.168.1.105</td>
                  <td>
                    <div class="device-info">
                      <svg class="device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12.01" y2="18"/>
                      </svg>
                      Safari on iPhone
                    </div>
                  </td>
                  <td><span class="status-badge">Signed Out</span></td>
                </tr>
                <tr>
                  <td>Jan 13, 2024</td>
                  <td>8:16 PM</td>
                  <td>203.0.113.45</td>
                  <td>
                    <div class="device-info">
                      <svg class="device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12.01" y2="18"/>
                      </svg>
                      Firefox on macOS
                    </div>
                  </td>
                  <td><span class="status-badge">Signed Out</span></td>
                </tr>
                <tr>
                  <td>Jan 12, 2024</td>
                  <td>11:45 AM</td>
                  <td>192.168.1.105</td>
                  <td>
                    <div class="device-info">
                      <svg class="device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12.01" y2="18"/>
                      </svg>
                      Chrome on Android
                    </div>
                  </td>
                  <td><span class="status-badge">Signed Out</span></td>
                </tr>
              </tbody>
            </table>

            <div class="activity-warning">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <svg style="width: 20px; height: 20px; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <strong>Sign Out of All Devices</strong>
              </div>
              <p>This will sign you out of all sessions. Review the current one. You'll need to sign in again in other devices.</p>
              <button class="btn-sign-out-all">Sign Out of All Devices</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const activeTab = ref('account')

const tabs = ['account', 'notifications', 'system', 'security']

const tabLabels = {
  account: 'Account Settings',
  notifications: 'Notification Preferences',
  system: 'System Configuration',
  security: 'Security & Privacy'
}

const notificationSettings = reactive({
  email: true,
  sms: true,
  push: false,
  frequency: 'instant'
})
</script>

<style scoped>
.container {
  padding: 2rem;
  overflow-y: auto;
}

.topbar {
  margin-bottom: 2rem;
}

.topbar h2 {
  font-size: 24px;
  font-weight: 600;
  color: #222;
  margin: 0;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.tab {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: #7a7f84;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;
}

.tab:hover {
  color: #222;
}

.tab.active {
  color: #ff6b1a;
  border-bottom-color: #ff6b1a;
}

/* Tab Content */
.tab-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.settings-section {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.settings-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin: 0 0 1rem 0;
}

.section-desc {
  font-size: 13px;
  color: #7a7f84;
  margin: 0 0 1.5rem 0;
}

/* Profile Section */
.settings-grid {
  display: grid;
  gap: 2rem;
}

.profile-section {
  max-width: 600px;
}

.profile-upload {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-upload {
  background: #ff6b1a;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;
}

.btn-upload:hover {
  background: #e55a0a;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin: 0;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #222;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #ff6b1a;
  box-shadow: 0 0 0 3px rgba(255, 107, 26, 0.1);
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-save {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save:hover {
  background: #2563eb;
}

.btn-reset {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: #eee;
}

/* Notification Settings */
.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.notification-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.notification-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notification-title h4 {
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin: 0;
}

.icon {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon.email-icon,
.icon.sms-icon,
.icon.push-icon,
.icon.frequency-icon {
  width: 24px;
  height: 24px;
  color: #ff6b1a;
}

.notification-card-desc {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-flex;
  width: 50px;
  height: 28px;
  cursor: pointer;
}

.toggle-switch input {
  display: none;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ccc;
  border-radius: 14px;
  transition: background 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  top: 3px;
  left: 3px;
  transition: transform 0.3s;
}

.toggle-switch input:checked + .toggle-slider {
  background: #ff6b1a;
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(22px);
}

/* Frequency Select */
.frequency-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  margin-top: 0.75rem;
  background: #fff;
}

.frequency-select:focus {
  outline: none;
  border-color: #ff6b1a;
  box-shadow: 0 0 0 3px rgba(255, 107, 26, 0.1);
}

/* Test Card */
.test-card {
  background: #fff7f1;
  border-color: #ffe8d6;
}

.test-card h4 {
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin: 0 0 0.5rem 0;
}

.test-desc {
  font-size: 12px;
  color: #666;
  margin: 0 0 1rem 0;
}

.btn-test-notification {
  background: #ff6b1a;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-test-notification:hover {
  background: #e55a0a;
}

/* Save Card */
.save-card {
  background: #f5f5f5;
  border-color: #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.save-desc {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.save-actions {
  display: flex;
  gap: 1rem;
}

.btn-cancel {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #d0d0d0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #eee;
  border-color: #999;
}

.btn-save-notif {
  background: #ff6b1a;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save-notif:hover {
  background: #e55a0a;
}

/* Configuration Settings */
.system-config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.config-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.config-block {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.block-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.block-icon {
  font-size: 28px;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  color: #ff6b1a;
}

.block-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin: 0 0 0.25rem 0;
}

.block-desc {
  font-size: 12px;
  color: #7a7f84;
  margin: 0;
}

.status-indicator {
  display: inline-block;
  font-size: 12px;
  color: #22c55e;
  font-weight: 600;
  margin-top: 0.5rem;
}

/* Form Group */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #222;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #ff6b1a;
  box-shadow: 0 0 0 3px rgba(255, 107, 26, 0.1);
}

.input-with-hint {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.input-with-hint input {
  flex: 1;
}

.hint-text {
  font-size: 12px;
  color: #7a7f84;
  white-space: nowrap;
}

/* Backup Block */
.backup-block {
  background: #f9f9f9;
}

.backup-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-backup {
  flex: 1;
  background: #e8f0ff;
  color: #3b82f6;
  border: 1px solid #cfe2ff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-backup:hover {
  background: #d6e4ff;
  border-color: #b8d4ff;
}

.btn-restore {
  flex: 1;
  background: #fff7f1;
  color: #ff6b1a;
  border: 1px solid #ffe8d6;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-restore:hover {
  background: #ffeedc;
  border-color: #ffd6ad;
}

.backup-info {
  font-size: 12px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Status Block */
.status-block {
  background: #f0fdf4;
}

.status-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.metric {
  text-align: center;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #dcfce7;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #22c55e;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 12px;
  color: #7a7f84;
  font-weight: 500;
}

/* Map Configuration Block */
.map-config-block {
  background: #f0f4ff;
}

.map-status {
  margin-top: 1.5rem;
}

.status-badge {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.status-badge.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.status-badge.success:hover {
  background: #a7f3d0;
  border-color: #6ee7b7;
}

/* Security Settings */
.security-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.security-block {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.security-block-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.security-icon {
  font-size: 24px;
  width: 24px;
  height: 24px;
  color: #ff6b1a;
}

.security-block-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin: 0;
}

.activity-filter {
  margin-left: auto;
  font-size: 12px;
  color: #7a7f84;
  font-weight: 500;
}

/* Password Input Wrapper */
.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
}

.password-input-wrapper input:focus {
  outline: none;
  border-color: #ff6b1a;
  box-shadow: 0 0 0 3px rgba(255, 107, 26, 0.1);
}

.toggle-password-btn {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.6;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #666;
}

.toggle-password-btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

.toggle-password-btn:hover {
  opacity: 1;
}

.btn-update-password {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;
}

.btn-update-password:hover {
  background: #2563eb;
}

/* Login Activity Table */
.login-activity-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-bottom: 1.5rem;
}

.login-activity-table thead {
  border-bottom: 2px solid #f0f0f0;
}

.login-activity-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: #555;
  background: #fafafa;
  font-size: 12px;
}

.login-activity-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.login-activity-table tbody tr:hover {
  background: #fafafa;
}

.device-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.device-icon {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  color: #666;
}

.status-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: #e8e8e8;
  color: #555;
}

.status-badge.current {
  background: #d1fae5;
  color: #065f46;
}

/* Activity Warning */
.activity-warning {
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1.5rem;
}

.activity-warning strong {
  display: block;
  font-size: 13px;
  color: #7f1d1d;
  margin-bottom: 0.5rem;
}

.activity-warning p {
  font-size: 12px;
  color: #991b1b;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.btn-sign-out-all {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-sign-out-all:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .topbar h2 {
    font-size: 20px;
  }

  .tabs {
    gap: 0;
    overflow-x: auto;
  }

  .tab {
    padding: 1rem 1rem;
    white-space: nowrap;
  }

  .settings-section {
    padding: 1.5rem;
  }

  .profile-upload {
    flex-direction: column;
    align-items: flex-start;
  }

  .config-item select {
    max-width: 100%;
  }

  .radio-group {
    flex-direction: column;
    gap: 1rem;
  }

  .system-config-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .status-metrics {
    grid-template-columns: 1fr;
  }

  .save-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .save-actions {
    width: 100%;
    flex-direction: column;
  }

  .save-actions button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0.75rem;
  }

  .topbar h2 {
    font-size: 18px;
  }

  .tabs {
    gap: 0;
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }

  .tab {
    padding: 0.75rem 1rem;
    font-size: 13px;
  }

  .settings-section {
    padding: 1rem;
  }

  .settings-section h3 {
    font-size: 16px;
  }

  .profile-upload {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .avatar-large {
    width: 80px;
    height: 80px;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group input,
  .form-group select {
    font-size: 16px;
    padding: 10px;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-actions button {
    width: 100%;
  }

  .notification-card {
    padding: 1rem;
  }

  .notification-card-header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .notification-title {
    gap: 0.75rem;
  }

  .icon {
    width: 20px;
    height: 20px;
  }

  .save-card {
    flex-direction: column;
  }

  .save-actions {
    width: 100%;
    flex-direction: column;
  }

  .save-actions button {
    width: 100%;
  }

  .system-config-grid {
    grid-template-columns: 1fr;
  }

  .config-block {
    padding: 1rem;
  }

  .config-block h4 {
    font-size: 14px;
  }

  .status-metrics {
    grid-template-columns: 1fr;
  }

  .security-block {
    padding: 1rem;
  }

  .login-activity-table {
    font-size: 11px;
  }

  .login-activity-table thead {
    display: none;
  }

  .login-activity-table tbody,
  .login-activity-table tr,
  .login-activity-table td {
    display: block;
    width: 100%;
  }

  .login-activity-table tr {
    margin-bottom: 10px;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    padding: 8px;
  }

  .login-activity-table td {
    padding: 6px 0;
    border: none;
  }

  .login-activity-table td:before {
    content: attr(data-label);
    font-weight: 600;
    display: inline-block;
    width: 35%;
    color: #666;
  }
}
</style>
