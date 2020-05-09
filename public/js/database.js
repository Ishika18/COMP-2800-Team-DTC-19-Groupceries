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
        console.log(querySnapshot.length)
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.error(error);
    });
};

function addItem(user, groceryList, item){
    db.collection(user).doc(groceryList).set({
        items: firebase.firestore.FieldValue.arrayUnion(item)
    }, {merge: true}).then(function() {
        console.log("Write success, the database should now contain this entry.")
        console.log("Invoke 'read('" + user +"')' to view all lists for this user.");
        
    })
    .catch(function(error) {
        console.error(error);
    });
};

function removeItem(user, groceryList, item){
    db.collection(user).doc(groceryList).set({
        items: firebase.firestore.FieldValue.arrayRemove(item)
    }, {merge: true})
    .then(function() {
        console.log("Write success, the database should now have removed contain this entry.")
        console.log("Invoke 'read('" + user +"')' to view all lists for this user.");
        
    })
    .catch(function(error) {
        console.error(error);
    });
};

function addGroceryList(user, groceryList){
    let GROCERY_LIST_INITIAL_STATE = {
        items: [],
        ready_to_buy: false,
    };
    db.collection(user).doc(groceryList).set(GROCERY_LIST_INITIAL_STATE)
    .then(function() {
        console.log("Write success, the database should now contain this entry.")
        console.log("Invoke 'read('" + user +"')' to view all lists for this user.");
    })
    .catch(function(error) {
        console.error(error);
    });
};

function deleteGroceryList(user, groceryList){
    db.collection(user).doc(groceryList).delete().then(function() {
        console.log("Delete success, the database should no longer contain this entry");
        console.log("Invoke 'read('" + user +"')' to view all lists for this user.");
    }).catch(function(error) {
        console.error(error);
    });
};

// inefficicent, but firebase has a 1-second delay on editing items within an array, additionally editing maps (objects) inside of arrays are inefficient.
function editItem(user, groceryList, oldItem, newItem){
    removeItem(user, groceryList, oldItem);
    addItem(user, groceryList, newItem);
};

//scripts below here
console.log(localStorage.getItem('uid'));

//debug to return the names of all items in Chris/dinner on change
db.collection("Chris").doc("dinner")
    .onSnapshot(function(doc) {
    objects = doc.data().items
        for(item in objects){
            console.log(objects[item].name);
        }
    });


db.collection("Chris")
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            // call relevant create/delete functions here
            // dont forget about instantiating lists.
            console.log(change.type, "to list", change.doc.ref.id, change.doc.data());
            // hardcoding for demo list "dinner" below
            if(change.doc.ref.id == "dinner"){
                console.log(change.doc.data().items);
                updateClient(change.doc.data().items)
            };
        });
    });

db.collection("Chris").doc("friends")
    .onSnapshot(function(doc){
        // placeholder for notification, possibly deprecated soon
    })
// for demo
console.log("Here is some code to demonstrate the working database. Please open 'https://console.firebase.google.com/project/groupceries-f6189/database' in another tab.")
console.log("Please initialize the following code in the console of the groceries/createListPage page.")
console.log(`
let item1 = {name: "cabbage", quantity:{amount: 5, unit:"units"}, found: null, notes: "note"};
let item2 = {name: "beef", quantity:{amount: 3, unit:"kg"}, found: null, notes: "note"};
let item3 = {name: "broth", quantity:{amount: 1, unit:"L"}, found: null, notes: "note"};
let dinner = [item1, item2, item3];
let item4 = {name: "eggs", quantity:{amount: 2, unit:"units"}, found: null, notes: "note"};
let item5 = {name: "oatmeal", quantity:{amount: 2.5, unit:"kg"}, found: null, notes: "note"};
let item6 = {name: "whiskey", quantity:{amount: 1.14, unit:"L"}, found: null, notes: "note"};
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