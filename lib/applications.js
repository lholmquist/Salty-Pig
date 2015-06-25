var mongo = require('../db/mongo');
mongo.connect();


module.exports = {
    find: function (applicationId) {
        return Promise.resolve({});
    },
    findAll: function () {
        return new Promise(function (resolve, reject) {
            mongo.collection('unifiedpush').find().toArray(function (err, result) {
            if (err) {
                return reject(err);
            }
                return resolve(result);
            });
        });
    },
    save: function () {
        return new Promise(function (resolve, reject) {

        });
    }
};
