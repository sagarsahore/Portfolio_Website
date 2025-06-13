// Simple toggle for extra portfolio items
$(document).ready(function(){
    const btn = $('#toggle-projects');
    const projects = $('#additional-projects');

    btn.on('click', function(){
        // Toggle additional projects with a sliding animation
        projects.slideToggle(400);
        const expanded = btn.attr('data-expanded') === 'true';
        if(expanded){
            btn.attr('data-expanded','false');
            btn.find('.vlt-btn__text').text('Show More Projects');
        } else {
            btn.attr('data-expanded','true');
            btn.find('.vlt-btn__text').text('Show Less Projects');
        }
    });
});
