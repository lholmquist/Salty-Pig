'use strict';

const gcm = require('node-gcm');
const _ = require('lodash');

function send (googleKey, gcmMessage, tokens) {
    const sender = new gcm.Sender(googleKey);
    sender.send(gcmMessage, {registrationTokens: tokens}, (err, response) => {
        console.log(err, response);
    });
}

module.exports = (installs, message) => {
     const gcmMessage = new gcm.Message(message);

     // Need to group all the installs based on the VariantID, since we could have more than one variant
     const groupVariants = _.groupBy(installs, 'variantID');

     for(let install in groupVariants) {
        const installLenghth = groupVariants[install].length;
        const installations = groupVariants[install];
        const regTokens = [];
        for(let i = 0; i < installLenghth; i++) {
            regTokens.push(installations[i].deviceToken);
        }

        send('AIzaSyDCORP3s2f0VED8ygCInCFCQQ4D7dZPW1o', gcmMessage, regTokens);
     }
};
