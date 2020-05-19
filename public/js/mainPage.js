let database = { user: 123, listName: "Silvana's List", readyToPurchase: false, items: [] }
const uid = localStorage.getItem('uid')

function databaseListItem() {         // object constructor for new database entries. Creates an empty grocery list item object. This is called when the user presses "new item".
    this.name = ""
    this.quantity = { amount: null, unit: undefined }
    this.notes = ""
}

function loadItems(data) { //runs when page loads and loads all items from database and makes them visible on list.
    for (item in data.items) {
        let listItem = document.createElement("div")
        listItem.className = "listItems"
        let list = document.getElementById("groceryList")
        list.appendChild(listItem)
        var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
        var i

        for (i = 0; i < fields.length; i++) {
            container = document.createElement("div")
            container.classList = "p-2"
            if (fields[i] === "Units") {
                let possibleUnits = ["units", "pack", "kg", "g", "L", "mL",]
                let input = document.createElement("select")
                input.classList = fields[i]
                input.classList.add("itemInfo")
                input.classList.add("disabledInput")
                input.disabled = true
                let label = document.createElement("label")
                label.innerHTML = fields[i]
                label.classList = "listInputLabels"
                for (unit in possibleUnits) {
                    let option = document.createElement("option")
                    option.innerHTML = possibleUnits[unit]
                    option.value = possibleUnits[unit]
                    input.appendChild(option)
                }
                container.appendChild(label)
                container.appendChild(input)
                listItem.appendChild(container)
            } else {
                let input = document.createElement("input")
                input.setAttribute("type", "text")
                input.classList = fields[i]
                input.classList.add("itemInfo")
                input.classList.add("disabledInput")
                input.disabled = true
                let label = document.createElement("label")
                label.innerHTML = fields[i]
                label.classList = "listInputLabels"
                container.appendChild(label)
                container.appendChild(input)
                listItem.appendChild(container)
            }
        }
        addButtons(listItem)
        let addButton = listItem.getElementsByClassName("addButton")
        addButton[0].style.display = "none"
        let editButton = listItem.getElementsByClassName("editButton")
        editButton[0].style.display = "inline-block"
        let deleteButton = listItem.getElementsByClassName("deleteButton")
        deleteButton[0].style.display = "inline-block"
        fillFields(listItem, data.items[item])
    }

}
document.onload = loadItems(database)

function fillFields(item, DBitem) { //called by each list item loaded from database. grabs field information and makes it visible in html page.
    let nameField = item.getElementsByClassName("Name")
    nameField[0].value = DBitem.name
    let qtyField = item.getElementsByClassName("Quantity")
    qtyField[0].value = DBitem.quantity.amount
    let unitsField = item.getElementsByClassName("Units")
    unitsField[0].value = DBitem.quantity.unit
    let notes = item.getElementsByClassName("Notes(Optional)")
    notes[0].value = DBitem.notes
}


function getFieldData(item) { //helper function for editDBEntry()
    let nameField = item.getElementsByClassName("Name")
    let name = nameField[0].value
    let qtyField = item.getElementsByClassName("Quantity")
    let qty = qtyField[0].value
    let unitsField = item.getElementsByClassName("Units")
    let units = unitsField[0].value
    let notesField = item.getElementsByClassName("Notes(Optional)")
    let notes = notesField[0].value
    return [name, qty, units, notes]
}

function updateClient(DBItems) {
    let discrepencies = findDifference(DBItems);
    if (discrepencies[1]) { // if DB has items not in client, must add items to client
        for (item in discrepencies[0]) {
            loadItems({ items: [discrepencies[0][item]] }); // this structure is required for loadItems to work. will need to refactor later
        };
    } else { // if client has items not in DB, must delete those items
        for (item in discrepencies[0]) {
            let itemToDelete = findItemInClient(discrepencies[0][item]);
            itemToDelete.remove();
        };
    };
};

function findItemInClient(DBItem) {
    let listItems = document.getElementById("groceryList").getElementsByClassName("listItems");
    console.log(listItems)
    for (let i = 0; i < listItems.length; i++) {
        if (_.isEqual(itemAsDBObject(listItems[i]), DBItem)) {
            return listItems[i];
        };
    };
};


