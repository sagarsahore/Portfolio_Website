/***********************************************
 * VLT Animation Engine 2.0 - Mobile First
 * Ultra-fast, hardware-accelerated animations
 * optimized for mobile devices and touch interfaces
 ***********************************************/

'use strict';

/**
 * VLT Animation Engine 2.0
 * Complete rewrite focusing on mobile performance
 */
window.VLTAnimationEngine = (function() {

    // Performance monitoring
    let performanceMetrics = {
        frameRate: 60,
        frameDrops: 0,
        animationQuality: 'high', // high, medium, low
        batteryLevel: 1,
        isLowPowerMode: false,
        networkSpeed: 'fast' // fast, slow
    };

    // Animation state management
    let animationState = {
        currentSection: 0,
        isTransitioning: false,
        touchStartY: 0,
        touchEndY: 0,
        momentum: 0,
        lastFrameTime: 0,
        activeAnimations: new Set(),
        preloadedSections: new Set()
    };

    // Device capabilities detection
    const deviceCapabilities = {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        hasGPU: !!window.WebGLRenderingContext,
        hardwareConcurrency: navigator.hardwareConcurrency || 2,
        deviceMemory: navigator.deviceMemory || 2,
        
        // Advanced mobile detection
        isLowPerformance() {
            return this.hardwareConcurrency <= 2 || 
                   this.deviceMemory <= 2 || 
                   this.getNetworkSpeed() === 'slow';
        },
        
        getNetworkSpeed() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection) {
                return (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') ? 'slow' : 'fast';
            }
            return 'fast';
        },
        
        getBatteryLevel() {
            if ('getBattery' in navigator) {
                navigator.getBattery().then(battery => {
                    performanceMetrics.batteryLevel = battery.level;
                    performanceMetrics.isLowPowerMode = battery.level < 0.2;
                });
            }
        }
    };

    /**
     * Hardware acceleration utilities
     */
    const HardwareAcceleration = {
        // Apply comprehensive hardware acceleration
        enable(element) {
            if (!element) return;
            
            const style = element.style;
            style.transform = style.transform || 'translateZ(0)';
            style.willChange = 'transform, opacity';
            style.backfaceVisibility = 'hidden';
            style.perspective = '1000px';
            style.transformStyle = 'preserve-3d';
            
            // Mobile-specific optimizations
            if (deviceCapabilities.isMobile) {
                style.webkitTransform = style.transform;
                style.webkitBackfaceVisibility = 'hidden';
                style.webkitPerspective = '1000px';
            }
        },
        
        // Remove hardware acceleration when animation completes
        disable(element) {
            if (!element) return;
            
            const style = element.style;
            style.willChange = 'auto';
            // Keep translateZ(0) for layout stability
        },
        
        // Batch enable for multiple elements
        enableBatch(elements) {
            const fragment = document.createDocumentFragment();
            elements.forEach(el => {
                if (el.parentNode) {
                    fragment.appendChild(el);
                    this.enable(el);
                    el.parentNode.insertBefore(el, null);
                } else {
                    this.enable(el);
                }
            });
        }
    };

    /**
     * Advanced Performance Monitor
     */
    const PerformanceMonitor = {
        frameCount: 0,
        lastTime: performance.now(),
        frameRates: [],
        
        init() {
            this.startMonitoring();
            deviceCapabilities.getBatteryLevel();
            this.detectNetworkSpeed();
        },
        
        startMonitoring() {
            const monitor = () => {
                const currentTime = performance.now();
                const delta = currentTime - this.lastTime;
                const fps = 1000 / delta;
                
                this.frameRates.push(fps);
                if (this.frameRates.length > 60) {
                    this.frameRates.shift();
                }
                
                // Calculate average FPS over last 60 frames
                const avgFPS = this.frameRates.reduce((a, b) => a + b, 0) / this.frameRates.length;
                performanceMetrics.frameRate = avgFPS;
                
                // Adaptive quality scaling
                this.adjustQuality(avgFPS);
                
                this.lastTime = currentTime;
                this.frameCount++;
                
                requestAnimationFrame(monitor);
            };
            
            requestAnimationFrame(monitor);
        },
        
        adjustQuality(fps) {
            const body = document.body;
            
            // Remove existing quality classes
            body.classList.remove('vlt-quality-high', 'vlt-quality-medium', 'vlt-quality-low');
            
            if (fps < 30 || performanceMetrics.isLowPowerMode) {
                performanceMetrics.animationQuality = 'low';
                body.classList.add('vlt-quality-low');
            } else if (fps < 50) {
                performanceMetrics.animationQuality = 'medium';
                body.classList.add('vlt-quality-medium');
            } else {
                performanceMetrics.animationQuality = 'high';
                body.classList.add('vlt-quality-high');
            }
            
            // Adjust animation complexity based on quality
            this.adjustAnimationComplexity();
        },
        
        adjustAnimationComplexity() {
            const elements = document.querySelectorAll('.vlt-animated-block');
            
            elements.forEach(el => {
                switch (performanceMetrics.animationQuality) {
                    case 'low':
                        el.classList.add('vlt-simple-animation');
                        el.classList.remove('vlt-complex-animation');
                        break;
                    case 'medium':
                        el.classList.add('vlt-medium-animation');
                        el.classList.remove('vlt-complex-animation', 'vlt-simple-animation');
                        break;
                    case 'high':
                        el.classList.add('vlt-complex-animation');
                        el.classList.remove('vlt-simple-animation', 'vlt-medium-animation');
                        break;
                }
            });
        },
        
        detectNetworkSpeed() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection) {
                performanceMetrics.networkSpeed = this.getNetworkSpeed();
                
                connection.addEventListener('change', () => {
                    performanceMetrics.networkSpeed = this.getNetworkSpeed();
                });
            }
        },
        
        getNetworkSpeed() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (!connection) return 'fast';
            
            return (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') ? 'slow' : 'fast';
        }
    };

    /**
     * Mobile-Optimized Section Transitions
     */
    const SectionTransitions = {
        sections: [],
        currentIndex: 0,
        isAnimating: false,
        touchStartY: 0,
        touchMomentum: 0,
        
        init() {
            this.sections = Array.from(document.querySelectorAll('.vlt-section'));
            this.setupMobileTouch();
            this.preloadAdjacentSections();
            this.enableFastScrolling();
        },
        
        setupMobileTouch() {
            if (!deviceCapabilities.isTouch) return;
            
            let touchStartTime;
            const container = document.querySelector('.vlt-fullpage-slider');
            if (!container) return;
            
            // Passive event listeners for better performance
            container.addEventListener('touchstart', (e) => {
                if (this.isAnimating) return;
                
                this.touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
                this.touchMomentum = 0;
            }, { passive: true });
            
            container.addEventListener('touchmove', (e) => {
                if (this.isAnimating) return;
                
                // Prevent default scrolling
                e.preventDefault();
                
                const currentY = e.touches[0].clientY;
                const deltaY = this.touchStartY - currentY;
                const deltaTime = Date.now() - touchStartTime;
                
                // Calculate momentum
                this.touchMomentum = deltaY / deltaTime;
                
                // Provide visual feedback during touch
                this.provideVisualFeedback(deltaY);
            }, { passive: false });
            
            container.addEventListener('touchend', (e) => {
                if (this.isAnimating) return;
                
                const touchEndY = e.changedTouches[0].clientY;
                const deltaY = this.touchStartY - touchEndY;
                const deltaTime = Date.now() - touchStartTime;
                
                // Determine if we should transition
                const shouldTransition = Math.abs(deltaY) > 50 || Math.abs(this.touchMomentum) > 0.5;
                
                if (shouldTransition) {
                    if (deltaY > 0 && this.currentIndex < this.sections.length - 1) {
                        this.transitionToSection(this.currentIndex + 1);
                    } else if (deltaY < 0 && this.currentIndex > 0) {
                        this.transitionToSection(this.currentIndex - 1);
                    }
                }
                
                this.resetVisualFeedback();
            }, { passive: true });
        },
        
        provideVisualFeedback(deltaY) {
            const currentSection = this.sections[this.currentIndex];
            if (!currentSection) return;
            
            // Subtle transform to show touch responsiveness
            const transform = `translateY(${-deltaY * 0.1}px) translateZ(0)`;
            currentSection.style.transform = transform;
        },
        
        resetVisualFeedback() {
            const currentSection = this.sections[this.currentIndex];
            if (!currentSection) return;
            
            currentSection.style.transform = 'translateY(0) translateZ(0)';
        },
        
        transitionToSection(index) {
            if (index < 0 || index >= this.sections.length || this.isAnimating) return;
            
            this.isAnimating = true;
            const previousIndex = this.currentIndex;
            this.currentIndex = index;
            
            const currentSection = this.sections[previousIndex];
            const nextSection = this.sections[index];
            
            // Prepare next section
            this.prepareSection(nextSection, index > previousIndex ? 'down' : 'up');
            
            // Ultra-fast mobile transition
            const duration = deviceCapabilities.isMobile ? 300 : 500; // Even faster for mobile
            
            // Animate out current section
            this.animateSection(currentSection, 'out', index > previousIndex ? 'up' : 'down', duration);
            
            // Animate in next section
            this.animateSection(nextSection, 'in', index > previousIndex ? 'down' : 'up', duration);
            
            // Update states
            setTimeout(() => {
                this.isAnimating = false;
                this.cleanupSection(currentSection);
                this.activateSection(nextSection);
                this.preloadAdjacentSections();
                
                // Trigger custom event
                window.dispatchEvent(new CustomEvent('vlt.sectionTransition', {
                    detail: { from: previousIndex, to: index }
                }));
            }, duration);
        },
        
        prepareSection(section, direction) {
            HardwareAcceleration.enable(section);
            section.classList.remove('active');
            section.classList.add('transitioning');
            
            // Set initial position based on direction
            const initialTransform = direction === 'down' ? 'translateY(100%)' : 'translateY(-100%)';
            section.style.transform = `${initialTransform} translateZ(0)`;
            section.style.opacity = '0';
        },
        
        animateSection(section, type, direction, duration) {
            const isOut = type === 'out';
            const isDown = direction === 'down';
            
            let targetTransform, targetOpacity;
            
            if (isOut) {
                targetTransform = isDown ? 'translateY(-100%)' : 'translateY(100%)';
                targetOpacity = '0';
            } else {
                targetTransform = 'translateY(0)';
                targetOpacity = '1';
            }
            
            // Use CSS transitions for smooth hardware-accelerated animations
            section.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}ms ease`;
            section.style.transform = `${targetTransform} translateZ(0)`;
            section.style.opacity = targetOpacity;
        },
        
        activateSection(section) {
            section.classList.add('active');
            section.classList.remove('transitioning');
            section.style.transition = '';
            section.style.transform = 'translateY(0) translateZ(0)';
            section.style.opacity = '1';
            
            // Trigger section-specific animations
            this.triggerSectionAnimations(section);
        },
        
        cleanupSection(section) {
            section.classList.remove('active', 'transitioning');
            HardwareAcceleration.disable(section);
        },
        
        triggerSectionAnimations(section) {
            const animatedElements = section.querySelectorAll('.vlt-animated-block');
            
            animatedElements.forEach((element, index) => {
                // Remove any existing animation state
                element.classList.remove('animated', 'vlt-pre-animated');
                
                // Add hardware acceleration
                HardwareAcceleration.enable(element);
                
                // Stagger animations with minimal delay for mobile
                const delay = deviceCapabilities.isMobile ? index * 50 : index * 100;
                
                setTimeout(() => {
                    element.classList.add('animated');
                }, delay);
            });
        },
        
        preloadAdjacentSections() {
            // Preload previous and next sections for instant transitions
            const preloadIndexes = [this.currentIndex - 1, this.currentIndex + 1];
            
            preloadIndexes.forEach(index => {
                if (index >= 0 && index < this.sections.length) {
                    const section = this.sections[index];
                    // Ensure section is ready for animation
                    HardwareAcceleration.enable(section);
                    animationState.preloadedSections.add(index);
                }
            });
        },
        
        enableFastScrolling() {
            // Disable native scrolling for custom implementation
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Smooth scrolling fallback for non-touch devices
            if (!deviceCapabilities.isTouch) {
                this.setupWheelScrolling();
            }
        },
        
        setupWheelScrolling() {
            let wheelTimeout;
            
            document.addEventListener('wheel', (e) => {
                if (this.isAnimating) return;
                
                e.preventDefault();
                
                clearTimeout(wheelTimeout);
                wheelTimeout = setTimeout(() => {
                    const deltaY = e.deltaY;
                    
                    if (deltaY > 0 && this.currentIndex < this.sections.length - 1) {
                        this.transitionToSection(this.currentIndex + 1);
                    } else if (deltaY < 0 && this.currentIndex > 0) {
                        this.transitionToSection(this.currentIndex - 1);
                    }
                }, 50);
            }, { passive: false });
        }
    };

    /**
     * Advanced Animation Controller
     */
    const AnimationController = {
        observerOptions: {
            root: null,
            // Increased rootMargin for more stable content visibility
            rootMargin: deviceCapabilities.isMobile ? '20px' : '80px',
            // Increased threshold to ensure more content is visible before animation triggers
            threshold: deviceCapabilities.isMobile ? 0.4 : 0.5
        },
        
        init() {
            this.setupIntersectionObserver();
            this.initializeExistingElements();
        },
        
        setupIntersectionObserver() {
            if (!window.IntersectionObserver) {
                this.fallbackAnimation();
                return;
            }
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);
            
            // Observe all animated elements
            document.querySelectorAll('.vlt-animated-block').forEach(el => {
                observer.observe(el);
            });
        },
        
        animateElement(element) {
            // Check if should reduce animations
            if (this.shouldReduceAnimations()) {
                element.classList.add('vlt-no-animation');
                return;
            }
            
            // Enable hardware acceleration for stable performance
            HardwareAcceleration.enable(element);
            
            // Use stable fade animation for better content visibility
            this.applyStableFadeAnimation(element);
            
            // Track active animation
            animationState.activeAnimations.add(element);
            
            // Clean up after animation
            this.cleanupAfterAnimation(element);
        },
        
        applyStableFadeAnimation(element) {
            // Remove any existing animation classes
            element.classList.remove('vlt-pre-animated');
            
            // Add stable fade animation class
            element.classList.add('vlt-stable-fade');
            
            // Trigger smooth fade-in animation
            requestAnimationFrame(() => {
                element.classList.add('animated');
            });
        },
        
        cleanupAfterAnimation(element) {
            const duration = this.getAnimationDuration(element);
            
            setTimeout(() => {
                HardwareAcceleration.disable(element);
                animationState.activeAnimations.delete(element);
            }, duration);
        },
        
        getAnimationDuration(element) {
            const computed = window.getComputedStyle(element);
            const duration = computed.animationDuration;
            return parseFloat(duration) * 1000 || 500;
        },
        
        shouldReduceAnimations() {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
                   performanceMetrics.isLowPowerMode ||
                   performanceMetrics.animationQuality === 'low';
        },
        
        initializeExistingElements() {
            // Provide stable pre-animation state for better content visibility
            document.querySelectorAll('.vlt-animated-block').forEach(element => {
                if (this.isAboveFold(element)) {
                    // Show content immediately for above-fold elements
                    element.classList.add('vlt-instant-show');
                } else {
                    // Use stable pre-animation state that maintains content readability
                    element.classList.add('vlt-stable-pre-animated');
                }
            });
        },
        
        isAboveFold(element) {
            const rect = element.getBoundingClientRect();
            return rect.top < window.innerHeight;
        },
        
        fallbackAnimation() {
            // Simple fallback for older browsers
            document.querySelectorAll('.vlt-animated-block').forEach(element => {
                element.classList.add('animated');
            });
        }
    };

    /**
     * Public API
     */
    return {
        init() {
            // Initialize all systems
            PerformanceMonitor.init();
            SectionTransitions.init();
            AnimationController.init();
            
            // Add mobile detection classes
            if (deviceCapabilities.isMobile) {
                document.body.classList.add('vlt-mobile-device');
            }
            
            if (deviceCapabilities.isLowPerformance()) {
                document.body.classList.add('vlt-low-performance');
            }
            
            console.log('VLT Animation Engine 2.0 initialized - Mobile Optimized');
        },
        
        // Navigation methods
        goToSection(index) {
            SectionTransitions.transitionToSection(index);
        },
        
        nextSection() {
            SectionTransitions.transitionToSection(SectionTransitions.currentIndex + 1);
        },
        
        previousSection() {
            SectionTransitions.transitionToSection(SectionTransitions.currentIndex - 1);
        },
        
        // Performance methods
        getPerformanceMetrics() {
            return { ...performanceMetrics };
        },
        
        // Animation control
        pauseAnimations() {
            animationState.activeAnimations.forEach(element => {
                element.style.animationPlayState = 'paused';
            });
        },
        
        resumeAnimations() {
            animationState.activeAnimations.forEach(element => {
                element.style.animationPlayState = 'running';
            });
        }
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        VLTAnimationEngine.init();
    });
} else {
    VLTAnimationEngine.init();
}