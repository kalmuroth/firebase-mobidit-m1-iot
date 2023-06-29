const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const formidable = require('formidable-serverless');
const gcs = require('@google-cloud/storage');
const fetch = require('node-fetch');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
require('dotenv').config();


//imports the required dependencies and initializes the Firebase Admin SDK.
admin.initializeApp();

/*

INFORMATIONS UTILES : 

Pour tester localement les apis : 
en ligne de commande : $ firebase emulators:start
dans postman mettre http://localhost:5001/bluelocker1-2/us-central1/<function_name>

*/


//--------------------------------------------------------------
//--------ROUTE TO ADMINISTRATE THE CATEGORY--------------------
//--------------------------------------------------------------


//creates an instance of the Express application for managing category routes.
const app_category = express();

//Defines a POST route
app_category.post("/", async (req, res) => {
    const category = req.body;
    await admin.firestore().collection("categories").add(category);

    res.status(200).send();
});

//Defines a GET route by id
app_category.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection("categories").doc(req.params.id).get();
    const categoryData = snapshot.data();
    
    res.status(200).send(JSON.stringify({categoryData}));
});

//Defines a GET route for retrieving all 
app_category.get("/", async (req, res) => {
    const snapshot = await admin.firestore().collection("categories").get();
    const categories = [];
    snapshot.forEach((doc) => {
        console.log(doc)
        const categoryId = doc.id;
        const categoryData = doc.data();
        categories.push({ categoryId, categoryData });
    });

    res.status(200).send(JSON.stringify(categories));
});

//Defines a DELETE route
app_category.delete("/:id", async (req, res) => {
    await admin.firestore().collection("categories").doc(req.params.id).delete();

    res.status(200).send();
});

//Defines a POST route for updating
app_category.post("/:id", async (req, res) => {
    try {
      const newData = req.body;
      const docRef = admin.firestore().collection("categories").doc(req.params.id);
      await docRef.update(newData);
  
      res.status(200).send();
    } catch (error) {

      res.status(500).json({ error: "Internal server error" });
    }
});

exports.category = functions.region('europe-west2').https.onRequest(app_category)


//--------------------------------------------------------------
//--------ROUTE TO ADMINISTRATE POSTS---------------------------
//--------------------------------------------------------------

//creates an instance of the Express application for managing category routes.
const app_post = express();

//Defines a POST route
app_post.post("/", async (req, res) => {
    const key = req.body;
    await admin.firestore().collection("posts").add(key);

    res.status(200).send();
});

//Defines a GET route by id
app_post.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection("posts").doc(req.params.id).get();
    const keyData = snapshot.data();
    
    res.status(200).send(JSON.stringify({keyData}));
});

//Defines a GET route for retrieving all 
app_post.get("/", async (req, res) => {
    const snapshot = await admin.firestore().collection("posts").get();
    const keys = []; 
    snapshot.forEach((doc) => {
        const keyId = doc.id;
        const keyData = doc.data();
        keys.push({keyId,keyData });
    });

    res.status(200).send(JSON.stringify(keys));
});

//Defines a DELETE route
app_post.delete("/:id", async (req, res) => {
    await admin.firestore().collection("posts").doc(req.params.id).delete();

    res.status(200).send();
});

