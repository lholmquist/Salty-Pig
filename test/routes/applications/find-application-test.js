'use strict';

const test = require('tape');
const Hapi = require('hapi');


const pushApplicationData = [
    {
        name: 'Push App 1',
        pushApplicationID: '12345-abcde',
    },
    {
        name: 'Push App 2',
        pushApplicationID: '54321-abcde'
    }
];

function findMocked(pushAppId) {
    return Promise.resolve(pushApplicationData.filter(p => p.pushApplicationID === pushAppId));
}

test('applications route plugin - Test Get applications', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.find', () => { return Promise.resolve(pushApplicationData); }, {bind: server, callback: false});

        const request = {
            method: 'GET',
            url: '/rest/applications'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 200, 'should return a 200 status');
            t.equal(Array.isArray(res.result), true, 'should return an array');
            t.equal(res.result.length, 2, 'should return 2 push applications');
            t.end();
        });
    });
});

test('applications route plugin - Test Get applications error', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.find', () => { return Promise.reject(); }, {bind: server, callback: false});

        const request = {
            method: 'GET',
            url: '/rest/applications'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 422, 'should return a 422 status');
            t.end();
        });
    });
});

test('applications route plugin - Test Get 1 application', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.find', findMocked, {bind: server, callback: false});

        const request = {
            method: 'GET',
            url: '/rest/applications/12345-abcde'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 200, 'should return a 200 status');
            t.equal(Array.isArray(res.result), false, 'should return an array');
            t.equal(res.result.name, pushApplicationData[0].name, 'names should equal');
            t.equal(res.result.pushApplicationID, pushApplicationData[0].pushApplicationID, 'pushApplicationIDs should equal');
            t.end();
        });
    });
});

test('applications route plugin - Test Get 1 application not found', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.find', findMocked, {bind: server, callback: false});

        const request = {
            method: 'GET',
            url: '/rest/applications/notfound'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 404, 'should return a 204 status');
            t.end();
        });
    });
});

test('applications route plugin - Test Get 1 application error', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.find', () => { return Promise.reject(); }, {bind: server, callback: false});

        const request = {
            method: 'GET',
            url: '/rest/applications/error'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 422, 'should return a 422 status');
            t.end();
        });
    });
});
