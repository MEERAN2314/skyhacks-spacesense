// Responsive Navigation Handler
class ResponsiveNav {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navStatus = document.querySelector('.nav-status');
        this.lastScrollTop = 0;
        this.scrollThreshold = 50;
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupScrollBehavior();
        this.setupResizeHandler();
        this.setupClickOutside();
    }
    
    setupMobileMenu() {
        if (!this.navToggle || !this.navStatus) return;
        
        this.navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });
    }
    
    toggleMobileMenu() {
        const isActive = this.navStatus.classList.toggle('active');
        
        // Update toggle icon
        const icon = this.navToggle.querySelector('i');
        if (icon) {
            icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
        }
        
        // Prevent body scroll when menu is open
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    closeMobileMenu() {
        if (this.navStatus.classList.contains('active')) {
            this.navStatus.classList.remove('active');
            
            const icon = this.navToggle?.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
            
            document.body.style.overflow = '';
        }
    }
    
    setupScrollBehavior() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > this.scrollThreshold) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (mobile only)
        if (window.innerWidth <= 768) {
            if (scrollTop > this.lastScrollTop && scrollTop > 100) {
                // Scrolling down
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                this.navbar.style.transform = 'translateY(0)';
            }
        } else {
            this.navbar.style.transform = 'translateY(0)';
        }
        
        this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
    
    setupResizeHandler() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }
    
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
        
        // Reset navbar transform
        this.navbar.style.transform = 'translateY(0)';
    }
    
    setupClickOutside() {
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const isClickInsideNav = this.navbar.contains(e.target);
                
                if (!isClickInsideNav && this.navStatus.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            }
        });
    }
}

// Responsive Utilities
class ResponsiveUtils {
    static isMobile() {
        return window.innerWidth <= 768;
    }
    
    static isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }
    
    static isDesktop() {
        return window.innerWidth > 1024;
    }
    
    static isTouchDevice() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    }
    
    static getDeviceType() {
        if (this.isMobile()) return 'mobile';
        if (this.isTablet()) return 'tablet';
        return 'desktop';
    }
    
    static getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }
    
    static addDeviceClasses() {
        const body = document.body;
        const deviceType = this.getDeviceType();
        const orientation = this.getOrientation();
        
        // Remove existing classes
        body.classList.remove('mobile', 'tablet', 'desktop', 'portrait', 'landscape', 'touch');
        
        // Add current classes
        body.classList.add(deviceType);
        body.classList.add(orientation);
        
        if (this.isTouchDevice()) {
            body.classList.add('touch');
        }
    }
    
    static optimizeForDevice() {
        const deviceType = this.getDeviceType();
        
        // Adjust visualization quality based on device
        if (deviceType === 'mobile') {
            // Reduce particle count, animation complexity
            if (window.particleSystem) {
                window.particleSystem.setParticleCount(50);
            }
        } else if (deviceType === 'tablet') {
            if (window.particleSystem) {
                window.particleSystem.setParticleCount(100);
            }
        } else {
            if (window.particleSystem) {
                window.particleSystem.setParticleCount(200);
            }
        }
    }
}

// Viewport Height Fix for Mobile Browsers
class ViewportFix {
    constructor() {
        this.init();
    }
    
    init() {
        this.setVH();
        
        window.addEventListener('resize', () => {
            this.setVH();
        });
        
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.setVH();
            }, 100);
        });
    }
    
    setVH() {
        // Set CSS custom property for actual viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
}

// Touch Gesture Handler
class TouchGestureHandler {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;
        
        this.init();
    }
    
    init() {
        if (!ResponsiveUtils.isTouchDevice()) return;
        
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleGesture();
        }, { passive: true });
    }
    
    handleGesture() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        
        // Horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > this.minSwipeDistance) {
                if (deltaX > 0) {
                    this.onSwipeRight();
                } else {
                    this.onSwipeLeft();
                }
            }
        }
        // Vertical swipe
        else {
            if (Math.abs(deltaY) > this.minSwipeDistance) {
                if (deltaY > 0) {
                    this.onSwipeDown();
                } else {
                    this.onSwipeUp();
                }
            }
        }
    }
    
    onSwipeRight() {
        // Open mobile menu
        if (ResponsiveUtils.isMobile() && window.responsiveNav) {
            const navStatus = document.querySelector('.nav-status');
            if (!navStatus.classList.contains('active')) {
                window.responsiveNav.toggleMobileMenu();
            }
        }
    }
    
    onSwipeLeft() {
        // Close mobile menu
        if (ResponsiveUtils.isMobile() && window.responsiveNav) {
            window.responsiveNav.closeMobileMenu();
        }
    }
    
    onSwipeDown() {
        // Show navbar if hidden
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.transform = 'translateY(0)';
        }
    }
    
    onSwipeUp() {
        // Could hide navbar or trigger other actions
    }
}

// Performance Monitor for Mobile
class MobilePerformanceMonitor {
    constructor() {
        this.fps = 60;
        this.lastTime = performance.now();
        this.frames = 0;
        this.checkInterval = 1000; // Check every second
        
        if (ResponsiveUtils.isMobile()) {
            this.init();
        }
    }
    
    init() {
        this.measureFPS();
    }
    
    measureFPS() {
        const now = performance.now();
        this.frames++;
        
        if (now >= this.lastTime + this.checkInterval) {
            this.fps = Math.round((this.frames * 1000) / (now - this.lastTime));
            this.frames = 0;
            this.lastTime = now;
            
            // Adjust quality if FPS is low
            if (this.fps < 30) {
                this.reduceQuality();
            } else if (this.fps > 50) {
                this.increaseQuality();
            }
        }
        
        requestAnimationFrame(() => this.measureFPS());
    }
    
    reduceQuality() {
        // Reduce visual effects for better performance
        console.log('Reducing quality for better performance');
        
        // Disable some animations
        document.body.classList.add('low-performance');
    }
    
    increaseQuality() {
        // Restore visual effects
        document.body.classList.remove('low-performance');
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize responsive navigation
    window.responsiveNav = new ResponsiveNav();
    
    // Add device classes
    ResponsiveUtils.addDeviceClasses();
    
    // Optimize for device
    ResponsiveUtils.optimizeForDevice();
    
    // Fix viewport height
    new ViewportFix();
    
    // Setup touch gestures
    new TouchGestureHandler();
    
    // Monitor performance on mobile
    if (ResponsiveUtils.isMobile()) {
        new MobilePerformanceMonitor();
    }
    
    // Update device classes on resize
    window.addEventListener('resize', () => {
        ResponsiveUtils.addDeviceClasses();
        ResponsiveUtils.optimizeForDevice();
    });
    
    // Update on orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            ResponsiveUtils.addDeviceClasses();
            ResponsiveUtils.optimizeForDevice();
        }, 100);
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ResponsiveNav,
        ResponsiveUtils,
        ViewportFix,
        TouchGestureHandler,
        MobilePerformanceMonitor
    };
}
