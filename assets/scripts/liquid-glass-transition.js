/**
 * Liquid Glass Page Transition
 * Apple-style minimal page transitions with liquid glass effect
 * Version: 1.0.0
 * 
 * Features:
 * - Frosted glass overlay with ripple effects
 * - GPU-accelerated animations
 * - Accessibility support (prefers-reduced-motion)
 * - Performance optimized (60fps target)
 * - Reusable utility class
 */

class LiquidGlassTransition {
    constructor(options = {}) {
        // Configuration
        this.config = {
            duration: options.duration || 500,
            easing: options.easing || 'cubic-bezier(0.4, 0, 0.2, 1)',
            debug: options.debug || false,
            onStart: options.onStart || null,
            onComplete: options.onComplete || null,
            ...options
        };
        
        // State
        this.isTransitioning = false;
        this.overlay = null;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the transition system
     */
    init() {
        this.createOverlay();
        this.setupEventListeners();
        
        if (this.config.debug) {
            console.log('[LiquidGlassTransition] Initialized', this.config);
        }
    }
    
    /**
     * Create the glass overlay element
     */
    createOverlay() {
        // Check if overlay already exists
        if (document.querySelector('.liquid-glass-overlay')) {
            this.overlay = document.querySelector('.liquid-glass-overlay');
            return;
        }
        
        // Create overlay element
        this.overlay = document.createElement('div');
        this.overlay.className = 'liquid-glass-overlay';
        this.overlay.setAttribute('role', 'presentation');
        this.overlay.setAttribute('aria-hidden', 'true');
        
        // Add to DOM
        document.body.appendChild(this.overlay);
        
        if (this.config.debug) {
            console.log('[LiquidGlassTransition] Overlay created');
        }
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for reduced motion preference changes
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            if (this.config.debug) {
                console.log('[LiquidGlassTransition] Reduced motion:', this.reducedMotion);
            }
        });
        
