'use strict';

const Boom = require('boom');
const Joi = require('joi');
const uuid = require('node-uuid');

const gcmUrl = 'https://android.googleapis.com/gcm/send/';

function stripToken(deviceToken) {
    if (deviceToken.includes(gcmUrl)) {
        const split = deviceToken.split(gcmUrl);
        return split[1];
    }

    return deviceToken;
}

exports.register = (server, options, next) => {
    server.route({
        method: 'POST',
        path: '/rest/registry/device',
        handler: (request, reply) => {
            // Find the variant for this installation
            // 'request.auth.credentials.id' will be the variantID here
            server.methods.database.variants.findById(request.auth.credentials.id).then((docs) => {
                if (docs.length === 0) {
                    return reply(Boom.notFound());
                }

                const variant = docs[0].variants.filter((v) => {
                    return v.variantID === request.auth.credentials.id;
                })[0];

                return variant;
            }).then((variant) => {
                const defaultInstallation = {
                    _id: uuid.v1(),
                    variantID: variant.variantID
                };

                const payload = request.payload;

                if (variant.type === 'ANDROID') {
                    // For GCM Chrome we need to strip off the "https://android.googleapis.com/gcm/send/" portion of the device Token
                    payload.deviceToken = stripToken(payload.deviceToken);
                }


                const installation = Object.assign({}, defaultInstallation, payload);

                return server.methods.database.installations.create(installation).then((result) => {
                    return reply(result);
                });
            }).catch((err) => {
                return reply(Boom.badData('Internal MongoDB error', err));
            });
        },
        config: {
            auth: 'device-registration',
            validate: {
                payload: {
                    alias: Joi.string().min(1).optional(),
                    platform: Joi.string().min(1).optional(),
                    deviceType: Joi.string().min(1).optional(),
                    operatingSystem: Joi.string().min(1).optional(),
                    osVersion: Joi.string().min(1).optional(),
                    categories: Joi.array().optional(),
                    deviceToken: Joi.string().min(1).required()
                }
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'routes-registry-devices'
};
