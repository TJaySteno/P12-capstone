'use strict';

/********************* MAP *********************/
/* Initialize map and markers in the global scope */
let map;
let marker;

function initMap() {
  const mapDiv = document.querySelector('#map');
  const coord = mapDiv.attributes.value.value.split(' ');
  const center = { lat: Number(coord[0]), lng: Number(coord[1]) };

  map = new google.maps.Map(mapDiv, { center, zoom: 5 });
  marker = new google.maps.Marker({ map, position: center });
}

/* Instantly invoke the rest to avoid global scope */
(() => {

  /**********************************************************
    MAPS
  **********************************************************/

  /********************* GENERAL FUNCTIONS *********************/

  /* Simplify AJAX requests */
  const request = (type, url, data) =>
    new Promise(async (resolve, reject) => {
      try {
        const options = { type, url, dataType: 'json' };
        if (data) options.data = data;

        const response = await $.ajax(options);
        resolve(response);
      } catch (e) {
        reject(e);
      }
    });

  /* Shift map to, and write weather & passtimes for given coordinates */
  const reposition = (coord, zoom) =>
    new Promise(async (resolve, reject) => {
      try {
        const { lat, lng } = coord;
        const isMetric = $('.btn-group-toggle .active').text().includes('C');
        const scale = isMetric ? 'metric' : 'imperial';
        const response = await request('POST', '/api/reposition', { lat, lng, scale });

        writeWeather(response.current, response.forecast);
        writePasstimes(response.passtimes);

        map.setCenter(coord);
        map.setZoom(zoom || 5);
        marker.setPosition(coord);

      } catch (e) {
        console.error(e);
        reject(e);
      }
    });

  /* Write new values for current and forecasted weather */
  const writeWeather = (current, forecast) => {

    const titleHTML = current.description +
      `<img src=${current.imgSrc} alt="${current.description} icon">`;

    $('#current-weather')
      .find('.lead').html(titleHTML)
      .next().html(current.tempText)
      .next().text(current.windText)
      .next().text(current.cloudText);

    let forecastHTML = '';

    forecast.forEach(item => {
      forecastHTML += (
        '<li class="forecast-li list-group-item">' +
          '<div class="d-inline-block alert-info rounded p-0">' +
            `<img src=${item.imgSrc} alt="${item.description} icon" title=${item.description}>` +
          '</div>' +
          '<div class="d-inline-block pl-1">' +
            `<span>${item.text}</span>` +
          '</div>' +
        '</li>'
      );
    });

    $('#weather-forecast ul').html(forecastHTML);

  };

  /* Write new values for pass times modal */
  const writePasstimes = passtimes => {
    let passtimeHTML = '';

    passtimes.forEach(pass =>
      passtimeHTML += `<li class="list-group-item">${pass.time} ${pass.duration}</li>`);

    $('#passtimesModal').find('ul').html(passtimeHTML);
  };

  /********************* WEATHER DIV *********************/

  /* Accept address form submissions and find the query in Google Maps */
  $('#address-form').submit(async e => {
    try {
      e.preventDefault();

      const $address = $(e.target).find('#address');
      const query = $address.val();
      if (query === '') return;
      $address.val('');

      const results = await request('POST', '/api/geocode', { query });

      const coord = results[0].geometry.location;

      reposition(coord, 10);

    } catch (e) {
      console.error(e);
    }
  });

  /* Request a new ISS location */
  $('#iss-now').click(async e => {
    try {
      const coord = await request('GET', '/api/iss');
      reposition(coord);
    } catch (e) {
      console.error(e);
    };
  });

  /* Interpret a landmark button and reposition the app accordingly */
  const moveToLandmark = e => {
    const split = $(e.target).find('span').text().split(' ');
    const coord = { lat: Number(split[0]), lng: Number(split[1]) };

    reposition(coord, 13);
  };

  /* Apply click handlers to all landmark buttons in the dropdown menu */
  $('#landmark-buttons').children().each(function () {
    $(this).click(moveToLandmark);
  });

  /* Handle user preferences between metric and imperial measurements */
  $('.btn-group-toggle').on('change', async e => {
    try {
      const scale = e.target.name;
      const lat = marker.position.lat();
      const lng = marker.position.lng();

      const weather = await request('POST', '/api/weather', { scale, lat, lng });

      writeWeather(weather.current, weather.forecast);
      map.setCenter({ lat, lng });

    } catch (e) {
      console.error(e);
    };
  });

  /********************* ALL MODAL WINDOWS *********************/

  $('.modal').each(function () {

    /* On modal closure, reset for next use */
    $(this).on('hidden.bs.modal', function () {

      $(this).find('.hide').each(function () {
        if (!$(this).hasClass('d-none'))
          $(this).addClass('d-none');
      });

      $(this).find('.show').each(function () {
        $(this).removeClass('d-none');
      });

      $(this).find('#add-landmark-error')
        .removeClass().addClass('d-none');

      $(this).find('#remove-landmark-error')
        .removeClass().addClass('d-none');
    });
  });

  /********************* ADD LANDMARKS *********************/

  /* Upon opening "Add Landmark" modal, focus input */
  $('#add-landmark').on('shown.bs.modal', function () {
    $(this).find('input').trigger('focus');
  });

  /* Geocode a user query and post it to #add-landmark-results */
  $('#add-landmark-search form').submit(async e => {
    e.preventDefault();

    const query = e.target[0].value;
    const results = await request('POST', '/api/geocode', { query });

    const $ulDiv = $('#add-landmark-results ul');
    $ulDiv.children().remove();

    results.forEach(result => {
      const { formatted_address, geometry } = result;
      const { lat, lng } = geometry.location;

      const li =
        '<li class="list-group-item list-group-item-action"' +
          `<p>${formatted_address}<span class="d-none">$%${lat}$%${lng}</span></p>` +
        '</li>';
      $ulDiv.append(li);
    });

    $('#add-landmark-results').removeClass('d-none');
  });

  /* Upon selecting geocode results, move user to formatting div */
  $('#add-landmark-results ul').click(e => {
    const $searchDiv = $('#add-landmark-search');
    const $formatDiv = $('#add-landmark-format');
    const $p = $formatDiv.find('p');
    const $searchInput = $searchDiv.find('input');
    const split = $(e.target).text().split('$%');

    $formatDiv.find('input').val($searchInput.val());

    $searchDiv.addClass('d-none');
    $searchInput.val('');

    $('#add-landmark-results').addClass('d-none');
    $($p[1]).text(split[0]);
    $($p[2]).text(`${split[1]} ${split[2]}`);

    $formatDiv.removeClass('d-none');
    $formatDiv.find('input').focus();
  });

  /* Post a user-formatted name to be saved in the DB */
  $('#add-landmark-format form').submit(async e => {
    try {
      e.preventDefault();

      const coordStrings = $('#coord').text().split(' ');
      const lat = coordStrings[0];
      const lng = coordStrings[1];
      const name = e.target.name.value;
      const $status = $('#add-landmark-error');

      $status.text('Saving...')
        .removeClass().addClass('text-warning');

      const landmark = await request('POST', '/api/landmarks', { name, lat, lng });

      $status.text('Saved!')
        .removeClass().addClass('text-success');

      reposition({ lat: Number(lat), lng: Number(lng) }, 13);

      /* Once this modal is hidden, reset it and add landmark to page */
      $('#add-landmark').modal('hide')
        .on('hidden.bs.modal', () => {

          const landmarkButton =
            '<button class="dropdown-item" type="button">' +
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

  /* Upon selecting a landmark to remove, reveal confirmation div */
  $('#remove-landmark-list ul').click(function (e) {
    const split = $(e.target).text().split('$%');
    const $confirmDiv = $('#remove-landmark-confirm');
    $confirmDiv.find('#remove-landmark-title').text(split[0] + '?');
    $confirmDiv.find('#remove-landmark-button').val(split[1]);
    $confirmDiv.removeClass('d-none');
  });

  /* Upon landmark removal confirmation, send a DELETE request */
  $('#remove-landmark-button').click(async e => {
    try {
      const _id = $(e.target).val();
      const $status = $('#remove-landmark-error');

      $status.text('Deleting...')
        .removeClass().addClass('text-warning');

      await request('DELETE', '/api/landmarks', { _id });

      $status.text('Landmark deleted!')
        .removeClass().addClass('text-success');

      $('#remove-landmark').modal('hide');

      /* Once this modal is hidden, reset it and remove landmark from page */
      $('#remove-landmark').modal('hide')
        .on('hidden.bs.modal', () => {

          $('#remove-landmark-confirm').addClass('d-none');

          $('#landmark-buttons').children().each(function () {
            const _idIsPresent = $(this).text().includes(_id);
            if (_idIsPresent) $(this).remove();
          });

          $('#remove-landmark-list').find('li').each(function () {
            const _idIsPresent = $(this).text().includes(_id);
            if (_idIsPresent) $(this).remove();
          });
        });
    } catch (e) {
      $('#remove-landmark-error')
        .text(`${e.status}: ${e.statusText}`)
        .removeClass().addClass('text-danger');
    }
  });
})();
