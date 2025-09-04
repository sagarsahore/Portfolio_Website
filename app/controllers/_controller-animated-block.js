/***********************************************
 * VLT ANIMATED BLOCK - Engine 2.0 Integration
 * Ultra-fast mobile-first animation controller
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.animatedBlock = {
		
		// Legacy compatibility wrapper for VLT Animation Engine 2.0
		init: function () {
			// Check if new animation engine is available
			if (typeof VLTAnimationEngine !== 'undefined') {
				console.log('Using VLT Animation Engine 2.0 for optimized performance');
				this.initEngine2();
			} else {
				console.log('Fallback to legacy animation system');
				this.initLegacy();
			}
		},
		
		initEngine2: function () {
			// The new engine handles everything automatically
			// We just need to ensure proper integration with existing slide events
			var self = this;
			
			// Listen for section transitions
			window.addEventListener('vlt.sectionTransition', function(e) {
				self.handleSectionChange(e.detail.to);
			});
			
			// Handle fullpage slider integration
			VLTJS.window.on('vlt.change-slide', function() {
				// Let the new engine handle this automatically
				// The engine's section transition system will take over
			});
			
			// Instant initialization for above-fold content
			this.instantInit();
		},
		
		initLegacy: function () {
			// Legacy fallback system
			var el = $('.vlt-animated-block');
			
			if (window.IntersectionObserver) {
				this.initIntersectionObserver(el);
			} else {
				this.initSlideBasedAnimation(el);
			}
		},
		
		instantInit: function () {
			// Provide immediate visual feedback
			$('.vlt-animated-block').each(function() {
				var $this = $(this);
				var rect = this.getBoundingClientRect();
				
				// Elements above the fold get instant animation
				if (rect.top < window.innerHeight) {
					$this.addClass('vlt-instant-show');
				} else {
					// Elements below fold get pre-animation state
					$this.addClass('vlt-pre-animated');
				}
			});
		},
		
		handleSectionChange: function(sectionIndex) {
			// Enhanced section change handling for new engine
			var activeSection = $('.vlt-section').eq(sectionIndex);
			var animatedElements = activeSection.find('.vlt-animated-block');
			
			// Reset all animations in the section
			animatedElements.removeClass('animated vlt-pre-animated');
			
			// Trigger staggered animations with mobile-optimized timing
			animatedElements.each(function(index) {
				var $element = $(this);
				var delay = window.VLTAnimationEngine ? 
					(VLTJS.isMobile.any() ? index * 50 : index * 100) : 
					index * 150; // Fallback timing
				
				setTimeout(function() {
					$element.addClass('animated');
				}, delay);
			});
		},
		
		// Legacy methods for compatibility
		initIntersectionObserver: function (el) {
			var options = {
				root: null,
				rootMargin: VLTJS.isMobile.any() ? '10px' : '50px',
				threshold: VLTJS.isMobile.any() ? 0.1 : 0.3
			};
			
			var observer = new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						var $element = $(entry.target);
						
						// Enhanced mobile performance checks
						if (VLTJS.isMobile && VLTJS.isMobile.shouldReduceAnimations && VLTJS.isMobile.shouldReduceAnimations()) {
							$element.addClass('vlt-no-animation');
						}
						
						// Mobile-optimized hardware acceleration
						if (VLTJS.isMobile.any() && VLTJS.performance && VLTJS.performance.enableHardwareAcceleration) {
							VLTJS.performance.enableHardwareAcceleration($element);
						}
						
						$element.addClass('animated');
						observer.unobserve(entry.target);
					}
				});
			}, options);
			
			el.each(function () {
				observer.observe(this);
			});
		},
		
		initSlideBasedAnimation: function (el) {
			// Legacy slide-based animation
			el.each(function () {
				var $this = $(this);
				VLTJS.window.on('vlt.change-slide', function () {
					$this.removeClass('animated');
					if ($this.parents('.vlt-section').hasClass('active')) {
						
						// Mobile performance optimization
						if (VLTJS.isMobile.any() && VLTJS.performance && VLTJS.performance.enableHardwareAcceleration) {
							VLTJS.performance.enableHardwareAcceleration($this);
						}
						
						// Reduced motion support
						if (VLTJS.isMobile && VLTJS.isMobile.shouldReduceAnimations && VLTJS.isMobile.shouldReduceAnimations()) {
							$this.addClass('vlt-no-animation');
						}
						
						$this.addClass('animated');
					}
				});
			});
		},
		
		// Public API methods
		triggerAnimation: function(element) {
			$(element).addClass('animated');
		},
		
		resetAnimation: function(element) {
			$(element).removeClass('animated vlt-pre-animated').addClass('vlt-pre-animated');
		},
		
		// Performance monitoring
		getActiveAnimations: function() {
			return $('.vlt-animated-block.animated').length;
		}
	}
	
	// Enhanced initialization
	$(document).ready(function() {
		VLTJS.animatedBlock.init();
		
		// Performance monitoring
		if (typeof console !== 'undefined' && console.log) {
			console.log('VLT Animated Block Controller initialized');
			console.log('Mobile device:', VLTJS.isMobile.any());
			console.log('Animation Engine 2.0:', typeof VLTAnimationEngine !== 'undefined');
		}
	});

	// Early initialization for critical above-fold content
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function() {
			VLTJS.animatedBlock.instantInit();
		});
	} else {
		VLTJS.animatedBlock.instantInit();
	}

})(jQuery);