const axios = require('axios');

// For a given coordinate (req.coord), get the next 5 passtimes
const getPasstimes = async (req, res, next) => {
  try {
    const { lat, lng } = req.coord ? req.coord : req.body;
    const url = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lng}`;
    const response = await axios.get(url);

    const passtimes = response.data.response;

    req.passtimes = passtimes.map(pass => {
      const time = new Date(pass.risetime * 1000).toUTCString();
      const duration = (pass.duration / 60).toFixed(2);
      return {
        time,
        duration: `for roughly ${duration} minutes`
      }
    });

    next();
  } catch (e) { next(e) }
};

module.exports = getPasstimes;
