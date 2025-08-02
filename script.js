// Enhanced Scroll Animation Script with Ink Spread Effect
document.addEventListener('DOMContentLoaded', function() {
    const scrollElements = document.querySelectorAll('.scroll-element');
    
    // Intersection Observer for dynamic scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            const element = entry.target;
            
            if (entry.isIntersecting) {
                // Element is coming into view - animate in
                const customDelay = element.getAttribute('data-delay');
                const delay = customDelay ? parseInt(customDelay) : index * 150;
                
                setTimeout(() => {
                    element.classList.add('animate-in');
                    element.classList.remove('animate-out');
                    
                    // Reset any inline styles
                    element.style.transform = '';
                    element.style.opacity = '';
                }, delay); // Use custom delay or staggered delay
            } else {
                // Element is going out of view - animate out
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (rect.bottom < 0) {
                    // Element scrolled past the top
                    element.classList.add('animate-out');
                    element.classList.remove('animate-in');
                } else if (rect.top > windowHeight) {
                    // Element scrolled past the bottom
                    element.classList.remove('animate-in');
                    element.classList.remove('animate-out');
                    // Reset to initial state for next animation
                    setTimeout(() => {
                        element.style.transform = '';
                        element.style.opacity = '';
                    }, 300);
                }
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation 50px before element is fully visible
    });

    // Observe all scroll elements
    scrollElements.forEach(element => {
        observer.observe(element);
    });

    // Ink spread effect for hero images
    document.querySelectorAll('.image-container').forEach(container => {
        const img = container.querySelector('.hero-img');
        const colorReveal = container.querySelector('.color-reveal');
        const inkSpread = container.querySelector('.ink-spread');
        
        let isHovering = false;
        let inkDroplets = [];
        
        container.addEventListener('mouseenter', () => {
            isHovering = true;
            container.style.cursor = 'none';
        });
        
        container.addEventListener('mouseleave', () => {
            isHovering = false;
            colorReveal.style.clipPath = 'circle(0px at 50% 50%)';
            
            // Clear all ink droplets
            inkDroplets.forEach(droplet => {
                if (droplet.parentNode) {
                    droplet.parentNode.removeChild(droplet);
                }
            });
            inkDroplets = [];
            
            inkSpread.classList.remove('active');
            container.style.cursor = 'default';
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            // Create ink spread effect with irregular shape
            const radius = Math.min(rect.width, rect.height) * 0.18;
            colorReveal.style.clipPath = `circle(${radius}px at ${x}% ${y}%)`;
            
            // Position main ink spread element
            inkSpread.style.left = `${e.clientX - rect.left - 60}px`;
            inkSpread.style.top = `${e.clientY - rect.top - 60}px`;
            inkSpread.style.width = '120px';
            inkSpread.style.height = '120px';
            
            // Create additional smaller ink droplets for realistic effect
            if (Math.random() > 0.7) { // 30% chance to create droplet
                createInkDroplet(container, e.clientX - rect.left, e.clientY - rect.top);
            }
            
            // Trigger ink spread animation
            inkSpread.classList.remove('active');
            void inkSpread.offsetWidth; // Force reflow
            inkSpread.classList.add('active');
        });
        
        // Create small ink droplets around main spread
        function createInkDroplet(container, x, y) {
            const droplet = document.createElement('div');
            droplet.className = 'ink-droplet';
            
            const size = Math.random() * 20 + 10; // Random size between 10-30px
            const offsetX = (Math.random() - 0.5) * 80; // Random offset
            const offsetY = (Math.random() - 0.5) * 80;
            
            droplet.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x + offsetX - size/2}px;
                top: ${y + offsetY - size/2}px;
                background: radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 80%);
                border-radius: ${Math.random() * 50 + 50}% ${Math.random() * 50 + 50}% ${Math.random() * 50 + 50}% ${Math.random() * 50 + 50}%;
                pointer-events: none;
                z-index: 2;
                animation: dropletSpread 0.6s ease-out forwards;
                transform: scale(0);
                mix-blend-mode: multiply;
            `;
            
            container.appendChild(droplet);
            inkDroplets.push(droplet);
            
            // Remove droplet after animation
            setTimeout(() => {
                if (droplet.parentNode) {
                    droplet.parentNode.removeChild(droplet);
                    inkDroplets = inkDroplets.filter(d => d !== droplet);
                }
            }, 600);
        }
        
        // Add click effect for stronger ink spread
        container.addEventListener('click', (e) => {
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            // Larger reveal on click with irregular shape
            const radius = Math.min(rect.width, rect.height) * 0.35;
            colorReveal.style.clipPath = `circle(${radius}px at ${x}% ${y}%)`;
            colorReveal.style.transition = 'clip-path 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            // Create burst of ink droplets on click
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createInkDroplet(container, e.clientX - rect.left, e.clientY - rect.top);
                }, i * 100);
            }
            
            // Reset transition after animation
            setTimeout(() => {
                colorReveal.style.transition = 'clip-path 0.3s ease';
            }, 800);
        });
    });

    // Enhanced hover effects for non-hero scroll elements
    const nonHeroElements = document.querySelectorAll('.scroll-element:not(.hero-img)');
    nonHeroElements.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const rect = this.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Only apply hover effects if element is in viewport - removed upward movement
            if (rect.top < windowHeight && rect.bottom > 0) {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                this.style.zIndex = '10';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            this.style.zIndex = '';
        });
    });

    // Additional smooth scroll tracking for enhanced effects
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isScrollingDown = scrollTop > lastScrollTop;
        
        nonHeroElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;
            
            // Calculate distance from viewport center for subtle parallax effect
            if (rect.top < windowHeight && rect.bottom > 0) {
                const distance = Math.abs(elementCenter - viewportCenter);
                const maxDistance = windowHeight / 2;
                const parallaxOffset = (distance / maxDistance) * 20;
                
                if (!element.matches(':hover')) {
                    element.style.transform = `translateY(${isScrollingDown ? parallaxOffset : -parallaxOffset}px)`;
                }
            }
        });
        
        lastScrollTop = scrollTop;
    });
});