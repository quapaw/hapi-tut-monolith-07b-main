'use strict';


class ManifestBuilder {

    getManifest() {
        const Fs = require('fs');

        const rawManifest  = require('./manifest.json');
        const Dotenv       = require('dotenv');
        const Confidence   = require('confidence');
        var   store        = new Confidence.Store();

        Dotenv.config({ path: `${__dirname}/../.env`});


        store.load(rawManifest);
        var simiManifest = store.get('/', process.env);

        simiManifest.registrations[0].plugin.options.url = process.env.MONGO_URL;

        if (process.env.PROTOCOL === 'https') {
            const key  = simiManifest.connections[0].tls.key;
            const cert = simiManifest.connections[0].tls.cert;

            simiManifest.connections[0].tls.key  = Fs.readFileSync(key);
            simiManifest.connections[0].tls.cert = Fs.readFileSync(cert);
            simiManifest.connections[0].prot     = process.env.HTTPS_PORT;
        } else {
            simiManifest.connections[0].port     = process.env.HTTP_PORT;
        }

        return simiManifest;
    }
}

module.exports = ManifestBuilder;
