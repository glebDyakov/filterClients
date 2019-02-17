$(document).ready(function () {

    var top = 1;
    $(window).scroll(function () {
        var y = $(this).scrollTop();
        if (y >= top)
            $('header').addClass('header_fixed');
        else
            $('header').removeClass('header_fixed');
    });

    $('.bxslider').bxSlider({
        minSlides: '1',
        nextText: '',
        prevText: '',
        maxSlides: '3',
        slideWidth: '290',
        moveSlides: '1',
//    auto: true,
        speed: 200,
        infiniteLoop: true
    });
    $('.bxslider2').bxSlider({
        minSlides: '1',
        nextText: '',
        prevText: '',
        maxSlides: '3',
        slideWidth: '300',
        moveSlides: '1',
        slideMargin: 15,
//    auto: true,
        speed: 200,
        infiniteLoop: true
    });


    $('.burger').click(function () {
        $('header > div > div').fadeIn(300);
    });
    $('header > div > div .close').click(function (e) {
        $('header > div > div').fadeOut(300);
        e.stopPropagation();
    });

    $('.details_list').click(function () {
        $(this).parent('li').hasClass('active');
        $(this).parent('li').children('ul').slideDown(300);
        $(this).parent('li').addClass('active');
    });

    $('.reg').click(function () {
        $('.modal').fadeIn(300);
    });

    $('.log_in').click(function () {
        $('.modal').fadeIn(300);
        $('.tab_reg').fadeOut(0);
        $('.tab_sign_in').fadeIn(300);
        $('.tab_sign_in').addClass('active');
        $('.sign_in_modal').addClass('active');
        $('.registry').removeClass('active');
        $('.tab_reg').removeClass('active');
    });

    $('.modal .closer').click(function (e) {
        $('.modal').fadeOut(300);
        e.stopPropagation();
    });

    $('.modal .bg-modal').click(function (e) {
        $('.modal').fadeOut(300);
        e.stopPropagation();
    });

    $('.registry').click(function () {
        $('.tab_sign_in').fadeOut(0);
        $('.tab_reg').fadeIn(300);
        $('.tab_reg').addClass('active');
        $('.registry').addClass('active');
        $('.sign_in_modal').removeClass('active');
        $('.tab_sign_in').removeClass('active');
    });

    $('.sign_in_modal').click(function () {
        $('.tab_reg').fadeOut(0);
        $('.tab_sign_in').fadeIn(300);
        $('.tab_sign_in').addClass('active');
        $('.sign_in_modal').addClass('active');
        $('.registry').removeClass('active');
        $('.tab_reg').removeClass('active');
    });

    $('.popup_forgot').click(function (e) {
        $('.modal2').fadeIn(300);
        e.stopPropagation();
        $('.modal').fadeOut(0);
    });

    $('.modal2 .closer').click(function (e) {
        $('.modal2').fadeOut(0);
        e.stopPropagation();
    });

    $('.modal2 .bg-modal').click(function (e) {
        $('.modal2').fadeOut(0);
        e.stopPropagation();
    });

    var $page = $('html, body');
    $('a[href*="#"]').click(function () {
        $page.animate({
            scrollTop: $($.attr(this, 'href')).offset().top - 100  //добавила -100
        }, 1500);
        return false;
    });
});

