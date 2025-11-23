// ===========================================
// SUB NAVIGATION FUNCTIONALITY
// ===========================================

// DOM Elements
const subNavLinks = document.querySelectorAll('#sub-nav li');
const borderEffect = document.querySelector('.border-effect');

// Calculate border position based on screen width
function calculateBorderPosition(index) {
  const navWidth = document.querySelector('#sub-nav ul').offsetWidth;
  const tabCount = subNavLinks.length;
  const tabWidth = navWidth / tabCount;
  const centerOffset = (tabWidth - 60) / 2; // 60 is border width
  
  return (tabWidth * index) + centerOffset;
}

// Set active tab based on current page
function setActiveTab() {
  const currentPage = window.location.pathname.split('/').pop();
  
  subNavLinks.forEach((link, index) => {
    const href = link.querySelector('a').getAttribute('href');
    
    if (href === currentPage) {
      link.classList.add('active');
      const svg = link.querySelector('svg');
      if (svg) {
        svg.classList.add('active-fill');
      }
      
      // Set border position
      const position = calculateBorderPosition(index);
      borderEffect.style.left = `${position}px`;
    } else {
      link.classList.remove('active');
      const svg = link.querySelector('svg');
      if (svg) {
        svg.classList.remove('active-fill');
      }
    }
  });
}

// Recalculate border position on window resize
let resizeTimer;
function handleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const activeTab = document.querySelector('#sub-nav li.active');
    if (activeTab) {
      const index = Array.from(subNavLinks).indexOf(activeTab);
      const position = calculateBorderPosition(index);
      borderEffect.style.left = `${position}px`;
    }
  }, 250);
}

// Initialize everything
function initObjetivosPage() {
  setActiveTab();
  window.addEventListener('resize', handleResize);
  
  console.log('✅ Página de Objetivos inicializada');
}

// Execute on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initObjetivosPage);
} else {
  initObjetivosPage();
}

// ===========================================
// SMOOTH SCROLL ENHANCEMENT
// ===========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===========================================
// ANIMATION ON SCROLL
// ===========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all content sections
document.querySelectorAll('.content-section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});