const axios = require('axios');
const mongoose = require('mongoose');

const Landmark = require('../models/Landmark');

/* Retrieve favorited landmarks from storage */
const getLandmarks = async (req, res, next) => {
  try {
    const landmarks = Landmark.find({}, (err, landmarks) => {
      if (err) throw err;
      req.options = {
        ...req.options,
        landmarks,
      };
      next();
    });
  } catch (e) {
    next(e);
  };
};

module.exports = getLandmarks;
