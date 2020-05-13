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

// call on page load
function newListener(){
    userListener = db.collection(localStorage.getItem('uid'))
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if(change.doc.ref.id == "Friends"){
                // change .accepted into the actual field. change consolelog 
                // into function that updates friends' frontend. instantiators will call getUserName.
                // /silv make div with hidden UID, shown name.
                // TODO make a function that creates a global variable holding listeners for all friends.
                // let x = onsnap, arr.push(x), arr[i]()
                console.log(change.doc.data().accepted)
            };
            // replace if statement with check to see if document is a grocery list
            if(change.doc.ref.id == "groceryListPattern"){
                // need to add an if statement to check if list is most recently interacted with
                if(change.type == "added"){
                    // replace console.log with instantiate list function
                    console.log(change.doc.ref.id)
                };
            };
            console.log(change.type, "to list", change.doc.ref.id, change.doc.data());
            // replace dinner with param currentlist or function that returns currentlistname
            // if function, no need to recreate listener on list change
            if(change.doc.ref.id == "dinner"){
                console.log(change.doc.data().items);
                updateClient(change.doc.data().items)
            };
        });
    });
}

function getUserName(UID) {
    db.collection(UID).doc("userInfo").get().then(function(doc) {
        return doc.data().name
    })
    .catch(function(error) {
        console.error(error);
    });
}

// for demo
function demo(){
    item1 = {name: "cabbage", quantity:{amount: 5, unit:"units"}, found: null, notes: "note"};
    item2 = {name: "beef", quantity:{amount: 3, unit:"kg"}, found: null, notes: "note"};
    item3 = {name: "broth", quantity:{amount: 1, unit:"L"}, found: null, notes: "note"};
    dinner = [item1, item2, item3];
    item4 = {name: "eggs", quantity:{amount: 2, unit:"units"}, found: null, notes: "note"};
    item5 = {name: "oatmeal", quantity:{amount: 2.5, unit:"kg"}, found: null, notes: "note"};
    item6 = {name: "whiskey", quantity:{amount: 1.14, unit:"L"}, found: null, notes: "note"};
    breakfast = [item4, item5, item6];
    console.log('https://console.firebase.google.com/project/groupceries-f6189/database');
};


//scripts below here

//debug to return the names of all items in Chris/dinner on change
var chrisDinnerListener = db.collection("Chris").doc("dinner")
    .onSnapshot(function(doc) {
    objects = doc.data().items
        for(item in objects){
            console.log(94, objects[item].name);
        }
    });

//temporary onload call before implementation of listener-generation-on-list-selection is created
newListener();