const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");

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

const app_category = express();

app_category.post("/", async (req, res) => {
    const category = req.body;
    await admin.firestore().collection("categories").add(category);

    res.status(201).send();
});

app_category.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection("categories").doc(req.params.id).get();
    const categoryData = snapshot.data();
    
    res.status(200).send(JSON.stringify({categoryData}));
});

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

app_category.delete("/:id", async (req, res) => {
    await admin.firestore().collection("categories").doc(req.params.id).delete();

    res.status(200).send();
})

exports.category = functions.region('europe-west2').https.onRequest(app_category)


//--------------------------------------------------------------
//--------ROUTE TO ADMINISTRATE POSTS---------------------------
//--------------------------------------------------------------

const app_post = express();

app_post.post("/", async (req, res) => {
    const key = req.body;
    await admin.firestore().collection("posts").add(key);

    res.status(201).send();
});

app_post.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection("posts").doc(req.params.id).get();
    const keyData = snapshot.data();
    
    res.status(200).send(JSON.stringify({keyData}));
});
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

app_post.delete("/:id", async (req, res) => {
    await admin.firestore().collection("posts").doc(req.params.id).delete();

    res.status(200).send();
})

exports.post = functions.region('europe-west2').https.onRequest(app_post);

//--------------------------------------------------------------
//--------ROUTE TO ADMINISTRATE COMMENTS------------------------
//--------------------------------------------------------------

const app_comment = express();

app_comment.post("/", async (req, res) => {
    const key = req.body;
    await admin.firestore().collection("comments").add(key);

    res.status(201).send();
});

app_comment.get("/:id", async (req, res) => {
    const snapshot = await admin.firestore().collection("comments").doc(req.params.id).get();
    const keyData = snapshot.data();
    
    res.status(200).send(JSON.stringify({keyData}));
});
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

app_comment.delete("/:id", async (req, res) => {
    await admin.firestore().collection("comments").doc(req.params.id).delete();

    res.status(200).send();
})

exports.comment = functions.region('europe-west2').https.onRequest(app_comment);