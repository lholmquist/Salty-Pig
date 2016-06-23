'use strict';

const test = require('tape');
const Hapi = require('hapi');


test('applications route plugin - Test DELETE application', (t) => {
    const server = new Hapi.Server();

    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.remove', () => { return Promise.resolve({result: {n: 1}}); }, {bind: server, callback: false});

        const request = {
            method: 'DELETE',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 204, 'should return a 204 status');
            t.end();
        });
    });
});

test('applications route plugin - Test DELETE application - not found', (t) => {
    const server = new Hapi.Server();

    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.remove', () => { return Promise.resolve({result: {n: 0}}); }, {bind: server, callback: false});

        const request = {
            method: 'DELETE',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 404, 'should return a 404 status');
            t.end();
        });
    });
});


test('applications route plugin - Test DELETE application - err on delete', (t) => {
    const server = new Hapi.Server();

    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.remove', () => { return Promise.reject(); }, {bind: server, callback: false});

        const request = {
            method: 'DELETE',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 422, 'should return a 422 status');
            t.end();
        });
    });
});
