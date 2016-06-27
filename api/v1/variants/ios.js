'use strict';

const Boom = require('boom');
const Joi = require('joi');
const uuid = require('node-uuid');
const toArray = require('stream-to-array');

exports.register = (server, options, next) => {
    server.route({
        method: 'GET',
        path: '/rest/applications/{pushAppId}/ios',
        handler: (request, reply) => {
            server.methods.database.variants.find(request.params.pushAppId).then((variants) => {
                const iosVariants = variants.filter((v) => {
                    return v.type === 'IOS';
                }).map((v) => {
                    delete v.certificate;
                    delete v.passphrase;
                    return v;
                });

                reply(iosVariants);
            }).catch((err) => {
                if (err.isBoom) {
                    return reply(err);
                }

                return reply(Boom.badData('Internal MongoDB error', err));
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/rest/applications/{pushAppId}/ios/{variantId}',
        handler: (request, reply) => {
            server.methods.database.variants.find(request.params.pushAppId, request.params.variantId).then((variant) => {
                if (variant.length === 0) {
                    return reply(Boom.notFound());
                }

                delete variant[0].certificate;
                delete variant[0].passphrase;

                return reply(variant[0]);
            }).catch((err) => {
                if (err.isBoom) {
                    return reply(err);
                }

                return reply(Boom.badData('Internal MongoDB error', err));
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/rest/applications/{pushAppId}/ios',
        handler: (request, reply) => {
            const payload = request.payload;

            payload._id = uuid.v1();
            payload.variantID = uuid.v4();
            payload.secret = uuid.v4();
            payload.production = payload.production ? true : false;

            // Need to validate the cert and passphrase?

            // Take the incoming cert and put it into a buffer
            toArray(request.payload.certificate).then((parts) => {
                const buffers = [];
                for (let i = 0, l = parts.length; i < l ; ++i) {
                    const part = parts[i];
                    buffers.push((part instanceof Buffer) ? part : new Buffer(part));
                }
                return Buffer.concat(buffers);
            }).then((certBuffer) => {
                payload.certificate = certBuffer;
                return server.methods.database.variants.create(request.params.pushAppId, payload).then((variant) => {
                    delete payload.certificate;
                    delete payload.passphrase;

                    return reply(payload).code(201);
                });
            }).catch((err) => {
                if (err.isBoom) {
                    return reply(err);
                }

                return reply(Boom.badData('Internal MongoDB error', err));
            });
        },
        config: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            },
            validate: {
                payload: {
                    name: Joi.string().min(1).max(255).required(),
                    type: Joi.string().valid('IOS').required(),
                    description: Joi.string().min(1).max(255).optional(),
                    passphrase: Joi.string().min(1).max(255).required(),
                    production: Joi.boolean().optional(),
                    certificate: Joi.object().required()
                }
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'routes-ios-android'
};
