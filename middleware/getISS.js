const axios = require('axios');

const getISS = async (req, res, next) => {
  try {
    const url = 'http://api.open-notify.org/iss-now.json';
    const response = await axios.get(url);
    const { data } = response;
    const coord = {
      lng: data.iss_position.longitude,
      lat: data.iss_position.latitude
    }
    req.issNow = data;
    req.coord = coord;
    next();
  } catch (e) { next(e) }
};

module.exports = getISS;
