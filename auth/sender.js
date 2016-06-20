'use strict';

function validate (request, username, password, callback) {
    // The usernam and password will be the variantID and the variantSecert
    // check to see if there is a username first
    if (!username) {
        callback(null, false);
    }
    // look up the variant by the Id(which will be the username)
    this.server.methods.database.applications.find(username).then((docs) => {
        if (docs.length === 0) {
            return callback(null, false);
        }

        // validate this variant comparing the password and variant secret
        if (password !== docs[0].masterSecret) {
            return callback(null, false);
        }

        callback(null, true, {id: username});


    }).catch((err) => {
        return callback(err, false);
    });
}

exports.register = (server, options, next) => {
    server.register([], (err) => {
        if (err) {
            next(err);
        }

        server.auth.strategy('auth-sender', 'basic', { validateFunc: validate, server: server });
        next();
    });
};

exports.register.attributes = {
    name: 'auth-sender'
};
