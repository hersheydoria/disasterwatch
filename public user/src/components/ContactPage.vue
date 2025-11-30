<template>
  <div class="page-content contact-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <h1 class="contact-hero-title">Get in Touch with DisasterWatch</h1>
      <p class="contact-hero-subtitle">We're here to help. Questions? Support, queries, or feedback</p>
    </section>

    <!-- Main Contact Content -->
    <section class="contact-main">
      <div class="contact-grid">
        <!-- Contact Form -->
        <div class="contact-form-section">
          <div class="form-header">
            <h2>Send us a Message</h2>
          </div>

          <form @submit.prevent="submitContactForm" class="contact-form">
            <!-- Success Message -->
            <div v-if="formSubmitted" class="success-message">
              <div class="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3>Thank you!</h3>
              <p>Your message has been sent successfully. We'll be in touch soon.</p>
            </div>

            <!-- Error Message -->
            <div v-if="formError && !formSubmitted" class="error-message">
              <span class="error-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </span>
              {{ formError }}
            </div>

            <!-- Form Fields -->
            <div v-if="!formSubmitted" class="form-row">
              <div class="form-group">
                <input
                  v-model="form.fullName"
                  type="text"
                  class="form-input"
                  placeholder="Full Name"
                  @input="onFullNameInput"
                  required
                />
              </div>
              <div class="form-group">
                <input
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  placeholder="Email Address"
                  @input="onEmailInput"
                  required
                />
              </div>
            </div>

            <div v-if="!formSubmitted" class="form-group">
              <input
                v-model="form.subject"
                type="text"
                class="form-input"
                placeholder="Subject"
                @input="onSubjectInput"
                required
              />
            </div>

            <div v-if="!formSubmitted" class="form-group">
              <textarea
                v-model="form.message"
                class="form-textarea"
                placeholder="Message"
                rows="5"
                @input="onMessageInput"
                required
              ></textarea>
            </div>

            <button v-if="!formSubmitted" type="submit" class="btn btn-primary form-submit">
              Send Message
            </button>
          </form>
        </div>

        <!-- Contact Information -->
        <div class="contact-info-section">
          <div class="info-header">
            <h2>Contact Information</h2>
          </div>

          <!-- Contact Info Cards -->
          <div class="contact-info-cards">
            <!-- Email -->
            <div class="info-card">
              <div class="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3>Email</h3>
              <p class="info-detail">info@disasterwatch.ph</p>
              <p class="info-subtext">Support during business hours</p>
            </div>

            <!-- Phone -->
            <div class="info-card">
              <div class="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3>Phone Number</h3>
              <p class="info-detail">+63-85-225-0000</p>
              <p class="info-subtext">Mon - Fri, 8:00 AM - 5:00 PM</p>
            </div>

            <!-- Office -->
            <div class="info-card">
              <div class="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3>Office Location</h3>
              <p class="info-detail">Butuan City, Caraga</p>
              <p class="info-subtext">Regional Office</p>
            </div>

            <!-- Hours -->
            <div class="info-card">
              <div class="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Office Hours</h3>
              <p class="info-detail">Monday - Friday, 9 AM - 5 PM</p>
              <p class="info-subtext">Saturday - Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Mini Map Section -->
      <div class="location-section">
        <div class="map-container">
          <div class="map-placeholder">
            <img src="../assets/map.png" alt="Caraga Region Map" class="map-image" />
            <button class="btn btn-map-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Subscribe to Caraga Region
            </button>
          </div>
        </div>
        <p class="map-description">DisasterWatch serves the entire Caraga Region, providing real-time monitoring and emergency resources to protect our communities.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['navigate'])

const form = ref({
  fullName: '',
  email: '',
  subject: '',
  message: ''
})

const formSubmitted = ref(false)
const formError = ref('')

