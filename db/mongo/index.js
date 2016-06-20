'use strict';

const mongo = require('mongodb').MongoClient;
const uuid = require('node-uuid');
const Boom = require('boom');

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

function findVariants(pushAppId) {
    return new Promise((resolve, reject) => {
        return this.methods.database.applications.find(pushAppId).then((pushApplicaitons) => {
            if (pushApplicaitons.length === 0) {
                return reject(Boom.notFound());
            }

            return resolve(pushApplicaitons[0].variants || []);
        });
    });
}

function findVariantByVariantId(variantId) {
    return new Promise((resolve, reject) => {
        const db = this.app.db;
        const pushApplication = db.collection('pushApplications');

        const query = {
            'variants.variantID': variantId
        };

        pushApplication.find(query).toArray((err, docs) => {
            if (err) {
                return reject(err);
            }

            return resolve(docs);

        });
    });
}

function createInstallation (installation) {
    return new Promise((resolve, reject) => {
        const db = this.app.db;
        const installations = db.collection('installations');

        installations.insert(installation, (err, result) => {
            if (err) {
                return reject(err);
            }

            return resolve(result.ops[0]);
        });
    });
}

function findInstallations (variantId) {
    return new Promise((resolve, reject) => {
        const db = this.app.db;
        const installations = db.collection('installations');

        installations.find({variantID: variantId}).toArray((err, installs) => {
            if (err) {
                return reject(err);
            }

            return resolve(installs);
        });
    });
}

function createVariants (pushAppId, payload) {
    /* jshint validthis: true */
    const applications = this.methods.database.applications;
     return applications.find(pushAppId).then((pushApplicaitons) => {
        if (pushApplicaitons.length === 0) {
            return Promise.reject(Boom.notFound());
        }

        const pushApplicaiton = pushApplicaitons[0];

        pushApplicaiton.variants.push(payload);
        return applications.update(pushApplicaiton);
    });
}

exports.register = (server, options, next) => {
    server.method('database.applications.find', findApplication, {bind: server, callback: false});
    server.method('database.applications.create', createApplication, {bind: server, callback: false});
    server.method('database.applications.update', updateApplication, {bind: server, callback: false});
    server.method('database.applications.remove', removeApplication, {bind: server, callback: false});
    server.method('database.applications.reset',  resetApplication, {bind: server, callback: false});

    server.method('database.variants.find', findVariants, {bind: server, callback: false});
    server.method('database.variants.findById', findVariantByVariantId, {bind: server, callback: false});
    server.method('database.variants.create', createVariants, {bind: server, callback: false});


    server.method('database.installations.create', createInstallation, {bind: server, callback: false});
    server.method('database.installations.find', findInstallations, {bind: server, callback: false});
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
