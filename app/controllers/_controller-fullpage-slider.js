/***********************************************
 * PAGE: FULLPAGE SLIDER - Enhanced with Animation Engine 2.0
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.fullpageSlider = {
		usingEngine2: false,
		currentIndex: 0,
		
		init: function () {
			// Check if Animation Engine 2.0 is available and should take over
			if (typeof VLTAnimationEngine !== 'undefined' && VLTJS.isMobile.any()) {
				console.log('Using VLT Animation Engine 2.0 for mobile-optimized section transitions');
				this.usingEngine2 = true;
				this.initEngine2();
				return;
			}
			
			// Fallback to traditional pagepiling
			this.initTraditional();
		},
		
		initEngine2: function () {
			// Let the new engine handle section transitions
			// We still need to maintain compatibility with existing navigation
			var self = this;
			var el = $('.vlt-fullpage-slider');
			var progress_bar = el.find('.vlt-fullpage-slider-progress-bar');
			var numbers = el.find('.vlt-fullpage-slider-numbers');
			
			// Set up navigation elements
			this.setupProgressBar(progress_bar);
			this.setupNumbers(numbers);
			
			// Listen for engine events
			window.addEventListener('vlt.sectionTransition', function(e) {
				self.currentIndex = e.detail.to;
				self.updateNavigation(e.detail.from, e.detail.to);
				self.updateBrightness();
				
				// Trigger compatibility event
				VLTJS.window.trigger('vlt.change-slide');
			});
			
			// Set up menu integration
			this.setupMenuIntegration();
		},
		
		initTraditional: function () {
			// Traditional pagepiling initialization
			if (typeof $.fn.pagepiling == 'undefined') {
				return;
			}
			
			var el = $('.vlt-fullpage-slider'),
				progress_bar = el.find('.vlt-fullpage-slider-progress-bar'),
				numbers = el.find('.vlt-fullpage-slider-numbers'),
				loop_top = el.data('loop-top') ? true : false,
				loop_bottom = el.data('loop-bottom') ? true : false,
				speed = VLTJS.isMobile.any() ? 400 : (el.data('speed') || 800), // Faster for mobile
				anchors = [];

			VLTJS.body.css('overflow', 'hidden');
			VLTJS.html.css('overflow', 'hidden');

			el.find('[data-anchor]').each(function () {
				anchors.push($(this).data('anchor'));
			});

			var self = this;

			el.pagepiling({
				menu: '.vlt-offcanvas-menu ul.sf-menu, .vlt-fullpage-slider-progress-bar',
				scrollingSpeed: speed,
				loopTop: loop_top,
				loopBottom: loop_bottom,
				anchors: anchors,
				sectionSelector: '.vlt-section',
				navigation: false,
				afterRender: function () {
					self.setupProgressBar(progress_bar);
					self.updateBrightness();
					self.updateSlideCounter(numbers);
					VLTJS.window.trigger('vlt.change-slide');
				},
				onLeave: function (index, nextIndex, direction) {
					self.currentIndex = nextIndex - 1;
					self.updateBrightness();
					self.updateProgressNavigation(progress_bar, direction, nextIndex);
					self.updateSlideCounter(numbers);
					VLTJS.window.trigger('vlt.change-slide');
				},
				afterLoad: function (anchorLink, index) {
					progress_bar.find('li.active').prevAll().addClass('prev');
					self.updateNavbarSolid();
				}
			});

			this.setupNumbers(numbers);
			this.setupScrollableNavbar(el);
		},
		
		setupProgressBar: function(progress_bar) {
			progress_bar.find('li:first-child').addClass('active').end().addClass('is-show');
		},
		
		setupNumbers: function(numbers) {
			var self = this;
			numbers.on('click', '>a', function (e) {
				e.preventDefault();
				if (self.usingEngine2) {
					VLTAnimationEngine.nextSection();
				} else {
					$.fn.pagepiling.moveSectionDown();
				}
			});
		},
		
		setupMenuIntegration: function() {
			var self = this;
			
			// Handle menu clicks for Engine 2.0
			$('.vlt-offcanvas-menu ul.sf-menu a, .vlt-fullpage-slider-progress-bar a').on('click', function(e) {
				var href = $(this).attr('href');
				if (href && href.startsWith('#')) {
					e.preventDefault();
					var anchor = href.substring(1);
					var targetIndex = self.getIndexByAnchor(anchor);
					if (targetIndex >= 0) {
						VLTAnimationEngine.goToSection(targetIndex);
					}
				}
			});
		},
		
		getIndexByAnchor: function(anchor) {
			var index = -1;
			$('.vlt-section[data-anchor]').each(function(i) {
				if ($(this).data('anchor') === anchor) {
					index = i;
					return false;
				}
			});
			return index;
		},
		
		updateNavigation: function(fromIndex, toIndex) {
			var progress_bar = $('.vlt-fullpage-slider-progress-bar');
			var numbers = $('.vlt-fullpage-slider-numbers');
			
			// Update progress bar
			var targetLi = progress_bar.find('li').eq(toIndex);
			progress_bar.find('li').removeClass('active');
			targetLi.addClass('active');
			
			if (toIndex > fromIndex) {
				targetLi.prevAll().addClass('prev');
			} else {
				targetLi.removeClass('prev');
			}
			
			// Update numbers
			this.updateSlideCounter(numbers);
		},
		
		updateBrightness: function() {
			var section = $('.vlt-section').eq(this.currentIndex);
			switch (section.data('brightness')) {
				case 'light':
					VLTJS.html.removeClass('is-light').addClass('is-dark');
					break;
				case 'dark':
					VLTJS.html.removeClass('is-dark').addClass('is-light');
					break;
			}
		},
		
		updateProgressNavigation: function(progress_bar, direction, index) {
			switch (direction) {
				case 'down':
					progress_bar.find('li:nth-child(' + index + ')').prevAll().addClass('prev');
					break;
				case 'up':
					progress_bar.find('li:nth-child(' + index + ')').removeClass('prev');
					break;
			}
		},
		
		updateSlideCounter: function(numbers) {
			var index = this.currentIndex;
			if (index === 0) {
				numbers.html('<a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg></a>');
			} else {
				numbers.html(VLTJS.addLedingZero(index + 1));
			}
		},
		
		updateNavbarSolid: function() {
			var el = $('.vlt-fullpage-slider');
			if (el.find('.pp-section.active').scrollTop() > 0) {
				$('.vlt-navbar').addClass('vlt-navbar--solid');
			} else {
				$('.vlt-navbar').removeClass('vlt-navbar--solid');
			}
		},
		
		setupScrollableNavbar: function(el) {
			el.find('.pp-scrollable').on('scroll', function () {
				var scrollTop = $(this).scrollTop();
				if (scrollTop > 0) {
					$('.vlt-navbar').addClass('vlt-navbar--solid');
				} else {
					$('.vlt-navbar').removeClass('vlt-navbar--solid');
				}
			});
		},
		
		// Public API methods
		goToSection: function(index) {
			if (this.usingEngine2) {
				VLTAnimationEngine.goToSection(index);
			} else if (typeof $.fn.pagepiling !== 'undefined') {
				$.fn.pagepiling.moveTo(index + 1);
			}
		},
		
		nextSection: function() {
			if (this.usingEngine2) {
				VLTAnimationEngine.nextSection();
			} else if (typeof $.fn.pagepiling !== 'undefined') {
				$.fn.pagepiling.moveSectionDown();
			}
		},
		
		previousSection: function() {
			if (this.usingEngine2) {
				VLTAnimationEngine.previousSection();
			} else if (typeof $.fn.pagepiling !== 'undefined') {
				$.fn.pagepiling.moveSectionUp();
			}
		}
	};
	
	// Initialize with enhanced mobile detection
	$(document).ready(function() {
		VLTJS.fullpageSlider.init();
		
		// Performance logging
		if (typeof console !== 'undefined' && console.log) {
			console.log('VLT Fullpage Slider initialized');
			console.log('Using Engine 2.0:', VLTJS.fullpageSlider.usingEngine2);
			console.log('Mobile device:', VLTJS.isMobile.any());
		}
	});
	
})(jQuery);