function findDifference(DBItems) {
    let clientItems = parseAllItemsToDB();
    let inDBnotClient = DBItems.filter(item => !contains(item, clientItems)); //all items in DB but not in client
    let differentItems = [];
    if (inDBnotClient.length != 0) { // if at least one item in DB not in client
        for (item in inDBnotClient) {
            differentItems.push(inDBnotClient[item]);
        };
        return [differentItems, true] // bool represents if different items are in DB
    } else { // if client has all DB items, client must also have an additional item (otherwise there would be no change)
        let inClientNotDB = clientItems.filter(item => !contains(item, DBItems));
        for (item in inClientNotDB) {
            differentItems.push(inClientNotDB[item]);
        }; // all items in client not in DB
        return [differentItems, false] // bool represents if different items are in DB
    }
};

function contains(item, items) {
    for (let i = 0; i < items.length; i++) {
        if (_.isEqual(item, items[i])) {
            return true
        }
    };
    return false
}

function stringifyDB(DBItems) { // deprecated for now
    let DBItemsAsStrings = [];
    for (let i = 0; i < DBItems.length; i++) {
        console.log("item2", JSON.stringify(DBItems[i]))
        DBItemsAsStrings.push(JSON.stringify(DBItems[i]))
    };
    return DBItemsAsStrings;
}

function parseAllItemsToDB() {
    let listItems = document.getElementById("groceryList").getElementsByClassName("listItems");
    listItemsAsDB = [];
    for (let i = 0; i < listItems.length; i++) {
        listItemsAsDB.push(itemAsDBObject(listItems[i]));
    };
    return listItemsAsDB
};

function itemAsDBObject(item) {
    let nameField = item.getElementsByClassName("Name");
    let itemName = nameField[0].value;
    let qtyField = item.getElementsByClassName("Quantity");
    let itemQty = parseFloat(qtyField[0].value);
    let unitsField = item.getElementsByClassName("Units");
    let itemUnits = unitsField[0].value;
    let notesField = item.getElementsByClassName("Notes(Optional)");
    let itemNotes = notesField[0].value;
    return {
        name: itemName,
        found: null,
        quantity: {
            amount: itemQty,
            unit: itemUnits
        },
        notes: itemNotes
    }
};

function newItemField() {
    if (!checkIfOtherItemsAreBeingEdited()) {
        let item = document.createElement("div")
        item.className = "listItems"
        let list = document.getElementById("groceryList")
        list.appendChild(item)

        var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
        var i

        for (i = 0; i < fields.length; i++) {
            container = document.createElement("div")
            container.classList = "p-2"
            if (fields[i] === "Units") {
                let possibleUnits = ["units", "pack", "kg", "g", "L", "mL",]
                let input = document.createElement("select")
                input.classList = fields[i]
                input.classList.add("itemInfo")
                input.classList.add("textInput")
                let label = document.createElement("label")
                label.innerHTML = fields[i]
                label.classList = "listInputLabels"
                for (unit in possibleUnits) {
                    let option = document.createElement("option")
                    option.innerHTML = possibleUnits[unit]
                    option.value = possibleUnits[unit]
                    input.appendChild(option)
                }
                container.appendChild(label)
                container.appendChild(input)
                item.appendChild(container)
            } else {
                let input = document.createElement("input")
                input.setAttribute("type", "text")
                input.classList = fields[i]
                input.classList.add("textInput")
                input.classList.add("itemInfo")
                let label = document.createElement("label")
                label.innerHTML = fields[i]
                label.classList = "listInputLabels"
                container.appendChild(label)
                container.appendChild(input)
                item.appendChild(container)
            }
        }
        addButtons(item)
    }
}

function createEntryInDB() {
    let dbEntry = new databaseListItem()
    database.items.push(dbEntry)
    return dbEntry
}

function addItemDetails(item) {
    return function () {
        dbEntry = createEntryInDB()
        editDBEntry(item, dbEntry)
        let addButton = item.getElementsByClassName("addButton")
        addButton[0].style.display = "none"
        let editButton = item.getElementsByClassName("editButton")
        editButton[0].style.display = "inline-block"
        let deleteButton = item.getElementsByClassName("deleteButton")
        deleteButton[0].style.display = "inline-block"
        toggleInputClass(item)
        console.log(database)
    }
}

