var mongo = require('mongodb').MongoClient;

var M = function (options) {
    // Connection URL
    var url = 'mongodb://192.168.59.103:27017/unifiedpush',
        mongoDB;

    this.connect = function () {
        // Use connect method to connect to the Server
        mongo.connect(url, function(err, db) {
            mongoDB = db;

            console.log('connected to mongo');
        });
    };

    this.getDb = function () {
        console.log('getting db', mongoDB);
        return mongoDB;
    };

    this.collection = function () {
        return mongoDB.collection('unifiedpush');
    };

    this.disconnect = function () {
        mongoDB.close();
    };

    return this;
};

module.exports = new M();

