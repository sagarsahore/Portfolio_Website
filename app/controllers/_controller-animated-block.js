/***********************************************
 * WIDGET: ANIMATED BLOCK
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.animatedBlock = {
		init: function () {
			var el = $('.vlt-animated-block');
			
			// Use intersection observer if available and not already initialized by helpers
			if (window.IntersectionObserver && !VLTJS.intersectionObserver.observer) {
				this.initIntersectionObserver(el);
			} else {
				// Fallback to existing slide-based animation
				this.initSlideBasedAnimation(el);
			}
		},
		
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
						
						// Check if we should reduce animations
						if (VLTJS.isMobile && VLTJS.isMobile.shouldReduceAnimations && VLTJS.isMobile.shouldReduceAnimations()) {
							$element.addClass('vlt-no-animation');
						}
						
						// Add hardware acceleration for mobile
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
			// Original slide-based animation for fullpage slider
			el.each(function () {
				var $this = $(this);
				VLTJS.window.on('vlt.change-slide', function () {
					$this.removeClass('animated');
					if ($this.parents('.vlt-section').hasClass('active')) {
						// Add hardware acceleration for mobile
						if (VLTJS.isMobile.any() && VLTJS.performance && VLTJS.performance.enableHardwareAcceleration) {
							VLTJS.performance.enableHardwareAcceleration($this);
						}
						
						// Check if we should reduce animations
						if (VLTJS.isMobile && VLTJS.isMobile.shouldReduceAnimations && VLTJS.isMobile.shouldReduceAnimations()) {
							$this.addClass('vlt-no-animation');
						}
						
						$this.addClass('animated');
					}
				});
			});
		}
	}
	
	// Initialize when DOM is ready
	$(document).ready(function() {
		VLTJS.animatedBlock.init();
		
		// Add instant visual feedback for animations
		$('.vlt-animated-block').each(function() {
			var $this = $(this);
			// Add a subtle pre-animation state to prevent blank content
			if (!$this.hasClass('animated')) {
				$this.addClass('vlt-pre-animated');
			}
		});
	});

})(jQuery);