const offices = ref([
  { name: 'Butuan Central Office', city: 'Butuan City', phone: '+63-85-225-0000', email: 'butuan@disasterwatch.ph', hours: '8 AM - 5 PM' },
  { name: 'Surigao Branch', city: 'Surigao City', phone: '+63-86-235-1234', email: 'surigao@disasterwatch.ph', hours: '8 AM - 5 PM' },
  { name: 'Tandag Field Office', city: 'Tandag, Surigao del Sur', phone: '+63-86-211-5678', email: 'tandag@disasterwatch.ph', hours: '8 AM - 5 PM' }
])

const emergencyContacts = ref([
  { organization: 'National Emergency Hotline', phone: '911', available: '24/7' },
  { organization: 'Philippine Red Cross', phone: '143', available: '24/7' },
  { organization: 'PAGASA Weather Bureau', phone: '8-PAGASA (827-4272)', available: '24/7' },
  { organization: 'Caraga CDRRMO', phone: '+63-85-227-0123', available: '24/7' },
  { organization: 'Bureau of Fire Protection', phone: '143 (Fire) or 8-BFPHOTLINE', available: '24/7' }
])

const faqs = ref([
  { question: 'How often is the earthquake data updated?', answer: 'Our system updates earthquake data every 5 minutes from official sources like PAGASA and USGS.' },
  { question: 'Are the shelters list always accurate?', answer: 'We update shelter information regularly, but we recommend confirming with local authorities before evacuation.' },
  { question: 'Can I use DisasterWatch offline?', answer: 'The web version requires internet. Check back soon for our offline-capable mobile app.' },
  { question: 'How can I report a shelter issue?', answer: 'Use the contact form or call our office directly with details about the shelter and the issue.' },
  { question: 'Is my personal data safe?', answer: 'We follow strict data protection policies. Your information is only used for service improvement.' }
])

const submitContactForm = () => {
  // Validate form
  if (!form.value.fullName || !form.value.email || !form.value.subject || !form.value.message) {
    formError.value = 'Please fill out all fields'
    return
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    formError.value = 'Please enter a valid email address'
    return
  }

  // Success - show submitted data
  formError.value = ''
  formSubmitted.value = true
  
  // Log submitted data to console
  console.log('Form submitted with data:', {
    name: form.value.fullName,
    email: form.value.email,
    subject: form.value.subject,
    message: form.value.message,
    timestamp: new Date().toLocaleString()
  })
  
  // Reset form after 2 seconds
  setTimeout(() => {
    form.value = {
      fullName: '',
      email: '',
      subject: '',
      message: ''
    }
    formSubmitted.value = false
  }, 2000)
}

// Real-time listeners for form validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const onFullNameInput = (event) => {
  form.value.fullName = event.target.value
  console.log('Full Name entered:', form.value.fullName)
}

const onEmailInput = (event) => {
  form.value.email = event.target.value
  console.log('Email entered:', form.value.email, '- Valid:', validateEmail(form.value.email))
}

const onSubjectInput = (event) => {
  form.value.subject = event.target.value
  console.log('Subject entered:', form.value.subject)
}

const onMessageInput = (event) => {
  form.value.message = event.target.value
  console.log('Message entered - Length:', form.value.message.length, 'characters')
}
</script>

<style scoped>
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.contact-page {
  background: white;
}

