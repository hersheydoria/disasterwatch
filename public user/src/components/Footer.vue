<script setup>
import logoImage from '../assets/logo.png'
defineEmits(['navigate'])
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- About Section -->
      <div class="footer-section">
        <div class="footer-logo">
          <img :src="logoImage" alt="DisasterWatch Logo" class="footer-logo-icon" />
          <h2 class="footer-logo-text">DisasterWatch</h2>
        </div>
        <p>Protecting communities in the Caraga Region through advanced disaster monitoring and emergency preparedness.</p>
      </div>

      <!-- Quick Links -->
      <div class="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#about" @click.prevent="$emit('navigate', 'about')">About Us</a></li>
          <li><a href="#map" @click.prevent="$emit('navigate', 'map')">Live Map</a></li>
          <li><a href="#contact" @click.prevent="$emit('navigate', 'contact')">Contact Us</a></li>
        </ul>
      </div>

      <!-- Support -->
      <div class="footer-section">
        <h3>Support</h3>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
        </ul>
      </div>

      <!-- Emergency Hotline -->
      <div class="footer-section">
        <div class="emergency-hotline">
          <h3>Emergency Hotline</h3>
          <div class="emergency-number">911</div>
          <p class="emergency-text">24/7 Emergency Response</p>
          <div class="social-links">
            <a href="#" title="Facebook">f</a>
            <a href="#" title="Twitter">𝕏</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Divider -->
    <div class="footer-divider"></div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <p>© 2025 DisasterWatch. All rights reserved. Keeping Caraga Region safe.</p>
    </div>
  </footer>
</template>

<style scoped>
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
  cursor: pointer;
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
  object-fit: contain;
  padding: 2px;
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
  color: white;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 600;
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
  margin: 0 0 1rem;
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
  text-decoration: none;
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

.footer-bottom p {
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer {
    padding: 2.5rem 1rem 1.5rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .footer-section h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .footer-section p {
    font-size: 0.85rem;
  }

  .emergency-hotline {
    padding: 1.2rem;
  }

  .emergency-number {
    font-size: 1.7rem;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 1.5rem 0.8rem 0.8rem;
  }

  .footer-content {
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .footer-logo {
    margin-bottom: 0.6rem;
    gap: 0.6rem;
  }

  .footer-logo-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
    border-radius: 6px;
  }

  .footer-logo-text {
    font-size: 1rem;
  }

  .footer-section h3 {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }

  .footer-section p {
    font-size: 0.75rem;
    line-height: 1.5;
  }

  .footer-section ul {
    list-style: none;
  }

  .footer-section li {
    margin-bottom: 0.6rem;
  }

  .social-links a {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .footer-bottom {
    font-size: 0.75rem;
  }
}
</style>
