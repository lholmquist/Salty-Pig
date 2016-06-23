'use strict';

const uuid = require('node-uuid');
const Boom = require('boom');

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

function createVariants (pushAppId, payload) {
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

module.exports = {
    find: findVariants,
    findById: findVariantByVariantId,
    create: createVariants
};
