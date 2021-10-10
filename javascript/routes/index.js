var express = require('express');
var router = express.Router();
var postalAbbreviations = require('../us_state.js');

// helper functions 
const setUrl = (city, state) => {
  // example url: https://api.turbovote.org/elections/upcoming?district-divisions=ocd-division/country:us/state:ma,ocd-division/country:us/state:ma/place:wayland
  let state = state.toLowerCase();
  // remove spaces from city name
  let city = city.toLowerCase().replace(/\s+/g, '');

  let url = `https://api.turbovote.org/elections/upcoming?district-divisions=ocd-division/country:us/state:${state},ocd-division/country:us/state:${state}/place:${city}`;

}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Find My Election', states: postalAbbreviations });
});



module.exports = router;
