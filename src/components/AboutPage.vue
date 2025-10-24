<template>
  <div class="page-content about-page">
    <!-- Hero Section -->
    <section class="about-hero">
      <h1 class="about-hero-title">Our Mission: Keeping Communities Safe</h1>
      <p class="about-hero-subtitle">Empowering the Caraga Region through real-time disaster monitoring and emergency preparedness</p>
    </section>

    <!-- Why DisasterWatch Exists Section -->
    <section class="why-section">
      <div class="why-content">
        <div class="why-text">
          <h2>Why DisasterWatch Exists</h2>
          <p>The Caraga Region is among the most seismically active areas in the Philippines. With over 1.5 million residents, timely access to earthquake information and emergency resources is critical.</p>
          <p>DisasterWatch was developed to help residents, responders, and local authorities understand risks and prepare for disaster scenarios across the Caraga Region.</p>
        </div>
        <div class="why-features">
          <div class="feature-box">
            <div class="feature-icon">🎯</div>
            <div class="feature-label">Community Focus</div>
            <p>Built for residents, by understanding local needs</p>
          </div>
          <div class="feature-box">
            <div class="feature-icon">📊</div>
            <div class="feature-label">Data-Driven Insights</div>
            <p>Real-time monitoring and risk assessment</p>
          </div>
          <div class="feature-box">
            <div class="feature-icon">⚡</div>
            <div class="feature-label">Quick Access</div>
            <p>Information when you need it most</p>
          </div>
          <div class="feature-box">
            <div class="feature-icon">🛡️</div>
            <div class="feature-label">Easy-to-use</div>
            <p>Designed for everyone</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How DisasterWatch Works Section -->
    <section class="how-section">
      <h2>How DisasterWatch Works</h2>
      <p>Our system integrates real-time earthquake data and emergency resources to help communities stay informed and prepared for earthquakes in the Caraga Region.</p>
      
      <div class="how-grid">
        <div class="how-card">
          <div class="how-icon">📍</div>
          <h3>Data-Driven Monitoring</h3>
          <p>Monitor active fault lines, seismic zones, and earthquake trends. Huge seismic updates in real-time</p>
        </div>
        <div class="how-card">
          <div class="how-icon">🤖</div>
          <h3>AI Risk Assessment</h3>
          <p>Get AI-powered analysis of your specific area's seismic risk. AI-powered insights for better preparedness</p>
        </div>
        <div class="how-card">
          <div class="how-icon">👥</div>
          <h3>Preparedness & Safety Access</h3>
          <p>Access safety tips, preparedness resources, and emergency contact information specific to your area</p>
        </div>
      </div>
    </section>

    <!-- Critical Importance & Building Resilient Communities -->
    <section class="importance-section">
      <div class="importance-left">
        <div class="importance-card critical">
          <h3>The Critical Importance</h3>
          <div class="critical-content">
            <ul class="critical-list">
              <li>🚨 Early warning saves lives during earthquakes</li>
              <li>🗺️ Knowing nearby shelters and evacuation routes</li>
              <li>📱 Real-time communication during emergencies</li>
              <li>🏥 Access to medical facility information</li>
              <li>👨‍👩‍👧‍👦 Community preparedness and drills</li>
              <li>📊 Understanding your area's seismic risk</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="importance-right">
        <h3>Building Resilient Communities</h3>
        <p>Disaster preparedness isn't about reacting to emergencies—it's about building a culture of safety. By having access to information, resources, and tools, communities can:</p>
        <ul class="resilience-list">
          <li>Develop comprehensive evacuation plans</li>
          <li>Understand your building's seismic resilience</li>
          <li>Make informed decisions about your family's safety</li>
          <li>Build stronger community networks</li>
        </ul>
      </div>
    </section>

    <!-- Supported By Section -->
    <section class="supported-section">
      <h2>Supported By</h2>
      <p>DisasterWatch is built through collaboration with key organizations in disaster management and community safety</p>
      
      <div class="partners-grid">
        <div class="partner-badge">🏛️</div>
        <div class="partner-badge">⚠️</div>
        <div class="partner-badge">🚨</div>
        <div class="partner-badge">🏘️</div>
      </div>
    </section>
  </div>
</template>

<script setup>
defineEmits(['navigate'])
</script>

<style scoped>
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.about-page {
  background: white;
}

