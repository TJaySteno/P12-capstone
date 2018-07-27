/**********************************************************
  /MAPS
**********************************************************/

const getGeocode = query => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await $.ajax({
        type: 'POST',
        url: '/geocode',
        data: { query },
        dataType: 'json',
      });
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

/********************* THE MAP *********************/

let map;
let service;
let marker;

function initMap () {
  const mapDiv = document.querySelector('#map');
  const coord = mapDiv.attributes.value.value.split(' ');
  const center = { lat: Number(coord[0]), lng: Number(coord[1]) }

  map = new google.maps.Map(mapDiv, { center, zoom: 5 });
  marker = new google.maps.Marker({ position: center, map });
}

function recenterMap (center) {
  map.setCenter(center);
  marker.setPosition(center);
}

/********************* WEATHER DIV *********************/

// Accept address form submissions and find the query in Google Maps
$('#address-form').submit(async e => {
  try {
    e.preventDefault();
    const $input = $(e.target).find('#zip');
    const query = $input.val();
    $input.val('');

    const results = await getGeocode(query);

    const coord = results[0].geometry.location;
    recenterMap(coord)

    // TODO: setPopover(address)

  } catch (e) {
    console.error(e);
  }
});

// TODO: SET POPOVER?
// Set popover to display for a short time
// const setPopover = content => {
//   const $input = $('#zip');
//   $input.popover('show', { content });
//   setTimeout(() => $input.popover('hide', { content: '' }), 3000);
// }

// TODO: ISS Now button

const visitLandmark = e => {
  const split = $(e.target).find('span').text().split(' ');
  const coord = { lat: Number(split[0]), lng: Number(split[1]) };

  // TODO:
    // get weather
      // rerender
    // get passtimes
      // rerender

  recenterMap(coord)
}

$('#landmark-buttons').children().each(function () {
  $(this).click(visitLandmark);
});

// Handle user preferences between metric and imperial measurements
$('.btn-group-toggle').on('change', e => {
  const url = '/maps/' + e.target.name;
  const match = window.location.pathname === url;
  if (!match) window.location = url;
});

/********************* ALL MODAL WINDOWS *********************/

// On modal closure, show/hide divs for next usage
$('.modal').each(function () {
  $(this).on('hidden.bs.modal', function () {
    $(this).find('.hide').each(function () {
      if (!$(this).hasClass('d-none')) $(this).addClass('d-none');
    });
    $(this).find('.show').each(function () {
      if ($(this).hasClass('d-none')) $(this).removeClass('d-none');
    });
    $(this).find('#add-landmark-error')
      .removeClass().addClass('d-none');
    $(this).find('#remove-landmark-error')
      .removeClass().addClass('d-none');
  });
});

/********************* ADD LANDMARKS *********************/

// Take input, test it against Google
  // Multiple options: display options
  // One option: move to document formatting
$('#add-landmark-search-btn').click(async function (e) {

  // TODO: this needs to submit when you hit 'enter'

  const query = $(this).parent().prev().val();

  const results = await getGeocode(query);

  const $ulDiv = $('#add-landmark-results ul')
  $ulDiv.children().remove();

  console.log(results);

  results.forEach(result => {
    const { formatted_address, geometry } = result
    const { lat, lng } = geometry.location;

    const li =
      '<li class="list-group-item list-group-item-action"' +
        `<p>${formatted_address}<span class="d-none">$%${lat}$%${lng}</span></p>` +
      '</li>';
    $ulDiv.append(li);
  });

  $('#add-landmark-results').removeClass('d-none');
});

// User makes their selection from a few options, move to doc formatting
$('#add-landmark-results ul').click(e => {
  const $searchDiv = $('#add-landmark-search')
  const $formatDiv = $('#add-landmark-format');
  const $p = $formatDiv.find('p');
  const $searchInput = $searchDiv.find('input');
  const split = $(e.target).text().split('$%');

  $searchDiv.addClass('d-none');
  $formatDiv.find('input').val($searchInput.val());
  $searchInput.val('');

  $('#add-landmark-results').addClass('d-none');

  $($p[0]).text(split[0]);
  $($p[1]).text(`${split[1]} ${split[2]}`);
  $formatDiv.removeClass('d-none');
});

// Take the user-formatted name and post it to be saved in the DB
$('#add-landmark-format form').submit(async e => {
  try {
    e.preventDefault();

    const coordStrings = $('#coord').text().split(' ');
    const lat = coordStrings[0];
    const lng = coordStrings[1];
    const name = e.target.name.value;
    const $status = $('#add-landmark-error');

    // POST new landmark
    $status.text('Saving...')
      .removeClass().addClass('text-warning');

    const landmark = await $.ajax({
      type: 'POST',
      url: '/landmarks',
      data: { name, lat, lng },
      dataType: 'json',
    });

    $status.text('Saved!')
      .removeClass().addClass('text-success');

    // Reset modal window
    $('#add-landmark').modal('hide');

    setTimeout(() => {
      // Show new landmark on page

      const landmarkButton =
        '<button class="landmark-buttons dropdown-item" type="button">' +
          `${name}<span class='d-none'>${lat} ${lng} ${landmark._id}</span>` +
        '</button>';

      this.$landmarkButton = $(landmarkButton)
        .click(visitLandmark)
        .appendTo($('#landmark-buttons'));

      const landmarkListItem =
        '<li class="list-group-item list-group-item-action">' +
          `${name}<span class="d-none">$%${landmark._id}</span>` +
        '</li>';
      $('#remove-landmark-list').find('ul').append(landmarkListItem);
    }, 500);

  } catch (e) {
    $('#add-landmark-error')
      .text(`${e.status}: ${e.statusText}`)
      .removeClass().addClass('text-danger');
  }
});

/********************* REMOVE LANDMARKS *********************/

// On selecting a landmark to remove, reveal confirmation div
$('#remove-landmark-list ul').click(function (e) {
  const split = $(e.target).text().split('$%');
  const $confirmDiv = $('#remove-landmark-confirm')
  $confirmDiv.find('#remove-landmark-title').text(split[0] + '?');
  $confirmDiv.find('#remove-landmark-button').val(split[1]);
  $confirmDiv.removeClass('d-none');
});

// On landmark removal confirmation, send a DELETE request
$('#remove-landmark-button').click(async e => {
  try {
    const _id = $(e.target).val();
    const $status = $('#remove-landmark-error');

    // POST new landmark
    $status.text('Deleting...')
      .removeClass().addClass('text-warning');

    // DELETE request
    await $.ajax({
      type: 'DELETE',
      url: '/landmarks',
      data: { _id },
      dataType: 'json',
    });

    // TODO: check status
    $status.text('Landmark deleted!')
      .removeClass().addClass('text-success');

    // Reset modal
    $('#remove-landmark').modal('hide')

    setTimeout(() => {
      $('#remove-landmark-confirm').addClass('d-none');

      // Remove deleted landmark from page
      $('#landmark-buttons').each(function () {
        const _idIsPresent = $(this).text().includes(_id);
        if (_idIsPresent) $(this).remove();
      });

      $('#remove-landmark-list').find('li').each(function () {
        const _idIsPresent = $(this).text().includes(_id);
        if (_idIsPresent) $(this).remove();
      });
    }, 500);

  } catch (e) {
    $('#remove-landmark-error')
      .text(`${e.status}: ${e.statusText}`)
      .removeClass().addClass('text-danger');
  }
});

/**********************************************************
  /PROJECTS
**********************************************************/

// Initialize tabs for projects page
$('#projects-tab a').on('click', function (e) {
  e.preventDefault();
  $(this).tab('show');
});
