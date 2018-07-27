const validate = async (req, res, next) => {
  const { system } = req.params;
  const validScale = system === 'imperial' || system === 'metric';
  if (validScale) return next();
  const err = new Error('Only Imperial and Metric systems are supported at this time');
  err.status = 400;
  next(err);
};

module.exports = validate;
