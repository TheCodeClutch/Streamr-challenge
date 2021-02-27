const router = require("express").Router();
const axios = require("axios");
const parser = require('ua-parser-js');
const client = require("./streamr-config")
const Complaints = require("../Database/Models/model").complaints;

router.get( '/', (request, response) => {
    response.status(200).json({
        message : "This is the default route for the Pragati Project API, for women empowerment"
    })
})

router.get( '/team', (request, response) => {
    response.status(200).json({
        message : "The API is built by Nikhil, while frontend is developed by Shreya and Saloni"
    })
})

router.get('/news', (request, response) => {
  axios.get('http://api.mediastack.com/v1/news?access_key=0fe6be7088aff123737658e7e1ddf9e4&keywords=successful%20women&countries=in&limit=50')
  .then(function (res) {
    console.log('News response: ', res)
    response.status(200).json({
      message: res.data
    })
  })
  .catch(function (error) {
    console.log(error)
    response.status(200).json({
      err: 'There was some error while fetching the results.'
    })
  })
})

router.post('/visit', (req, res) => {
  const ua = parser(req.headers['user-agent']);
  client.publish('0x458246a08f695b2b002ad481173f185b3c2e4892/visits', {
      userAgent: ua,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
  })
  res.json({
    message: 'Successfully registered visit'
  })
})


router.post('/register/sos', (req, res) => {
    const ua = parser(req.headers['user-agent']);
    client.publish('0x458246a08f695b2b002ad481173f185b3c2e4892/sos-usage', {
        userAgent: ua,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
    })
    res.json({
        message: 'Successfully registered sos usage'
    })
})

router.post('/register/complaints', (request, response) => {
    const gender = 'Female';
    const age = request.body?.age;
    const type = request.body?.type;
    const description = request.body?.description;
    const latitude = request.body?.latitude;
    const longitude = request.body?.longitude;

    if(gender && age && type && description && latitude && longitude) {
	    client.publish('0x458246a08f695b2b002ad481173f185b3c2e4892/crime-record', {
            gender,
            age,
            type,
            description,
            latitude,
            longitude,
         })

        const data = new Complaints({
            GENDER: gender,
            AGE: age,
            TYPE: type,
            DESCRIPTION: description,
            LATITUDE: latitude,
            LONGITUDE: longitude
        })
        data.save((err) => {
            if(err){
                response.status(200).json({
                    error: 'There was some error while saving the data in the db',
                    err
                })
            } else {
                response.status(200).json({
                    message: 'The data was successfully registered.'
                })
            }
        })
    } else {
        response.status(200).json({
            error: 'Some required data was missing'
        })
    }
})

module.exports = router;
