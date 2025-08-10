/***********************************************
 * WIDGET: PROGRESS BAR
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.progressBar = {
		init: function () {
			// check if plugin defined
			if (typeof gsap == 'undefined') {
				return;
			}
			var el = $('.vlt-progress-bar');
			
			// Only initialize if progress bar elements exist
			if (el.length === 0) {
				return;
			}
			
			el.each(function () {
				var $this = $(this),
					final_value = $this.data('final-value') || 0,
					animation_duration = $this.data('animation-speed') || 0,
					delay = 500,
					obj = {
						count: 0
					};

				VLTJS.window.on('vlt.change-slide', function () {
					if ($this.parents('.vlt-section').hasClass('active')) {

						obj.count = 0;
						var counterEl = $this.find('.vlt-progress-bar__title > .counter');
						var barEl = $this.find('.vlt-progress-bar__bar > span');
						
						// Check if required elements exist before animating
						if (counterEl.length > 0) {
							counterEl.text(Math.round(obj.count));
						}
						
						if (barEl.length > 0) {
							gsap.set(barEl, {
								width: 0
							});
							gsap.to(barEl, animation_duration / 1000, {
								width: final_value + '%',
								delay: delay / 1000
							});
						}
						
						if (counterEl.length > 0) {
							gsap.to(obj, (animation_duration / 1000) / 2, {
								count: final_value,
								delay: delay / 1000,
								onUpdate: function () {
									counterEl.text(Math.round(obj.count));
								}
							});
						}

					}
				});

			});
		}
	}
	VLTJS.progressBar.init();

})(jQuery);