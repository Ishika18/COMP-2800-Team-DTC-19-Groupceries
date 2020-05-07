let database = { user: 123, listName: "Silvana's List", lastItemNum: 2, readyToPurchase: false, items: [{ itemNumber: 1, name: "ketchup", qty: 1, units: "bottle", notes: "pls" }, { itemNumber: 2, name: "lettuce", qty: 1, units: "bag", notes: "pls" }] }

function databaseListItem() {         // object constructor for new database entries. Creates an empty grocery list item object. This is called when the user presses "new item".
    this.itemNumber = null
    this.name = " "
    this.qty = null
    this.units = " "
    this.notes = ""
}

function loadItems() { //runs when page loads and loads all items from database and makes them visible on list.
    for (item in database.items) {
        listItem = document.createElement("div")
        listItem.className = "listItems"
        let list = document.getElementById("groceryList")
        list.appendChild(listItem)
        var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
        var i

        for (i = 0; i < fields.length; i++) {
            input = document.createElement("input")
            input.setAttribute("type", "text")
            input.id = fields[i] + database.items[item].itemNumber
            input.classList = "disabledInput"
            input.disabled = true
            label = document.createElement("label")
            label.innerHTML = fields[i]
            label.classList = "listInputLabels"
            listItem.appendChild(label)
            listItem.appendChild(input)
        }
        addButtons(listItem, database.items[item].itemNumber)
        document.getElementById("addButton" + database.items[item].itemNumber).style.display = "none"
        document.getElementById("editButton" + database.items[item].itemNumber).style.display = "inline-block"
        document.getElementById("deleteButton" + database.items[item].itemNumber).style.display = "inline-block"
        fillFields(database.items[item])
        document.getElementById("listTitle").innerHTML = database.listName
    }

}
document.onload = loadItems()

function fillFields(item) { //called by each list item loaded from database. grabs field information and makes it visible in html page.
    let itemNum = item.itemNumber
    document.getElementById("Name" + itemNum).value = item.name
    document.getElementById("Quantity" + itemNum).value = item.qty
    document.getElementById("Units" + itemNum).value = item.units
    document.getElementById("Notes(Optional)" + itemNum).value = item.notes
}


function getFieldData(itemNumber) { //helper function for editDBEntry()
    let name = document.getElementById("Name" + itemNumber).value
    let qty = document.getElementById("Quantity" + itemNumber).value
    let units = document.getElementById("Units" + itemNumber).value
    let notes = document.getElementById("Notes(Optional)" + itemNumber).value
    return [name, qty, units, notes]
}

function newItemField() {
    let item = document.createElement("div")
    database.lastItemNum++
    item.className = "listItems"
    item.id = "Item" + database.lastItemNum
    let list = document.getElementById("groceryList")
    list.appendChild(item)

    var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
    var i

    for (i = 0; i < fields.length; i++) {
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.id = fields[i] + database.lastItemNum
        input.classList = "textInput"
        label = document.createElement("label")
        label.innerHTML = fields[i]
        label.classList = "listInputLabels"
        item.appendChild(label)
        item.appendChild(input)
    }
    addButtons(item, database.lastItemNum)
}

function createEntryInDB() {
    let dbEntry = new databaseListItem()
    dbEntry.itemNumber = database.lastItemNum
    database.items.push(dbEntry)
    return dbEntry
}

function addItemDetails(item) {
    return function () {
        dbEntry = createEntryInDB()
        let itemNumber = dbEntry.itemNumber
        editDBEntry(dbEntry)
        document.getElementById("addButton" + itemNumber).style.display = "none"
        document.getElementById("editButton" + itemNumber).style.display = "inline-block"
        document.getElementById("deleteButton" + itemNumber).style.display = "inline-block"
        toggleInputClass(item)
        console.log(database)
    }
}

function editDBEntry(dbEntry) { //called when a user clicks "Add" on a new item after filling out the fields. Edits item in database's fields to reflect user input.
    fieldData = getFieldData(dbEntry.itemNumber)
    dbEntry.name = fieldData[0]
    dbEntry.qty = fieldData[1]
    dbEntry.units = fieldData[2]
    dbEntry.notes = fieldData[3]
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
        if (input.className == "textInput") {
            input.className = "disabledInput"
        } else {
            input.className = "textInput" //if input is an active text box, change it's styling to make it look inactive
        }
        if (input.disabled == true) {
            input.disabled = false
        } else {
            input.disabled = true// this part actually disables or enables the textbox (depending on its current state) by changing the 'disabled' property
        }
    }
}

function addButtons(item, itemNumber) { //creates all of the necessary buttons for the list field
    let buttonInnerHTML = ["Add", "Edit", "Save Changes", "Cancel", "Delete Item"]
    let buttonID = ["addButton", "editButton", "saveButton", "cancelButton", "deleteButton"]
    let buttonFunctions = [addItemDetails(item), edit(item, itemNumber), saveChanges(item, itemNumber), cancelListEditing(item, itemNumber), deleteListItem(item, itemNumber)]
    let initialButtonDisplay = ["inline-block", "none", "none", "none", "none"]
    var i 

    for(i=0; i<buttonInnerHTML.length; i++) {
        let button = document.createElement("button")
        button.innerHTML = buttonInnerHTML[i]
        button.id = buttonID[i] + itemNumber
        item.appendChild(button)
        button.onclick = buttonFunctions[i]
        button.style.display = initialButtonDisplay[i]
    }
}

function deleteListItem(item, itemNumber) {
    return function() {
        let dbEntry = getDbEntryFromItemNumber(itemNumber)
        item.remove()
        delete database.items[dbEntry]
    }
}

function cancelListEditing(item, itemNumber) {
    return function () {
        dbEntry = getDbEntryFromItemNumber(itemNumber)
        fillFields(dbEntry)
        toggleInputClass(item)
        document.getElementById("editButton" + itemNumber).style.display = "inline-block"
        document.getElementById("deleteButton" + itemNumber).style.display = "inline-block"
        document.getElementById("saveButton" + itemNumber).style.display = "none"
        document.getElementById("cancelButton" + itemNumber).style.display = "none"
    }
}

function edit(item, itemNumber) {
    return function () {
        document.getElementById("editButton" + itemNumber).style.display = "none"
        document.getElementById("saveButton" + itemNumber).style.display = "inline-block"
        document.getElementById("cancelButton" + itemNumber).style.display = "inline-block"
        document.getElementById("deleteButton" + itemNumber).style.display = "inline-block"
        toggleInputClass(item)
    }
}
function saveChanges(item, itemNumber) {
    return function () {
        dbEntry = getDbEntryFromItemNumber(itemNumber)
        document.getElementById("editButton" + itemNumber).style.display = "inline-block"
        document.getElementById("deleteButton" + itemNumber).style.display = "inline-block"
        document.getElementById("saveButton" + itemNumber).style.display = "none"
        document.getElementById("cancelButton" + itemNumber).style.display = "none"
        toggleInputClass(item)
        editDBEntry(dbEntry)
        console.log(database)
    }
}

function getDbEntryFromItemNumber(itemNumber) {//helper function 
    for (listItem in database.items) {
        if (database.items[listItem].itemNumber == itemNumber) {
            var dbEntry = database.items[listItem]
        } // had no other way of passing the item's database entry to this function, so this for loop searches the items list for the item whose itemNumber matches the one it was passed.
    }
    return dbEntry
}

function collapse() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].onclick = function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        };
    }
}

document.getElementById("newItem").onclick = newItemField
collapse()

