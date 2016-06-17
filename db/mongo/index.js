'use strict';

const mongo = require('mongodb').MongoClient;
const uuid = require('node-uuid');

const url = 'mongodb://localhost:27017/unifiedpush';

function findApplication (pushAppId) {
    return new Promise((resolve, reject) => {
        const db = this.app.db;
        const pushApplication = db.collection('pushApplications');

        const query = {};

        if (pushAppId) {
            query.pushApplicationID = pushAppId;
        }

        pushApplication.find(query).toArray((err, docs) => {
            if (err) {
                return reject(err);
            }

            return resolve(docs);

        });
    });
}

function createApplication (app) {
    return new Promise((resolve, reject) => {
        const db = this.app.db;
        const pushApplication = db.collection('pushApplications');

        pushApplication.insert(app, (err, result) => {
            console.log(err, result);
            if (err) {
                return reject(err);
            }

            return resolve(result.ops[0]);
        });
    });
}

function updateApplication (updatedPushApp) {
    return new Promise((resolve, reject) => {
        const db = this.app.db;
        const pushApplication = db.collection('pushApplications');

         pushApplication.update({pushApplicationID: updatedPushApp.pushApplicationID}, updatedPushApp,  (err, doc) => {
            if (err) {
                return reject(err);
            }

            return resolve(doc);
        });
    });
}

function removeApplication (pushAppId) {
    return new Promise((resolve, reject) => {
        const db = this.app.db;
        const pushApplication = db.collection('pushApplications');

        pushApplication.remove({
            pushApplicationID: pushAppId
        }, (err, doc) => {
            if (err) {
                return reject(err);
            }

            resolve(doc);
        });
    });
}

function resetApplication (pushAppId) {
    return new Promise((resolve, reject) => {
        const db = this.app.db;
        const pushApplication = db.collection('pushApplications');

        const query = {
            $set: {
                masterSecret: uuid.v4()
            }
        };

        pushApplication.update({pushApplicationID: pushAppId}, query,  (err, doc) => {
            if (err) {
                return reject(err);
            }

            return resolve(doc);
        });
    });
}

exports.register = (server, options, next) => {
    server.method('database.applications.find', findApplication, {bind: server, callback: false});
    server.method('database.applications.create', createApplication, {bind: server, callback: false});
    server.method('database.applications.update', updateApplication, {bind: server, callback: false});
    server.method('database.applications.remove', removeApplication, {bind: server, callback: false});
    server.method('database.applications.reset',  resetApplication, {bind: server, callback: false});

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
