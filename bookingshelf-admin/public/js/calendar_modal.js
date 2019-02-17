$(document).ready(function () {
    $('body').click(function () {
        $('.datepickers-container').fadeOut(400);
    });
    $('.calendar_modal_button').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.datepickers-container').fadeIn(400);
    });
    $('.datepickers-container').click(function (e) {
        e.stopPropagation();
    });

});