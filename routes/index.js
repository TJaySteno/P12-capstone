const express = require('express');
const router = express.Router();
const projects = require('../data/projects');
console.log(projects.length);

/* GET home page. */
router.get('/', (req, res) => res.render('home'));

router.get('/about', (req, res) => res.render('projects', { projects }));

// router.get((req, res) => {
//   res.render('error');
// });

module.exports = router;
