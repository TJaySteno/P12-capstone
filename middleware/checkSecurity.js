// Check if request is being made over HTTP or HTTPS
const checkSecurity = async (req, res, next) => {
  try {
    const https = req.headers.referer.includes('https://');
    req.options = { https };
    next();
  } catch (e) {
    next(e);
  };
};

module.exports = checkSecurity;
