<script setup>
import { ref, onMounted } from 'vue'
import logoImage from './assets/logo.png'
import LiveMap from './components/LiveMap.vue'
import HomePage from './components/HomePage.vue'
import AboutPage from './components/AboutPage.vue'
import ContactPage from './components/ContactPage.vue'
import SafetyRecommendations from './components/SafetyRecommendations.vue'
import Footer from './components/Footer.vue'

const currentPage = ref('home')
const activeNav = ref('home')
const navOpen = ref(false)

// Load saved page from localStorage on mount
onMounted(() => {
  const savedPage = localStorage.getItem('currentPage')
  if (savedPage) {
    currentPage.value = savedPage
    activeNav.value = savedPage
  }
})

const navigateTo = (section) => {
  activeNav.value = section
  currentPage.value = section
  navOpen.value = false
  // Save current page to localStorage
  localStorage.setItem('currentPage', section)
}

const toggleNav = () => {
  navOpen.value = !navOpen.value
}
</script>

<template>
  <div class="app-container">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-content">
        <div class="logo-section" @click="navigateTo('home')" style="cursor: pointer;">
          <img :src="logoImage" alt="DisasterWatch Logo" class="logo-image" />
          <h1 class="brand-name">DisasterWatch</h1>
        </div>
        <button class="hamburger-btn" @click="toggleNav">
          <span :class="{ open: navOpen }"></span>
          <span :class="{ open: navOpen }"></span>
          <span :class="{ open: navOpen }"></span>
        </button>
        <ul :class="['nav-links', { open: navOpen }]">
          <li>
            <a 
              href="#home" 
              :class="['nav-link', { active: currentPage === 'home' }]"
              @click.prevent="navigateTo('home')"
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              :class="['nav-link', { active: currentPage === 'about' }]"
              @click.prevent="navigateTo('about')"
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              :class="['nav-link', { active: currentPage === 'contact' }]"
              @click.prevent="navigateTo('contact')"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Home Page -->
    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />

    <!-- Live Map Page -->
    <LiveMap v-else-if="currentPage === 'map'" @navigate="navigateTo" />

    <!-- About Page -->
    <AboutPage v-else-if="currentPage === 'about'" @navigate="navigateTo" />

    <!-- Contact Page -->
    <ContactPage v-else-if="currentPage === 'contact'" @navigate="navigateTo" />

    <!-- Safety Recommendations Page -->
    <SafetyRecommendations v-else-if="currentPage === 'safety'" @navigate="navigateTo" />

    <!-- Footer -->
    <Footer @navigate="navigateTo" />
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navigation Bar */
.navbar {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(255, 122, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.logo-image {
  width: 50px;
  height: 50px;
  object-fit: contain;
  transition: transform 0.3s ease;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(255, 122, 0, 0.15);
}

.logo-section:hover .logo-image {
  transform: scale(1.1);
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FF7A00;
  margin: 0;
}

/* Hamburger Button */
.hamburger-btn {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  align-items: center;
}

.hamburger-btn span {
  width: 24px;
  height: 3px;
  background: #333;
  border-radius: 2px;
  transition: all 0.3s ease;
  display: block;
}

.hamburger-btn span.open:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.hamburger-btn span.open:nth-child(2) {
  opacity: 0;
}

.hamburger-btn span.open:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: #FF7A00;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #FF7A00;
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

/* Hero Section */
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

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255, 122, 0, 0.08) 0%, transparent 50%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 2rem;
  text-align: center;
}