function editDBEntry(item, dbEntry) { //called when a user clicks "Add" on a new item after filling out the fields. Edits item in database's fields to reflect user input.
    addItem(uid, currentListForDB(), itemAsDBObject(item));
    fieldData = getFieldData(item)
    if (fieldData[0] === "realness") {
        easterEgg()
    }
    dbEntry.name = fieldData[0]
    dbEntry.quantity.amount = parseFloat(fieldData[1])
    dbEntry.quantity.unit = fieldData[2]
    dbEntry.notes = fieldData[3]
    console.log(database)
}

function toggleInputClass(item) { //disable or enable inputs as necessary, helper function for many other functions
    var fields = item.getElementsByClassName("textInput")
    if (fields.length == 0) {
        fields = item.getElementsByClassName("disabledInput")
    } //this section of code determines which class of input is currently present.
    var fieldsCopy = []
    for (field in fields) {
        fieldsCopy[field] = fields[field] //create shallow copy to prevent errors related to list length
    }
    var i

    for (i = 0; i < fieldsCopy.length; i++) {
        input = fieldsCopy[i]
        if (input.classList.contains("textInput")) {
            input.classList.toggle("textInput")
            input.classList.add("disabledInput")
        } else {
            input.classList.toggle("disabledInput")
            input.classList.add("textInput") //if input is an active text box, change it's styling to make it look inactive
        }
        if (input.disabled == true) {
            input.disabled = false
        } else {
            input.disabled = true// this part actually disables or enables the textbox (depending on its current state) by changing the 'disabled' property
        }
    }
}

function addButtons(item) { //creates all of the necessary buttons for the list field
    let buttonInnerHTML = ["Add", "Edit", "Save Changes", "Cancel", "Delete Item"]
    let buttonClass = ["addButton", "editButton", "saveButton", "cancelButton", "deleteButton"]
    let buttonFunctions = [addItemDetails(item), edit(item), undefined, undefined, deleteListItem(item)]
    let initialButtonDisplay = ["inline-block", "none", "none", "none", "none"]
    var i

    for (i = 0; i < buttonInnerHTML.length; i++) {
        let button = document.createElement("button")
        button.innerHTML = buttonInnerHTML[i]
        button.classList = buttonClass[i]
        item.appendChild(button)
        button.onclick = buttonFunctions[i]
        button.style.display = initialButtonDisplay[i]
    }
}

function deleteListItem(item) {
    return function () {
        removeItem(uid, currentListForDB(), itemAsDBObject(item));
        let itemData = getFieldData(item)
        console.log(itemData)
        let quantity = parseFloat(itemData[1])
        let dbEntryLocation = database.items.findIndex(obj => obj.name === itemData[0] && obj.quantity.amount === quantity && obj.quantity.unit === itemData[2] && obj.notes === itemData[3])
        item.remove()
        database.items.splice(dbEntryLocation, 1)
        console.log(database)
    }
}

function cancelListEditing(item, currentFieldData) {//needs to be re-done
    return function () {
        let editButton = item.getElementsByClassName("editButton")
        editButton[0].style.display = "inline-block"
        let deleteButton = item.getElementsByClassName("deleteButton")
        deleteButton[0].style.display = "inline-block"
        let saveButton = item.getElementsByClassName("saveButton")
        saveButton[0].style.display = "none"
        let cancelButton = item.getElementsByClassName("cancelButton")
        cancelButton[0].style.display = "none"
        toggleInputClass(item)
    }
}

function checkIfOtherItemsAreBeingEdited() {
    let listArea = document.getElementById('groceryList')
    let itemsBeingEdited = Array.from(listArea.getElementsByClassName('textInput'))
    if (itemsBeingEdited.length === 0) {
        return false
    } else {
        return true
    }
}

