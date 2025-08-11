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
					submitButton = thisForm.find('button[type="submit"], input[type="submit"]'),
					successMessage = thisForm.find('.message.success'),
					errorMessage = thisForm.find('.message.danger');

				// Set form start time for spam protection
				$.post('handler.php', { init_session: true });

				thisForm.validate({
					errorClass: 'error',
					errorPlacement: function(error, element) {
						// Place error message after the element
						error.insertAfter(element);
					},
					highlight: function(element) {
						$(element).attr('aria-invalid', 'true');
					},
					unhighlight: function(element) {
						$(element).removeAttr('aria-invalid');
					},
					rules: {
						name: {
							required: true,
							minlength: 2,
							maxlength: 100
						},
						email: {
							required: true,
							email: true,
							maxlength: 255
						},
						category: {
							maxlength: 100
						},
						message: {
							required: true,
							minlength: 10,
							maxlength: 2000
						}
					},
					messages: {
						name: {
							required: "Please enter your name",
							minlength: "Name must be at least 2 characters",
							maxlength: "Name must be less than 100 characters"
						},
						email: {
							required: "Please enter your email address",
							email: "Please enter a valid email address",
							maxlength: "Email must be less than 255 characters"
						},
						category: {
							maxlength: "Category must be less than 100 characters"
						},
						message: {
							required: "Please enter your message",
							minlength: "Message must be at least 10 characters",
							maxlength: "Message must be less than 2000 characters"
						}
					},
					submitHandler: function (form) {
						// Disable submit button and show loading state
						var originalText = submitButton.find('.vlt-btn__text').text();
						submitButton.prop('disabled', true)
								   .find('.vlt-btn__text').text('Sending...');

						$.ajax({
							type: 'POST',
							url: 'handler.php',
							data: new FormData(form),
							cache: false,
							contentType: false,
							processData: false,
							dataType: 'json',
							success: function (response) {
								if (response.success) {
									successMessage.find('span, div').remove();
									successMessage.append('<div>' + response.message + '</div>');
									successMessage.fadeIn();
									form.reset();
									setTimeout(function () {
										successMessage.fadeOut();
									}, 8000);
								} else {
									errorMessage.find('span, div').remove();
									errorMessage.append('<div>' + response.message + '</div>');
									errorMessage.fadeIn();
									setTimeout(function () {
										errorMessage.fadeOut();
									}, 8000);
								}
							},
							error: function (xhr, status, error) {
								var message = 'Sorry, there was an error sending your message. Please try again later.';
								
								// Try to get error message from response
								if (xhr.responseJSON && xhr.responseJSON.message) {
									message = xhr.responseJSON.message;
								}
								
								errorMessage.find('span, div').remove();
								errorMessage.append('<div>' + message + '</div>');
								errorMessage.fadeIn();
								setTimeout(function () {
									errorMessage.fadeOut();
								}, 8000);
							},
							complete: function () {
								// Re-enable submit button
								submitButton.prop('disabled', false)
										   .find('.vlt-btn__text').text(originalText);
							}
						});
					}
				});

			});
		}
	}
	VLTJS.contactForm.init();

})(jQuery);