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
      // if there are upcoming elections
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
      } else {
        // if there are no upcoming elections
        res.send('There are no upcoming elections for this area.')
      }
    })
    .catch(error => res.send(error))
});

module.exports = router;