function edit(item) {
    return function () {
        if (!checkIfOtherItemsAreBeingEdited()) {
            item.dataset.oldItem = JSON.stringify(itemAsDBObject(item));
            let currentFieldData = getFieldData(item)
            let editButton = item.getElementsByClassName("editButton")
            editButton[0].style.display = "none"
            let saveButton = item.getElementsByClassName("saveButton")
            saveButton[0].style.display = "inline-block"
            saveButton[0].onclick = saveChanges(item, currentFieldData)
            let cancelButton = item.getElementsByClassName("cancelButton")
            cancelButton[0].style.display = "inline-block"
            cancelButton[0].onclick = cancelListEditing(item, currentFieldData)
            let deleteButton = item.getElementsByClassName("deleteButton")
            deleteButton[0].style.display = "inline-block"
            toggleInputClass(item)
        }
    }
}
function saveChanges(item, currentFieldData) {
    // will eventually refactor database out of everything, change currentFieldData to encompass old item instead
    return function () {
        editItem(uid, currentListForDB(), JSON.parse(item.dataset.oldItem), itemAsDBObject(item));
        let editButton = item.getElementsByClassName("editButton")
        editButton[0].style.display = "inline-block"
        let deleteButton = item.getElementsByClassName("deleteButton")
        deleteButton[0].style.display = "inline-block"
        let saveButton = item.getElementsByClassName("saveButton")
        saveButton[0].style.display = "none"
        let cancelButton = item.getElementsByClassName("cancelButton")
        cancelButton[0].style.display = "none"
        toggleInputClass(item)
        let quantity = parseFloat(currentFieldData[1])
        let dbEntryLocation = database.items.findIndex(obj => obj.name === currentFieldData[0] && obj.quantity.amount === quantity && obj.quantity.unit === currentFieldData[2] && obj.notes === currentFieldData[3])
        let userChanges = getFieldData(item)
        let dbEntry = database.items[dbEntryLocation]
        dbEntry.name = userChanges[0]
        dbEntry.quantity.amount = parseFloat(userChanges[1])
        dbEntry.quantity.unit = userChanges[2]
        dbEntry.notes = userChanges[3]
        console.log(database)
    }
}

function collapse() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
       coll[i].onclick = function () {
            this.classList.toggle("active");
            let content = $(this).parent()[0].nextElementSibling;
            console.log($(this).parent()[0].nextElementSibling)
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        };
    }
}

document.getElementById("newItem").onclick = newItemField
setInterval(collapse, 1)
$( document ).ready(function() {
    $("html body div#buttonFooter.row.fixed-bottom mainpagebuttons#mainPageButtons div.row.fixed-bottom.centerbuttonbar div.toggle.btn.ios.btn-primary").on("click", updateToggleMobile);
});


//format: {friend1: [list1, list2, list3], friend2: [list1, list2, list3]}
function loadLists(friendObj) {
    let myList = document.getElementById("myGroceryLists")
    if(myList){myList.id = uid} // myList exists initially but then gets deleted, function breaks on subsequent calls.
    console.log(friendObj)
    let friends = Object.keys(friendObj)
    friends.forEach(friend => {
        if (!checkForFriend(friend)) {//checks if a friend already has a display element
            createFriendElement(friend)//if not, creates one for it
        }
        let listSection = findListEntry(friend)
        let friendsLists = friendObj[friend]
        console.log(friendsLists)
        friendsLists.forEach(list => {//loops through array of lists for each friend
            createListElement(listSection, list) // creates a list display element for each list
        })

    });
}
function updateToggleMobile(){
    value = !document.getElementById("readyForShoppingToggle").checked;
    toggleReadyDatabaseMobile(value);
}

function updateToggle(value){
    if(document.getElementById("readyForShoppingToggle").checked != value){
        document.getElementById("readyForShoppingToggle").parentElement.click();
    }
    document.getElementById("flip-checkbox-2").checked = value;
};

function findListEntry(friend) {
    let friendList = document.getElementById("left")
    let existingFriends = friendList.getElementsByClassName("collapsible")
    let existingFriendsArray = Array.from(existingFriends)
    for (entry in existingFriendsArray) {
        if (existingFriendsArray[entry].id.includes(friend)) {
            return existingFriendsArray[entry].parentElement.nextElementSibling
        }
    }

}

