$('#projects-tab a').on('click', function (e) {
  e.preventDefault();
  $(this).tab('show');
});

$('form').submit(e => {
  e.preventDefault();
  const $input = $(e.target).find('#zip');
  const address = $input.val();
  $input.val('');
  console.log(address);
  setPopover(address);
});

// const setPopover = content => {
//   const $input = $('#zip');
//   $input.popover('show', { content });
//   setTimeout(() => $input.popover('hide', { content: '' }), 3000);
// }

const $radioGroup = $('.btn-group-toggle');
$radioGroup.on('change', e => {
  console.log(e.target.name);
  // 'imperial', 'metric'
});
