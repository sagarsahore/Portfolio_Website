/***********************************************
 * SITE: PRELOADER
 ***********************************************/
(function ($) {
	'use strict';
	// check if plugin defined
	if (typeof $.fn.animsition == 'undefined') {
		return;
	}
	
	var el = $('.animsition');
	
	// Optimize preloader settings for mobile
	var preloaderSettings = {
		inDuration: VLTJS.isMobile.any() ? 300 : 500, // Faster on mobile
		outDuration: VLTJS.isMobile.any() ? 300 : 500, // Faster on mobile
		linkElement: 'a:not([target="_blank"]):not([href^="#"]):not([rel="nofollow"]):not([href~="#"]):not([href^=mailto]):not([href^=tel]):not(.sf-with-ul)',
		loadingClass: 'animsition-loading-2',
		loadingInner: '<div class="spinner"><span class="double-bounce-one"></span><span class="double-bounce-two"></span></div>',
	};
	
	// Disable preloader animations on low-performance devices
	if (VLTJS.isMobile && VLTJS.isMobile.shouldReduceAnimations && VLTJS.isMobile.shouldReduceAnimations()) {
		preloaderSettings.inDuration = 100;
		preloaderSettings.outDuration = 100;
		preloaderSettings.loadingInner = '<div class="spinner-simple">Loading...</div>';
	}
	
	el.animsition(preloaderSettings);
	
	el.on('animsition.inEnd', function () {
		VLTJS.window.trigger('vlt.preloader_done');
		VLTJS.html.addClass('vlt-is-page-loaded');
		
		// Clean up performance monitoring for preloader
		if (VLTJS.performance && VLTJS.performance.enableHardwareAcceleration) {
			// Remove will-change after animations complete to save resources
			setTimeout(function() {
				$('.vlt-animated-block, .vlt-fade-in-left, .vlt-fade-in-right, .vlt-fade-in-top, .vlt-fade-in-bottom').css('will-change', 'auto');
			}, 1000);
		}
	});
})(jQuery);