const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejsLayouts = require('express-ejs-layouts');
const groceriesController = require('./controllers/groceriesController');
const authController = require('./controllers/authController');
const favicon = require('serve-favicon');
const userController = require('./controllers/userController');
const algoliaController = require('./controllers/algoliaController');
const friendController = require('./controllers/friendController');

const loggerMiddleware = authController.loggerMiddleware;

const PORT = process.env.PORT || 3000;

// send all the users to algolia
userController.listAllUsers().then( (users) => {
    algoliaController.addData(users);
    algoliaController.setSearchAttributes();
    algoliaController.setCustomRankings();
    //algoliaController.removeCurrentUser(currentUserID);
});

app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({extended: true}));

app.use(ejsLayouts);

// use favicon
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// set up template engine
app.set('view engine', 'ejs');

/* Routes start here */

// SS - landing / home page.
app.get("/", groceriesController.home);

// SS - create list page
app.get("/groceries/createListPage", loggerMiddleware, groceriesController.createListPage);

// SS - edit list page
app.get("/groceries/editListPage", loggerMiddleware, groceriesController.editListPage);

// SS - login / logout the user ( get user id from post request )
app.post("/home", function(req, res) {
    let userId = JSON.parse(JSON.stringify(req.body));
    console.log(userId['idToken']);
    if (userId['idToken'] == 'false') {
        authController.logout();
    } else {
        authController.login(userId);
    }
});

// SS - user send friend request.
app.post("/home/user", function (req, res) {
    let friendEmail = JSON.parse(JSON.stringify(req.body)).friendEmail;
    let currentUserID = JSON.parse(JSON.stringify(req.body)).currentUser;
    // find the user id using the email of the user.
    userController.getUID(friendEmail).then((friendID) => {
        friendController.sendRequest(currentUserID, friendID);
    }).catch( (error) => { console.log(error) });
});

app.listen(PORT, function() {
    console.log("Server running: Vist localhost:" + PORT + " in your browser.");
});