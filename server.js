'use strict';

const Hapi = require('hapi');
const mongodb = require('mongodb').MongoClient;

const server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3000
});

server.register([
    require('./db/mongo'),
    require('./api/v1/applications'),
    require('./api/v1/variants/android')
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
