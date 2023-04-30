const functions = require("firebase-functions");
const universal = require(__dirname + "/dist/server/main").app();

exports.ssr = functions.region('europe-west1').https.onRequest(universal);
