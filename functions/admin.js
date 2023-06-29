const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");

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

const app_get_post = express();

// Retrieve comments with the same id_post
app_get_post.get("/:id", async (req, res) => {
    try {
      const postId = req.params.id;
      
      const commentsSnapshot = await admin.firestore().collection("comments").where("id_post", "==", postId).get();
      const comments = [];
      commentsSnapshot.forEach((doc) => {
        comments.push(doc.data());
      });
  
      res.status(200).json(comments);
    } catch (error) {
      console.error("Error retrieving comments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
});

exports.getPost = functions.region('europe-west2').https.onRequest(app_get_post);
