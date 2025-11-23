// ===========================================
// DOM ELEMENTS
// ===========================================
const app = document.getElementById('app');
const signInButton = document.getElementById('sign-in-button');
const signOutButton = document.getElementById('sign-out-button');
const timeElements = document.querySelectorAll('.time');
const background = document.getElementById('app-background');

// ===========================================
// APP STATES
// ===========================================
const AppState = {
  LoggedOut: 'logged-out',
  LoggingIn: 'logging-in',
  VerifyingLogIn: 'verifying-log-in',
  LoggedIn: 'logged-in'
};

// ===========================================
// TIME FUNCTIONS
// ===========================================
function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const h = hours % 12 === 0 ? 12 : hours % 12;
  const m = minutes < 10 ? `0${minutes}` : minutes;
  return `${h}:${m}`;
}

function updateTime() {
  const now = new Date();
  const timeString = formatTime(now);
  timeElements.forEach(el => {
    el.textContent = timeString;
  });
}

// ===========================================
// STATE MANAGEMENT
// ===========================================
function setState(state) {
  Object.values(AppState).forEach(s => app.classList.remove(s));
  app.classList.add(state);
}

function handleSignIn() {
  setState(AppState.LoggingIn);
  
  setTimeout(() => {
    setState(AppState.VerifyingLogIn);
    
    setTimeout(() => {
      setState(AppState.LoggedIn);
      
      // Scroll suave al contenido después de login
      setTimeout(() => {
        window.scrollTo({
          top: document.getElementById('app-menu-content-wrapper').offsetTop - 20,
          behavior: 'smooth'
        });
      }, 300);
    }, 1000);
  }, 500);
}

function handleSignOut() {
  setState(AppState.LoggedOut);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===========================================
// BACKGROUND CLICK
// ===========================================
function setupBackgroundClick() {
  background.addEventListener('click', () => {
    if (app.classList.contains(AppState.LoggedOut)) {
      handleSignIn();
    }
  });
}

// ===========================================
// LAZY LOADING DE IMÁGENES
// ===========================================
function setupLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ===========================================
// ANIMACIÓN DE SECCIONES AL SCROLL
// ===========================================
function setupScrollAnimations() {
  const sections = document.querySelectorAll('.content-section');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
  });
}

// ===========================================
// SMOOTH SCROLL PARA NAVEGACIÓN
// ===========================================
function setupSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-item');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Si es un enlace a otra página, dejar que funcione normalmente
      if (href.includes('.html')) {
        return;
      }
      
      // Si es un ancla en la misma página
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href;
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const offset = 100;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// ===========================================
// DETECCIÓN DE DISPOSITIVO
// ===========================================
function detectDevice() {
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
  
  document.body.classList.toggle('mobile', isMobile);
  document.body.classList.toggle('tablet', isTablet);
  document.body.classList.toggle('desktop', !isMobile && !isTablet);
}

// ===========================================
// OPTIMIZACIÓN DE SCROLL
// ===========================================
let ticking = false;

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // Aquí puedes agregar efectos de parallax u otros efectos de scroll
      ticking = false;
    });
    ticking = true;
  }
}

// ===========================================
// MANEJO DE RESIZE
// ===========================================
let resizeTimeout;

function onResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    detectDevice();
  }, 250);
}

// ===========================================
// ACCESSIBILITY - KEYBOARD NAVIGATION
// ===========================================
function setupAccessibility() {
  // Navegación con teclado para botones
  const buttons = document.querySelectorAll('button, .nav-item');
  
  buttons.forEach(button => {
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });
  
  // Trap focus en modales si se implementan en el futuro
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && app.classList.contains(AppState.LoggedIn)) {
      handleSignOut();
    }
  });
}

// ===========================================
// PERFORMANCE OPTIMIZATION
// ===========================================
function optimizePerformance() {
  // Reducir motion para usuarios que lo prefieran
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01s');
  }
  
  // Añadir will-change a elementos animados
  const animatedElements = document.querySelectorAll('.glass-morphism, .clear-button');
  animatedElements.forEach(el => {
    el.style.willChange = 'transform, opacity';
  });
}

// ===========================================
// ERROR HANDLING
// ===========================================
function setupErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('Error detectado:', e.error);
    // Aquí puedes agregar lógica para mostrar mensajes de error al usuario
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada:', e.reason);
  });
}

// ===========================================
// LOCAL STORAGE - GUARDAR ESTADO
// ===========================================
function saveState(state) {
  try {
    localStorage.setItem('portfolioState', state);
  } catch (e) {
    console.warn('No se pudo guardar el estado:', e);
  }
}

function loadState() {
  try {
    const savedState = localStorage.getItem('portfolioState');
    if (savedState === AppState.LoggedIn) {
      // Auto-login si el usuario estaba logueado
      setTimeout(() => handleSignIn(), 500);
    }
  } catch (e) {
    console.warn('No se pudo cargar el estado:', e);
  }
}

// ===========================================
// INITIALIZATION
// ===========================================
function init() {
  // Update time
  updateTime();
  setInterval(updateTime, 1000);
  
  // Event listeners principales
  signInButton.addEventListener('click', () => {
    handleSignIn();
    saveState(AppState.LoggedIn);
  });
  
  signOutButton.addEventListener('click', () => {
    handleSignOut();
    saveState(AppState.LoggedOut);
  });
  
  // Setup features
  setupBackgroundClick();
  setupSmoothScroll();
  setupScrollAnimations();
  setupLazyLoading();
  setupAccessibility();
  optimizePerformance();
  setupErrorHandling();
  
  // Detección de dispositivo
  detectDevice();
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Cargar estado guardado
  loadState();
  
  console.log('✅ Portafolio inicializado correctamente');
  console.log('📱 Dispositivo detectado:', {
    mobile: window.innerWidth <= 768,
    tablet: window.innerWidth > 768 && window.innerWidth <= 1024,
    desktop: window.innerWidth > 1024
  });
}

// ===========================================
// EXECUTE ON LOAD
// ===========================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ===========================================
// SERVICE WORKER (Opcional - para PWA)
// ===========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Descomentar cuando tengas un service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(reg => console.log('✅ Service Worker registrado'))
    //   .catch(err => console.log('❌ Error al registrar SW:', err));
  });
}