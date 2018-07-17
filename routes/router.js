const express = require('express');
const mongoose = require('mongoose');

const projects = require('../data/projects');
const Weather = require('../models/Weather');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => res.render('home', { active: [true,false,false] }));

router.get('/about', (req, res) => res.render('projects', { projects, active: [false,false,true] }));

router.get('/maps', (req, res) => {
  const options = {
    active: [false,true,false],
    weatherTitle: 'Helsinki',
    showCurrent: true,
    showInC: true,
  }
  res.render('maps', options);
});

module.exports = router;
