const firebase = require('firebase/app');
require('firebase/auth');

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


let authController = {
    loggerMiddleware: (req, res, next) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // user is signed in 
                console.log(user);
                // do the rendering or whatever
                next();
            } else {
                // redirect to the home page.
                res.render("home.ejs");
            }
        });
    },

    login: function (userId) {
        let uId = JSON.parse(userId);
        var credential = firebase.auth.GoogleAuthProvider.credential(
        uId['idToken']);
        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential).catch(function(error) {
        // Handle Errors here.
        console.log(error);
        });
    },

    logout: function () {
        firebase.auth().signOut().then(function() {
            console.log('sign out successfull');
        }, function(error) {
            console.log(error);
        });
    },

    user: firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            return user;
        }
    })
}

module.exports = authController;