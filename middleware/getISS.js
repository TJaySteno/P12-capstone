const axios = require('axios');

// Request current position of the ISS
const getISS = async (req, res, next) => {
  try {
    const url = 'http://api.open-notify.org/iss-now.json';
    const response = await axios.get(url);
    const { data } = response;
    const coord = {
      lat: data.iss_position.latitude,
      lng: data.iss_position.longitude
    }
    req.issNow = data;
    req.coord = coord;
    next();
  } catch (e) { next(e) }
};

module.exports = getISS;
