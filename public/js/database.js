function write(user, groceryList, itemList){
    db.collection(user).doc(groceryList).set({
        // This function will require itemList to be a list of maps representing foods.
        items: itemList,
        ready_to_buy: false
    })
    .then(function() {
        console.log("Write success, the database should now contain this entry.")
        console.log("Invoke 'read('" + user +"')' to view all lists for this user.");
        
    })
    .catch(function(error) {
        console.error(error);
    });
};

function read(user){
    db.collection(user).get().then(function(querySnapshot) {
        console.log()
        console.log(querySnapshot.length)
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
        });
    });
};

function addItem(user, groceryList, item){
    db.collection(user).doc(groceryList).update({
        items: firebase.firestore.FieldValue.arrayUnion(item)
    });
};

function removeItem(user, groceryList, item){
    db.collection(user).doc(groceryList).update({
        items: firebase.firestore.FieldValue.arrayRemove(item)
    });
};

// for demo
console.log("Here is some code to demonstrate the working database. Please open 'https://console.firebase.google.com/project/groupceries-f6189/database' in another tab.")
console.log("Please initialize the following code in the console of the groceries/createListPage page.")
console.log(`
let item1 = {name: "cabbage", quantity:{amount: 5, unit:"heads"}, found: null};
let item2 = {name: "beef", quantity:{amount: 3, unit:"kgs"}, found: null};
let item3 = {name: "broth", quantity:{amount: 1, unit:"litres"}, found: null};
let dinner = [item1, item2, item3];
let item4 = {name: "eggs", quantity:{amount: 2, unit:"dozen"}, found: null};
let item5 = {name: "oatmeal", quantity:{amount: 2.5, unit:"kg"}, found: null};
let item6 = {name: "whiskey", quantity:{amount: 1.14, unit:"litres"}, found: null};
let breakfast = [item4, item5, item6];`)
console.log("Now let's showcase the app by invoking the following functions one after another:")
console.log(`
write("Chris", "dinner", dinner)
read("Chris")
write("Chris", "breakfast", breakfast)
read("Chris")
write("Armaan", "lunch", breakfast)
read("Armaan")
read("Chris")`)