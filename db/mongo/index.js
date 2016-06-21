'use strict';

const mongo = require('mongodb').MongoClient;
const uuid = require('node-uuid');
const Boom = require('boom');

const application = require('./lib/application');
const variant = require('./lib/variant');
const installation = require('./lib/installation');

const url = 'mongodb://localhost:27017/unifiedpush';

exports.register = (server, options, next) => {
    server.method('database.applications.find', application.find, {bind: server, callback: false});
    server.method('database.applications.create', application.create, {bind: server, callback: false});
    server.method('database.applications.update', application.update, {bind: server, callback: false});
    server.method('database.applications.remove', application.remove, {bind: server, callback: false});
    server.method('database.applications.reset',  application.reset, {bind: server, callback: false});

    server.method('database.variants.find', variant.find, {bind: server, callback: false});
    server.method('database.variants.findById', variant.findById, {bind: server, callback: false});
    server.method('database.variants.create', variant.create, {bind: server, callback: false});


    server.method('database.installations.create', installation.create, {bind: server, callback: false});
    server.method('database.installations.find', installation.find, {bind: server, callback: false});

    mongo.connect(url, (err, db) => {
        if (err) {
            next(err);
        }

        server.app.db = db;
        next();
    });
};

exports.register.attributes = {
    name: 'mongodb-unifiedpush'
};
