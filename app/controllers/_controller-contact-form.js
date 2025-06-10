/***********************************************
 * WIDGET: CONTACT FORM
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.contactForm = {
		init: function () {
			// check if plugin defined
			if (typeof $.fn.validate == 'undefined') {
				return;
			}
			var el = $('.vlt-contact-form');
			el.each(function () {
				var thisForm = $(this),
					successMessage = thisForm.find('.message.success'),
					errorMessage = thisForm.find('.message.danger');
                                thisForm.validate({
                                        errorClass: 'error',
                                        submitHandler: function (form) {
                                                // Validation passed. Submission is handled in form.js
                                        }
                                });

			});
		}
	}
	VLTJS.contactForm.init();

})(jQuery);