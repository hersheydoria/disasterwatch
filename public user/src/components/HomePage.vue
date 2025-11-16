<template>
  <div class="page-content">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background"></div>
      <img src="../assets/map.png" alt="Map background" class="map-background" />
      <div class="hero-content">
        <div class="hero-text">
          <h2 class="hero-headline">Stay Informed.<br><span class="highlight">Stay Safe.</span></h2>
          <p class="hero-description">
            Monitor earthquake-prone areas and access real-time evacuation information for the Caraga Region, Philippines. Your safety is our priority.
          </p>
          <div class="cta-buttons">
            <button class="btn btn-primary" @click="$emit('navigate', 'map')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                <line x1="8" y1="2" x2="8" y2="18"/>
                <line x1="16" y1="6" x2="16" y2="22"/>
              </svg>
              View Live Map
            </button>
          </div>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">24/7</div>
              <div class="stat-label">Monitoring</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">5</div>
              <div class="stat-label">Provinces</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">150+</div>
              <div class="stat-label">Shelters</div>
            </div>
          </div>
        </div>
        <div class="live-status-box">
          <div class="status-header">
            <span class="status-text">Live Status</span>
            <span class="status-badge">Active</span>
          </div>
          <div class="status-content">
            <div class="status-item">
              <div class="status-location">
                <span class="status-indicator safe"></span>
                <span class="location-name">Agusan del Norte</span>
              </div>
              <span class="status-label safe">Safe</span>
            </div>
            <div class="status-item">
              <div class="status-location">
                <span class="status-indicator watch"></span>
                <span class="location-name">Surigao del Sur</span>
              </div>
              <span class="status-label watch">Watch</span>
            </div>
            <div class="status-item">
              <div class="status-location">
                <span class="status-indicator safe"></span>
                <span class="location-name">Dinagat Islands</span>
              </div>
              <span class="status-label safe">Safe</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="features-header">
        <h2>Comprehensive Disaster Monitoring</h2>
        <p>Advanced technology and real-time data to keep Caraga Region communities safe and informed.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </div>
          <h3>AI Risk Analysis</h3>
          <p>Advanced data models evaluate historical and geological patterns to identify earthquake-prone zones and categorize them by risk level.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <h3>Emergency Shelters</h3>
          <p>Comprehensive database of emergency shelters with capacity and resource information.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="10" r="3"/>
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/>
            </svg>
          </div>
          <h3>Evacuation Routes</h3>
          <p>Detailed evacuation plans and safe routes to designated shelters and assembly points.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3>Community Preparedness</h3>
          <p>Designed to inform and empower residents, DisasterWatch promotes proactive safety awareness through clear, data-based insights.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['navigate'])

const recentEarthquakes = ref([
  { id: 1, location: 'Butuan City', magnitude: 4.5, depth: 12, time: '2 hours ago', status: 'Safe' },
  { id: 2, location: 'Surigao City', magnitude: 3.8, depth: 15, time: '5 hours ago', status: 'Safe' },
  { id: 3, location: 'Tandag', magnitude: 5.2, depth: 18, time: '1 day ago', status: 'Monitored' }
])

const shelterStats = ref({
  totalShelters: 150,
  activeShelters: 142,
  capacity: 25000,
  occupied: 340
})

const regions = ref([
  { name: 'Agusan del Norte', status: 'Safe', lastEQ: '3 hours ago' },
  { name: 'Surigao del Sur', status: 'Watch', lastEQ: '1 hour ago' },
  { name: 'Dinagat Islands', status: 'Safe', lastEQ: '6 hours ago' },
  { name: 'Misamis Oriental', status: 'Safe', lastEQ: '12 hours ago' },
  { name: 'Davao Oriental', status: 'Safe', lastEQ: '2 days ago' }
])
</script>

<style scoped>
/* Hero Section */
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hero {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  min-height: 600px;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #FF7A00 0%, #FF9933 50%, #fff 100%);
  opacity: 0.15;
  z-index: 0;
}

.map-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.1;
  z-index: 1;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255, 122, 0, 0.08) 0%, transparent 50%);
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  max-width: 1200px;
  width: 100%;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.hero-text {
  flex: 1;
}

.hero-headline {
  font-size: 3.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-headline .highlight {
  color: #FF7A00;
}

.hero-description {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.stats {
  display: flex;
  gap: 3rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: left;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #FF7A00;
  line-height: 1;
  margin-bottom: 0.3rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* Live Status Box */
.live-status-box {
  flex: 0 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  min-width: 320px;
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.status-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.status-badge {
  background-color: #E8F5E9;
  color: #44AA44;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background-color: #fafafa;
  border-radius: 8px;
}

.status-location {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.safe {
  background-color: #44AA44;
}

.status-indicator.watch {
  background-color: #FFC107;
}

.status-indicator.danger {
  background-color: #F44336;
}

.location-name {
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}

.status-label {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.25rem 0.7rem;
  border-radius: 12px;
}

.status-label.safe {
  background-color: #E8F5E9;
  color: #44AA44;
}

.status-label.watch {
  background-color: #FFF9E6;
  color: #F57C00;
}

.status-label.danger {
  background-color: #FFEBEE;
  color: #F44336;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
}

.btn-primary {
  background-color: #FF7A00;
  color: white;
  box-shadow: 0 4px 15px rgba(255, 122, 0, 0.3);
}

.btn-primary:hover {
  background-color: #E56A00;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 122, 0, 0.4);
}

/* Features Section */
.features {
  padding: 5rem 2rem;
  background-color: #fafafa;
}

.features-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
}

.features-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.features-header p {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.feature-card {
  background-color: white;
  padding: 2.5rem;
  border-radius: 16px;
  text-align: left;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.feature-icon-box {
  width: 60px;
  height: 60px;
  background-color: #FF7A00;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.feature-icon-box svg {
  width: 30px;
  height: 30px;
  color: white;
}

.feature-card h3 {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
}

.feature-card p {
  color: #666;
  line-height: 1.7;
  font-size: 1rem;
}

/* Footer */
.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: auto;
}

.footer p {
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .hero-text {
    flex: 1;
  }

  .stats {
    justify-content: center;
  }

  .live-status-box {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .hero-headline {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .cta-buttons {
    gap: 1rem;
    justify-content: center;
  }

  .btn {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    min-height: 500px;
  }

  .live-status-box {
    min-width: auto;
    padding: 1.5rem;
  }

  .stats {
    gap: 2rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-headline {
    font-size: 1.5rem;
  }

  .hero-description {
    font-size: 0.9rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .hero {
    min-height: 400px;
  }

  .stats {
    gap: 1.5rem;
  }
}
</style>