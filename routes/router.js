const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const Landmark = require('../models/Landmark');
const projectData = require('../data/projects');

const getISS = require('../middleware/getISS');
const getWeather = require('../middleware/getWeather');
const getPasstimes = require('../middleware/getPasstimes');
const getLandmarks = require('../middleware/getLandmarks');

const router = express.Router();

/**********************************************************
  ROUTING WEBPAGES
**********************************************************/

/* GET home page. */
router.get('/', (req, res) => res.render('home', { active: [true,false,false] }));

router.get('/about', (req, res) => {
  const projects = projectData.map(project => {
    const { id } = project;

    let tabClass = 'nav-link';
    if (id === 1) tabClass += ' active';
    let contentClass = 'tab-pane px-2';
    if (id === 1) contentClass += ' show active';

    const rootName = `project-${id}`;
    const tabSelected = (id === 1) ? 'true' : 'false';

    return { ...project, tabClass, contentClass, rootName, tabSelected };

  });

  res.render('projects', { projects, active: [false,false,true] });

});

router.get('/maps', getISS, getPasstimes, getLandmarks, getWeather, async (req, res, next) => {
  try {
    const classTemp = {
      f: 'btn btn-secondary',
      c: 'btn btn-secondary'
    }

    req.scale.system === 'imperial'
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

/**********************************************************
  API ROUTING
**********************************************************/

// Create a new Landmark from data provided
router.post('/api/geocode', async (req, res, next) => {
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

// Get weather and passtimes for coordinates given in req.body
router.post('/api/reposition', getPasstimes, getWeather, (req, res, next) => {
  const { passtimes, weather } = req;
  res.send({ weather, passtimes });
});

router.post('/api/weather', getWeather, (req, res, next) => res.send(req.weather));

/**********************************************************
  DATABASE ROUTING
**********************************************************/

// Create a new Landmark from data provided
router.post('/api/landmarks', async (req, res, next) => {
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
router.delete('/api/landmarks', async (req, res, next) => {
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
