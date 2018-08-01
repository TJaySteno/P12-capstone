const axios = require('axios');

const formatCurrent = (current, scale) => {
  const description = current.weather[0].description;
  const imgSrc = `http://openweathermap.org/img/w/${current.weather[0].icon}.png`;

  const { main, wind, clouds } = current;

  const tempText = `${main.temp}&deg;${scale.temp} with ${main.humidity}% hum`;

  const windText = (() => {
    const directions = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW','N'];
    const direction = directions[Math.round((wind.deg / 360) * 16)];

    return `Winds blowing at ${wind.speed} ${scale.wind}, ${direction}`;
  })()

  const cloudText = `Cloud cover is ${clouds.all}%`

  return { description, imgSrc, tempText, windText, cloudText };
}

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

const getWeather = async (req, res, next) => {
  try {
    const weatherRequest = async path => {
      return new Promise(async (resolve, reject) => {
        const url = `http://api.openweathermap.org/data/2.5/${path}`;
        const { lat, lng } = req.coord ? req.coord : req.body;

        if (req.body.scale && req.body.scale === 'metric') {
          req.scale = {
            system: 'metric',
            temp: 'C',
            wind: 'm/s'
          }
        } else {
          req.scale = {
            system: 'imperial',
            temp: 'F',
            wind: 'mph'
          }
        }

        let params = {
          lat: Number(lat),
          lon: Number(lng),
          units: req.scale.system,
          APPID: process.env.WEATHER_KEY
        }

        const response = await axios.get(url, { params });

        if (response.status === 200) return resolve(response.data);
        else return reject(res);
      });
    }

    const currentRaw = await weatherRequest('weather');
    const forecastRaw = await weatherRequest('forecast');

    const current = formatCurrent(currentRaw, req.scale);
    const forecast = formatForecast(forecastRaw, req.scale);

    req.weather = { current, forecast };

    next();
  } catch (e) { next(e) }
};

module.exports = getWeather;
