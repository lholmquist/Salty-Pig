'use strict';

const Boom = require('boom');
const Joi = require('joi');
const uuid = require('node-uuid');

exports.register = (server, options, next) => {
    server.route({
        method: 'POST',
        path: '/rest/registry/device/',
        handler: (request, reply) => {
            // TODO: Do device installation/registration stuff
            const defaultInstallation = {
                _id: uuid.v1(),
                variantID: request.auth.credentials.id
            };

            const installation = Object.assign({}, defaultInstallation, request.payload);

            server.methods.database.installations.create(installation).then((result) => {
                return reply(result);
            }).catch((err) => {
                return reply(Boom.badData('Internal MongoDB error', err));
            });
        },
        config: {
            auth: 'device-registration',
            validate: {
                payload: {
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