.hero-headline {
  font-size: 3.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.2;
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
  justify-content: center;
  flex-wrap: wrap;
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

.btn-secondary {
  background-color: transparent;
  color: #FF7A00;
  border: 2px solid #FF7A00;
}

.btn-secondary:hover {
  background-color: #FF7A00;
  color: white;
  transform: translateY(-2px);
}

/* Features Section */
.features {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-top: 4px solid #FF7A00;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(255, 122, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Footer */
.footer {
  background-color: #1a2332;
  color: #b0b8c1;
  padding: 4rem 2rem 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h3 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  font-weight: 600;
}

.footer-section p {
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  color: #b0b8c1;
}

.footer-section ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-section li {
  margin-bottom: 0.8rem;
}

.footer-section a {
  color: #b0b8c1;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: #FF7A00;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.footer-logo-icon {
  width: 40px;
  height: 40px;
  background-color: #FF7A00;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.footer-logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.emergency-hotline {
  background: rgba(255, 122, 0, 0.1);
  border-left: 4px solid #FF7A00;
  padding: 1.5rem;
  border-radius: 8px;
}

.emergency-hotline h3 {
  margin-top: 0;
}

.emergency-number {
  font-size: 2rem;
  color: #FF7A00;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.emergency-text {
  font-size: 0.85rem;
  color: #b0b8c1;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.social-links a:hover {
  background-color: #FF7A00;
  color: white;
}

.footer-divider {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 2rem 0;
}

.footer-bottom {
  text-align: center;
  font-size: 0.85rem;
  color: #7a8390;
}

.footer p {
  margin: 0;
}

/* Page Content Container */
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* About Page */
.about-page {
  display: flex;
  flex-direction: column;
}

/* About Hero Section */
.about-hero {
  position: relative;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.about-hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #FF7A00 0%, #FF9933 50%, #fff 100%);
  opacity: 0.15;
  z-index: 0;
}

.about-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255, 122, 0, 0.08) 0%, transparent 50%);
  z-index: 1;
}

.about-hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  text-align: center;
}

.about-hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.about-hero-subtitle {
  font-size: 1.3rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* About Main Content */
.about-main {
  flex: 1;
  padding: 0;
}

.about-section {
  padding: 4rem 2rem;
  background: white;
}

.about-section.alternate {
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
}

.section-content {
  max-width: 1000px;
  margin: 0 auto;
}

.section-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  display: block;
  text-align: center;
}

.about-section h2 {
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.about-section p {
  font-size: 1.05rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.2rem;
}

/* Features List */
.features-list {
  list-style: none;
  margin: 2rem 0;
}

.features-list li {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.3rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 122, 0, 0.05) 0%, rgba(255, 153, 51, 0.05) 100%);
  border-radius: 8px;
  border-left: 4px solid #FF7A00;
}

.list-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.features-list span {
  font-size: 1rem;
  color: #555;
}

.features-list strong {
  color: #333;
}

/* Impact Cards */
.impact-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.impact-card {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #FF7A00 0%, #FF9933 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(255, 122, 0, 0.2);
}

.impact-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.impact-label {
  font-size: 0.95rem;
  opacity: 0.9;
}

/* Values Grid */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.value-card {
  padding: 2rem;
  background: white;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-top: 4px solid #FF7A00;
  transition: all 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(255, 122, 0, 0.15);
}

.value-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.value-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
}

.value-card p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Offerings Grid */
.offerings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.offering-item {
  padding: 2rem;
  background: white;
  border-radius: 12px;
  border-left: 5px solid #FF7A00;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.offering-item:hover {
  box-shadow: 0 6px 15px rgba(255, 122, 0, 0.15);
  transform: translateY(-3px);
}

.offering-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #FF7A00;
  margin-bottom: 0.8rem;
}

.offering-item p {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* Partners Grid */
.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.partner-item {
  padding: 2rem;
  background: white;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.partner-item:hover {
  border-color: #FF7A00;
  box-shadow: 0 6px 15px rgba(255, 122, 0, 0.2);
  transform: translateY(-3px);
}

.partner-badge {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.partner-item p {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  font-weight: 500;
  line-height: 1.5;
}

/* About CTA Section */
.about-cta {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #FF7A00 0%, #FF9933 100%);
  color: white;
  text-align: center;
}

.about-cta h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
}

.about-cta p {
  font-size: 1.05rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

/* Contact Page */
.contact-page {
  display: flex;
  flex-direction: column;
}

/* Contact Hero Section */
.contact-hero {
  position: relative;
  overflow: hidden;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
}

.contact-hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #FF7A00 0%, #FF9933 50%, #fff 100%);
  opacity: 0.15;
  z-index: 0;
}

.contact-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255, 122, 0, 0.08) 0%, transparent 50%);
  z-index: 1;
}

.contact-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  text-align: center;
}

.contact-hero-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.contact-hero-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* Contact Main Section */
.contact-main {
  flex: 1;
  padding: 4rem 2rem;
  background: white;
}

.contact-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

/* Contact Form Section */
.contact-form-section {
  display: flex;
  flex-direction: column;
}

.form-header h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-header p {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 2rem;
}

