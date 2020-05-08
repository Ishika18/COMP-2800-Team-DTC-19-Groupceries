let database = { user: 123, listName: "Silvana's List", readyToPurchase: false, items: [{name: "ketchup", qty: 1, units: "bottle", notes: "pls" }, {name: "lettuce", qty: 1, units: "bag", notes: "pls" }] }

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
            input.classList = fields[i]
            input.classList.add("disabledInput")
            input.disabled = true
            label = document.createElement("label")
            label.innerHTML = fields[i]
            label.classList = "listInputLabels"
            listItem.appendChild(label)
            listItem.appendChild(input)
        }
        addButtons(listItem)
        let addButton = listItem.getElementsByClassName("addButton")
        addButton[0].style.display = "none"
        let editButton = listItem.getElementsByClassName("editButton")
        editButton[0].style.display = "inline-block"
        let deleteButton = listItem.getElementsByClassName("deleteButton")
        deleteButton[0].style.display = "inline-block"
        fillFields(listItem, database.items[item])
        document.getElementById("listTitle").innerHTML = database.listName
    }

}
document.onload = loadItems()

function fillFields(item, DBitem) { //called by each list item loaded from database. grabs field information and makes it visible in html page.
    let nameField = item.getElementsByClassName("Name")
    nameField[0].value = DBitem.name
    let qtyField = item.getElementsByClassName("Quantity")
    qtyField[0].value = DBitem.qty
    let unitsField = item.getElementsByClassName("Units")
    unitsField[0].value = DBitem.units
    let notes = item.getElementsByClassName("Notes(Optional)")
    notes[0].value = DBitem.notes
}


function getFieldData(item) { //helper function for editDBEntry()
    let nameField = item.getElementsByClassName("Name")
    let name = nameField.value
    let qtyField = item.getElementsByClassName("Quantity")
    let qty = qtyField.value
    let unitsField = item.getElementsByClassName("Units")
    let units = unitsField.value
    let notesField = item.getElementsByClassName("Notes(Optional)")
    let notes = notesField.value
    return [name, qty, units, notes]
}

function newItemField() {
    let item = document.createElement("div")
    database.lastItemNum++
    item.className = "listItems"
    let list = document.getElementById("groceryList")
    list.appendChild(item)

    var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
    var i

    for (i = 0; i < fields.length; i++) {
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.classList = fields[i]
        input.classList = "textInput"
        label = document.createElement("label")
        label.innerHTML = fields[i]
        label.classList = "listInputLabels"
        item.appendChild(label)
        item.appendChild(input)
    }
    addButtons(item)
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
    fieldData = getFieldData(item)
    console.log(dbEntry)
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
        if (input.classList.contains("textInput")) {
            input.classList.toggle("textInput")
            input.classList = "disabledInput"
        } else {
            input.classList.toggle("disabledInput") 
            input.classList= "textInput" //if input is an active text box, change it's styling to make it look inactive
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
    let buttonFunctions = [addItemDetails(item), edit(item), saveChanges(item), cancelListEditing(item), deleteListItem(item)]
    let initialButtonDisplay = ["inline-block", "none", "none", "none", "none"]
    var i 

    for(i=0; i<buttonInnerHTML.length; i++) {
        let button = document.createElement("button")
        button.innerHTML = buttonInnerHTML[i]
        button.classList = buttonClass[i]
        item.appendChild(button)
        button.onclick = buttonFunctions[i]
        button.style.display = initialButtonDisplay[i]
    }
}

function deleteListItem(item) {
    return function() {
        let itemData = getFieldData(item)
        let dbEntryLocation = database.items.indexOf({name: itemData[0], qty: itemData[1], units: itemData[2], notes: itemData[3]})
        item.remove()
        database.items.splice(dbEntryLocation, 1)
        console.log(database)
    }
}

function cancelListEditing(item) {//needs to be re-done
    return function () {
      console.log("hi")
    }
}

function edit(item) {
    return function () {
        let editButton = item.getElementsByClassName("editButton")
        editButton[0].style.display = "none"
        let saveButton = item.getElementsByClassName("saveButton")
        saveButton[0].style.display = "inline-block"
        let cancelButton = item.getElementsByClassName("cancelButton")
        cancelButton[0].style.display = "inline-block"
        let deleteButton = item.getElementsByClassName("deleteButton")
        deleteButton[0].style.display = "inline-block"
        toggleInputClass(item)
    }
}
function saveChanges(item) {
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
        let itemData = getFieldData(item)
        console.log(itemData)
        let dbEntryLocation = database.items.indexOf({name: itemData[0], qty: itemData[1], units: itemData[2], notes: itemData[3]})
        console.log(dbEntryLocation)
        editDBEntry(item, database.items[dbEntryLocation])
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

