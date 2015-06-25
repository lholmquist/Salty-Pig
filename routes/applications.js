var express = require('express');
var router = express.Router();
var application = require('../models/application');

// Main Application End Point

// Create a new Application
router.post('/', function (request, response) {
    // Take the JSON Body and create a new Application and then return that JSON
    application.save(request.body).then(function (app) {
        response.statusCode = 201;
        response.json(app);
    }).catch(function (err) {
        response.sendStatus(400);
    });
});

router.put('/:applicationId', function (request, response) {
    application.update(request.params.applicationId, request.body);
});

// Get One Application
router.get('/:applicationId', function (request, response) {
    // Using the applicationId sent in, retrieve the application from a store
    application.find(request.params.applicationId).then(function (app) {
        response.json(app);
    });
});

// Get All Applications
router.get('/', function (request, response) {
    // Retrieve all the applications from a store
    application.findAll().then(function (apps) {
        response.json(apps);
    });
});

router.delete('/:applicationId', function (request, response) {
    application.remove(request.params.applicationId).then(function () {
        response.statusCode = 204;
        response.json({});
    }).catch(function (err) {
        response.sendStatus(400);
    });
});



module.exports = router;
