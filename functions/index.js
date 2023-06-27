const admin = require("firebase-admin");
const functions = require("firebase-functions");
const formidable = require('formidable-serverless');


admin.initializeApp();

/*

INFORMATIONS UTILES : 

Pour tester localement les apis : 
en ligne de commande : $ firebase emulators:start
dans postman mettre http://localhost:5001/bluelocker1-2/us-central1/<function_name>

*/

exports.admin = require('./admin');

//on user.create in Firebase Auth => method trigger => add user in database (uuid/email)
exports.updateUserCount = functions.region('europe-west2').auth.user().onCreate(async (user) => {
    try {
      const { uid, email} = user;
      const docRef = admin.firestore().collection("users").doc(uid);
      await docRef.set({ uid, email});
  
      return;
    } catch (error) {
      console.error("Error updating user count:", error);
      throw error;
    }
});


//upload image to firebase bucket
exports.uploadFile = functions.region('europe-west2').https.onRequest((req, res) => {
    var form = new formidable.IncomingForm();
    return new Promise((resolve, reject) => {
      form.parse(req, function(err, fields, files) {
        var file = files.fileToUpload;
        if(!file){
          reject("no file to upload, please choose a file.");
          return;
        }
        var filePath = file.path;  
        var bucket = admin.storage().bucket('flutter-mobidit-m1-iot.appspot.com');
        return bucket.upload(filePath, {
          destination: file.name
        }).then(() => {
          // Get the full URL of the uploaded file
          const fileUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
          resolve(fileUrl);
        }).catch((err) => {
          reject('Failed to upload: ' + JSON.stringify(err));
        });
      });
    }).then((fileUrl) => {
      res.status(200).send(JSON.stringify(fileUrl));
      return null
    }).catch(err => {
      console.error('Error while parsing form: ' + err);
      res.status(500).send('Error while parsing form: ' + err);
    });
});