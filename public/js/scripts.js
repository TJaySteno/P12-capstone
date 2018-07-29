/**********************************************************
  /MAPS
**********************************************************/

const getGeocode = query => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await $.ajax({
        type: 'POST',
        url: '/api/geocode',
        data: { query },
        dataType: 'json',
      });
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
}

const repositionMap = (coord, zoom) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { lat, lng } = coord;
      const isMetric = window.location.pathname.includes('/metric');
      const scale = isMetric ? 'metric' : 'imperial';

      const response = await $.ajax({
        type: 'POST',
        url: '/api/reposition',
        data: { lat, lng, scale },
        dataType: 'json',
      });

      writeWeather(response.weather);
      writePasstimes(response.passtimes);

      map.setCenter(coord);
      map.setZoom(zoom || 5);
      marker.setPosition(coord);

    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}

// Write new values for current and forecasted weather
const writeWeather = weather => {
  const { current, forecast } = weather;

  const titleHTML = current.description +
    `<img src=${current.imgSrc} alt="${current.description} icon">`;

  let forecastHTML = '';
  forecast.forEach(item => {
    forecastHTML += (
      '<li class="forecast-li list-group-item">' +
        '<div class="d-inline-block alert-info rounded p-0">' +
          `<img src=${item.imgSrc} alt="${item.imgAlt} icon">` +
        '</div>' +
        '<div class="d-inline-block pl-1">' +
          `<span>${item.text}</span>` +
        '</div>' +
      '</li>'
    );
  });

  $('#current-weather')
    .find('.lead').html(titleHTML)
    .next().html(current.tempText)
    .next().text(current.windText)
    .next().text(current.cloudText);

  $('#weather-forecast ul').html(forecastHTML);

}

// Write new values for Pass Times modal
const writePasstimes = passtimes => {
  let passtimeHTML = '';

  passtimes.forEach(pass =>
    passtimeHTML += `<li class="list-group-item">${pass.time} ${pass.duration}</li>`);

  $('#passtimesModal').find('ul').html(passtimeHTML)
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

    repositionMap(coord, 10);

    // TODO: setPopover(address)

  } catch (e) {
    console.error(e);
  }
});

// Request a new ISS location
$('#iss-now').click(async e => {
  try {
    const coord = await $.ajax({
      type: 'GET',
      url: '/api/iss',
      dataType: 'json',
    });
    repositionMap(coord);
  } catch (e) {
    console.error(e);
  }


});

const moveToLandmark = e => {
  const split = $(e.target).find('span').text().split(' ');
  const coord = { lat: Number(split[0]), lng: Number(split[1]) };

  repositionMap(coord, 13);
}

$('#landmark-buttons').children().each(function () {
  $(this).click(moveToLandmark);
});

// Handle user preferences between metric and imperial measurements
$('.btn-group-toggle').on('change', async e => {
  try {
    const scale = e.target.name;
    const lat = marker.position.lat();
    const lng = marker.position.lng();

    const weather = await $.ajax({
      type: 'POST',
      url: '/api/weather',
      data: { scale, lat, lng },
      dataType: 'json'
    });

    writeWeather(weather);
    map.setCenter({ lat, lng });

  } catch (e) {
    console.error(e);
  }
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

  const query = $(this).parent().prev().val();

  console.log('add landmark search button', query);

  const results = await getGeocode(query);

  console.log('add landmark search button', results);

  const $ulDiv = $('#add-landmark-results ul');
  $ulDiv.children().remove();

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

  $($p[1]).text(split[0]);
  $($p[2]).text(`${split[1]} ${split[2]}`);
  $formatDiv.removeClass('d-none');
});

// Take the user-formatted name and post it to be saved in the DB
$('#add-landmark-format form').submit(async e => {
  try {
    e.preventDefault();

    // if (.includes(html)) throw new Error('no html');

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
      url: '/api/landmarks',
      data: { name, lat, lng },
      dataType: 'json',
    });

    $status.text('Saved!')
      .removeClass().addClass('text-success');

    repositionMap({ lat: Number(lat), lng: Number(lng) }, 13);

    // After a modal is hidden, reset it and  Show new landmark on page
    $('#add-landmark').modal('hide')
      .on('hidden.bs.modal', function () {
        const landmarkButton =
          '<button class="landmark-buttons dropdown-item" type="button">' +
            `${name}<span class='d-none'>${lat} ${lng} ${landmark._id}</span>` +
          '</button>';

        this.$landmarkButton = $(landmarkButton)
          .click(moveToLandmark)
          .appendTo($('#landmark-buttons'));

        const landmarkListItem =
          '<li class="list-group-item list-group-item-action">' +
            `${name}<span class="d-none">$%${landmark._id}</span>` +
          '</li>';
        $('#remove-landmark-list').find('ul').append(landmarkListItem);
      });

  } catch (e) {
    if (!e.message) e.message = `${e.status}: ${e.statusText}`;
    $('#add-landmark-error')
      .text(e.message)
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
      url: '/api/landmarks',
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
      $('#landmark-buttons').children().each(function () {
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
