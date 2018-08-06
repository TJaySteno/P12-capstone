const axios = require('axios');

// Get the next passtimes at given coordinates
const getPasstimes = async (req, res, next) => {
  try {
    const { lat, lng } = req.coord ? req.coord : req.body;
    const url = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lng}`;
    const response = await axios.get(url);

    const passtimesRaw = response.data.response;

    const passtimes = passtimesRaw.map(pass => {
      const time = new Date(pass.risetime * 1000).toUTCString();
      const duration = (pass.duration / 60).toFixed(2);
      return {
        time,
        duration: `for roughly ${duration} minutes`
      };
    });

    req.options = {
      ...req.options,
      passtimes
    };

    next();

  } catch (e) {
    next(e);
  };
};

module.exports = getPasstimes;
