'use strict';

const test = require('tape');
const Hapi = require('hapi');


test('applications route plugin - Test PUT/update application', (t) => {
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
        const updateSuccessMock = (app) => {
            // Test that our Object.assign worked ok
            t.equal(app.name, 'Push App Update Name', 'name should be updated');
            t.ok(app.pushApplicationID, 'should have a pushApplicationID');
            t.ok(app.masterSecret, 'should have a masterSecret');
            t.ok(app.variants, 'should have a variants');

            const doc = {
                result: {
                    n: 1
                }
            };

            return Promise.resolve(doc);
        };

        server.method('database.applications.find', () => { return Promise.resolve(pushApplications); }, {bind: server, callback: false});
        server.method('database.applications.update', updateSuccessMock, {bind: server, callback: false});

        const request = {
            method: 'PUT',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f',
            payload: {
                name: 'Push App Update Name'
            }
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 204, 'should return a 204 status');
            t.end();
        });
    });
});

test('applications route plugin - Test PUT/update application with description', (t) => {
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
        const updateSuccessMock = (app) => {
            // Test that our Object.assign worked ok
            t.equal(app.name, 'Push App Update Name', 'name should be updated');
            t.equal(app.description, 'Updated Description', 'name should be updated');
            t.ok(app.pushApplicationID, 'should have a pushApplicationID');
            t.ok(app.masterSecret, 'should have a masterSecret');
            t.ok(app.variants, 'should have a variants');

            const doc = {
                result: {
                    n: 1
                }
            };

            return Promise.resolve(doc);
        };

        server.method('database.applications.find', () => { return Promise.resolve(pushApplications); }, {bind: server, callback: false});
        server.method('database.applications.update', updateSuccessMock, {bind: server, callback: false});

        const request = {
            method: 'PUT',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f',
            payload: {
                name: 'Push App Update Name',
                description: 'Updated Description'
            }
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 204, 'should return a 204 status');
            t.end();
        });
    });
});

test('applications route plugin - Test PUT/update application - err with no name', (t) => {
    const server = new Hapi.Server();

    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {

        const request = {
            method: 'PUT',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f',
            payload: {
                description: 'Updated Description'
            }
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 400, 'should return a 400 status');
            t.end();
        });
    });
});

test('applications route plugin - Test PUT/update application - no rows updated', (t) => {
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
        const updateSuccessMock = (app) => {
            const doc = {
                result: {
                    n: 0
                }
            };

            return Promise.resolve(doc);
        };

        server.method('database.applications.find', () => { return Promise.resolve(pushApplications); }, {bind: server, callback: false});
        server.method('database.applications.update', updateSuccessMock, {bind: server, callback: false});

        const request = {
            method: 'PUT',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f',
            payload: {
                name: 'Push App Update Name'
            }
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 404, 'should return a 404 status');
            t.end();
        });
    });
});

test('applications route plugin - Test PUT/update application - error on updat', (t) => {
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
        const updateSuccessMock = (app) => {
            return Promise.reject();
        };

        server.method('database.applications.find', () => { return Promise.resolve(pushApplications); }, {bind: server, callback: false});
        server.method('database.applications.update', updateSuccessMock, {bind: server, callback: false});

        const request = {
            method: 'PUT',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f',
            payload: {
                name: 'Push App Update Name'
            }
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 422, 'should return a 422 status');
            t.end();
        });
    });
});

test('applications route plugin - Test PUT/update application - not found', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.find', () => { return Promise.resolve([]); }, {bind: server, callback: false});

        const request = {
            method: 'PUT',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f',
            payload: {
                name: 'Push App Update Name'
            }
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 404, 'should return a 404 status');
            t.end();
        });
    });
});

test('applications route plugin - Test PUT/update application - error in find', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/applications'), (err) => {
        server.method('database.applications.find', () => { return Promise.reject(); }, {bind: server, callback: false});

        const request = {
            method: 'PUT',
            url: '/rest/applications/531801c7-5ae5-468a-9484-2b047a41e64f',
            payload: {
                name: 'Push App Update Name'
            }
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 422, 'should return a 422 status');
            t.end();
        });
    });
});
