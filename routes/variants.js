var express = require('express');
var router = express.Router({mergeParams: true});
var variant = require('../models/variant');

// Create a New variant of a certain type
router.post('/', function (request, response) {
    variant.save(request.params.applicationId, request.body).then(function (variant) {
        response.statusCode = 201;
        response.json(variant);
    }).catch(function (err) {
        console.log(err);
        response.sendStatus(400);
    });
});

router.put('/:variantId', function (request, response) {
    response.send({});
});

// Return just 1 variant
router.get('/:variantId', function (request, response) {
    variant.find(request.params.applicationId, request.params.variantId).then(function (variant) {
        response.json(variant);
    }).catch(function (err) {
        response.sendStatus(400);
    });
});

// Return all Variants
router.get('/', function (request, response) {
    variant.findAll(request.params.applicationId).then(function (variant) {
        response.json(variant);
    }).catch(function (err) {
        response.sendStatus(400);
    });
});

router.delete('/:variantId', function (request, response) {
    response.statusCode = 204;
    response.send();
});


module.exports = router;