/* Hero Section */
.contact-hero {
  background: linear-gradient(135deg, #FF7A00 0%, #FF9933 100%);
  color: white;
  text-align: center;
  padding: 2.2rem 1.5rem;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.contact-hero-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.contact-hero-subtitle {
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
  opacity: 0.95;
}

/* Contact Main Section */
.contact-main {
  padding: 2.5rem 1.5rem;
  background: white;
}

.contact-grid {
  max-width: 1100px;
  margin: 0 auto 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Contact Form Section */
.contact-form-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
}

.form-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 1.5rem 0;
  font-weight: 700;
}

/* Contact Form */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-input,
.form-textarea {
  padding: 0.9rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #999;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #FF7A00;
  box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
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
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  color: white;
}

.success-icon svg {
  width: 100%;
  height: 100%;
}

.success-message h3 {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  font-weight: 600;
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
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  color: white;
}

.error-icon svg {
  width: 100%;
  height: 100%;
}

/* Form Submit Button */
.form-submit {
  width: 100%;
}

/* Contact Info Section */
.contact-info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

/* Contact Info Cards */
.contact-info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.info-card {
  padding: 1.2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #FF7A00;
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 4px 12px rgba(255, 122, 0, 0.15);
}

.info-icon {
  width: 1.8rem;
  height: 1.8rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF7A00;
}

.info-icon svg {
  width: 100%;
  height: 100%;
}

.info-card h3 {
  font-size: 1rem;
  color: #333;
  margin: 0.5rem 0;
  font-weight: 600;
}

.info-detail {
  font-size: 0.95rem;
  font-weight: 600;
  color: #FF7A00;
  margin: 0.3rem 0;
}

.info-subtext {
  font-size: 0.85rem;
  color: #999;
  margin: 0;
}

/* Location Section */
.location-section {
  max-width: 1100px;
  margin: 0 auto;
  margin-top: 1.5rem;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-bottom: 1.5rem;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-map-link {
  position: absolute;
  bottom: 1.5rem;
  background: white;
  color: #333;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.btn-map-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  background: #f5f5f5;
}

.map-description {
  font-size: 0.95rem;
  color: #666;
  text-align: center;
  line-height: 1.6;
  margin: 0;
}

.inline-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

/* Buttons */
.btn {
  padding: 0.9rem 1.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #FF7A00;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 122, 0, 0.3);
}

.btn-primary:hover {
  background-color: #E56A00;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 122, 0, 0.4);
}

.btn-emergency {
  background: white;
  color: #E63946;
  font-weight: 700;
}

.btn-emergency:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #E63946;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .contact-wrapper {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .contact-hero-title {
    font-size: 1.8rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .contact-hero {
    padding: 2rem 1.5rem;
    min-height: 140px;
  }

  .contact-hero-title {
    font-size: 1.4rem;
    margin-bottom: 0.3rem;
  }

  .contact-hero-subtitle {
    font-size: 0.9rem;
  }

  .contact-main {
    padding: 2rem 1.5rem;
  }

  .contact-wrapper {
    gap: 1.5rem;
  }

  .contact-form-section {
    padding: 1.5rem;
  }

  .form-header h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .contact-form {
    gap: 0.8rem;
  }

  .form-input,
  .form-textarea {
    padding: 0.8rem 0.8rem;
    font-size: 0.9rem;
  }

  .info-header h2 {
    font-size: 1.3rem;
  }

  .contact-info-cards {
    gap: 1rem;
  }

  .info-card {
    padding: 1rem;
  }

  .map-container {
    height: 250px;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .contact-hero {
    padding: 1.5rem 1rem;
    min-height: 120px;
  }

  .contact-hero-title {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
  }

  .contact-hero-subtitle {
    font-size: 0.85rem;
  }

  .contact-main {
    padding: 1.5rem 1rem;
  }

  .contact-wrapper {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .contact-form-section {
    padding: 1.2rem;
  }

  .form-header h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .form-input,
  .form-textarea {
    font-size: 16px;
    padding: 0.8rem;
  }

  .form-submit {
    width: 100%;
    padding: 0.9rem 1.5rem;
  }

  .info-header h2 {
    font-size: 1.2rem;
  }

  .info-card {
    padding: 1rem;
  }

  .info-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .info-card h3 {
    font-size: 0.95rem;
  }

  .info-detail {
    font-size: 0.9rem;
  }

  .info-subtext {
    font-size: 0.8rem;
  }

  .map-container {
    height: 200px;
  }

  .btn-map-link {
    bottom: 1rem;
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
  }

  .map-description {
    font-size: 0.9rem;
  }
  
  .btn {
    width: 100%;
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
