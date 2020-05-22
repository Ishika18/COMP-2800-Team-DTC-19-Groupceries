const uid = localStorage.getItem('uid')//the current users ID

function loadItems(data) { //runs when page loads and loads all items from database and makes them visible on list.
    for (item in data.items) {
        let listItem = document.createElement("div")//creates container that holds the entire list entry
        listItem.className = "listItems"
        $("#groceryList").append(listItem)
        var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
        var i
        let inputType = "disabledInput"
        let disabled = true

        for (i = 0; i < fields.length; i++) {//this loop creates four input fields
            let container = document.createElement("div")
            container.classList = "p-2"
            if (fields[i] === "Units") {
                createUnitInput(container, listItem, inputType, disabled)
            } else {
                createInput(fields[i], container, listItem, inputType, disabled)
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
function createInput(field, container, listItem, inputType, disabled) {//creates inputs when loading lists
    let input = document.createElement("input")
    input.setAttribute("type", "text")
    input.classList = field
    input.classList.add("itemInfo")
    input.classList.add(inputType)
    input.disabled = disabled
    let label = document.createElement("label")
    label.innerHTML = field
    label.classList = "listInputLabels"
    container.appendChild(label)
    container.appendChild(input)
    listItem.appendChild(container)
}
function createUnitInput(container, listItem, inputType, disabled) { //creates unit input because its constructed differently than the others
    let possibleUnits = ["", "units", "pack", "kg", "g", "L", "mL",]
    let input = document.createElement("select")
    input.classList = "Units"
    input.classList.add("itemInfo")
    input.classList.add(inputType)
    input.disabled = disabled
    let label = document.createElement("label")
    label.innerHTML = "Units"
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
}


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

function getFieldData(item) {
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
            loadItems({ items: [discrepencies[0][item]] }); // this structure is required for loadItems to work
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
        };
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

function stringifyDB(DBItems) {
    let DBItemsAsStrings = [];
    for (let i = 0; i < DBItems.length; i++) {
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
    if (!checkIfOtherItemsAreBeingEdited()) {//will not run if other items are being edited or added
        let item = document.createElement("div")
        item.className = "listItems"
        $("#groceryList").prepend(item)

        var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
        var i
        let inputType = "textInput"
        let disabled = false

        for (i = 0; i < fields.length; i++) {
            container = document.createElement("div")
            container.classList = "p-2"
            if (fields[i] === "Units") {
                createUnitInput(container, item, inputType, disabled)
            } else {
                createInput(fields[i], container, item, inputType, disabled)
            }
        }
        addButtons(item)
    } else {
        swal({
            title: "Error",
            text: "Please finish adding this item before adding another.",
            icon: "warning",
        });
    }
}

function checkIfItemAlreadyExists(name, quantity, units, notes) { //verifies the item being added is unique
    let existingItemsinDB = Array.from(document.getElementsByClassName("listItems"))
    let alreadyExists = false
    for (item in existingItemsinDB) {
        if (Array.from(existingItemsinDB[item].getElementsByClassName("textInput")).length === 0) {//ensures the item currently being added is not included in this comparison
            let itemName = existingItemsinDB[item].getElementsByClassName("Name").item(0).value
            let itemQty = parseFloat(existingItemsinDB[item].getElementsByClassName("Quantity").item(0).value)
            let itemUnits = existingItemsinDB[item].getElementsByClassName("Units").item(0).value
            let itemNotes = existingItemsinDB[item].getElementsByClassName("Notes(Optional)").item(0).value
            if (itemName === name && itemQty === quantity && itemUnits === units && itemNotes === notes) {
                alreadyExists = true
                swal({
                    title: "Error",
                    text: "This item cannot be added because it is identical to an existing item.",
                    icon: "warning",
                });
            }
        }
    }
    return alreadyExists
}

function addItemDetails(item) {
    return function () {
        let name = item.getElementsByClassName("Name").item(0).value.trim()
        let quantity = parseFloat(item.getElementsByClassName("Quantity").item(0).value)
        let units = item.getElementsByClassName("Units").item(0).value
        let notes = item.getElementsByClassName("Notes(Optional)").item(0).value
        if (!checkIfItemAlreadyExists(name, quantity, units, notes)) {
            if (name != "" && quantity > 0 && units != "") {
                editDBEntry(item)
                let addButton = item.getElementsByClassName("addButton")
                addButton[0].style.display = "none"
                let editButton = item.getElementsByClassName("editButton")
                editButton[0].style.display = "inline-block"
                let deleteButton = item.getElementsByClassName("deleteButton")
                deleteButton[0].style.display = "inline-block"
                toggleInputClass(item)
            } else {
                evaluateFields(quantity, name, units)
            }
        }
    }
}

function editDBEntry(item) { //called when a user clicks "Add" on a new item after filling out the fields. Edits item in database's fields to reflect user input.
    addItem(uid, currentListForDB(), itemAsDBObject(item));
    fieldData = getFieldData(item)
    if (fieldData[0] === "realness") {
        easterEgg()
    }

}

function toggleInputClass(item) { //disable or enable inputs as necessary, helper function for many other functions
    var fields = item.getElementsByClassName("textInput")
    if (fields.length == 0) {
        fields = item.getElementsByClassName("disabledInput")
    } //this section of code determines which class of input is currently present.
    var fieldsCopy = []
    for (field in fields) {
        fieldsCopy[field] = fields[field]
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
            input.disabled = true
        }
    }
}

function addButtons(item) {
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
        swal({
            title: "Confirm",
            text: "Are you sure you want to delete this item from your list?",
            icon: "warning",
            buttons: {
                cancel: true,
                confirm: {
                    text: "Delete",
                    value: "willDelete"
                }
            }
        }).then((value) => {
            if (value) {
                removeItem(uid, currentListForDB(), itemAsDBObject(item));
                let itemData = getFieldData(item)
                let quantity = parseFloat(itemData[1])
                let dbEntryLocation = database.items.findIndex(obj => obj.name === itemData[0] && obj.quantity.amount === quantity && obj.quantity.unit === itemData[2] && obj.notes === itemData[3])
                item.remove()
                database.items.splice(dbEntryLocation, 1)
            }
        })
            .then((value) => {
                if (value) {
                    removeItem(uid, currentListForDB(), itemAsDBObject(item));
                    item.remove()
                }
            })
    }
}

function cancelListEditing(item, currentFieldData) {
    return function () {
        item.getElementsByClassName("Name").item(0).value = currentFieldData[0]
        item.getElementsByClassName("Quantity").item(0).value = currentFieldData[1]
        item.getElementsByClassName("Units").item(0).value = currentFieldData[2]
        item.getElementsByClassName("Notes(Optional)").item(0).value = currentFieldData[3]
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
        } else {
            swal({
                title: "Error",
                text: "Please finish adding/editing other items before editing this one.",
                icon: "warning",
            })
        }
    }
}

function saveChanges(item, currentFieldData) {
    return function () {
        let userChanges = getFieldData(item)
        let quantity = parseFloat(userChanges[1])
        let name = userChanges[0].trim()
        let units = userChanges[2]
        if (quantity > 0 && name != "" && units != "") {
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
        } else {
            evaluateFields(quantity, name, units)
        }
    }
}

function evaluateFields(quantity, name, units) {
    let errorMessage = ""
    if (quantity <= 0 || isNaN(quantity)) {
        errorMessage = " Quantity must be a number greater than 0."
    }
    if (name == "") {
        errorMessage += " Please enter a name for your item."
    }
    if (units == "") {
        errorMessage += " Please select a unit."
    }
    swal({
        title: "Error",
        text: errorMessage,
        icon: "warning",
    });
}

function collapse() {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
        coll[i].onclick = function () {
            this.classList.toggle("active");
            let content = $(this).parent()[0].nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
                this.style = "color: black"
            } else {
                content.style.display = "block";
                this.style = "color: white"
            }
        };
    }
}

