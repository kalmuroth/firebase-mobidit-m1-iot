const admin = require("firebase-admin");
const functions = require("firebase-functions");
const fetch = require('node-fetch');

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