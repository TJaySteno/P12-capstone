const axios = require('axios');

// Convert current weather into readable format
const formatCurrent = (current, scale) => {
  const description = current.weather[0].description;
  const imgSrc = `http://openweathermap.org/img/w/${current.weather[0].icon}.png`;

  const { main, wind, clouds } = current;

  const tempText = `${main.temp}&deg;${scale.temp} with ${main.humidity}% humidity`;

  const windText = (() => {
    const directions = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW','N'];
    const direction = directions[Math.round((wind.deg / 360) * 16)];

    return `Winds blowing at ${wind.speed} ${scale.wind}, ${direction}`;
  })();

  const cloudText = `Cloud cover is ${clouds.all}%`;

  return { description, imgSrc, tempText, windText, cloudText };
}

// Convert millisecond string into readable format
const formatTime = dt => {
  const date = new Date(dt * 1000);

  const days = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const day = days[date.getUTCDay()];

  const time = (() => {
    let hour = date.getUTCHours() + 1;
    if (hour > 12) return (hour - 12) + 'pm';
    else return hour + 'am'
  })();

  return `${day}, ${time} GMT`;
}

// Convert forecasted weather into readable format
const formatForecast = (forecastRaw, scale) => {
  const { list } = forecastRaw;
  list.length = 4;

  return list.map(item => {
    const { dt, main, weather, clouds, wind, rain, sys } = item;
    const time = formatTime(item.dt);
    const temp = `${item.main.temp}&deg;${scale.temp}`;
    const humidity = `${item.main.humidity}% hum`;
    const description = weather[0].description;

    const text = `${time}: ${temp}, ${humidity}`;
    const imgSrc = `http://openweathermap.org/img/w/${weather[0].icon}.png`;

    return { text, imgSrc, description };
  });
}

// Store values for 'metric' or 'imperial' systems
const determineScaleValues = scale => {
  if (scale && scale === 'metric') {
    return {
      system: 'metric',
      temp: 'C',
      wind: 'm/s'
    }
  } else {
    return {
      system: 'imperial',
      temp: 'F',
      wind: 'mph'
    }
  }
}

// Request current or forecasted weather
const weatherRequest = async (path, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `http://api.openweathermap.org/data/2.5/${path}`;
      const { lat, lng } = req.coord ? req.coord : req.body;

      let params = {
        lat: Number(lat),
        lon: Number(lng),
        units: req.scale.system,
        APPID: process.env.WEATHER_KEY
      }

      const response = await axios.get(url, { params });

      return resolve(response.data);

    } catch (e) {
      return reject(res);
    }
  });
}

// Request weather and return formatted values
const getWeather = async (req, res, next) => {
  try {

    req.scale = determineScaleValues(req.body.scale);

    const classTemp = {
      f: 'btn btn-secondary',
      c: 'btn btn-secondary'
    }
    req.scale.system === 'imperial'
      ? classTemp.f += ' active'
      : classTemp.c += ' active';

    const currentRaw  = await weatherRequest('weather', req);
    const forecastRaw = await weatherRequest('forecast', req);

    const current  = formatCurrent(currentRaw, req.scale);
    const forecast = formatForecast(forecastRaw, req.scale);

    req.weather = { classTemp, current, forecast };

    next();

  } catch (e) {
    next(e);
  }
};

module.exports = getWeather;