function createFriendElement(friend) { //helper for loadlists
    let friendElementWrapper = document.createElement("div")
    friendElementWrapper.classList.add("p-2", "listCollapsibleLayer2")
    let listLabel = document.createElement("label")
    friendElementWrapper.appendChild(listLabel)
    let friendElement = document.createElement("button")
    friendElement.classList.add("btn", "collapsible", "viewListsbutton")
    let chevron = document.createElement("i")
    chevron.classList.add("fas", "fa-chevron-down")
    friendElement.appendChild(chevron)
    friendElementWrapper.appendChild(friendElement)
    let friendList = document.getElementById("friendsListCollapsibles")
    friendList.appendChild(friendElementWrapper)

    db.collection(friend).doc('userInfo').get()
        .then((doc) => {
            let name = doc.data().name
            listLabel.innerHTML = name + "'s Lists"
        })

    
    friendElement.id = friend
    let listSection = document.createElement("section")
    listSection.classList.add("collapse")
    friendList.append(listSection)
    return listSection
}

function createListElement(listSection, list) { //helper for loadLists
    let listElementWrapper = document.createElement("div")
    listElementWrapper.classList.add("p-2","listCollapsibleLayer3", "listElement")
    let listLabel = document.createElement("label")
    listLabel.classList.add("inputLabels")
    listLabel.innerText = list
    let listElement = document.createElement("button")
    listElement.classList.add("btn", "viewListsbutton")
    listElementWrapper.appendChild(listLabel)
    listElementWrapper.appendChild(listElement)
    listElement.onclick = function(event){
        displayList(listLabel.innerText)()
        console.log(event.target, event.target.parentElement.parentElement.parentElement)
    }    
    listSection.appendChild(listElementWrapper)
    listElement.innerHTML = "View List"
}

function checkForFriend(friend) {//helper for load lists
    let alreadyInList = false
    let friendList = document.getElementById("left")
    let existingFriends = friendList.getElementsByClassName("collapsible")
    let existingFriendsArray = Array.from(existingFriends)
    existingFriendsArray.forEach(friendEntry => {
        if (friendEntry.id.includes(friend)) {
            alreadyInList = true
        }

    })
    return alreadyInList
}

let newListButton = document.querySelector("#createList")
newListButton.onclick = createNewList

function createNewList() {
    let newListButton = document.querySelector("#createList")
    newListButton.onclick = "null"
    let newListTitle = document.createElement("input")
    let submitButton = document.createElement("button")
    submitButton.innerText = "OK"
    let currentListTitle = document.querySelector("#listTitle")
    let listTitleArea = document.querySelector("#listTitleSection")
    newListTitle.setAttribute("type", "text")
    newListTitle.placeholder = "Enter the name of your new list."
    listTitleArea.appendChild(newListTitle)
    listTitleArea.appendChild(submitButton)
    currentListTitle.style.display = "none"//When "create list" is pressed, an input field for the name of the new list appears where the list title was
    submitButton.addEventListener('click', _ => {
        let listName = newListTitle.value
        currentListTitle.innerText = listName
        currentListTitle.style.display = "inline"
        newListTitle.style.display = "none"
        submitButton.style.display = "none"// when the user hits "OK" after typing the new list name, the new list name appears in place of the input text box
        let listSection = document.getElementById(uid).parentElement.nextElementSibling
        createListElement(listSection, listName)//adds new list to side bar
        clearList() //clears list on UI so user can start with an empty list for their new list
        newListButton.onclick = createNewList
        addGroceryList(uid, "_" + listName);
        loadNewList(uid, "_" + currentListName.innerText)
    })
}




function deleteList() { // deletes current list -  a user can only delete their own lists
    let deleteButton = document.getElementById("deleteEntireListButton")
    deleteButton.addEventListener('click', _ => {
        let currentList = document.getElementById("listTitle").innerText
        let listArea = document.getElementById('left')
        let allLists = Array.from(listArea.getElementsByClassName("collapsible"))
        allLists.forEach(element => {//loops through all list elements in sidebar
            if (element.id === uid) {
                let sections = Array.from(element.parentElement.nextElementSibling.childNodes)
                sections.forEach(section => {
                    if (section.innerText === currentList) {
                        deleteGroceryList(uid, "_" + currentList);
                        section.remove()//when it finds the one that matches the current list and user, it deletes it
                        clearList()// clears list
                        //need to make it load next list in line
                    }
                })
            }
        })
    })
}


