'use strict';

const test = require('tape');
const Hapi = require('hapi');
const Boom = require('boom');


const pushApplicationData = {
    'name':'Angry Birds',
    'description':null,
    'pushApplicationID':'474099cc-ee59-4253-8ed6-29a9be1e4618',
    'masterSecret':'24089b76-b46f-42a1-bc76-4847072e4c08',
    'variants':[
        {
            'name':'Android Variant',
            'googleKey':'123456789',
            'projectNumber':'5431',
            'type':'ANDROID',
            'variantID':'7e17b0e0-56d1-4b99-af66-a66f458b3eb0',
            'secret':'2bce8116-5e08-46d5-848a-c5e926582fb8'
        },
        {
            'name':'Android Variant 2',
            'googleKey':'123456789',
            'projectNumber':'5431',
            'type':'ANDROID',
            'variantID':'d2a9465f-c802-435c-a9f5-d475810fa45e',
            'secret':'51cf2cd6-6bcf-48da-a24f-0404b7c5c9b7'
        },
        {
            'name':'iOS Variant',
            'type':'IOS'
        }
    ]
};

// Android Variant GET
test('variants route plugin - Test Get variants - android', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/variants/android'), (err) => {
        server.method('database.variants.find', () => { return Promise.resolve(pushApplicationData.variants); }, {bind: server, callback: false});

        const request = {
            method: 'GET',
            url: '/rest/applications/474099cc-ee59-4253-8ed6-29a9be1e4618/android'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 200, 'should return a 200 status');
            t.equal(Array.isArray(res.result), true, 'should return an array');
            t.equal(res.result.length, 2, 'should return 2 android variants');
            t.end();
        });
    });
});

test('variants route plugin - Test Get variant - android', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/variants/android'), (err) => {
        server.method('database.variants.find', (pushAppId, variantId) => { return Promise.resolve(pushApplicationData.variants.filter((v) => { return variantId === v.variantID; })); }, {bind: server, callback: false});

        const request = {
            method: 'GET',
            url: '/rest/applications/474099cc-ee59-4253-8ed6-29a9be1e4618/android/7e17b0e0-56d1-4b99-af66-a66f458b3eb0'
        };

        server.inject(request, (res) => {
            const result = res.result;
            t.equal(res.statusCode, 200, 'should return a 200 status');
            t.equal(Array.isArray(result), false, 'should return an array');
            t.equal(result.name, 'Android Variant', 'name should be equal');
            t.end();
        });
    });
});

test('variants route plugin - Test Get variant - android - not found', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/variants/android'), (err) => {
        server.method('database.variants.find', (pushAppId, variantId) => { return Promise.resolve(pushApplicationData.variants.filter((v) => { return variantId === v.variantID; })); }, {bind: server, callback: false});

        const request = {
            method: 'GET',
            url: '/rest/applications/474099cc-ee59-4253-8ed6-29a9be1e4618/android/notvalid'
        };

        server.inject(request, (res) => {
            const result = res.result;
            t.equal(res.statusCode, 404, 'should return a 404 status');
            t.end();
        });
    });
});

test('variants route plugin - Test Get variants - pushApplicationID not found', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/variants/android'), (err) => {
        server.method('database.variants.find', () => { return Promise.reject(Boom.notFound()); }, {bind: server, callback: false});

        const request = {
            method: 'GET',
            url: '/rest/applications/474099cc-ee59-4253-8ed6-29a9be1e4618/android'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 404, 'should return a 404 status');
            t.end();
        });
    });
});

test('variants route plugin - Test Get variant - pushApplicationID not found', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/variants/android'), (err) => {
        server.method('database.variants.find', () => { return Promise.reject(Boom.notFound()); }, {bind: server, callback: false});

        const request = {
            method: 'GET',
            url: '/rest/applications/474099cc-ee59-4253-8ed6-29a9be1e4618/android/variantid'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 404, 'should return a 404 status');
            t.end();
        });
    });
});

test('variants route plugin - Test Get variants - err with find', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/variants/android'), (err) => {
        server.method('database.variants.find', () => { return Promise.reject({}); }, {bind: server, callback: false});

        const request = {
            method: 'GET',
            url: '/rest/applications/474099cc-ee59-4253-8ed6-29a9be1e4618/android'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 422, 'should return a 422 status');
            t.end();
        });
    });
});

test('variants route plugin - Test Get variant - err with find', (t) => {
    const server = new Hapi.Server();
    server.connection();
    server.register(require('../../../api/v1/variants/android'), (err) => {
        server.method('database.variants.find', () => { return Promise.reject({}); }, {bind: server, callback: false});

        const request = {
            method: 'GET',
            url: '/rest/applications/474099cc-ee59-4253-8ed6-29a9be1e4618/android/variantId'
        };

        server.inject(request, (res) => {
            t.equal(res.statusCode, 422, 'should return a 422 status');
            t.end();
        });
    });
});