//format: {friend1: [list1, list2, list3], friend2: [list1, list2, list3]}
function loadLists(friendObj) {
    let myList = document.getElementById("myGroceryLists")
    if (myList) { myList.id = uid } // handle cases where myList is deleted
    let friends = Object.keys(friendObj)
    friends.forEach(friend => {
        if (!checkForFriend(friend)) {
            createFriendElement(friend)
        }
        let listSection = findListEntry(friend)
        let friendsLists = friendObj[friend]
        friendsLists.forEach(list => {//loops through array of lists for each friend
            if (!checkForList(list, friend)) {
            createListElement(listSection, list, friend) // creates a list display element for each list
        }}
        )

    });
};

function checkForList(list, friend){
    let alreadyExists = false
    let existingLists = Array.from($('*[data-belongs-to=' + friend + ']'))
    for (existingList in existingLists) {
        if (existingLists[existingList].firstChild.innerText = list){
            alreadyExists = true
        }
    }
    return alreadyExists
}
function updateToggleMobile() {
    value = !document.getElementById("readyForShoppingToggle").checked;
    toggleReadyDatabaseMobile(value);
};

function updateToggle(value) {
    if (document.getElementById("readyForShoppingToggle").checked != value) {
        $("#readyForShoppingToggle").prop("disabled", false);
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
};

function createFriendElement(friend) {
    let friendElementWrapper = document.createElement("div")
    friendElementWrapper.classList.add("p-2", "listCollapsibleLayer2")
    let textContainer = document.createElement("h7")
    textContainer.className = "collapsibleText"
    let listLabel = document.createElement("label")
    listLabel.className = "inputLabels"
    listLabel.appendChild(textContainer)
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
            textContainer.innerHTML = name + "'s Lists"
        })
    friendElement.id = friend
    let listSection = document.createElement("section")
    listSection.classList.add("collapse")
    friendList.append(listSection)
    return listSection
}

