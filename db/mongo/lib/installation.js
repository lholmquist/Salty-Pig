'use strict';

const uuid = require('node-uuid');
const Boom = require('boom');

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

module.exports = {
    find: findInstallations,
    create: createInstallation
};
