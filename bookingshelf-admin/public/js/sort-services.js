$(document).ready(function () {
    var container = document.getElementById("sortable_list");
    var sort = Sortable.create(container, {
        animation: 150,
        handle: ".ellipsis",
        onUpdate: function (evt) {
            var item = evt.item;
        }
    });
});