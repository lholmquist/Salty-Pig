'use strict';

const test = require('tape');
const Hapi = require('hapi');


test('applications route plugin - Test POST/create application', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.create',  (app) => { return Promise.resolve(app); }, {bind: server, callback: false});

        const request = {
            method: 'POST',
            url: '/rest/applications',
            payload: {
                name: 'Push App 1',
                description: 'This is the Description'
            }
        };

        server.inject(request, (res) => {
            const result = res.result;
            t.equal(res.statusCode, 201, 'should return a 201 status');
            t.ok(result.name, 'object should have the name');
            t.equal(result.name, request.payload.name, 'name should equal what we put in');
            t.ok(result.description, 'object should have the description');
            t.equal(result.description, request.payload.description, 'description should equal what we put in');
            t.ok(result.pushApplicationID, 'should have a pushApplicationID');
            t.ok(result.masterSecret, 'should have a masterSecret');
            t.ok(result.variants, 'should have a variants');
            t.ok(Array.isArray(result.variants), 'variants should be an array');
            t.end();
        });
    });
});

test('applications route plugin - Test POST/create application - description is optional', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.create',  (app) => { return Promise.resolve(app); }, {bind: server, callback: false});

        const request = {
            method: 'POST',
            url: '/rest/applications',
            payload: {
                name: 'Push App 1'
            }
        };

        server.inject(request, (res) => {
            const result = res.result;
            t.equal(res.statusCode, 201, 'should return a 201 status');
            t.equal(result.description, undefined, 'description should be undefined');
            t.end();
        });
    });
});

test('applications route plugin - Test POST/create application - err, missing name', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.create',  (app) => { return Promise.resolve(app); }, {bind: server, callback: false});

        const request = {
            method: 'POST',
            url: '/rest/applications',
            payload: {}
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 400, 'should return a 400 status');
            t.end();
        });
    });
});

test('applications route plugin - Test POST/create application - create error', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.create',  (app) => { return Promise.reject(); }, {bind: server, callback: false});

        const request = {
            method: 'POST',
            url: '/rest/applications',
            payload: {
                name: 'Push App'
            }
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 422, 'should return a 422 status');
            t.end();
        });
    });
});
