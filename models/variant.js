var variants = require('../lib/variants');

module.exports = {
    find: function (applicationId, variantId) {
        return variants.find(applicationId, variantId);
    },
    findAll: function (applicationId) {
        return variants.findAll(applicationId);
    },
    save: function (applicationId, payload) {
        return variants.save(applicationId, payload);
    },
    update: function (variantId, payload) {
        throw('Not yet Impletented');
    },
    remove: function (variantId) {
        throw('Not Yet Implemented');
    }
};
