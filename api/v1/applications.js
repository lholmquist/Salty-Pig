'use strict';

const Boom = require('boom');
const Joi = require('joi');
const uuid = require('node-uuid');

exports.register = (server, options, next) => {
    const db = server.app.db;
    const pushApplication = db.collection('pushApplications');

    server.route({
        method: 'GET',
        path: '/rest/applications',
        handler: (request, reply) => {
            server.methods.database.applications.find().then((docs) => {
                reply(docs);
            }).catch((err) => {
                return reply(Boom.badData('Internal MongoDB error', err));
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/rest/applications/{pushAppId}',
        handler: (request, reply) => {
            server.methods.database.applications.find(request.params.pushAppId).then((docs) => {
                if (docs.length === 0) {
                    return reply(Boom.notFound());
                }

                return reply(docs[0]);
            }).catch((err) => {
                return reply(Boom.badData('Internal MongoDB error', err));
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/rest/applications',
        handler: (request, reply) => {
            const app = {
                _id: uuid.v1(),
                name: request.payload.name,
                description: request.payload.description,
                pushApplicationID: uuid.v4(),
                masterSecret: uuid.v4(),
                variants: []
            };

            server.methods.database.applications.create(app, server).then((result) => {
                return reply(result);
            }).catch((err) => {
                return reply(Boom.badData('Internal MongoDB error', err));
            });
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().min(1).max(255).required(),
                    description: Joi.string().min(1).max(255).optional()
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/rest/applications/{pushAppId}',
        handler: (request, reply) => {
            // TODO: find the thing first,  then merge the payload with the current, then update
            server.methods.database.applications.find(request.params.pushAppId).then((docs) => {
                // check that it exists
                if (docs.length === 0) {
                    return reply(Boom.notFound());
                }

                const pushApplication = docs[0];

                const query = {};

                // Not really a fan of these if's
                // according to the endpoint docs,  i think all the params need to be here, so this could change
                // api reference https://aerogear.org/docs/specs/aerogear-unifiedpush-rest/index.html#-1174679174
                if (request.payload.name) {
                    query.name = request.payload.name;
                }

                if (request.payload.description) {
                    query.description = request.payload.description;
                }

                const updatedPushApplication = Object.assign({}, pushApplication, query);
                // got the doc we need.
                return server.methods.database.applications.update(updatedPushApplication).then((doc) => {
                    if (doc.result.n === 0) {
                        return reply(Boom.notFound());
                    }

                    return reply().code(204);
                });
            }).catch((err) => {
                return reply(Boom.badData('Internal MongoDB error', err));
            });
        },
        config: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(1).max(255).optional(),
                    description: Joi.string().min(1).max(255).optional(),
                })
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/rest/applications/{pushAppId}',
        handler: (request, reply) => {
            server.methods.database.applications.remove(request.params.pushAppId).then((doc) => {
                if (doc.result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            }).catch((err) => {
                return reply(Boom.badData('Internal MongoDB error', err));
            });
        }
    });

    server.route({
        method: 'PUT',
        path: '/rest/applications/{pushAppId}/reset',
        handler: (request, reply) => {
            server.methods.database.applications.reset(request.params.pushAppId).then((doc) => {
                if (doc.result.n === 0) {
                    return reply(Boom.notFound());
                }

                return server.methods.database.applications.find(request.params.pushAppId);
            }).then((docs) => {
                if (docs.length === 0) {
                    return reply(Boom.notFound());
                }

                return reply(docs[0]);
            }).catch((err) => {
                return reply(Boom.badData('Internal MongoDB error', err));
            });
        }
    });

    next();
};


exports.register.attributes = {
    name: 'routes-applications'
};
