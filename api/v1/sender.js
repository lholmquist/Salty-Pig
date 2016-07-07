'use strict';

const Boom = require('boom');
const _ = require('lodash');
const Joi = require('joi');

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
            const message = request.payload.message || {};
            const criteria = request.payload.criteria || {};
            const config = request.payload.config || {};
            // Find the Application
            // Pass them off to the sender
            // Filtering should happen at some point
            // 'request.auth.credntials.id' will be the pushApplicationID
            server.methods.database.applications.find(request.auth.credentials.id).then((docs) => {
                if (docs.length === 0) {
                    return reply(Boom.notFound());
                }

                // Check the message to see if we need to filter by variant)
                // If So, filter and then get just those installations
                let variants = docs[0].variants;
                if (criteria.variants) {
                    variants = variants.filter((v) => {
                        if (!Array.isArray(criteria.variants)) {
                            return v.variantID === criteria.variants;
                        }

                        for (let i = 0; i < criteria.variants; i++) {
                            return criteria.variants[i] === v.variantID;
                        }
                    });
                }

                // Then loop through the variants
                return getInstallations(server, variants).then((installs) => {
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
            auth: 'auth-sender',
            validate: {
                payload: {
                    message: Joi.object().optional(),
                    criteria: Joi.object().optional(),
                    config: Joi.object().optional()
                }
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'route-sender'
};
