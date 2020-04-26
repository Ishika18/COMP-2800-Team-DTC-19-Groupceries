import { database } from "firebase";

let groceriesController = {

    home: (req, res) => {
        res.render("groceries/home");
    },

    createListPage: (req, res) => {
        // instead of grocery list user email could be passed because firestore data has to be edited.
        res.render('groceries/createListPage', {groceryList: database.randomUserId.groceries})
    },

    editListPage: (req, res) => {
        // instead of grocery list user email could be passed because firestore data has to be edited.
        res.render('groceries/editListPage', {groceryList: database.randomUserId.groceries})
    }
}