/***********************************************
 * SITE: PRELOADER
 ***********************************************/
(function ($) {
    'use strict';
    // Skip page transition animation and mark the page as loaded
    $(window).on('load', function () {
        VLTJS.window.trigger('vlt.preloader_done');
        VLTJS.html.addClass('vlt-is-page-loaded');
    });
})(jQuery);