//Defines a POST route for updating
app_post.post("/:id", async (req, res) => {
    try {
      const newData = req.body;
      const docRef = admin.firestore().collection("posts").doc(req.params.id);
      await docRef.update(newData);
  
      res.status(200).send();
    } catch (error) {
      console.error("Error updating data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});

exports.post = functions.region('europe-west2').https.onRequest(app_post);

//--------------------------------------------------------------
//--------ROUTE TO ADMINISTRATE COMMENTS------------------------
//--------------------------------------------------------------

const app_comment = express();

//Defines a POST route
app_comment.post("/", async (req, res) => {
    const key = req.body;
    await admin.firestore().collection("comments").add(key);

    res.status(200).send();
});

//Defines a GET route by id
app_comment.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection("comments").doc(req.params.id).get();
    const keyData = snapshot.data();
    
    res.status(200).send(JSON.stringify({keyData}));
});

//Defines a GET route for retrieving all 
app_comment.get("/", async (req, res) => {
    const snapshot = await admin.firestore().collection("comments").get();
    const keys = [];
    
    snapshot.forEach((doc) => {
        const keyId = doc.id;
        const keyData = doc.data();
        keys.push({keyId,keyData });
    });

    res.status(200).send(JSON.stringify(keys));
});

//Defines a DELETE route
app_comment.delete("/:id", async (req, res) => {
    await admin.firestore().collection("comments").doc(req.params.id).delete();

    res.status(200).send();
});

//Defines a POST route for updating
app_comment.post("/:id", async (req, res) => {
    try {
      const newData = req.body;
      const docRef = admin.firestore().collection("comments").doc(req.params.id);
      await docRef.update(newData);
  
      res.status(200).send();
    } catch (error) {
      console.error("Error updating data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});

exports.comment = functions.region('europe-west2').https.onRequest(app_comment);

//--------------------------------------------------------------
//--------ROUTE TO ADMINISTRATE USERS---------------------------
//--------------------------------------------------------------

//creates an instance of the Express application for managing category routes.
const app_user = express();

//Defines a POST route
app_user.post("/", async (req, res) => {
  const key = req.body;
  await admin.firestore().collection("users").add(key);

  res.status(200).send();
});

//Defines a GET route by id
app_user.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection("users").doc(req.params.id).get();
    const keyData = snapshot.data();
    
    res.status(200).send(JSON.stringify({keyData}));
});

//Defines a GET route for retrieving all 
app_user.get("/", async (req, res) => {
    const snapshot = await admin.firestore().collection("users").get();
    const keys = [];
    snapshot.forEach((doc) => {
        const keyId = doc.id;
        const keyData = doc.data();
        keys.push({keyId,keyData });
    });

    res.status(200).send(JSON.stringify(keys));
});

//Defines a POST route for updating
app_user.post("/:id", async (req, res) => {
    try {
      const newData = req.body;
      const docRef = admin.firestore().collection("users").doc(req.params.id);
      await docRef.update(newData);
  
      res.status(200).send();
    } catch (error) {
      console.error("Error updating data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});

//Defines a DELETE route
app_user.delete("/:id", async (req, res) => {
    await admin.firestore().collection("users").doc(req.params.id).delete();

    res.status(200).send();
})

exports.user = functions.region('europe-west2').https.onRequest(app_user);

//on user.create in Firebase Auth => method trigger => add user in database (uuid/email)
exports.updateUser = functions.region('europe-west2').auth.user().onCreate(async (user) => {
  try {
    const speudo = await getRandomUsername()
    const { uid, email} = user;
    const docRef = admin.firestore().collection("users").doc(uid);
    await docRef.set({ uid, email, speudo});

    return;
  } catch (error) {
    console.error("Error updating user count:", error);
    throw error;
  }
});


//upload image to firebase bucket
exports.uploadFileWithPath = functions.region('europe-west2').https.onRequest((req, res) => {
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


//same but decode in base64 
exports.uploadFileInBase64 = functions.region('europe-west2').https.onRequest(async (req, res) => {
  const fileData = req.body.fileData;

  if (!fileData) {
    res.status(400).send('No file data provided. Please choose a file.');
    return;
  }

  try {
    const fileBuffer = Buffer.from(fileData, 'base64');
    const tempFilePath = path.join(os.tmpdir(), 'temp-image.jpg');

    fs.writeFileSync(tempFilePath, fileBuffer);

    const storageWithAuth = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace newline characters
      },
    });

    const bucket = storage.bucket('flutter-mobidit-m1-iot.appspot.com');
    const bucketName ='flutter-mobidit-m1-iot.appspot.com';
    const fileName = 'image.jpg';

    const [uploadedFile] = await storageWithAuth.bucket(bucketName).upload(tempFilePath, {
      destination: fileName,
      contentType: 'image/jpg',
    });

    const file = bucket.file(fileName);
    const [metadata] = await file.getMetadata();
    const downloadUrl = await uploadedFile.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // Set an appropriate expiration date
    });

    res.status(200).send(JSON.stringify(downloadUrl[0]));
  } catch (err) {
    console.error('Error while decoding or uploading the file: ' + err);
    res.status(500).send('Error while decoding or uploading the file: ' + err);
  }
});



//generate random username
async function getRandomUsername() {
  try {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    const username = data.results[0].login.username;
    return username;
  } catch (error) {
    console.log('Error:', error);
    // Handle error
    return null;
  }
}