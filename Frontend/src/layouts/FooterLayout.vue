<template>
  <!-- Remover q-footer y usar div normal -->
  <div class="footer-profesional">
    <!-- Sección Principal del Footer -->
    <div class="footer-main">
      <div class="footer-content">
        
        <!-- Columna 1: Branding y Descripción -->
        <div class="footer-section">
          <div class="footer-brand">
            <div class="brand-logo">
              <q-icon name="mdi-tooth" size="32px" color="white" />
              <span class="brand-name">KIRU</span>
            </div>
            <div class="brand-tagline">Odontología Especializada</div>
            <p class="footer-description">
              Tu sonrisa es nuestra prioridad. Ofrecemos tratamientos dentales 
              de calidad con tecnología de vanguardia y un equipo profesional.
            </p>
          </div>
          
          <!-- Redes Sociales -->
          <div class="social-links">
            <q-btn round flat color="white" icon="fab fa-facebook-f" class="social-btn" size="12px" />
            <q-btn round flat color="white" icon="fab fa-instagram" class="social-btn" size="12px" />
            <q-btn round flat color="white" icon="fab fa-whatsapp" class="social-btn" size="12px" />
            <q-btn round flat color="white" icon="fab fa-twitter" class="social-btn" size="12px" />
          </div>
        </div>

        <!-- Columna 2: Enlaces Rápidos -->
        <div class="footer-section">
          <h4 class="section-title">Enlaces Rápidos</h4>
          <div class="footer-links">
            <a href="#" class="footer-link">Inicio</a>
            <a href="#services" class="footer-link">Servicios</a>
            <a href="#about" class="footer-link">Nosotros</a>
            <a href="#branch" class="footer-link">Sucursales</a>
            <a href="#contact" class="footer-link">Contacto</a>
          </div>
        </div>

        <!-- Columna 3: Servicios -->
        <div class="footer-section">
          <h4 class="section-title">Nuestros Servicios</h4>
          <div class="footer-links">
            <a href="#services" class="footer-link">Ortodoncia</a>
            <a href="#services" class="footer-link">Blanqueamiento</a>
            <a href="#services" class="footer-link">Implantes</a>
            <a href="#services" class="footer-link">Limpieza Dental</a>
            <a href="#services" class="footer-link">Emergencias</a>
          </div>
        </div>

        <!-- Columna 4: Contacto -->
        <div class="footer-section">
          <h4 class="section-title">Contacto</h4>
          <div class="contact-info">
            <div class="contact-item">
              <q-icon name="mdi-phone" size="16px" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div class="contact-item">
              <q-icon name="mdi-email" size="16px" />
              <span>info@kiruodontologia.com</span>
            </div>
            <div class="contact-item">
              <q-icon name="mdi-clock" size="16px" />
              <span>Lun-Vie: 8:00 AM - 6:00 PM</span>
            </div>
            <div class="contact-item">
              <q-icon name="mdi-map-marker" size="16px" />
              <span>Av. Principal #123, Ciudad</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Sección Inferior del Footer -->
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <div class="copyright-content">
          <span>© 2025 KIRU Odontología. Todos los derechos reservados.</span>
        </div>
      </div>
    </div>
  </div>
</template>