function createListElement(listSection, list, friend) {
    let listElementWrapper = document.createElement("div")
    listElementWrapper.dataset.belongsTo = friend
    listElementWrapper.classList.add("p-2", "listCollapsibleLayer3", "listElement")
    let listLabel = document.createElement("label")
    listLabel.classList.add("inputLabels")
    let textContainer = document.createElement("h7")
    textContainer.className = "collapsibleText"
    textContainer.innerText = list
    listLabel.appendChild(textContainer)
    let listElement = document.createElement("button")
    listElement.classList.add("btn", "viewListsbutton")
    listElementWrapper.appendChild(listLabel)
    listElementWrapper.appendChild(listElement)
    listElement.onclick = displayList(listLabel.innerText, friend)
    listSection.appendChild(listElementWrapper)
    listElement.innerHTML = "View List"
}

function checkForFriend(friend) {
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

function createNewList() {
    let okButtonLocation = document.getElementById("myListBar")
    let inputLocation = document.getElementById("myListBar")
    let mobileDeviceWidth = window.matchMedia("(max-width:1024px)")
    
    if (mobileDeviceWidth.matches) {
        currentListButton()//if its the mobile view, run this function to switch the users view to the list page so they dont have to switch themselves
    }
    let cancelIcon = document.createElement("i")
    cancelIcon.className = "fas fa-times"

    let confirmIcon = document.createElement("i")
    confirmIcon.className = "fas fa-check"

    let newListButton = document.querySelector("#createList")
    newListButton.onclick = "null"

    let newListTitle = document.createElement("input")

    let submitButton = document.createElement("button")
    submitButton.appendChild(confirmIcon)
    submitButton.id = "createListButton"

    let currentListTitle = document.querySelector("#listTitleSection")
    newListTitle.setAttribute("type", "text")
    newListTitle.placeholder = "Enter the name of your new list."
    newListTitle.id = "newListTitleInputBar"

    let cancelButton = document.createElement("button")
    cancelButton.appendChild(cancelIcon)
    cancelButton.className = "deleteEntireListButton"

    inputLocation.insertBefore(newListTitle, inputLocation.firstChild)
    okButtonLocation.appendChild(submitButton)
    okButtonLocation.appendChild(cancelButton)

    document.getElementById("deleteEntireListButton").style.display = "none"
    currentListTitle.style.display = "none"//When "create list" is pressed, an input field for the name of the new list appears where the list title was
    submitButton.addEventListener('click', _ => {
        let newList = document.querySelector("#newListTitleInputBar")
        let listName = newList.value
        let createList = true
        if (listName.trim() === "") {
            swal({
                title: "Error",
                text: "New list name cannot be blank.",
                icon: "warning",
            });
            createList = false
        }
        let usersExistingLists = Array.from($('*[data-belongs-to=' + uid + ']'))
        for (list in usersExistingLists) {
            let existingListTitle = usersExistingLists[list].getElementsByClassName("inputLabels").item(0).innerText
            if (existingListTitle === listName) {
                swal({
                    title: "Error",
                    text: "You cannot have two lists with the same name. Please input a different name.",
                    icon: "warning",
                });
                createList = false
            }
        }
        if (createList){
        document.getElementById("listTitle").remove();
        let titleContainer = document.createElement("p")
        titleContainer.id = "listTitle"
        titleContainer.innerText = listName
        currentListTitle.appendChild(titleContainer)
        currentListTitle.style.display = "inline"
        newListTitle.style.display = "none"
        submitButton.style.display = "none"// when the user hits "OK" after typing the new list name, the new list name appears in place of the input text box
        document.getElementById("deleteEntireListButton").style.display = "inline-block"
        cancelButton.style.display = "none"
        let listSection = document.getElementById(uid).parentElement.nextElementSibling
        createListElement(listSection, listName, uid)//adds new list to side bar
        clearList() //clears list on UI so user can start with an empty list for their new list
        newListButton.onclick = createNewList
        addGroceryList(uid, "_" + listName);
        loadNewList(uid, "_" + currentListTitle.innerText)
    }})
    cancelButton.addEventListener('click', _=>{
        currentListTitle.style.display = "inline"
        newListTitle.style.display = "none"
        submitButton.style.display = "none"
        newListButton.onclick = createNewList
        cancelButton.style.display = "none"
    })
}

function deleteList() {
    let deleteButton = document.getElementById("deleteEntireListButton")
    deleteButton.addEventListener('click', _ => {
        swal({
            title: "Confirm",
            text: "Are you sure you want to delete this list?",
            icon: "warning",
            buttons: {
                cancel: true,
                confirm: {
                    text: "Delete",
                    value: "willDelete"
                }
            }
        }).then((value) => {
            if (value) {
                let currentListName = document.getElementById("listTitle").innerText
                let currentUserListSection = document.getElementById('availableLists')
                let currentUsersLists = Array.from(currentUserListSection.getElementsByClassName('listElement'))
                currentUsersLists.forEach(listElement => {
                    if (listElement.firstChild.innerText === currentListName) {
                        document.getElementById('listTitle').innerText = ""
                        deleteGroceryList(uid, "_" + currentListName)
                        listElement.remove()
                        clearList()
                        getNextList()
                    }
                })
            }
        })
    })
}

function getNextList() {
    let remainingLists = Array.from($('*[data-belongs-to=' + uid + ']'))
    if (remainingLists.length != 0) {
        remainingLists[0].lastChild.click()
    }
}

function currentListForDB() {
    return "_" + document.getElementById('listTitle').innerText;
};

function displayList(listElement, listOwner = uid) {
    return function () {
        if (!checkIfOtherItemsAreBeingEdited()) {
            let mobileDeviceWidth = window.matchMedia("(max-width:1024px)")
            if (mobileDeviceWidth.matches) {
                currentListButton()//if its the mobile view, run this function to switch the users view to the list page so they dont have to switch themselves
            }
            let currentListName = document.getElementById('listTitle')//get name of current list displayed
            currentListName.innerText = listElement
            clearList()
            loadNewList(listOwner, "_" + currentListName.innerText)
        } else {
            swal({
                title: "Error",
                text: "Please finish editing the current list before switching to another one.",
                icon: "warning",
            })
        }
    }
}

function updateInteractionStatus(UID) {
    $("#newItem").css("display", "block");
    $("#deleteEntireListButton").css("display", "block");
    $("#readyForShoppingToggle").prop("disabled", false);
    $("html body div#buttonFooter.row.fixed-bottom mainpagebuttons#mainPageButtons div.row.fixed-bottom.centerbuttonbar div.toggle.btn.ios.btn-primary").on("click", updateToggleMobile);
    if (UID != uid) { deleteInteraction() };

};

function deleteInteraction() {
    $(".listItems button").css("display", "none");
    $("#deleteEntireListButton").css("display", "none");
    $("#newItem").css("display", "none");
    $("#readyForShoppingToggle").prop("disabled", true);
    $("html body div#buttonFooter.row.fixed-bottom mainpagebuttons#mainPageButtons div.row.fixed-bottom.centerbuttonbar div.toggle.btn.ios.btn-primary").on("click", "");
}

function clearList() {
    let currentList = document.getElementById("groceryList")
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
    easterEggArea.addEventListener('click', _ => {
        bgMusic.pause()
        document.getElementById("middle").removeChild(easterEggArea)
        let queens = Array.from(document.getElementsByClassName("queen"))
        queens.forEach(queen => {
            document.body.removeChild(queen)
        })
        queenPhotos.length = 0
        queenQuotes.length = 0
        currentView.style.display = "block"
    })
}

function generateQueen(queenPhotos, queenQuotes) {
    return function () {
        if (queenPhotos.length > 0) {
            let randomQueen = Math.floor(Math.random() * queenPhotos.length)
            let queenQuote = new Audio()
            queenQuote.src = queenQuotes[randomQueen]
            let bottomValue = 50
            let leftValue = 17
            let queenDisplay = document.createElement("img")
            queenDisplay.src = queenPhotos[randomQueen]
            queenDisplay.classList.add("queen")
            document.body.appendChild(queenDisplay)
            queenDisplay.style.height = "45vh"
            queenDisplay.style.width = "32vw"
            queenDisplay.style.zIndex = 2
            queenDisplay.style.position = "absolute"
            queenDisplay.style.bottom = bottomValue + "vh"
            queenDisplay.style.left = leftValue + "vw"
            queenDisplay.onclick = function () {
                queenQuote.play()
            }
            moveQueen(queenDisplay, bottomValue, leftValue)
            queenPhotos.splice(randomQueen, 1)
            queenQuotes.splice(randomQueen, 1)
        }
    }
}

function moveQueen(queen, bottomValue, leftValue) {
    setInterval(function () {
        if (bottomValue > 10) {
            bottomValue = bottomValue - 2
            queen.style.bottom = bottomValue + "vh"
            leftValue = leftValue + 0.75
            queen.style.left = leftValue + "vw"
        } else {
            document.body.removeChild(queen);
        }
    }, 180)
}

document.getElementById("newItem").onclick = newItemField
setInterval(collapse, 1)
$(document).ready(function () {
    $("html body div#buttonFooter.row.fixed-bottom mainpagebuttons#mainPageButtons div.row.fixed-bottom.centerbuttonbar div.toggle.btn.ios.btn-primary").on("click", updateToggleMobile);
});
let newListButton = document.querySelector("#createList")
newListButton.onclick = createNewList
deleteList()