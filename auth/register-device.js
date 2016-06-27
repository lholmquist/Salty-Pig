'use strict';

function validate (request, username, password, callback) {
    // The usernam and password will be the variantID and the variantSecert
    // check to see if there is a username first
    if (!username) {
        callback(null, false);
    }
    // look up the variant by the Id(which will be the username)
    this.server.methods.database.variants.findById(username).then((docs) => {
        if (docs.length === 0) {
            callback(null, false);
            return;
        }

        const variant = docs[0].variants.filter((v) => {
            return v.variantID === username;
        })[0];

        // validate this variant comparing the password and variant secret
        if (password !== variant.secret) {
            callback(null, false);
            return;
        }

        callback(null, true, {id: variant.variantID});


    }).catch((err) => {
        callback(err, false);
    });
}

exports.register = (server, options, next) => {
    server.register([], (err) => {
        if (err) {
            next(err);
        }

        server.auth.strategy('device-registration', 'basic', { validateFunc: validate, server: server });
        next();
    });
};

exports.register.attributes = {
    name: 'auth-register-device'
};
