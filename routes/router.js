const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const Landmark = require('../models/Landmark');
const projects = require('../data/projects');

const validate = require('../middleware/validate');
const getISS = require('../middleware/getISS');
const getWeather = require('../middleware/getWeather');
const getPasstimes = require('../middleware/getPasstimes');
const getLandmarks = require('../middleware/getLandmarks');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => res.render('home', { active: [true,false,false] }));

router.get('/about', (req, res) => res.render('projects', { projects, active: [false,false,true] }));

router.get('/maps', (req, res) => res.redirect('/maps/imperial'));

router.get('/maps/:system', validate, getISS, getPasstimes, getLandmarks, getWeather, async (req, res, next) => {
  try {

    // ISS pos -> Google Maps

    // ISS pos -> weather
      // weather -> db
    const classTemp = {
      f: 'btn btn-secondary',
      c: 'btn btn-secondary'
    }

    req.params.system === 'imperial'
      ? classTemp.f += ' active'
      : classTemp.c += ' active';

    const options = {
      googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_KEY}&callback=initMap&libraries=places`,
      mapCoord: `${req.coord.lat} ${req.coord.lng}`,

      active: [false,true,false],

      passtimes: req.passtimes,
      landmarks: req.landmarks,

      classTemp,

      current: req.weather.current,
      forecast: req.weather.forecast
    }

    res.render('maps', options);

  } catch (e) { next(e) }
});

// Create a new Landmark from data provided
router.post('/geocode', async (req, res, next) => {
  try {
    const { query } = req.body;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GOOGLE_KEY}`;

    const response = await axios.get(url);
    const results = response.data.results;
    res.send(results);
  } catch (e) {
    if (e.status) res.status(e.status);
    else res.status(500);
    next(e);
  }
});

// Create a new Landmark from data provided
router.post('/landmarks', async (req, res, next) => {
  try {
    const { name, lat, lng } = req.body;
    const coord = { lat, lng };
    const newLandmark = { name, coord };

    const landmark = new Landmark({ name, coord });
    landmark.save((err, lm) => {
      if (err) throw err;
      res.send(lm);
    });
  } catch (e) {
    if (e.status) res.status(e.status);
    else res.status(500);
    res.send(e);
  }
});

// Delete a Landmark by the provided '_id'
router.delete('/landmarks', async (req, res, next) => {
  try {
    Landmark.findByIdAndDelete(req.body._id, err => {
      if (err) throw err;
      res.sendStatus(204);
    });
  } catch (e) {
    if (e.status) res.status(e.status);
    else res.status(500);
    res.send(e);
  }
});

module.exports = router;
