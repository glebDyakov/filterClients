function shapeJs() {
    $(document).ready(function () {
        $('.blob').css('fill', "#3E50F7");
        $("#blob").attr('height', "300").attr('width', "300");
        $('.blob').attr('r', "300");
        $('.blob').toggleClass('animate-blob');

    });
}