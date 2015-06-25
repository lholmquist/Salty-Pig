var express = require('express');
var router = express.Router();
var variant = require('../models/variant');

// Create a New variant of a certain type
router.post('/:type', function (request, response) {
    response.send({});
});

router.put('/:variantId', function (request, response) {
    response.send({});
});

// Return just 1 variant
router.get('/:variantId', function (request, response) {
    response.send({});
});

// Return all Variants
router.get('/', function (request, response) {
    response.send([]);
});

router.delete('/:variantId', function (request, response) {
    response.statusCode = 204;
    response.send();
});


module.exports = router;
