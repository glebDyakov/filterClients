function initializeJs() {
    $(document).ready(function () {
        $('.mobile').click(function () {
            $('.phones_firm').fadeIn(300);
        });
        $('.phones_firm .closer').click(function (e) {
            $('.phones_firm').fadeOut(300);
            e.stopPropagation();
        });
        $(".nb").click(function () {
            console.log($(".nb"))
            $('.service_selection').fadeOut(0);
            $(this).parent().parent('.service_selection').next('.service_selection').fadeIn(100);
        });
        $(".skip_employee").click(function () {
            $('.service_selection').fadeOut(0);
            $('.screen2').fadeIn(100);
        });
        $(".prev_block3").click(function () {
            $('.service_selection').fadeOut(0);
            $(this).parent('.title_block').parent('.service_selection').prev('.service_selection').fadeIn(100);
        });
    });
}