const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ejsLayouts = require('express-ejs-layouts');
const groceriesController = require('./controllers/groceriesController');

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

const loggerMiddleware = (req, res, next) => {
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
};

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({extended: true}));

app.use(ejsLayouts);

// set up template engine
app.set('view engine', 'ejs');

/* Routes start here */

// SS - landing / home page.
app.get("/", groceriesController.home);

// SS - create list page
app.get("/groceries/createListPage", groceriesController.createListPage);

// SS - edit list page
app.get("/groceries/editListPage", groceriesController.editListPage);

app.listen(PORT, function() {
    console.log("Server running: Vist localhost:" + PORT + " in your browser.")
})