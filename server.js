'use strict';

const Hapi = require('hapi');
const mongodb = require('mongodb').MongoClient;
const Basic = require('hapi-auth-basic');

const server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3000
});

server.register([Basic,
    require('./db/mongo'),
    require('./auth/register-device'),
    require('./auth/sender'),
    require('./api/v1/registry/devices'),
    require('./api/v1/applications'),
    require('./api/v1/variants/android'),
    require('./api/v1/sender')
], (err) => {
    if (err) {
        throw err;
    }

    server.start((err) => {
        if (err) {
            throw err;
        }

        console.log(`Server running at: ${server.info.uri}`);
    });
});
