'use strict';

const uuid = require('node-uuid');

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

module.exports = {
    find: findApplication,
    create: createApplication,
    update: updateApplication,
    remove: removeApplication,
    reset: resetApplication
};
