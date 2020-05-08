const firebase = require("firebase/app");
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
// make sure it is not intialised before.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

let database = firebase.firestore();

let groceriesController = {

    home: (req, res) => {
        res.render("groceries/home");
    },

    createListPage: (req, res) => {
        // instead of grocery list user email could be passed because firestore data has to be edited.
        res.render('groceries/createListPage', database);
    },
    editListPage: (req, res) => {
        // instead of grocery list user email could be passed because firestore data has to be edited.
        res.render('groceries/editListPage', database);
    }
};

module.exports = groceriesController;