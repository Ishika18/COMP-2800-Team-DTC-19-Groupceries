const firebase = require('firebase/app');
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyBzfpsQJKBWD575xH9C42NBXrZ8dXd963o",
    authDomain: "nodefirebase-fe37e.firebaseapp.com",
    databaseURL: "https://nodefirebase-fe37e.firebaseio.com",
    projectId: "nodefirebase-fe37e",
    storageBucket: "nodefirebase-fe37e.appspot.com",
    messagingSenderId: "553609402101",
    appId: "1:553609402101:web:a1b7c98c40c5402ed697bc"
};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

let db = firebase.firestore();

let friendController = {
    sendRequest: (currentUser, friendID) => {
        console.log(currentUser);
        console.log(friendID);
        // document friends of current user
        let currentUserDocs = db.collection(currentUser).doc("Friends");

        // document friends of friend
        let friendDocs = db.collection(friendID).doc("Friends");

        // add the current uid to the friends' recieved
        /* .arrayRemove can be used to remove elements from an array. */
        friendDocs.set({ recieved: firebase.firestore.FieldValue.arrayUnion(currentUser) }, { merge: true }).catch((error) => { console.log(error) });

        // send the friend a notification

        // add the friend uid to the cuurent users' sent
        currentUserDocs.set({ sent: [friendID] }, { merge: true }).catch((error) => { console.log(error) });
    },
}

module.exports = friendController;