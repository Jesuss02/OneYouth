// Modern OneYouth Website JavaScript
// ===================================

// Configuration
const CONFIG = {
    animationDelay: 100,
    counterDuration: 2000,
    scrollThreshold: 0.1
};

// Custom Cursor
class CustomCursor {
    constructor() {
        this.dot = document.querySelector('[data-cursor-dot]');
        this.outline = document.querySelector('[data-cursor-outline]');
        
        if (!this.dot || !this.outline) return;
        
        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.animate();
        
        // Add hover effects
        const hoverElements = document.querySelectorAll('a, button, .service-card, .event-card, .partner-item');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.dot.style.transform = 'translate(-50%, -50%) scale(2)';
                this.outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.dot.style.transform = 'translate(-50%, -50%) scale(1)';
                this.outline.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }
    
    animate() {
        this.pos.x += (this.mouse.x - this.pos.x) * 0.15;
        this.pos.y += (this.mouse.y - this.pos.y) * 0.15;
        
        if (this.dot && this.outline) {
            this.dot.style.left = this.mouse.x + 'px';
            this.dot.style.top = this.mouse.y + 'px';
            
            this.outline.style.left = this.pos.x + 'px';
            this.outline.style.top = this.pos.y + 'px';
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Navigation
class Navigation {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.toggle = document.getElementById('navToggle');
        this.links = document.getElementById('navLinks');
        this.navItems = document.querySelectorAll('[data-nav-item]');
        
        this.init();
    }
    
    init() {
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        });
        
        // Mobile menu toggle
        this.toggle?.addEventListener('click', () => {
            this.toggle.classList.toggle('active');
            this.links.classList.toggle('active');
        });
        
        // Close menu on link click
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.toggle?.classList.remove('active');
                this.links.classList.remove('active');
            });
        });
        
        // Update active nav based on current page
        this.updateActiveNav();
        
        // Smooth scroll for hash links on the same page
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || !href) return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    updateActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navItems.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // Match current page
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.observer = null;
        
        this.init();
    }
    
    init() {
        const options = {
            threshold: CONFIG.scrollThreshold,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);
        
        this.elements.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Counter Animation
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.hasAnimated = false;
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.animateCounters();
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }
    
    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = CONFIG.counterDuration;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    }
}

// Contact Form
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        
        this.init();
    }
    
    init() {
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Log data (in production, send to backend)
            console.log('Form submitted:', data);
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.form.reset();
        });
    }
    
    showSuccessMessage() {
        // Create success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 32px;
            right: 32px;
            padding: 20px 32px;
            background: linear-gradient(135deg, #FF1744, #D50000);
            color: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(255, 23, 68, 0.4);
            z-index: 10000;
            font-weight: 600;
            animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        notification.textContent = 'Mesajınız uğurla göndərildi! ✓';
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) reverse';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
}

// Parallax Effects
class ParallaxEffects {
    constructor() {
        this.hero = document.querySelector('.hero');
        
        this.init();
    }
    
    init() {
        if (!this.hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroContent = this.hero.querySelector('.hero-content');
            
            if (scrolled < window.innerHeight && heroContent) {
                const opacity = 1 - (scrolled / 600);
                const translateY = scrolled * 0.5;
                
                heroContent.style.opacity = opacity;
                heroContent.style.transform = `translateY(${translateY}px)`;
            }
        });
    }
}

// Service Cards Interaction
class ServiceCards {
    constructor() {
        this.cards = document.querySelectorAll('.service-card');
        
        this.init();
    }
    
    init() {
        this.cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.05}s`;
            
            card.addEventListener('mouseenter', () => {
                this.cards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.style.opacity = '0.5';
                        otherCard.style.transform = 'scale(0.95)';
                    }
                });
            });
            
            card.addEventListener('mouseleave', () => {
                this.cards.forEach(otherCard => {
                    otherCard.style.opacity = '1';
                    otherCard.style.transform = 'scale(1)';
                });
            });
        });
    }
}

// Event Cards Animation
class EventCards {
    constructor() {
        this.cards = document.querySelectorAll('.event-card');
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(card);
        });
    }
}

// Gradient Orbs Animation
class GradientOrbs {
    constructor() {
        this.orbs = document.querySelectorAll('.gradient-orb');
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            this.orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.01;
                const x = (clientX - centerX) * speed;
                const y = (clientY - centerY) * speed;
                
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
}

// Smooth Page Load
class PageLoader {
    constructor() {
        this.init();
    }
    
    init() {
        document.body.style.opacity = '0';
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.6s ease';
                document.body.style.opacity = '1';
            }, 100);
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images if needed
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Utility Functions
const Utils = {
    debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle(func, limit = 16) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Initialize Everything
class App {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initComponents());
        } else {
            this.initComponents();
        }
    }
    
    initComponents() {
        // Initialize all components
        new PageLoader();
        new CustomCursor();
        new Navigation();
        new ScrollAnimations();
        new CounterAnimation();
        new ContactForm();
        new ParallaxEffects();
        new ServiceCards();
        new EventCards();
        new GradientOrbs();
        new PerformanceMonitor();
        
        console.log('🚀 OneYouth website initialized successfully!');
    }
}

// Start the application
new App();

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, Utils };
}
