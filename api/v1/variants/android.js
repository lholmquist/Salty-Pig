'use strict';

const Boom = require('boom');
const Joi = require('joi');
const uuid = require('node-uuid');

exports.register = (server, options, next) => {
    server.route({
        method: 'GET',
        path: '/rest/applications/{pushAppId}/android',
        handler: (request, reply) => {
            server.methods.database.variants.find(request.params.pushAppId).then((variants) => {
                const androidVariants = variants.filter((v) => {
                    return v.type === 'ANDROID';
                });

                reply(androidVariants);
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
        path: '/rest/applications/{pushAppId}/android/{variantId}',
        handler: (request, reply) => {
            server.methods.database.variants.find(request.params.pushAppId, request.params.variantId).then((variant) => {
                if (variant.length === 0) {
                    return reply(Boom.notFound());
                }

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
        path: '/rest/applications/{pushAppId}/android',
        handler: (request, reply) => {
            const payload = request.payload;

            payload._id = uuid.v1();
            payload.variantID = uuid.v4();
            payload.secret = uuid.v4();

            server.methods.database.variants.create(request.params.pushAppId, payload).then((variant) => {
                return reply(variant).code(201);
            }).catch((err) => {
                if (err.isBoom) {
                    return reply(err);
                }

                return reply(Boom.badData('Internal MongoDB error', err));
            });
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().min(1).max(255).required(),
                    type: Joi.string().valid('ANDROID').required(),
                    description: Joi.string().min(1).max(255).optional(),
                    googleKey: Joi.string().min(1).max(255).required(),
                    projectNumber: Joi.string().min(1).max(255).optional()
                }
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'routes-variants-android'
};
