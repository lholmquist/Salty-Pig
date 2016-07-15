'use strict';

const Hapi = require('hapi');
const Basic = require('hapi-auth-basic');

const server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3000,
    routes: {
        cors: {
            'headers': ['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Accept-language']
        }
    }
});

server.register([Basic,
    require('./db/mongo'),
    require('./auth/register-device'),
    require('./auth/sender'),
    require('./api/v1/registry/devices'),
    require('./api/v1/applications'),
    require('./api/v1/variants/android'),
    require('./api/v1/variants/ios'),
    require('./api/v1/installations'),
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
