var express = require('express');
var router = express.Router();
var postalAbbreviations = require('../us_state.js');
const axios = require('axios');
const dayjs = require('dayjs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Find My Election', states: postalAbbreviations });
});

/* POST search page */
router.post('/search', function (req, res, next) {
  let cityName = req.body.city.toLowerCase().replace(/\s+/g, '_').trim();

  let stateName = req.body.state.toLowerCase();

  let url = `https://api.turbovote.org/elections/upcoming?district-divisions=ocd-division/country:us/state:${stateName},ocd-division/country:us/state:${stateName}/place:${cityName}`;
  // let searchUrl = setUrl(req.body.city, req.body.state);

  axios({
    method: 'get',
    url,
    headers: {
      "Accept": "application/json"
    }
  })
    .then(data => {
      if (data.data.length > 0) {
        let results = data.data.map(result => {
          return {
            description: result.description,
            date: dayjs(result.date).format('MMM DD, YYYY'),
            type: result.type,
            website: result.website
          }
        });
        res.render('results', {title: 'Upcoming Elections', results: results})
      }
    })
    // .then(data => res.render('results', { title: 'Upcoming Elections:', results: data}))
    .catch(error => console.log(error))
});

/* example response
data: [
    {
      description: 'Noble Special Proposition Election',
      date: '2021-10-12T00:00:00Z',
      'district-divisions': [Array],
      type: 'municipal',
      source: [Object],
      'polling-place-url': 'https://okvoterportal.okelections.us/',
      'qa-status': 'complete',
      id: '61377a1e-b3cf-4830-84a9-8c80195c3538',
      population: 7053,
      website: 'https://okvoterportal.okelections.us',
      'polling-place-url-shortened': 'https://tvote.org/32uvpin'
    }
  ]


 */
module.exports = router;
