const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ejsLayouts = require('express-ejs-layouts');
const groceriesController = require('./controllers/groceriesController');
const authController = require('./controllers/authController');
<<<<<<< HEAD
const favicon = require('serve-favicon');
=======
const userController = require('./controllers/userController');
const algoliaController = require('./controllers/algoliaController');

>>>>>>> dev
const loggerMiddleware = authController.loggerMiddleware;
const user = authController.user;
let currentUserID = user.uid;

const PORT = process.env.PORT || 3000;

// send all the users to algolia
userController.listAllUsers().then( (users) => {
    algoliaController.addData(users);
    algoliaController.setSearchAttributes();
    algoliaController.setCustomRankings();
    algoliaController.removeCurrentUser(currentUserID);
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

// SS - mobile main page
app.get("/groceries/mobileMain", loggerMiddleware, groceriesController.mobileMain);

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

app.listen(PORT, function() {
    console.log("Server running: Vist localhost:" + PORT + " in your browser.");
});