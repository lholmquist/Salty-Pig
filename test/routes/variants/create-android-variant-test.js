'use strict';

const test = require('tape');
const Hapi = require('hapi');
const Boom = require('boom');

test('variants route plugin - Test POST/create Android Variant', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/variants/android'), (err) => {
        server.method('database.variants.create',  (pushAppId, app) => { return Promise.resolve(app); }, {bind: server, callback: false});

        const request = {
            method: 'POST',
            url: '/rest/applications/12345/android',
            payload: {
                name: 'Android Variant',
                description: 'This is the Description',
                type: 'ANDROID',
                googleKey: 'ab34ef78'
            }
        };

        server.inject(request, (res) => {
            const result = res.result;
            t.equal(res.statusCode, 201, 'should return a 201 status');
            t.ok(result.name, 'object should have the name');
            t.equal(result.name, request.payload.name, 'name should equal what we put in');
            t.ok(result.description, 'object should have the description');
            t.equal(result.description, request.payload.description, 'description should equal what we put in');
            t.ok(result.variantID, 'should have a pushApplicationID');
            t.ok(result.secret, 'should have a secret');
            t.ok(result.googleKey, 'should have a googleKey');
            t.end();
        });
    });
});

test('variants route plugin - Test POST/create Android Variant - err - google key is required', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/variants/android'), (err) => {
        const request = {
            method: 'POST',
            url: '/rest/applications/12345/android',
            payload: {
                name: 'Android Variant',
                description: 'This is the Description',
                type: 'ANDROID'
            }
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 400, 'should return a 400 status');
            t.end();
        });
    });
});

test('variants route plugin - Test POST/create Android Variant - err - pushApp ID not found', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/variants/android'), (err) => {
        server.method('database.variants.create',  (pushAppId, app) => { return Promise.reject(Boom.notFound()); }, {bind: server, callback: false});

        const request = {
            method: 'POST',
            url: '/rest/applications/12345/android',
            payload: {
                name: 'Android Variant',
                description: 'This is the Description',
                type: 'ANDROID',
                googleKey: 'ab34ef78'
            }
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 404, 'should return a 404 status');
            t.end();
        });
    });
});


test('variants route plugin - Test POST/create Android Variant - err - with create', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/variants/android'), (err) => {
        server.method('database.variants.create',  (pushAppId, app) => { return Promise.reject({}); }, {bind: server, callback: false});

        const request = {
            method: 'POST',
            url: '/rest/applications/12345/android',
            payload: {
                name: 'Android Variant',
                description: 'This is the Description',
                type: 'ANDROID',
                googleKey: 'ab34ef78'
            }
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 422, 'should return a 422 status');
            t.end();
        });
    });
});
