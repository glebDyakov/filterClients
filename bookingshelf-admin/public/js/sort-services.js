$(document).ready(function() {
  const container = document.getElementById('sortable_list');
  const sort = Sortable.create(container, {
    animation: 150,
    handle: '.ellipsis',
    onUpdate: function(evt) {
      const item = evt.item;
    },
  });
});
