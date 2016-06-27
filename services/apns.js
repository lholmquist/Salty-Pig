'use strict';

const apn = require('apn');
const _ = require('lodash');

function send(cert, passphrase, message, tokens) {
    const options = {
        pfx: cert.buffer,
        passphrase: passphrase,
        production: false
    };

    const apnConnection = new apn.Connection(options);

    const myDevices = tokens.map((t) => {
        return new apn.Device(t);
    });

    const note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 3;
    note.alert = '\uD83D\uDCE7 \u2709 You have a new message';
    note.payload = {'messageFrom': 'Caroline'};

    apnConnection.pushNotification(note, myDevices);

    apnConnection.on('completed', () => {
        console.log('Completed');
        apnConnection.shutdown();
    });
}

module.exports = (installs, message) => {
     // Need to group all the installs based on the VariantID, since we could have more than one variant
     const groupVariants = _.groupBy(installs, 'variantID');

     for(let install in groupVariants) {
        const installLenghth = groupVariants[install].length;
        const installations = groupVariants[install];
        const regTokens = [];
        for(let i = 0; i < installLenghth; i++) {
            regTokens.push(installations[i].deviceToken);
        }

        send(installations[0].variant.certificate, installations[0].variant.passphrase, '', regTokens);
     }
};
