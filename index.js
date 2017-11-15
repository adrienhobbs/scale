var SerialPort = require('serialport');
var KegScale = require('./lib/scale.js')
var admin = require("firebase-admin");
var serviceAccount = require("./glowkeg-firebase-adminsdk-xyuz0-46af9894e0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://glowkeg.firebaseio.com"
});
 

// SCALE WILL TARE ON INITIALIZATION IF TAREONINIT VARIABLE IS SET TO TRUE
//
//todo lets kill the serial listener if removed from firebase @TODO
// save initialized taps in object for reference later on

// example
// var tapOne = new KegScale({
//   baudRate: 115200,
//   path: '/dev/cu.usbserial-DN03FZV0',
//   name: 'Right Tap'
// })
//
// tapOne.watch()
//
// tap will emit events - init, pouringUpdated, weightUpdated, temperatureUpdated

const database = admin.database()

database.ref('lastStart').update(new Date())

database.ref('taps').once('value', snap => {
  snap.forEach(tapSnap => {
    const tap = new KegScale(tapSnap.val()).watch()

    tap.on('pouringUpdated', data => {
      database.ref('/taps/' + data.name).update(data)
    })

    tap.on('temperatureUpdated', data => {
      database.ref('/taps/' + data.name).update({temperature: data.temperature})
    })

    tap.on('weightUpdated', data => {
      database.ref('/taps/' + data.name).update(data)
    })
  })
})

