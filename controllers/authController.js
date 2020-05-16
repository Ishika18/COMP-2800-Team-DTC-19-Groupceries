const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

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
// make sure it is not initialized before
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
let db = firebase.firestore();

function intializeUser(user) {
    // if the user is new add their name and email 
    if (user.metadata.creationTime === user.metadata.lastSignInTime) {
        db.collection(user.uid).doc("userInfo").set({
            name: user.displayName,
            email: user.email
        }).catch(error => {console.log(error)});
    }
}


let authController = {
    loggerMiddleware: (req, res, next) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // user is signed in
                // do the rendering or whatever
                next();
            } else {
                // redirect to the home page.
                res.redirect("/");
            }
        });
    },

    login: (uId) => {
        var credential = firebase.auth.GoogleAuthProvider.credential(
            uId['idToken']);
        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential).then(function (result) {
            intializeUser(result.user);
            console.log("this is the user id token: ", firebase.auth().currentUser.uid);
        }).catch(function (error) {
            // Handle Errors here.
            console.log(error);
        });
    },

    logout: () => {
        firebase.auth().signOut().then(function () {
            console.log('sign out successfull');
        }, function (error) {
            console.log(error);
        });
    },

    user: () => {
        return firebase.auth().currentUser;
    }
}

module.exports = authController;