/* Contact Form */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  padding: 0.85rem 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #FF7A00;
  box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 150px;
}

/* Form Messages */
.success-message,
.error-message {
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.success-message {
  background: linear-gradient(135deg, #44AA44 0%, #66CC66 100%);
  color: white;
  text-align: center;
}

.success-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.success-message h3 {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.success-message p {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.95;
}

.error-message {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8787 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.error-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

/* Form Submit Button */
.form-submit {
  align-self: flex-start;
  margin-top: 0.5rem;
}

/* Contact Info Section */
.contact-info-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-header h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.info-header p {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1.5rem;
}

/* Contact Info Cards */
.contact-info-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.info-card {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  border-radius: 12px;
  border-left: 4px solid #FF7A00;
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 4px 12px rgba(255, 122, 0, 0.15);
  transform: translateX(5px);
}

.info-icon {
  font-size: 2rem;
  margin-bottom: 0.8rem;
  display: block;
}

.info-card h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.info-detail {
  font-size: 1rem;
  font-weight: 600;
  color: #FF7A00;
  margin: 0.3rem 0;
}

.info-subtext {
  font-size: 0.85rem;
  color: #999;
  margin: 0;
}

/* Mini Map */
.mini-map {
  margin-top: 1rem;
}

.map-container {
  width: 100%;
  height: 250px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e8f4f8 0%, #f0f8fb 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #FF7A00;
}

.map-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.map-placeholder p {
  font-size: 1rem;
  color: #333;
  margin: 0.3rem 0;
  font-weight: 500;
}

.map-coords {
  font-size: 0.85rem;
  color: #999;
}

/* Quick Links */
.quick-links {
  background: linear-gradient(135deg, #FF7A00 0%, #FF9933 100%);
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
}

.quick-links h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  margin-top: 0;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.quick-link-btn {
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.quick-link-btn:hover {
  background: white;
  color: #FF7A00;
}

/* Contact Resources Section */
.contact-resources {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
}

.resources-content {
  max-width: 1200px;
  margin: 0 auto;
}

.resources-content h2 {
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 3rem;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
}

.resource-item {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-top: 4px solid #FF7A00;
}

.resource-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(255, 122, 0, 0.15);
}

.resource-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.resource-item h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.8rem;
}

.resource-item p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* About & Contact Sections */
.about-section,
.contact-section {
  flex: 1;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
}

.about-container,
.contact-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.about-section h2,
.contact-section h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.about-container p,
.contact-container p {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Responsive Design for Contact Page */
@media (max-width: 1024px) {
  .contact-wrapper {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .contact-hero-title {
    font-size: 2rem;
  }

  .form-header h2,
  .info-header h2 {
    font-size: 1.5rem;
  }

  .resources-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .contact-main {
    padding: 2rem 1rem;
  }

  .contact-hero {
    min-height: 280px;
    padding: 2rem 1rem;
  }

  .contact-hero-title {
    font-size: 1.5rem;
  }

  .contact-hero-subtitle {
    font-size: 1rem;
  }

  .contact-wrapper {
    gap: 1.5rem;
  }

  .form-header h2,
  .info-header h2 {
    font-size: 1.3rem;
  }

  .form-header p,
  .info-header p {
    font-size: 0.9rem;
  }

  .form-group {
    gap: 0.3rem;
  }

  .form-input,
  .form-textarea {
    padding: 0.7rem 0.8rem;
    font-size: 0.95rem;
  }

  .contact-info-cards {
    grid-template-columns: 1fr;
  }

  .info-card {
    padding: 1.2rem;
  }

  .map-container {
    height: 200px;
  }

  .resources-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .quick-links {
    padding: 1.2rem;
  }

  .quick-link-btn {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
  }

  .resource-item {
    padding: 1.5rem;
  }

  .resource-icon {
    font-size: 2rem;
  }

  .resources-content h2 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .contact-main {
    padding: 1.5rem 1rem;
  }

  .contact-hero {
    min-height: 220px;
    padding: 1.5rem 1rem;
  }

  .contact-hero-title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .contact-hero-subtitle {
    font-size: 0.9rem;
  }

  .contact-wrapper {
    gap: 1rem;
  }

  .form-header h2,
  .info-header h2 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .form-header p,
  .info-header p {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .form-submit {
    width: 100%;
  }

  .form-input,
  .form-textarea {
    font-size: 16px; /* Prevents zoom on iOS */
  }

  .info-detail {
    font-size: 0.95rem;
  }

  .info-subtext {
    font-size: 0.8rem;
  }

  .map-container {
    height: 150px;
  }

  .map-icon {
    font-size: 2.5rem;
    margin-bottom: 0.3rem;
  }

  .map-placeholder p {
    font-size: 0.9rem;
  }

  .map-coords {
    font-size: 0.75rem;
  }

  .quick-links h3 {
    font-size: 1rem;
  }

  .quick-link-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }

  .resources-content h2 {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }

  .resource-item {
    padding: 1.2rem;
  }

  .resource-item h3 {
    font-size: 1rem;
  }

  .resource-item p {
    font-size: 0.85rem;
  }

  .resource-icon {
    font-size: 1.8rem;
  }

  .contact-resources {
    padding: 2rem 1rem;
  }
}

/* Responsive Design for About Page */
@media (max-width: 1024px) {
  .about-hero-title {
    font-size: 2.2rem;
  }

  .about-hero-subtitle {
    font-size: 1.1rem;
  }

  .values-grid,
  .offerings-grid,
  .impact-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .about-section {
    padding: 3rem 1.5rem;
  }

  .section-icon {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .about-hero {
    min-height: 300px;
    padding: 2rem 1rem;
  }

  .about-hero-title {
    font-size: 1.8rem;
  }

  .about-hero-subtitle {
    font-size: 1rem;
  }

  .about-section {
    padding: 2rem 1rem;
  }

  .about-section h2 {
    font-size: 1.8rem;
    margin-bottom: 1.2rem;
  }

  .about-section p {
    font-size: 0.95rem;
  }

  .features-list li {
    padding: 0.8rem;
    margin-bottom: 1rem;
  }

  .list-icon {
    font-size: 1.3rem;
  }

  .impact-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin: 1.5rem 0;
  }

  .impact-card {
    padding: 1.5rem;
  }

  .impact-number {
    font-size: 2rem;
  }

  .impact-label {
    font-size: 0.85rem;
  }

  .values-grid,
  .offerings-grid,
  .partners-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .value-card,
  .offering-item,
  .partner-item {
    padding: 1.5rem;
  }

  .value-icon {
    font-size: 2.5rem;
  }

  .partner-badge {
    font-size: 2rem;
  }

  .about-cta {
    padding: 2.5rem 1rem;
  }

  .about-cta h2 {
    font-size: 1.6rem;
  }

  .about-cta p {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .about-hero {
    min-height: 250px;
    padding: 1.5rem 1rem;
  }

  .about-hero-title {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
  }

  .about-hero-subtitle {
    font-size: 0.9rem;
  }

  .about-section {
    padding: 1.5rem 1rem;
  }

  .about-section h2 {
    font-size: 1.4rem;
  }

  .about-section p {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .section-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .features-list li {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0.8rem 1rem;
  }

  .impact-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 1rem 0;
  }

  .impact-card {
    padding: 1.2rem;
  }

  .impact-number {
    font-size: 1.8rem;
  }

  .impact-label {
    font-size: 0.8rem;
  }

  .value-card h3,
  .offering-title {
    font-size: 1rem;
  }

  .about-cta {
    padding: 2rem 1rem;
  }

  .about-cta h2 {
    font-size: 1.3rem;
  }

  .about-cta p {
    font-size: 0.85rem;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hamburger-btn {
    display: flex;
  }

  .nav-content {
    flex-direction: row;
    gap: 0;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    gap: 0;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .nav-links.open {
    max-height: 300px;
  }

  .nav-links li {
    border-bottom: 1px solid #f0f0f0;
  }

  .nav-links li:last-child {
    border-bottom: none;
  }

  .nav-link {
    display: block;
    padding: 1rem 2rem;
  }

  .nav-link::after {
    display: none;
  }

  .hero-headline {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .cta-buttons {
    gap: 1rem;
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
}

@media (max-width: 480px) {
  .brand-name {
    font-size: 1.2rem;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    gap: 0;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .nav-links.open {
    max-height: 250px;
  }

  .nav-links li {
    border-bottom: 1px solid #f0f0f0;
  }

  .nav-links li:last-child {
    border-bottom: none;
  }

  .nav-link {
    display: block;
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }

  .nav-link::after {
    display: none;
  }

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
}
</style>
