const axios = require('axios');

// For a given coordinate (req.coord), get the next 5 passtimes
const getPasstimes = async (req, res, next) => {
  try {
    // const { lat, lng } = req;
    const lat = 40;
    const lng = 40;
    const url = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lng}`;
    const response = await axios.get(url);
    req.passtimes = response.data.response;
    next();
  } catch (e) { next(e) }
};

module.exports = getPasstimes;
