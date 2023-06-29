const admin = require("firebase-admin");
const functions = require("firebase-functions");
const formidable = require('formidable-serverless');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
require('dotenv').config();

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