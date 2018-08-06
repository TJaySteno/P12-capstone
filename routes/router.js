const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const Landmark = require('../models/Landmark');
const projectData = require('../data/projects');

const checkSecurity = require('../middleware/checkSecurity');
const getISS = require('../middleware/getISS');
const getWeather = require('../middleware/getWeather');
const getPasstimes = require('../middleware/getPasstimes');
const getLandmarks = require('../middleware/getLandmarks');

const router = express.Router();

/**********************************************************
  WEBPAGE ROUTING
**********************************************************/

/* GET home page. */
router.get('/',
  checkSecurity,
  (req, res) => {
    req.options.active = 'home';
    res.render('home', req.options);
  }
);

/* GET maps page */
router.get('/maps',
  checkSecurity,
  getISS,
  getPasstimes,
  getWeather,
  getLandmarks,
  async (req, res, next) => {
    try {

      const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_KEY}&callback=initMap&libraries=places`;
      const active = 'maps';

      req.options = {
        ...req.options,
        googleMapURL,
        active
      };

      res.render('maps', req.options);

    } catch (e) {
      next(e);
    }
  }
);

/* GET about page */
router.get('/about',
  checkSecurity,
  (req, res) => {
    // Format project data for rendering
    const projects = projectData.map(project => {
      const { id } = project;

      let tabClass = 'nav-link';
      if (id == 1) tabClass += ' active';
      let contentClass = 'tab-pane px-2';
      if (id == 1) contentClass += ' show active';

      const rootName = `project-${id}`;
      const tabSelected = (id === 1) ? 'true' : 'false';

      return { ...project, tabClass, contentClass, rootName, tabSelected };

    });

    res.render('projects', { projects, active: 'about' });
  }
);



/**********************************************************
  EXTERNAL API ROUTING
**********************************************************/

// Make a geocode request to Google Maps
router.post('/api/geocode', async (req, res, next) => {
  try {
    const { query } = req.body;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GOOGLE_KEY}`;

    const response = await axios.get(url);
    const results = response.data.results;

    res.json(results);

  } catch (e) {
    res.status(e.status || 500);
    res.json(err);
  };
});

// Request current ISS location
router.get('/api/iss', async (req, res, next) => {
  try {
    const url = 'http://api.open-notify.org/iss-now.json';
    const response = await axios.get(url);

    const { latitude, longitude } = response.data.iss_position;

    res.json({ lat: Number(latitude), lng: Number(longitude) });

  } catch (e) {
    res.status(e.status || 500);
    res.json(err);
  };
});

// Get weather and passtimes for coordinates given in req.body
router.post('/api/reposition',
  getPasstimes,
  getWeather,
  (req, res) => {
    const { current, forecast, passtimes } = req.options;
    res.json({ current, forecast, passtimes });
  }
);

// Get weather for coordinates in req.body
router.post('/api/weather',
  getWeather,
  (req, res) => res.json(req.options)
);



/**********************************************************
  DATABASE ROUTING
**********************************************************/

// Save a new Landmark to the database
router.post('/api/landmarks', async (req, res) => {
  const { name, lat, lng } = req.body;
  const coord = { lat, lng };
  const newLandmark = { name, coord };

  const landmark = new Landmark({ name, coord });
  landmark.save((err, lm) => {
    if (err) {
      res.status(err.status || 500);
      return res.json(err);
    }
    res.json(lm);
  });
});

// Delete a Landmark from the database
router.delete('/api/landmarks', async (req, res) => {
  Landmark.findByIdAndDelete(req.body._id, err => {
    if (err) {
      res.status(err.status || 500);
      return res.json(err);
    };
    res.sendStatus(204);
  });
});

module.exports = router;
