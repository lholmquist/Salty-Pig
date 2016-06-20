'use strict';

const Boom = require('boom');
const _ = require('lodash');

const gcm = require('node-gcm');

exports.register = (server, options, next) => {
    server.route({
        method: 'POST',
        path: '/rest/sender',
        handler: (request, reply) => {
            // Find the Application
            // Pass them off to the sender
            // Filtering should happen at some point
            server.methods.database.applications.find(request.auth.credentials.id).then((docs) => {
                if (docs.length === 0) {
                    return reply(Boom.notFound());
                }

                // Then loop through the variants
                const p = docs[0].variants.map((v) => {
                    return server.methods.database.installations.find(v.variantID).then((install) => {
                        return install.map((i) => {
                            i.variant = v;
                            return i;
                        });
                    });
                });

                return Promise.all(p).then((results) => {
                    return _.flatten(results);
                }).then((installs) => {


                    // Send off to network
                    const message = new gcm.Message({data: {key1: 'msg1'}});
                    const sender = new gcm.Sender(installs[0].variant.googleKey);
                    const regTokens = [installs[0].deviceToken];

                    sender.send(message, {registrationTokens: regTokens}, (err, response) => {
                        if (err) {
                            console.log(err);
                            return reply(err);
                        }

                        reply(response);
                    });
                });
            }).catch((err) => {
                return reply(Boom.badData('Internal MongoDB error', err));
            });
        },
        config: {
            auth: 'auth-sender'
        }
    });

    next();
};

exports.register.attributes = {
    name: 'route-sender'
};
