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
                       var controls = $('.vlt-timeline-slider-controls');
                       el.each(function (index) {
                                var $this = $(this);
                                $this.find('.swiper-wrapper > *').wrap('<div class="swiper-slide">');

                                var $ctrl = controls.eq(index);
                                new Swiper(this, {
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