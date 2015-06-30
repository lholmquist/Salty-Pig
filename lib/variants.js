var uuid = require('node-uuid');
var mongo = require('mongodb').MongoClient;
var applications = require('./applications');


var url = 'mongodb://localhost:27017/unifiedpush';

function findVariant (variants, variantId) {
    return variants.filter(function (variant) {
        return variant.variantId === variantId;
    });
}

module.exports = {
    find: function (applicationId, variantId, type) {
        return new Promise(function (resolve, reject) {
            mongo.connect(url, function(err, db) {
                db.collection('unifiedpush').find({pushApplicationID: applicationId}).toArray(function (err, result) {
                    if (err) {
                        return reject(err);
                    }
                    db.close();

                    if (!result.variants) {
                        return resolve([]);
                    }

                    return resolve(findVariant(result.variants));
                });
            });
        });
    },
    findAll: function (applicationId) {
        return new Promise(function (resolve, reject) {
            mongo.connect(url, function(err, db) {
                db.collection('unifiedpush').find({pushApplicationID: applicationId}).toArray(function (err, result) {
                    if (err) {
                        return reject(err);
                    }
                    db.close();

                    if (!result.variants) {
                        return resolve([]);
                    }

                    return resolve(result.variants);
                });
            });
        });
    },
    save: function (applicationId, payload) {
        var variant = {
            name: payload.name,
            description: payload.description,
            type: payload.type,
            variantId: uuid.v4(),
            secret: uuid.v4()
        };

        // Need to add OS specific stuff here

        return applications.find(applicationId).then(function (app) {
            var application = app[0];
            application.variants = application.variants || [];
            application.variants.push(variant);
            return applications.update(application);
        }).then(function () {
            return variant;
        });
    },
    update: function (variantId, payload) {
        throw('Not yet Impletented');
    },
    remove: function (variantId) {
        throw('Not Yet Implemented');
    }
};