/* Hero Section */
.about-hero {
  background: linear-gradient(135deg, #FF7A00 0%, #FF9933 100%);
  color: white;
  text-align: center;
  padding: 4rem 2rem;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.about-hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.about-hero-subtitle {
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.6;
  opacity: 0.95;
}

/* Why DisasterWatch Exists Section */
.why-section {
  padding: 4rem 2rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.why-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.why-text h2 {
  font-size: 1.8rem;
  color: #333;
  margin: 0 0 1.5rem 0;
  font-weight: 700;
}

.why-text p {
  font-size: 1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.why-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.feature-box {
  background: linear-gradient(135deg, #FFF4E6 0%, #FFEBDE 100%);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid #FF7A00;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
  display: block;
}

.feature-label {
  font-size: 1rem;
  font-weight: 600;
  color: #FF7A00;
  margin-bottom: 0.5rem;
  display: block;
}

.feature-box p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

/* How DisasterWatch Works Section */
.how-section {
  padding: 4rem 2rem;
  background: #f9f9f9;
  text-align: center;
}

.how-section h2 {
  font-size: 2rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.how-section > p {
  font-size: 1rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.how-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.how-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
}

.how-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(255, 122, 0, 0.15);
}

.how-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.how-card h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.how-card p {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* Critical Importance & Building Resilient Communities Section */
.importance-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 4rem 2rem;
  background: white;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.importance-left {
  display: flex;
  align-items: center;
}

.importance-card.critical {
  background: #FF7A00;
  color: white;
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
}

.importance-card h3 {
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  font-weight: 700;
}

.critical-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.critical-list li {
  font-size: 0.95rem;
  line-height: 1.6;
}

.importance-right h3 {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.importance-right p {
  font-size: 1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.resilience-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resilience-list li {
  font-size: 0.95rem;
  color: #666;
  padding-left: 1.5rem;
  position: relative;
}

.resilience-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #FF7A00;
  font-weight: 700;
}

/* Supported By Section */
.supported-section {
  padding: 4rem 2rem;
  background: #f9f9f9;
  text-align: center;
}

.supported-section h2 {
  font-size: 2rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.supported-section > p {
  font-size: 1rem;
  color: #666;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.partner-badge {
  font-size: 3.5rem;
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.partner-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 122, 0, 0.15);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .why-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .why-features {
    grid-template-columns: 1fr 1fr;
  }

  .importance-section {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about-hero-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .about-hero {
    padding: 2.5rem 1.5rem;
    min-height: 200px;
  }

  .about-hero-title {
    font-size: 1.6rem;
    margin-bottom: 0.8rem;
  }

  .about-hero-subtitle {
    font-size: 1rem;
  }

  .why-section {
    padding: 2.5rem 1.5rem;
  }

  .why-text h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .why-text p {
    font-size: 0.95rem;
  }

  .why-features {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .feature-box {
    padding: 1.2rem;
  }

  .how-section {
    padding: 2.5rem 1.5rem;
  }

  .how-section h2 {
    font-size: 1.6rem;
  }

  .how-grid {
    gap: 1.5rem;
  }

  .importance-section {
    padding: 2.5rem 1.5rem;
  }

  .importance-card,
  .importance-right {
    padding: 0;
  }

  .importance-card h3,
  .importance-right h3 {
    font-size: 1.3rem;
  }

  .supported-section {
    padding: 2.5rem 1.5rem;
  }

  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .partner-badge {
    font-size: 2.5rem;
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .about-hero {
    padding: 2rem 1rem;
    min-height: 150px;
  }

  .about-hero-title {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }

  .about-hero-subtitle {
    font-size: 0.9rem;
  }

  .why-section {
    padding: 2rem 1rem;
  }

  .why-text h2 {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }

  .why-features {
    gap: 0.8rem;
  }

  .feature-box {
    padding: 1rem;
  }

  .feature-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .feature-label {
    font-size: 0.9rem;
  }

  .how-section {
    padding: 2rem 1rem;
  }

  .how-section h2 {
    font-size: 1.4rem;
  }

  .how-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .how-card {
    padding: 1.5rem;
  }

  .how-icon {
    font-size: 2.5rem;
    margin-bottom: 0.8rem;
  }

  .how-card h3 {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  .how-card p {
    font-size: 0.9rem;
  }

  .importance-section {
    padding: 2rem 1rem;
    gap: 1.5rem;
  }

  .importance-card,
  .importance-right h3 {
    font-size: 1.2rem;
  }

  .critical-list li,
  .resilience-list li {
    font-size: 0.9rem;
  }

  .supported-section {
    padding: 2rem 1rem;
  }

  .supported-section h2 {
    font-size: 1.4rem;
  }

  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .partner-badge {
    font-size: 2rem;
    padding: 1rem 0.8rem;
  }
}
</style>
