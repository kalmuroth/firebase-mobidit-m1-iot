const admin = require("firebase-admin");

//import des dépendances pour initialiser le SDK Firebase
admin.initializeApp();

/*

INFORMATION : 

Pour tester localement les apis : 
en ligne de commande : $ firebase emulators:start
sur port 5001

*/

//export les méthodes
exports.admin = require('./admin');
exports.trigger = require('./trigger');
exports.upload = require('./upload');
