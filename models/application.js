var applications = require('../lib/applications');

module.exports = {
    find: function (applicationId) {
        // Returns a Promise
        return applications.find(applicationId);
    },
    findAll: function () {
        return applications.findAll();
    },
    save: function (payload) {
        return applications.save(payload);
    },
    update: function (payload) {
        throw('Not yet Implemented');
    },
    remove: function (applicationId) {
        return applications.remove(applicationId);
    }
};
