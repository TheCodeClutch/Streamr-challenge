const router = require("express").Router();
const axios = require("axios");
const StreamrClient = require('streamr-client')
const parser = require('ua-parser-js');

const client = new StreamrClient({
    auth: {
        privateKey: process.env.STREAMR_PKEY,
    },
})

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

router.get('/visit', (req, res) => {
  const ua = parser(req.headers['user-agent']);
  client.publish('0xd5c5cf8f6c9357de19cae48f101641f54845bc82/visits', {
      userAgent: ua,
      latitude: req.body.latitude,
      humidity: req.body.longitude,
  })
  res.json({
    message: 'Successfully registered visit'
  })
})

router.get('/sos', (req, res) => {
  const ua = parser(req.headers['user-agent']);
  client.publish('0xd5c5cf8f6c9357de19cae48f101641f54845bc82/sos', {
      userAgent: ua,
      latitude: req.body.latitude,
      humidity: req.body.longitude,
  })
  res.json({
    message: 'Successfully registered SOS'
  })
})

module.exports = router;
