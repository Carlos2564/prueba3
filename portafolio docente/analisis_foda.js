// ===========================================
// FODA CAROUSEL FUNCTIONALITY
// ===========================================

document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  
  // Verificar si existe el carrusel en la página
  if (!carousel) {
    console.log('No carousel found on this page');
    return;
  }
  
  const items = carousel.querySelectorAll(".item");
  const dotsContainer = document.querySelector(".dots");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  
  // Verificar que tenemos items
  if (items.length === 0) {
    console.error('No carousel items found');
    return;
  }
  
  // Insert dots into the DOM
  items.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.dataset.index = index;
    dotsContainer.appendChild(dot);
  });
  
  const dots = document.querySelectorAll(".dot");
  
  // Function to show a specific item
  function showItem(index) {
    items.forEach((item, idx) => {
      item.classList.remove("active");
      dots[idx].classList.remove("active");
      if (idx === index) {
        item.classList.add("active");
        dots[idx].classList.add("active");
      }
    });
  }
  
  // Event listeners for buttons
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      const index = [...items].findIndex((item) =>
        item.classList.contains("active")
      );
      showItem((index - 1 + items.length) % items.length);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      const index = [...items].findIndex((item) =>
        item.classList.contains("active")
      );
      showItem((index + 1) % items.length);
    });
  }
  
  // Event listeners for dots
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.dataset.index);
      showItem(index);
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Solo funciona si estamos en la página del carrusel
    if (!carousel.offsetParent) return;
    
    const index = [...items].findIndex((item) =>
      item.classList.contains("active")
    );
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showItem((index - 1 + items.length) % items.length);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showItem((index + 1) % items.length);
    }
  });
  
  // Auto-play opcional (descomentado si lo deseas)
  /*
  let autoplayInterval;
  const autoplayDelay = 5000; // 5 segundos
  
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      const index = [...items].findIndex((item) =>
        item.classList.contains("active")
      );
      showItem((index + 1) % items.length);
    }, autoplayDelay);
  }
  
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }
  
  // Iniciar autoplay
  startAutoplay();
  
  // Pausar autoplay al hover
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  
  // Pausar autoplay al interactuar con controles
  prevButton.addEventListener('click', () => {
    stopAutoplay();
    setTimeout(startAutoplay, autoplayDelay);
  });
  
  nextButton.addEventListener('click', () => {
    stopAutoplay();
    setTimeout(startAutoplay, autoplayDelay);
  });
  
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      setTimeout(startAutoplay, autoplayDelay);
    });
  });
  */
  
  // Touch/Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      const index = [...items].findIndex((item) =>
        item.classList.contains("active")
      );
      
      if (diff > 0) {
        // Swipe left - next slide
        showItem((index + 1) % items.length);
      } else {
        // Swipe right - previous slide
        showItem((index - 1 + items.length) % items.length);
      }
    }
  }
  
  console.log('✅ Carrusel FODA inicializado');
  console.log(`📸 Total de slides: ${items.length}`);
});

// ===========================================
// ANIMATION ON SCROLL FOR FODA CARDS
// ===========================================
const fodaObserverOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

const fodaObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 100);
    }
  });
}, fodaObserverOptions);

// Observe FODA cards
document.querySelectorAll('.foda-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fodaObserver.observe(card);
});