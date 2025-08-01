// Enhanced Scroll Animation Script - Cards animate every time they come into view
document.addEventListener('DOMContentLoaded', function() {
    const scrollElements = document.querySelectorAll('.scroll-element');
    
    // Intersection Observer for dynamic scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            const element = entry.target;
            
            if (entry.isIntersecting) {
                // Element is coming into view - animate in
                setTimeout(() => {
                    element.classList.add('animate-in');
                    element.classList.remove('animate-out');
                    
                    // Reset any inline styles
                    element.style.transform = '';
                    element.style.opacity = '';
                }, index * 150); // Staggered animation delay
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

    // Enhanced hover effects that work regardless of animation state
    scrollElements.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const rect = this.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Only apply hover effects if element is in viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                this.style.transform = 'translateY(-15px) scale(1.05)';
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
        
        scrollElements.forEach(element => {
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