deleteList()

function currentListForDB(){
    return "_" + document.getElementById('listTitle').innerText;
};

function displayList(listElement) {//used for switching lists
    return function() {
    let currentListName = document.getElementById('listTitle')
    if (listElement !== currentListName.innerText) {
        currentListName.innerText = listElement // updates name of list
        clearList()
        loadNewList(uid, "_" + currentListName.innerText)

    }
}
}
    
function clearList() {
        let currentList = document.getElementById("groceryList") //clears list area
        let currentListItems = Array.from(currentList.getElementsByClassName('listItems'))
        currentListItems.forEach(item => {
            currentList.removeChild(item)
        })
    }


function easterEgg() {
        let queenPhotos = ["/images/alyssaedwards.png", "/images/bobthedragqueen.png", "/images/latriceroyale.png",
            "/images/michellevisage.png", "/images/missvanjie.jpg", "/images/moniqueheart.png", "/images/phiphi.jpg", "/images/rupaul.png", "/images/valentina.png"]
        let queenQuotes = ["/media/alyssaedwards.mp3", "/media/bobthedragqueen.mp3", "/media/latriceroyale.mp3", "/media/michellevisage.mp3",
            "/media/vanjie.mp3", "/media/moniqueheart.mp3", "/media/phiphiohara.mp3", "/media/rupaul.mp3", "/media/valentina.mp3"]
        let easterEggArea = document.getElementById("easterEgg")
        let currentView = document.getElementById("listArea")
        currentView.style.display = "none"
        easterEggArea.style.display = "block"
        document.getElementById("middle").appendChild(easterEggArea)
        setInterval(generateQueen(queenPhotos, queenQuotes), 6000)
        let bgMusic = new Audio()
        bgMusic.volume = 0.1
        bgMusic.src = "/media/runway.mp3"
        bgMusic.play()
        easterEggArea.addEventListener('click', _=> {
            bgMusic.pause()
            document.getElementById("middle").removeChild(easterEggArea)
            let queens = Array.from(document.getElementsByClassName("queen"))
            queens.forEach(queen => {
                document.body.removeChild(queen)
            })
            queenPhotos.length = 0
            queenQuotes.length = 0 
            currentView.style.display="block"
            
        })
    }


function generateQueen(queenPhotos, queenQuotes) {
        return function () {
            if (queenPhotos.length > 0) {
                let randomQueen = Math.floor(Math.random() * queenPhotos.length)
                let queenQuote = new Audio()
                queenQuote.src = queenQuotes[randomQueen]
                let bottomValue = 250
                let leftValue = 25
                let queenDisplay = document.createElement("img")
                queenDisplay.src = queenPhotos[randomQueen]
                queenDisplay.classList.add("queen")
                document.body.appendChild(queenDisplay)
                queenDisplay.style.height= "300px"
                queenDisplay.style.width="200px"
                queenDisplay.style.zIndex = 2
                queenDisplay.style.position = "absolute"
                queenDisplay.style.bottom = bottomValue + "px"
                queenDisplay.style.left = leftValue + "%"
                queenDisplay.onclick = queenQuote.play()
                moveQueen(queenDisplay, bottomValue, leftValue)
                queenPhotos.splice(randomQueen, 1)
                queenQuotes.splice(randomQueen, 1)

            }
        }
    }

    function moveQueen(queen, bottomValue, leftValue) {
        setInterval(function () {
            if (bottomValue > 10) {
                bottomValue = bottomValue - 10
                queen.style.bottom = bottomValue + "px"
                leftValue = leftValue + 0.25
                queen.style.left = leftValue + "%"

            } else {
                document.body.removeChild(queen)
            }
        }, 180)

    }


// add fucntionality to make new lists clickable
// user's list to add, delete and update the same way friends list 
// refactor how lists are created so they only write to the database 
// input validation - dont create lists with duplicate names 
// 