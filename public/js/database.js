function addItem(user, groceryList, item) {
    db.collection(user).doc(groceryList).set({
        items: firebase.firestore.FieldValue.arrayUnion(item)
    }, { merge: true })
        .catch(function (error) {
            console.error(error);
        });
};

function removeItem(user, groceryList, item) {
    db.collection(user).doc(groceryList).set({
        items: firebase.firestore.FieldValue.arrayRemove(item)
    }, { merge: true })
        .catch(function (error) {
            console.error(error);
        });
};

function addGroceryList(user, groceryList) {
    let GROCERY_LIST_INITIAL_STATE = {
        items: [],
        ready_to_buy: false,
    };
    db.collection(user).doc(groceryList).set(GROCERY_LIST_INITIAL_STATE)
        .catch(function (error) {
            console.error(error);
        });
};

function deleteGroceryList(user, groceryList) {
    if (getRecentList((listName) => { return function (listName) { return listName == groceryList.slice(1) } })) {
        db.collection(user).doc("recentList").set({ list: "" })
    };
    db.collection(user).doc(groceryList).delete().catch(function (error) {
        console.error(error);
    });
};

function editItem(user, groceryList, oldItem, newItem) {
    removeItem(user, groceryList, oldItem);
    addItem(user, groceryList, newItem);
};

function newListener() {
    userListener = db.collection(localStorage.getItem('uid'))
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                if (change.doc.ref.id == "Friends") {
                    friendsList = change.doc.data().accepted;
                    var friendsAndTheirLists = {}
                    var finishedPromises = 0;
                    let userLists = []
                    db.collection(localStorage.getItem('uid')).get().then(documents => {
                        documents.forEach(doc => {
                            if (doc.id.charAt(0) == "_") {
                                userLists.push(doc.id.slice(1));
                            };
                        });
                    }).finally(() => {
                        friendsAndTheirLists[localStorage.getItem('uid')] = userLists
                        if (friendsList.length == 0) { loadLists(friendsAndTheirLists); };
                        for (let i = 0; i < friendsList.length; i++) {
                            let friendUID = friendsList[i];
                            let listNames = []
                            db.collection(friendUID).get().then(documents => {
                                documents.forEach(doc => {
                                    if (doc.id.charAt(0) == "_") {
                                        listNames.push(doc.id.slice(1));
                                    };
                                });
                            }).finally(() => {
                                friendsAndTheirLists[friendUID] = listNames;
                                finishedPromises++;
                                if (finishedPromises == friendsList.length) {
                                    loadLists(friendsAndTheirLists);
                                };
                            });
                        };
                    })
                };
                if (change.doc.ref.id == currentListForDB()) {
                    updateClient(change.doc.data().items)
                    updateToggle(change.doc.data().ready_to_buy);
                };
            });
        });
};

function loadNewList(UID, groceryList) {
    if (UID == localStorage.getItem('uid')) {
        db.collection(UID).doc("recentList").set({ list: groceryList })
    };
    db.collection(UID).doc(groceryList).get()
        .then(data => {
            if (data.exists) {
                updateClient(data.data().items);
                updateToggle(data.data().ready_to_buy);
                updateInteractionStatus(UID);
            };
        })
        .catch(error => console.log(error));
};

function getRecentList(myFun) {
    db.collection(localStorage.getItem('uid')).doc("recentList").get()
        .then(data => {
            if (data.exists && data.data().list != "") {
                const listName = data.data().list.slice(1);
                myFun(listName)();
            } else {
                // Implement additional functionality to handle no recent list here
                myFun(listName)();
            };
        })
        .catch(error => console.log(error));
};

// Not implemented in the front end yet
function reNameList(groceryList, newListName) {
    db.collection(localStorage.getItem('uid')).doc(groceryList).get().then(function (doc) {
        let data = doc.data();
        db.collection(localStorage.getItem('uid')).doc(newListName).set(data)
            .then(function (_) {
                // Implement functions to update the front end here
            })
            .catch(function (error) { console.log(error) });
    }).catch(function (error) { console.log(error) });
};

function getUserName(UID) {
    db.collection(UID).doc("userInfo").get().then(function (doc) {
        return doc.data().name
    })
        .catch(function (error) {
            console.error(error);
        });
};

function toggleReadyDatabase() {
    db.collection(localStorage.getItem('uid')).doc(currentListForDB()).get().then(data => {
        currentValue = data.data().ready_to_buy;
        db.collection(localStorage.getItem('uid')).doc(currentListForDB()).update({ ready_to_buy: !currentValue })
    })
};

// this function prevents faulty writes caused by the bootstrap toggle
function toggleReadyDatabaseMobile(value) {
    db.collection(localStorage.getItem('uid')).doc(currentListForDB()).get().then(data => {
        if (data.exists) {
            currentValue = data.data().ready_to_buy;
            if (currentValue != value) {
                db.collection(localStorage.getItem('uid')).doc(currentListForDB()).update({ ready_to_buy: !currentValue })
            };
        };
    }).catch(error => console.log(error));
};

function onLoad() {
    newListener();
    if (currentListForDB() == "_My List") {
        getRecentList(displayList);
    };
};

onLoad();