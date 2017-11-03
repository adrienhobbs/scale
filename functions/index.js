const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.pouring = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.pouring;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  admin.database().ref('/pouring').set(original).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    // res.redirect(303, snapshot.ref);
    res.status(200).send()
  });
});

exports.updateWeight = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.weight;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  admin.database().ref('/weight').set(original).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    // res.redirect(303, snapshot.ref);
    res.status(200).send()
  });
});
