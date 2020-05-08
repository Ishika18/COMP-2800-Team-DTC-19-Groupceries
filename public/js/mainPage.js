let database = { user: 123, listName: "Silvana's List", readyToPurchase: false, items: [{name: "ketchup", qty: {amount: 1, unit: "units"}, notes: "pls" }, {name: "lettuce", qty: {amount: 1, unit: "units"}, notes: "pls" }] }

function databaseListItem() {         // object constructor for new database entries. Creates an empty grocery list item object. This is called when the user presses "new item".
    this.name = ""
    this.qty = {amount: null, unit: undefined}
    this.notes = ""
}

function loadItems() { //runs when page loads and loads all items from database and makes them visible on list.
    for (item in database.items) {
        let listItem = document.createElement("div")
        listItem.className = "listItems"
        let list = document.getElementById("groceryList")
        list.appendChild(listItem)
        var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
        var i

        for (i = 0; i < fields.length; i++) {
            if (fields[i] === "Units") {
                let possibleUnits = ["units", "pack", "kg", "g", "L", "mL", ]
                let input = document.createElement("select")
                input.classList = fields[i]
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
                listItem.appendChild(input)
            } else {
                let input = document.createElement("input")
                input.setAttribute("type", "text")
                input.classList = fields[i]
                input.classList.add("disabledInput")
                input.disabled = true
                let label = document.createElement("label")
                label.innerHTML = fields[i]
                label.classList = "listInputLabels"
                listItem.appendChild(label)
                listItem.appendChild(input)
            }
        }
        addButtons(listItem)
        let addButton = listItem.getElementsByClassName("addButton")
        addButton[0].style.display = "none"
        let editButton = listItem.getElementsByClassName("editButton")
        editButton[0].style.display = "inline-block"
        let deleteButton = listItem.getElementsByClassName("deleteButton")
        deleteButton[0].style.display = "inline-block"
        fillFields(listItem, database.items[item])
    }

}
document.onload = loadItems()

function fillFields(item, DBitem) { //called by each list item loaded from database. grabs field information and makes it visible in html page.
    let nameField = item.getElementsByClassName("Name")
    nameField[0].value = DBitem.name
    let qtyField = item.getElementsByClassName("Quantity")
    qtyField[0].value = DBitem.qty.amount
    let unitsField = item.getElementsByClassName("Units")
    unitsField[0].value = DBitem.qty.unit
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

function newItemField() {
    let item = document.createElement("div")
    item.className = "listItems"
    let list = document.getElementById("groceryList")
    list.appendChild(item)

    var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
    var i

    for (i = 0; i < fields.length; i++) {
        if (fields[i] === "Units") {
            let possibleUnits = ["units", "pack", "kg", "g", "L", "mL", ]
            let input = document.createElement("select")
            input.classList = fields[i]
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
            item.appendChild(input)
        } else {
        let input = document.createElement("input")
        input.setAttribute("type", "text")
        input.classList = fields[i]
        input.classList.add("textInput")
        let label = document.createElement("label")
        label.innerHTML = fields[i]
        label.classList = "listInputLabels"
        item.appendChild(label)
        item.appendChild(input)
    }
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
    dbEntry.name = fieldData[0]
    dbEntry.qty.amount = parseInt(fieldData[1])
    dbEntry.qty.unit = fieldData[2]
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
        console.log(itemData)
        let quantity = parseInt(itemData[1])
        let dbEntryLocation = database.items.findIndex(obj => obj.name === itemData[0] && obj.qty.amount === quantity && obj.qty.unit === itemData[2] && obj.notes === itemData[3])
        item.remove()
        database.items.splice(dbEntryLocation, 1)
        console.log(database)
    }
}

function cancelListEditing(item, currentFieldData) {//needs to be re-done
    return function () {
        let nameField = item.getElementsByClassName("Name")
        nameField.value = currentFieldData[0]
        let qtyField = item.getElementsByClassName("Quantity")
        qtyField.value = currentFieldData[1]
        let unitsField = items.getElementsByClassName("Units")
        unitsField.value = currentFieldData[2]
        let noteField = items.getElementsByClassName("Notes(Optional)")
        noteField.value = currentFieldData[3]
        toggleInputClass(item)
    }
}

function edit(item) {
    return function () {
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
function saveChanges(item, currentFieldData) {
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
        let quantity = parseInt(currentFieldData[1])
        let dbEntryLocation = database.items.findIndex(obj => obj.name === currentFieldData[0] && obj.qty.amount === quantity && obj.qty.unit === currentFieldData[2] && obj.notes === currentFieldData[3])
        let userChanges = getFieldData(item)
        let dbEntry = database.items[dbEntryLocation]
        dbEntry.name = userChanges[0]
        dbEntry.qty.amount = parseInt(userChanges[1])
        dbEntry.qty.unit = userChanges[2]
        dbEntry.notes = userChanges[3]
        console.log(database)
    }
}

function deleteList() {
    let list = document.getElementById("groceryList")
    list.remove()
}

document.getElementById("deleteList").onclick = deleteList

function createNewList() {

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

