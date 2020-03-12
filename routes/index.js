const express = require('express');
const router = express.Router();

const style = 'stylesheets/stylesheet.css';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

module.exports = router;
