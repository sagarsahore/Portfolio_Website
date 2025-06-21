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
                       var sliders = $('.vlt-timeline-slider');
                       sliders.each(function () {
                                var $slider = $(this);
                                var $container = $slider.find('.swiper-container');
                                var $ctrl = $slider.prev('.vlt-timeline-slider-controls');

                                $container.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

                                new Swiper($container[0], {
                                        speed: 1000,
                                        spaceBetween: 0,
                                        grabCursor: true,
                                        slidesPerView: 1,
                                        navigation: {
                                                nextEl: $ctrl.find('.next')[0],
                                                prevEl: $ctrl.find('.prev')[0]
                                        },
                                        pagination: {
                                                el: $ctrl.find('.pagination')[0],
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
