'use strict';

const test = require('tape');
const Hapi = require('hapi');


test('applications route plugin - Test PUT/reset application', (t) => {
    const server = new Hapi.Server();

    const pushApplications = [
        {
            'name':'Push Application',
            'description':null,
            'pushApplicationID':'531801c7-5ae5-468a-9484-2b047a41e64f',
            'masterSecret':'358764f9-f786-4629-b48d-b74dee60b29a',
            'variants':[]
        }
    ];

    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        const resetSuccessMock = (app) => {
            pushApplications[0].masterSecret = '54321';

            const doc = {
                result: {
                    n: 1
                }
            };

            return Promise.resolve(doc);
        };

        server.method('database.applications.find', () => { return Promise.resolve(pushApplications); }, {bind: server, callback: false});
        server.method('database.applications.reset', resetSuccessMock, {bind: server, callback: false});

        const request = {
            method: 'PUT',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f/reset'
        };

        server.inject(request, (res) => {
            const result = res.result;
            t.equal(result.masterSecret, '54321', 'secret should be updated');
            t.equal(res.statusCode, 200, 'should return a 200 status');
            t.end();
        });
    });
});

test('applications route plugin - Test PUT/reset application - err not found on remove', (t) => {
    const server = new Hapi.Server();

    const pushApplications = [
        {
            'name':'Push Application',
            'description':null,
            'pushApplicationID':'531801c7-5ae5-468a-9484-2b047a41e64f',
            'masterSecret':'358764f9-f786-4629-b48d-b74dee60b29a',
            'variants':[]
        }
    ];

    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        const resetSuccessMock = (app) => {
            const doc = {
                result: {
                    n: 0
                }
            };

            return Promise.resolve(doc);
        };

        server.method('database.applications.find', () => { return Promise.resolve(pushApplications); }, {bind: server, callback: false});
        server.method('database.applications.reset', resetSuccessMock, {bind: server, callback: false});

        const request = {
            method: 'PUT',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f/reset'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 404, 'should return a 404 status');
            t.end();
        });
    });
});

test('applications route plugin - Test PUT/reset application - err -not found on find', (t) => {
    const server = new Hapi.Server();

    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        const resetSuccessMock = (app) => {

            const doc = {
                result: {
                    n: 1
                }
            };

            return Promise.resolve(doc);
        };

        server.method('database.applications.find', () => { return Promise.resolve([]); }, {bind: server, callback: false});
        server.method('database.applications.reset', resetSuccessMock, {bind: server, callback: false});

        const request = {
            method: 'PUT',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f/reset'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 404, 'should return a 404 status');
            t.end();
        });
    });
});

test('applications route plugin - Test reset application - err on reset', (t) => {
    const server = new Hapi.Server();

    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.reset', () => { return Promise.reject(); }, {bind: server, callback: false});

        const request = {
            method: 'PUT',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f/reset'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 422, 'should return a 422 status');
            t.end();
        });
    });
});
