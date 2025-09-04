/***********************************************
 * VLThemes
 ***********************************************/

'use strict';

/**
 * Initialize main helper object
 */
var VLTJS = {
	window: jQuery(window),
	document: jQuery(document),
	html: jQuery('html'),
	body: jQuery('body'),
	is_safari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
	is_firefox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
	is_chrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor || ''),
	is_ie10: (navigator.appVersion || '').indexOf('MSIE 10') !== -1,
	transitionEnd: 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
	animIteration: 'animationiteration webkitAnimationIteration oAnimationIteration MSAnimationIteration',
	animationEnd: 'animationend webkitAnimationEnd'
};

/**
 * Enhanced mobile detection and performance utilities
 */
VLTJS.isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (VLTJS.isMobile.Android() || VLTJS.isMobile.BlackBerry() || VLTJS.isMobile.iOS() || VLTJS.isMobile.Opera() || VLTJS.isMobile.Windows());
	},
	// Enhanced detection
	isTouch: function () {
		return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	},
	isLowPerformance: function () {
		// Check for low-end mobile indicators
		var hardwareConcurrency = navigator.hardwareConcurrency || 1;
		var deviceMemory = navigator.deviceMemory || 1;
		var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
		var isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
		
		return hardwareConcurrency <= 2 || deviceMemory <= 2 || isSlowConnection;
	},
	shouldReduceAnimations: function () {
		// Respect user's motion preferences
		var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		return prefersReducedMotion || this.isLowPerformance();
	}
};

/**
 * Performance monitoring utilities
 */
VLTJS.performance = {
	animationFrameRate: 60,
	frameDropThreshold: 10,
	frameCount: 0,
	startTime: performance.now(),
	
	init: function () {
		// Only monitor performance on mobile devices
		if (typeof VLTJS !== 'undefined' && VLTJS.isMobile && VLTJS.isMobile.any && VLTJS.isMobile.any()) {
			this.monitorPerformance();
		}
	},
	
	monitorPerformance: function () {
		var self = this;
		var lastTime = performance.now();
		
		function checkFrame() {
			var currentTime = performance.now();
			var delta = currentTime - lastTime;
			var fps = 1000 / delta;
			
			self.frameCount++;
			
			// Check if frame rate is dropping
			if (fps < (self.animationFrameRate - self.frameDropThreshold)) {
				VLTJS.html.addClass('vlt-performance-low');
			} else if (self.frameCount > 60) { // Check after 60 frames
				VLTJS.html.removeClass('vlt-performance-low');
			}
			
			lastTime = currentTime;
			
			// Use requestAnimationFrame if available, fallback to setTimeout
			if (typeof requestAnimationFrame !== 'undefined') {
				requestAnimationFrame(checkFrame);
			} else {
				setTimeout(checkFrame, 16); // ~60fps fallback
			}
		}
		
		if (typeof requestAnimationFrame !== 'undefined') {
			requestAnimationFrame(checkFrame);
		} else {
			setTimeout(checkFrame, 16);
		}
	},
	
	enableHardwareAcceleration: function (element) {
		if (element && element.length) {
			element.css({
				'transform': 'translateZ(0)',
				'will-change': 'transform, opacity',
				'backface-visibility': 'hidden',
				'-webkit-perspective': '1000px',
				'perspective': '1000px'
			});
		}
	}
};

/**
 * Debounce resize
 */
var resizeArr = [];
var resizeTimeout;
VLTJS.window.on('load resize orientationchange', function(e) {
	if (resizeArr.length) {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function() {
			for (var i = 0; i < resizeArr.length; i++) {
				resizeArr[i](e);
			}
		}, 250);
	}
});

VLTJS.debounceResize = function(callback) {
	if (typeof callback === 'function') {
		resizeArr.push(callback);
	} else {
		window.dispatchEvent(new Event('resize'));
	}
}

VLTJS.addLedingZero = function (number) {
	return ('0' + number).slice(-2);
}

/**
 * Throttle scroll
 */
var throttleArr = [];
var didScroll;
var delta = 5;
var lastScrollTop = 0;

VLTJS.window.on('load resize scroll orientationchange', function() {
	if (throttleArr.length) {
		didScroll = true;
	}
});

function hasScrolled() {

	var scrollTop = VLTJS.window.scrollTop(),
		windowHeight = VLTJS.window.height(),
		documentHeight = VLTJS.document.height(),
		scrollState = '';

	// Make sure they scroll more than delta
	if (Math.abs(lastScrollTop - scrollTop) <= delta) {
		return;
	}

	if (scrollTop > lastScrollTop) {
		scrollState = 'down';
	} else if (scrollTop < lastScrollTop) {
		scrollState = 'up';
	} else {
		scrollState = 'none';
	}

	if (scrollTop === 0) {
		scrollState = 'start';
	} else if (scrollTop >= documentHeight - windowHeight) {
		scrollState = 'end';
	}

	for (var i in throttleArr) {
		if (typeof throttleArr[i] === 'function') {
			throttleArr[i](scrollState, scrollTop, lastScrollTop, VLTJS.window);
		}
	}

	lastScrollTop = scrollTop;
}

setInterval(function() {
	if (didScroll) {
		didScroll = false;
		if (typeof requestAnimationFrame !== 'undefined') {
			requestAnimationFrame(hasScrolled);
		} else {
			hasScrolled();
		}
	}
}, 250);

VLTJS.throttleScroll = function(callback) {
	if (typeof callback === 'function') {
		throttleArr.push(callback);
	}
}

/**
 * Intersection Observer for lazy loading animations
 */
