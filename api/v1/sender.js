'use strict';

const Boom = require('boom');
const _ = require('lodash');

const gcm = require('../../services/gcm');
const apns = require('../../services/apns');

function getInstallations (server, variants) {
    const p = variants.map((v) => {
        return server.methods.database.installations.find(v.variantID).then((install) => {
            return install.map((i) => {
                i.variant = v;
                return i;
            });
        });
    });

    return Promise.all(p).then((results) => {
        return _.flatten(results);
    });
}

exports.register = (server, options, next) => {
    server.route({
        method: 'POST',
        path: '/rest/sender',
        handler: (request, reply) => {
            // Find the Application
            // Pass them off to the sender
            // Filtering should happen at some point
            // 'request.auth.credntials.id' will be the pushApplicationID
            server.methods.database.applications.find(request.auth.credentials.id).then((docs) => {
                if (docs.length === 0) {
                    return reply(Boom.notFound());
                }

                // Then loop through the variants
                return getInstallations(server, docs[0].variants).then((installs) => {
                    // Filter results?

                    const message = {data: {key1: 'msg1'}};
                    // Group the remaining things based on the type
                    const grouped = _.groupBy(installs, 'variant.type');
                    for (let obj in grouped) {
                        switch (obj) {
                        case 'ANDROID':
                            gcm(grouped[obj], message);
                            break;
                        case 'IOS':
                            apns(grouped[obj], message);
                            break;
                        default:
                            break;
                        }
                    }

                    return reply('Messaged Sent to Push Network');
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
