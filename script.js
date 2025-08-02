/* ==========================================
   FASHION PHOTOGRAPHY WEBSITE INTERACTIONS
   ==========================================
   
   This JavaScript file handles all interactive elements:
   - Scroll-triggered animations for content sections
   - Advanced ink spread effects on hero images
   - Dynamic mouse tracking for color reveal
   - Animated ink droplet generation
   - Responsive event handling
   
   Key Features:
   - Intersection Observer for performance
   - Real-time mouse coordinate tracking
   - Boundary detection for ink effects
   - CSS clip-path manipulation
   - Dynamic element creation
   ========================================== */

// Initialize all interactions when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  
  /* ======================
     SCROLL ANIMATION SYSTEM
     ======================
     
     Uses Intersection Observer API for performance-optimized
     scroll animations. Excludes hero images to prevent
     conflicts with ink spread effects.
     ====================== */
  
  // Select all elements marked for scroll animation (excluding hero images)
  const scrollElements = document.querySelectorAll(
    ".scroll-element:not(.hero-img)"
  );
  
  // Add photography service cards to scroll animations
  const photoCards = document.querySelectorAll('.card1, .card2, .card3, .card4');
  
  // Add major sections for enhanced animations
  const majorSections = document.querySelectorAll(
    '.featured-work, .brand-story, .testimonials, .process-section, .cta-section'
  );
  
  const allScrollElements = [...scrollElements, ...photoCards, ...majorSections];

  // Intersection Observer for dynamic scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        const element = entry.target;

        if (entry.isIntersecting) {
          // Element entering viewport - trigger entrance animation
          
          // Special handling for photography cards with staggered delays
          if (element.classList.contains('card1') || 
              element.classList.contains('card2') || 
              element.classList.contains('card3') || 
              element.classList.contains('card4')) {
            
            const cardDelays = {
              'card1': 100,
              'card2': 300,
              'card3': 500,
              'card4': 700
            };
            
            const cardClass = Array.from(element.classList).find(cls => 
              cls.includes('card') && cls.length <= 5
            );
            const delay = cardDelays[cardClass] || 0;
            
            setTimeout(() => {
              element.classList.add("animate-in");
              element.classList.remove("animate-out");
            }, delay);
            
          } else if (element.classList.contains('featured-work') || 
                     element.classList.contains('brand-story') || 
                     element.classList.contains('testimonials') || 
                     element.classList.contains('process-section') || 
                     element.classList.contains('cta-section')) {
            
            // Major sections with enhanced animations
            const sectionDelays = {
              'brand-story': 200,
              'featured-work': 150,
              'testimonials': 100,
              'process-section': 100,
              'cta-section': 50
            };
            
            const sectionClass = Array.from(element.classList).find(cls => 
              sectionDelays.hasOwnProperty(cls)
            );
            const delay = sectionDelays[sectionClass] || 100;
            
            setTimeout(() => {
              element.classList.add("animate-in");
              element.classList.remove("animate-out");
            }, delay);
            
          } else {
            // Regular scroll elements
            const customDelay = element.getAttribute("data-delay");
            const delay = customDelay ? parseInt(customDelay) : index * 150; // Staggered timing

            setTimeout(() => {
              element.classList.add("animate-in");
              element.classList.remove("animate-out");

              // Reset any inline styles for clean animation
              element.style.transform = "";
              element.style.opacity = "";
            }, delay);
          }
          
        } else {
          // Element leaving viewport - handle exit animations
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (rect.bottom < 0) {
            // Element scrolled past the top of viewport
            element.classList.add("animate-out");
            element.classList.remove("animate-in");
          } else if (rect.top > windowHeight) {
            // Element scrolled past the bottom of viewport
            element.classList.remove("animate-in");
            element.classList.remove("animate-out");
            
            // Reset to initial state for next appearance
            setTimeout(() => {
              element.style.transform = "";
              element.style.opacity = "";
            }, 300);
          }
        }
      });
    },
    {
      threshold: 0.2, // Trigger when 20% of element is visible
      rootMargin: "0px 0px -50px 0px", // Start animation 50px before element fully visible
    }
  );

  // Observe all scroll elements for animation triggers
  allScrollElements.forEach((element) => {
    observer.observe(element);
  });

  /* ======================
     INK SPREAD EFFECT SYSTEM
     ======================
     
     Advanced mouse-tracking system that creates dynamic
     ink spread effects on hero images. Uses CSS clip-path
     for smooth color reveals and generates animated droplets.
     ====================== */

  // Initialize ink spread for each hero image container
  document.querySelectorAll(".image-container").forEach((container) => {
    const img = container.querySelector(".hero-img");
    const colorReveal = container.querySelector(".color-reveal");
    const inkSpread = container.querySelector(".ink-spread");

    // Track hover state and droplet animations
    let isHovering = false;
    let inkDroplets = [];

    /* Mouse enter event - start ink spread effect */
    container.addEventListener("mouseenter", () => {
      isHovering = true;
      container.style.cursor = "none"; // Hide cursor for immersive experience
    });

    /* Mouse leave event - clean up ink effects */
    container.addEventListener("mouseleave", () => {
      isHovering = false;
      colorReveal.style.clipPath = "circle(0px at 50% 50%)"; // Reset reveal area

      // Remove all animated ink droplets
      inkDroplets.forEach((droplet) => {
        if (droplet.parentNode) {
          droplet.parentNode.removeChild(droplet);
        }
      });
      inkDroplets = []; // Clear droplet array

      inkSpread.classList.remove("active"); // Stop ink spread animation
      container.style.cursor = "default"; // Restore normal cursor
    });

    /* Mouse move event - real-time ink spread tracking */
    container.addEventListener("mousemove", (e) => {
      if (!isHovering) return; // Only process if currently hovering

      // Calculate mouse position relative to container
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Boundary detection - ensure mouse is within image bounds
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        colorReveal.style.clipPath = "circle(0px at 50% 50%)"; // Hide reveal
        inkSpread.classList.remove("active"); // Stop spread animation
        return;
      }

      // Convert pixel coordinates to percentages for CSS clip-path
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      // Create dynamic ink spread circle with responsive radius
      const radius = Math.min(rect.width, rect.height) * 0.18; // 18% of smallest dimension
      
      // Apply circular clip-path for color reveal effect
      colorReveal.style.clipPath = `circle(${radius}px at ${xPercent}% ${yPercent}%)`;

      // Position the main ink spread element at mouse location
      inkSpread.style.left = `${x - 60}px`; // Center horizontally
      inkSpread.style.top = `${y - 60}px`; // Center vertically
      inkSpread.style.width = "120px"; // Fixed spread size
      inkSpread.style.height = "120px";

      // Randomly generate small ink droplets for realistic effect
      if (Math.random() > 0.7) {
        // 30% chance to create a droplet each mouse move
        createInkDroplet(container, x, y);
      }

      // Trigger ink spread animation with class toggle
      inkSpread.classList.remove("active");
      void inkSpread.offsetWidth; // Force DOM reflow for animation restart
      inkSpread.classList.add("active");
    });

    /* ======================
       INK DROPLET GENERATION
       ======================
       
       Creates small animated droplets around the main
       ink spread for enhanced visual realism.
       ====================== */

    function createInkDroplet(container, x, y) {
      const droplet = document.createElement("div");
      droplet.className = "ink-droplet";

      // Generate random droplet properties
      const size = Math.random() * 20 + 10; // Size between 10-30px
      const offsetX = (Math.random() - 0.5) * 80; // Random horizontal offset
      const offsetY = (Math.random() - 0.5) * 80; // Random vertical offset

      // Apply comprehensive droplet styling
      droplet.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x + offsetX - size / 2}px;
                top: ${y + offsetY - size / 2}px;
                background: radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 80%);
                border-radius: ${Math.random() * 50 + 50}% ${
        Math.random() * 50 + 50
      }% ${Math.random() * 50 + 50}% ${Math.random() * 50 + 50}%;
                pointer-events: none;
                z-index: 2;
                animation: dropletSpread 0.6s ease-out forwards;
                transform: scale(0);
                mix-blend-mode: multiply;
            `;

      // Add droplet to container and track it
      container.appendChild(droplet);
      inkDroplets.push(droplet);

      // Automatic cleanup after animation completes
      setTimeout(() => {
        if (droplet.parentNode) {
          droplet.parentNode.removeChild(droplet);
          inkDroplets = inkDroplets.filter((d) => d !== droplet); // Remove from tracking array
        }
      }, 600); // Match animation duration
    }

    /* ======================
       CLICK INTERACTION EFFECT
       ======================
       
       Enhanced ink spread on click with larger reveal
       area and burst of multiple droplets.
       ====================== */

    container.addEventListener("click", (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100; // Click X percentage
      const y = ((e.clientY - rect.top) / rect.height) * 100; // Click Y percentage

      // Create larger ink reveal on click (35% vs 18% on hover)
      const radius = Math.min(rect.width, rect.height) * 0.35;
      colorReveal.style.clipPath = `circle(${radius}px at ${x}% ${y}%)`;
      
      // Apply bouncy animation for click effect
      colorReveal.style.transition =
        "clip-path 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";

      // Create burst of multiple ink droplets on click
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createInkDroplet(
            container,
            e.clientX - rect.left, // Pixel coordinates for droplet positioning
            e.clientY - rect.top
          );
        }, i * 100); // Staggered timing for burst effect
      }

      // Reset transition back to normal after click animation
      setTimeout(() => {
        colorReveal.style.transition = "clip-path 0.3s ease";
      }, 800);
    });
  });

  /* ======================
     ENHANCED SCROLL EFFECTS
     ======================
     
     Additional interactive effects for non-hero elements
     including hover animations and subtle parallax scrolling.
     ====================== */

  // Select all scroll elements except hero images for enhanced interactions
  const nonHeroElements = document.querySelectorAll(
    ".scroll-element:not(.hero-img)"
  );
  
  // Add enhanced hover effects to cards and sections
  nonHeroElements.forEach((card) => {
    
    /* Mouse enter - apply hover transformation */
    card.addEventListener("mouseenter", function () {
      const rect = this.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only apply hover effects if element is visible in viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        this.style.transform = "scale(1.05)"; // Subtle scale increase
        this.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)"; // Enhanced shadow
        this.style.transition = "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)"; // Smooth transition
        this.style.zIndex = "10"; // Bring to front
      }
    });

    /* Mouse leave - reset hover effects */
    card.addEventListener("mouseleave", function () {
      this.style.transform = ""; // Reset scale
      this.style.boxShadow = ""; // Reset shadow
      this.style.zIndex = ""; // Reset z-index
    });
  });

  /* ======================
     SUBTLE PARALLAX SCROLLING
     ======================
     
     Creates gentle parallax movement based on scroll
     direction and element position relative to viewport.
     ====================== */

  let lastScrollTop = 0; // Track previous scroll position
  
  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isScrollingDown = scrollTop > lastScrollTop; // Determine scroll direction

    nonHeroElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2; // Element center point
      const viewportCenter = windowHeight / 2; // Viewport center point

      // Calculate distance from viewport center for parallax intensity
      if (rect.top < windowHeight && rect.bottom > 0) {
        const distance = Math.abs(elementCenter - viewportCenter);
        const maxDistance = windowHeight / 2;
        const parallaxOffset = (distance / maxDistance) * 20; // Max 20px offset

        // Apply subtle parallax movement if not being hovered
        if (!element.matches(":hover")) {
          element.style.transform = `translateY(${
            isScrollingDown ? parallaxOffset : -parallaxOffset
          }px)`;
        }
      }
    });

    lastScrollTop = scrollTop; // Update scroll position tracking
  });
});

/* ======================
   NAVBAR SCROLL EFFECT
   ======================
   
   Enhanced navbar that changes appearance on scroll
   ====================== */

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  const scrolled = window.scrollY > 50;
  
  if (scrolled) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ==========================================
   END OF FASHION PHOTOGRAPHY INTERACTIONS
   ========================================== */
