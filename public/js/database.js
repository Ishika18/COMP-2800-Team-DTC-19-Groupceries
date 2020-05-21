function write(user, groceryList, itemList){
    db.collection(user).doc(groceryList).set({
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
    if(getRecentList((listName)=>{return function(listName){return listName == groceryList.slice(1)}})){
        console.log("this is true");
        db.collection(user).doc("recentList").set({list: ""})
    };
    db.collection(user).doc(groceryList).delete().then(function() {
        console.log("Delete success, the database should no longer contain this entry");
        console.log("Invoke 'read('" + user +"')' to view all lists for this user.");
    }).catch(function(error) {
        console.error(error);
    });
};

function editItem(user, groceryList, oldItem, newItem){
    removeItem(user, groceryList, oldItem);
    addItem(user, groceryList, newItem);
};

function newListener(){
    userListener = db.collection(localStorage.getItem('uid'))
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if(change.doc.ref.id == "Friends"){
                // TODO make a function that creates a global variable holding listeners for all friends.
                // let x = onsnap, arr.push(x), arr[i]()
                friendsList = change.doc.data().accepted;
                var friendsAndTheirLists = {}
                var finishedPromises = 0;
                let userLists = []
                db.collection(localStorage.getItem('uid')).get().then(documents => {
                    documents.forEach(doc => {
                        if(doc.id.charAt(0) == "_"){
                            userLists.push(doc.id.slice(1));
                        };
                    });
                }).finally(() => {
                    friendsAndTheirLists[localStorage.getItem('uid')] = userLists
                    // Shagun needs to initalize so accepted exists, length != null/undefined *
                    for(let i = 0; i < friendsList.length; i++){
                        let friendUID = friendsList[i];
                        let listNames = []
                        db.collection(friendUID).get().then(documents => {
                            documents.forEach(doc => {
                                if(doc.id.charAt(0) == "_"){
                                    listNames.push(doc.id.slice(1));
                                };
                            });
                        }).finally(()=>{
                            console.log(friendUID);
                            friendsAndTheirLists[friendUID] = listNames;
                            finishedPromises++;
                            if(finishedPromises == friendsList.length){
                                loadLists(friendsAndTheirLists);
                            };
                        });
                    };
                })
            };
            if(change.doc.ref.id.charAt(0) == "_"){
                if(change.type == "added"){
                    // replace console.log with instantiate list function *
                    // deprecate creating list in front end on list creation, move to here based on database change
                    console.log(change.doc.ref.id.slice(1));
                };
                if(change.type == "removed"){
                    // replace console.log with delete list function *
                    console.log(change.doc.ref.id.slice(1));
                };
            };
            console.log(change.type, "to list", change.doc.ref.id, change.doc.data());
            if(change.doc.ref.id == currentListForDB()){
                updateClient(change.doc.data().items)
                updateToggle(change.doc.data().ready_to_buy);
            };
        });
    });
};

// this function will need to be somehow passed UID of friend if loading friend list
function loadNewList(UID, groceryList){
    console.log("lnl", UID, groceryList);
    if(UID == localStorage.getItem('uid')){
        db.collection(UID).doc("recentList").set({list: groceryList})
    };
    db.collection(UID).doc(groceryList).get()
    .then(data => {
        if(data.exists){
            updateClient(data.data().items);
            updateToggle(data.data().ready_to_buy);
        };
    })
    .catch(error => console.log(error));
};

function getRecentList(myFun){
    db.collection(localStorage.getItem('uid')).doc("recentList").get()
    .then(data => {
        if(data.exists && data.data().list != ""){
            const listName = data.data().list.slice(1);
            myFun(listName)();
        } else {
            // fix later if broken
            myFun(listName)();
        };
    })
    .catch(error => console.log(error));
};

function reNameList(groceryList, newListName){
    // silv: prevent rename to something that already exists.
    db.collection(localStorage.getItem('uid')).doc(groceryList).get().then(function(doc) {
        let data = doc.data();
        db.collection(localStorage.getItem('uid')).doc(newListName).set(data)
        .then(function(_){
            // call silv function to change lists to newListName, which needs to call *
        })
        .catch(function(error){console.log(error)});
    }).catch(function(error){console.log(error)});
};

function getUserName(UID) {
    db.collection(UID).doc("userInfo").get().then(function(doc) {
        return doc.data().name
    })
    .catch(function(error) {
        console.error(error);
    });
};

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

function onLoad(){
    //TODO check if async calls here will bug out.
    newListener();
    if(currentListForDB() == "_My List"){
        getRecentList(displayList);
    };
};

function toggleReadyDatabase(){
    db.collection(localStorage.getItem('uid')).doc(currentListForDB()).get().then(data => {
        currentValue = data.data().ready_to_buy;
        db.collection(localStorage.getItem('uid')).doc(currentListForDB()).update({ready_to_buy: !currentValue})
    })
};

function toggleReadyDatabaseMobile(value){
    db.collection(localStorage.getItem('uid')).doc(currentListForDB()).get().then(data => {
        currentValue = data.data().ready_to_buy;
        if(currentValue != value){
            db.collection(localStorage.getItem('uid')).doc(currentListForDB()).update({ready_to_buy: !currentValue})
        };
    })
};

onLoad();