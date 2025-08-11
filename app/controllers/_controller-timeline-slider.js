/***********************************************
 * WIDGET: TIMELINE SLIDER
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.timelineSlider = {
		init: function () {
			// check if plugin defined
			if (typeof Swiper == 'undefined') {
				return;
			}
			var el = $('.vlt-timeline-slider .swiper-container');
			el.each(function () {
				var $this = $(this);
				var $slider = $this.closest('.vlt-timeline-slider');
				var sliderType = $slider.attr('data-slider') || 'default';
				var $controls = $('.vlt-timeline-slider-controls[data-slider="' + sliderType + '"]');
				
				$this.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');
				
				new Swiper(this, {
					speed: 1000,
					spaceBetween: 0,
					grabCursor: true,
					slidesPerView: 1,
					navigation: {
						nextEl: $controls.find('.next')[0],
						prevEl: $controls.find('.prev')[0],
					},
					pagination: {
						el: $controls.find('.pagination')[0],
						clickable: false,
						type: 'fraction',
						renderFraction: function (currentClass, totalClass) {
							return '<span class="' + currentClass + '"></span>' +
								'<span class="sep">/</span>' +
								'<span class="' + totalClass + '"></span>';
						}
					}
				});
			});

		}
	};

	VLTJS.timelineSlider.init()

})(jQuery);