'use strict';

const Boom = require('boom');

exports.register = (server, options, next) => {
    server.route({
        method: 'GET',
        path: '/rest/applications/{variantId}/installations',
        handler: (request, reply) => {
            // Find the variant first, to make sure we have one
            // Then find the installations useing the variantId
            server.methods.database.variants.findById(request.params.variantId).then((docs) => {
                if (docs.length === 0) {
                    return reply(Boom.notFound());
                }

                const variant = docs[0].variants.filter((v) => {
                    return v.variantID === request.params.variantId;
                })[0];

                return server.methods.database.installations.find(request.params.variantId);
            }).then((installations) => {
                reply(installations);
            }).catch((err) => {
                console.log(err);
                reply(err);
            });
        }
    });
    next();
}

exports.register.attributes = {
    name: 'routes-installations'
};
