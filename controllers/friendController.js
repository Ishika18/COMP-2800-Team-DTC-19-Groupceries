const firebase = require('firebase/app');
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyC59-CinZU4yGdTnIcQPXEaIOC5R7cGfLA",
    authDomain: "groupceries-f6189.firebaseapp.com",
    databaseURL: "https://groupceries-f6189.firebaseio.com",
    projectId: "groupceries-f6189",
    storageBucket: "groupceries-f6189.appspot.com",
    messagingSenderId: "688161851064",
    appId: "1:688161851064:web:23a0bc2b403535a57f964d"
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

        // add the current uid to the friends' received
        /* .arrayRemove can be used to remove elements from an array. */
        friendDocs.set({ received: firebase.firestore.FieldValue.arrayUnion(currentUser) }, { merge: true }).catch((error) => { console.log(error) });

        // send the friend a notification

        // add the friend uid to the cuurent users' sent
        currentUserDocs.set({ sent: firebase.firestore.FieldValue.arrayUnion(friendID) }, { merge: true }).catch((error) => { console.log(error) });
    },

    undoSentRequest: (currentUser, friendID) => {
        // document friends of current user
        let currentUserDocs = db.collection(currentUser).doc("Friends");

        // document friends of friend
        let friendDocs = db.collection(friendID).doc("Friends");

        // delete the current uid to the friends'received
        friendDocs.update({ received: firebase.firestore.FieldValue.arrayRemove(currentUser) }).catch((error) => { console.log(error) });

        // remove the notification (maybe ?)

        // delete the friend email or uid to the cuurent users' sent
        currentUserDocs.update({ sent: firebase.firestore.FieldValue.arrayRemove(friendID) }).catch((error) => { console.log(error) });
    },

    acceptFriendRequest: (currentUser, friendID) => {
        // document friends of current user
        let currentUserDocs = db.collection(currentUser).doc("Friends");

        // document friends of friend
        let friendDocs = db.collection(friendID).doc("Friends");

        // add the current uid to the friends' accepted
        friendDocs.set({ accepted: firebase.firestore.FieldValue.arrayUnion(currentUser) }, { merge: true }).catch((error) => { console.log(error) });

        // delete the current uid from the friends' sent
        friendDocs.update({ sent: firebase.firestore.FieldValue.arrayRemove(currentUser) }).catch((error) => { console.log(error) });

        // delete the friends' uid from the user's recceived
        currentUserDocs.update({ received: firebase.firestore.FieldValue.arrayRemove(friendID) }).catch((error) => { console.log(error) });
        
        // send the friend a notification

        // add the friend uid to the cuurent users' accepted
        currentUserDocs.set({ accepted: firebase.firestore.FieldValue.arrayUnion(friendID) }, { merge: true }).catch((error) => { console.log(error) });
    },

    declineFriendRequest: (currentUser, friendID) => {
        /* If the user declines, should we inform the user who sent the friend request ?*/
        // delete the current email or uid to the friends' sent
        friendDocs.update({ sent: firebase.firestore.FieldValue.arrayRemove(currentUser) }).catch((error) => { console.log(error) });

        // remove the notification (maybe ?)

        // delete the friend email or uid to the cuurent users' received
        currentUserDocs.update({ received: firebase.firestore.FieldValue.arrayRemove(friendID) }).catch((error) => { console.log(error) });
    },

    unfriend: (currentUser, friendID) => {
        // delete the emails from the accepted.
        currentUserDocs.update({ accepted: firebase.firestore.FieldValue.arrayRemove(friendID) }).catch((error) => { console.log(error) });
        friendDocs.update({ accepted: firebase.firestore.FieldValue.arrayRemove(currentUser) }).catch((error) => { console.log(error) });
    }
}

module.exports = friendController;