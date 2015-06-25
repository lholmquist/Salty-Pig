var uuid = require('node-uuid');
var mongo = require('mongodb').MongoClient;


var url = 'mongodb://localhost:27017/unifiedpush';

module.exports = {
    find: function (applicationId) {
        return new Promise(function (resolve, reject) {
            mongo.connect(url, function(err, db) {
                db.collection('unifiedpush').find({pushApplicationID: applicationId}).toArray(function (err, result) {
                    if (err) {
                        return reject(err);
                    }

                    db.close();
                    return resolve(result);
                });
            });
        });
    },
    findAll: function () {
        return new Promise(function (resolve, reject) {
            mongo.connect(url, function(err, db) {
                db.collection('unifiedpush').find().toArray(function (err, result) {
                if (err) {
                    return reject(err);
                }

                db.close();
                return resolve(result);
                });
            });
        });
    },
    save: function (payload) {
        return new Promise(function (resolve, reject) {
            var app = {
                name: payload.name,
                description: payload.description,
                pushApplicationID: uuid.v4(),
                masterSecret: uuid.v4()
            };

            mongo.connect(url, function(err, db) {
                db.collection('unifiedpush').insert(app, function (err, result) {
                    if (err) {
                        return reject(err);
                    }

                    db.close();
                    return resolve(result.ops[0]);
                });
            });
        });
    },
    remove: function (applicationId) {
        return new Promise(function (resolve, reject) {
            mongo.connect(url, function (err, db) {
                db.collection('unifiedpush').remove({pushApplicationID: applicationId}, function (err, result) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(result.result.n);
                });
            });
        });
    }
};
