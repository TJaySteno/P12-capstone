const axios = require('axios');

const formatCurrent = (current, system) => {
  const description = current.weather[0].description;
  const imgSrc = `http://openweathermap.org/img/w/${current.weather[0].icon}.png`;

  const { main, wind, clouds } = current;

  const scale = system === 'imperial' ? 'F' : 'C';
  const tempText = `${main.temp}&deg;${scale} with ${main.humidity}% humidity`;

  const windText = (() => {
    const directions = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW','N'];
    const direction = directions[Math.round((wind.deg / 360) * 16)];

    const unitOfMeasure = system === 'imperial' ? 'mph' : 'm/s';

    return `Winds blowing at ${wind.speed} ${unitOfMeasure}, ${direction}`;
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

  return `${day}, ${time} UTC`;
}

const formatForecast = (forecastRaw, system) => {
  const { list } = forecastRaw;
  list.length = 4;

  return list.map(item => {
    // {time}: {tempNow}, {main.humidity}% humidity, {weatherDesc}
    const { dt, main, weather, clouds, wind, rain, sys } = item;
    const time = formatTime(item.dt);
    const temp = (() => {
      const scale = system === 'imperial' ? 'F' : 'C';
      return `${item.main.temp}&deg;${scale}`;
    })();
    const humidity = `${item.main.humidity}% humidity`;
    const description = weather[0].description;

    const text = `${time}: ${temp}, ${humidity}, ${description}`;
    const imgSrc = `http://openweathermap.org/img/w/04d.png`;
    const imgAlt = description;

    return { text, imgSrc, imgAlt };
  });
}

const getWeather = async (req, res, next) => {
  try {
    const weatherRequest = async path => {
      return new Promise(async (resolve, reject) => {

        const url = `http://api.openweathermap.org/data/2.5/${path}`;
        const params = {
          lat: req.coord.lat,
          lon: req.coord.lng,
          units: req.params.system,
          APPID: process.env.WEATHER_KEY
        }

        const response = await axios.get(url, { params });

        if (response.status === 200) return resolve(response.data);
        else return reject(res);
      });
    }

    const currentRaw = await weatherRequest('weather');
    const forecastRaw = await weatherRequest('forecast');

    const current = formatCurrent(currentRaw, req.params.system);
    const forecast = formatForecast(forecastRaw, req.params.system);

    req.weather = { current, forecast };

    next();
  } catch (e) { next(e) }
};

module.exports = getWeather;