        // Prevent transitions during page load
        window.addEventListener('load', () => {
            document.body.classList.remove('page-transitioning-in', 'page-transitioning-out');
        });
    }
    
    /**
     * Execute page transition
     * @param {Function} callback - Function to execute during transition
     * @returns {Promise} - Resolves when transition completes
     */
    async transition(callback) {
        // Prevent multiple simultaneous transitions
        if (this.isTransitioning) {
            if (this.config.debug) {
                console.warn('[LiquidGlassTransition] Transition already in progress');
            }
            return Promise.resolve();
        }
        
        this.isTransitioning = true;
        
        // Call onStart callback
        if (typeof this.config.onStart === 'function') {
            this.config.onStart();
        }
        
        return new Promise((resolve) => {
            // Calculate timing based on reduced motion preference
            const duration = this.reducedMotion ? 200 : this.config.duration;
            const midPoint = duration * 0.5;
            
            if (this.config.debug) {
                console.log('[LiquidGlassTransition] Starting transition');
                console.time('transition-duration');
            }
            
            // Step 1: Fade out current content
            this.fadeOut();
            
            // Step 2: Show glass overlay (slight delay for smoother effect)
            setTimeout(() => {
                this.showOverlay();
            }, 50);
            
            // Step 3: Execute callback at midpoint (when overlay is visible)
            setTimeout(() => {
                if (typeof callback === 'function') {
                    callback();
                }
            }, midPoint);
            
            // Step 4: Fade in new content
            setTimeout(() => {
                this.fadeIn();
            }, midPoint + 50);
            
            // Step 5: Hide overlay and complete transition
            setTimeout(() => {
                this.hideOverlay();
                
                setTimeout(() => {
                    this.cleanup();
                    this.isTransitioning = false;
                    
                    // Call onComplete callback
                    if (typeof this.config.onComplete === 'function') {
                        this.config.onComplete();
                    }
                    
                    if (this.config.debug) {
                        console.timeEnd('transition-duration');
                        console.log('[LiquidGlassTransition] Transition complete');
                    }
                    
                    resolve();
                }, duration * 0.4);
            }, duration + 100);
        });
    }
    
    /**
     * Fade out current content
     */
    fadeOut() {
        const sections = document.querySelectorAll('.vlt-section.active');
        sections.forEach(section => {
            section.classList.add('page-transitioning-out');
        });
        
        document.body.classList.add('liquid-glass-transition-active');
    }
    
    /**
     * Fade in new content
     */
    fadeIn() {
        // Remove fade-out class
        const sectionsOut = document.querySelectorAll('.page-transitioning-out');
        sectionsOut.forEach(section => {
            section.classList.remove('page-transitioning-out');
        });
        
        // Add fade-in class to new active section
        const sectionsIn = document.querySelectorAll('.vlt-section.active');
        sectionsIn.forEach(section => {
            section.classList.add('page-transitioning-in');
        });
    }
    
    /**
     * Show glass overlay
     */
    showOverlay() {
        if (this.overlay) {
            this.overlay.classList.add('active');
        }
    }
    
    /**
     * Hide glass overlay
     */
    hideOverlay() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
    }
    
    /**
     * Cleanup after transition
     */
    cleanup() {
        // Remove transition classes
        document.body.classList.remove('liquid-glass-transition-active');
        
        const sections = document.querySelectorAll('.vlt-section');
        sections.forEach(section => {
            section.classList.remove('page-transitioning-out', 'page-transitioning-in');
        });
    }
    
    /**
     * Trigger transition with navigation
     * @param {string|Function} target - Target section anchor or callback function
     * @returns {Promise}
     */
    async navigateTo(target) {
        if (typeof target === 'string') {
            // Navigate to section with anchor
            return this.transition(() => {
                // Integration with fullpage.js - check multiple ways it might be accessible
                if (typeof $.fn.fullpage !== 'undefined') {
                    // Try standard fullpage.js API
                    if ($.fn.fullpage.moveTo) {
                        $.fn.fullpage.moveTo(target);
                    } else if (typeof fullpage_api !== 'undefined' && fullpage_api.moveTo) {
                        fullpage_api.moveTo(target);
                    } else {
                        // Fallback to silentMoveTo if available
                        const fpInstance = $('.vlt-fullpage-slider');
                        if (fpInstance.length && fpInstance.fullpage) {
                            fpInstance.fullpage('moveTo', target);
                        }
                    }
                } else {
                    // Fallback: scroll to section
                    const section = document.querySelector(`[data-anchor="${target}"]`);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        } else if (typeof target === 'function') {
            // Custom callback
            return this.transition(target);
        }
    }
    
    /**
     * Destroy the transition system
     */
    destroy() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
        this.isTransitioning = false;
        
        if (this.config.debug) {
            console.log('[LiquidGlassTransition] Destroyed');
        }
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LiquidGlassTransition;
}

// Global export for browser usage
if (typeof window !== 'undefined') {
    window.LiquidGlassTransition = LiquidGlassTransition;
}

/**
 * Helper function for easy initialization with link interception
 */
function initLiquidGlassTransition(options = {}) {
    const transition = new LiquidGlassTransition(options);
    
    // Integration with fullpage.js if available
    if (typeof $.fn.fullpage !== 'undefined') {
        // Hook into fullpage.js navigation events
        $(document).on('click', 'a[href^="#"]', function(e) {
            const href = $(this).attr('href');
            if (href && href.length > 1) {
                const anchor = href.substring(1);
                const targetSection = $(`[data-anchor="${anchor}"]`);
                
                if (targetSection.length > 0) {
                    e.preventDefault();
                    transition.navigateTo(anchor);
                }
            }
        });
        
        if (options.debug) {
            console.log('[LiquidGlassTransition] Integrated with fullpage.js');
        }
    } else if (options.autoIntercept !== false) {
        // Fallback: Auto-intercept internal navigation links
        document.addEventListener('click', function(e) {
            // Find closest anchor tag
            const link = e.target.closest('a');
            
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Check if it's an internal section link
            if (href && href.startsWith('#') && href.length > 1) {
                const anchor = href.substring(1);
                
                // Check if target section exists
                const targetSection = document.querySelector(`[data-anchor="${anchor}"]`);
                
                if (targetSection) {
                    e.preventDefault();
                    transition.navigateTo(anchor);
                }
            }
        });
    }
    
    return transition;
}

// Export helper function
if (typeof window !== 'undefined') {
    window.initLiquidGlassTransition = initLiquidGlassTransition;
}