VLTJS.intersectionObserver = {
	observer: null,
	animatedElements: [],
	
	init: function () {
		if (typeof window !== 'undefined' && !window.IntersectionObserver) {
			// Fallback for browsers without intersection observer support
			this.fallbackToScroll();
			return;
		}
		
		if (typeof window === 'undefined') {
			// Server-side or test environment, skip initialization
			return;
		}
		
		var options = {
			root: null,
			rootMargin: (typeof VLTJS !== 'undefined' && VLTJS.isMobile && VLTJS.isMobile.any && VLTJS.isMobile.any()) ? '10px' : '50px', // Smaller margin for mobile
			threshold: (typeof VLTJS !== 'undefined' && VLTJS.isMobile && VLTJS.isMobile.any && VLTJS.isMobile.any()) ? 0.1 : 0.3 // Lower threshold for mobile
		};
		
		this.observer = new window.IntersectionObserver(this.handleIntersection.bind(this), options);
		this.observeElements();
	},
	
	observeElements: function () {
		if (typeof document === 'undefined') {
			return;
		}
		
		var elements = document.querySelectorAll('.vlt-animated-block, .vlt-fade-in-left, .vlt-fade-in-right, .vlt-fade-in-top, .vlt-fade-in-bottom');
		
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			this.observer.observe(element);
			this.animatedElements.push(element);
			
			// Add hardware acceleration for mobile
			if (typeof VLTJS !== 'undefined' && VLTJS.isMobile && VLTJS.isMobile.any && VLTJS.isMobile.any()) {
				VLTJS.performance.enableHardwareAcceleration(jQuery(element));
			}
		}
	},
	
	handleIntersection: function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				var element = entry.target;
				var $element = $(element);
				
				// Check if we should reduce animations
				if (VLTJS.isMobile.shouldReduceAnimations()) {
					$element.addClass('vlt-no-animation');
				}
				
				// Add appropriate classes based on element type
				if ($element.hasClass('vlt-animated-block')) {
					$element.addClass('animated');
				} else {
					$element.closest('.vlt-section').addClass('active');
				}
				
				// Stop observing this element
				VLTJS.intersectionObserver.observer.unobserve(element);
			}
		});
	},
	
	fallbackToScroll: function () {
		// Fallback for browsers without intersection observer
		VLTJS.throttleScroll(function (scrollState, scrollTop, lastScrollTop, $window) {
			var windowHeight = $window.height();
			
			$('.vlt-animated-block, .vlt-fade-in-left, .vlt-fade-in-right, .vlt-fade-in-top, .vlt-fade-in-bottom').each(function () {
				var $this = $(this);
				var elementTop = $this.offset().top;
				var elementHeight = $this.outerHeight();
				var triggerPoint = (typeof VLTJS !== 'undefined' && VLTJS.isMobile && VLTJS.isMobile.any && VLTJS.isMobile.any()) ? windowHeight * 0.9 : windowHeight * 0.7;
				
				if (elementTop < scrollTop + triggerPoint && elementTop + elementHeight > scrollTop) {
					if (VLTJS.isMobile.shouldReduceAnimations()) {
						$this.addClass('vlt-no-animation');
					}
					
					if ($this.hasClass('vlt-animated-block')) {
						$this.addClass('animated');
					} else {
						$this.closest('.vlt-section').addClass('active');
					}
					
					// Add hardware acceleration for mobile
					if (typeof VLTJS !== 'undefined' && VLTJS.isMobile && VLTJS.isMobile.any && VLTJS.isMobile.any()) {
						VLTJS.performance.enableHardwareAcceleration($this);
					}
				}
			});
		});
	}
};

/**
 * VAR polyfill
 */
if (typeof cssVars !== 'undefined') {
	cssVars({
		onlyVars: true,
	});
}

/**
 * Early initialization for instant animation setup
 */
VLTJS.earlyInit = function() {
	// Add mobile-specific classes immediately
	if (typeof VLTJS !== 'undefined' && VLTJS.isMobile && VLTJS.isMobile.any && VLTJS.isMobile.any()) {
		VLTJS.html.addClass('vlt-is-mobile');
		
		if (VLTJS.isMobile.isTouch && VLTJS.isMobile.isTouch()) {
			VLTJS.html.addClass('vlt-is-touch');
		}
		
		if (VLTJS.isMobile.isLowPerformance && VLTJS.isMobile.isLowPerformance()) {
			VLTJS.html.addClass('vlt-is-low-performance');
		}
		
		if (VLTJS.isMobile.shouldReduceAnimations && VLTJS.isMobile.shouldReduceAnimations()) {
			VLTJS.html.addClass('vlt-reduce-animations');
		}
	}
	
	// Pre-apply hardware acceleration to avoid layout shifts
	if (typeof document !== 'undefined') {
		var style = document.createElement('style');
		style.textContent = `
			.vlt-animated-block,
			.vlt-fade-in-left,
			.vlt-fade-in-right,
			.vlt-fade-in-top,
			.vlt-fade-in-bottom {
				transform: translateZ(0);
				will-change: transform, opacity;
				backface-visibility: hidden;
			}
		`;
		document.head.appendChild(style);
	}
};

// Initialize immediately, don't wait for DOM ready
if (typeof window !== 'undefined') {
	VLTJS.earlyInit();
}

/**
 * Initialize mobile performance improvements
 */
jQuery(document).ready(function($) {
	// Initialize performance monitoring
	VLTJS.performance.init();
	
	// Initialize intersection observer for lazy loading
	VLTJS.intersectionObserver.init();
	
	// Mark animations as ready to prevent delays
	VLTJS.html.addClass('vlt-animations-ready');
});