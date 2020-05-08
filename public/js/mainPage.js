let database = [{ itemNumber: 1, name: "ketchup", qty: 1, units: "bottle", notes: "pls" }, { itemNumber: 2, name: "lettuce", qty: 1, units: "bag", notes: "pls" }]
let itemNumber = 1

function databaseListItem() {         // object constructor for new database entries. Creates an empty grocery list item object. This is called when the user presses "new item".
    this.itemNumber = null
    this.name = " "
    this.qty = null
    this.units = " "
    this.notes = ""
}

function loadItems() { //runs when page loads and loads all items from database and makes them visible on list.
    for (item in database) {
        listItem = document.createElement("div")
        listItem.className = "listItems"
        let list = document.getElementById("groceryList")
        list.appendChild(listItem)
        var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
        var i

        for (i = 0; i < fields.length; i++) {
            container = document.createElement("div")
            container.classList = "p-2"
            input = document.createElement("input")
            input.setAttribute("type", "text")
            input.id = fields[i] + database[item].itemNumber
            input.classList = "disabledInput"
            input.disabled = true
            label = document.createElement("label")
            label.innerHTML = fields[i]
            label.classList = "listInputLabels"
            container.appendChild(label)
            container.appendChild(input)
            listItem.appendChild(container)
        }
        addButtons(listItem, database[item].itemNumber, database[item])
        document.getElementById("addButton" + database[item].itemNumber).style.display = "none"
        document.getElementById("editButton" + database[item].itemNumber).style.display = "inline-block"
        fillFields(database[item].itemNumber, database[item])
    }

}
document.onload = loadItems()

function fillFields(itemNum, item) { //called by each list item loaded from database. grabs field information and makes it visible in html page.
    document.getElementById("Name" + itemNum).value = item.name
    document.getElementById("Quantity" + itemNum).value = item.qty
    document.getElementById("Units" + itemNum).value = item.units
    document.getElementById("Notes(Optional)" + itemNum).value = item.notes
}

function editDBEntry(itemNumber, dbEntry) { //called when a user clicks "Add" on a new item after filling out the fields. Edits item in database's fields to reflect user input.
    let name = document.getElementById("Name" + itemNumber).value
    let qty = document.getElementById("Quantity" + itemNumber).value
    let units = document.getElementById("Units" + itemNumber).value
    let notes = document.getElementById("Notes(Optional)" + itemNumber).value
    dbEntry.name = name
    dbEntry.qty = qty
    dbEntry.units = units
    dbEntry.notes = notes
}

function newItemField() {
    let item = document.createElement("div")
    item.className = "listItems"
    item.id = "Item" + itemNumber
    let list = document.getElementById("groceryList")
    list.appendChild(item)
    let dbEntry = new databaseListItem()
    dbEntry.itemNumber = itemNumber
    itemNumber++
    database.push(dbEntry)
    var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
    var i

    for (i = 0; i < fields.length; i++) {
        container = document.createElement("div")
        container.classList = "p-2"
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.id = fields[i] + itemNumber
        input.classList = "textInput"
        label = document.createElement("label")
        label.innerHTML = fields[i]
        label.classList = "listInputLabels"
        container.appendChild(label)
        container.appendChild(input)
        item.appendChild(container)
    }
    addButtons(item, dbEntry.itemNumber, dbEntry)
}


function addButtons(item, itemNumber, dbEntry) {
    addButton = document.createElement("button")
    addButton.innerHTML = "Add"
    addButton.id = "addButton" + itemNumber
    item.appendChild(addButton)
    addButton.onclick = addItemDetails(item, itemNumber, dbEntry)

    editButton = document.createElement("button")
    editButton.id = "editButton" + itemNumber
    editButton.onclick = edit(item, itemNumber)
    editButton.innerHTML = "Edit"
    item.appendChild(editButton)
    editButton.style.display = "none"

    saveButton = document.createElement("button")
    saveButton.id = "saveButton" + itemNumber
    saveButton.onclick = saveChanges(item, itemNumber)
    saveButton.innerHTML = "Save Changes"
    item.appendChild(saveButton)
    saveButton.style.display = "none"

    cancelButton = document.createElement("button")
    cancelButton.id = "cancelButton" + itemNumber
    cancelButton.innerHTML = "Cancel"
    item.appendChild(cancelButton)
    cancelButton.style.display = "none"

}

function addItemDetails(item, itemNumber, dbEntry) {
    return function () {
        editDBEntry(itemNumber, dbEntry)
        document.getElementById("addButton" + itemNumber).style.display = "none"
        document.getElementById("editButton" + itemNumber).style.display = "inline-block"
        var fields = item.getElementsByClassName("textInput")
        var fieldsCopy = []
        for (field in fields) {
            fieldsCopy[field] = fields[field] //create shallow copy to prevent errors related to list length
        }
        var i

        for (i = 0; i < fieldsCopy.length; i++) {
            input = fieldsCopy[i]
            input.className = "disabledInput"
            input.disabled = true;
        }
    }
}



function edit(item, itemNumber) {
    return function () {
        document.getElementById("editButton" + itemNumber).style.display = "none"
        document.getElementById("saveButton" + itemNumber).style.display = "inline-block"
        document.getElementById("cancelButton" + itemNumber).style.display = "inline-block"
        var fields = item.getElementsByClassName("disabledInput")
        var fieldsCopy = []
        for (field in fields) {
            fieldsCopy[field] = fields[field] //create shallow copy to prevent errors related to list length
        }
        var i

        for (i = 0; i < fieldsCopy.length; i++) {
            input = fieldsCopy[i]
            input.className = "textInput"
            input.disabled = false;
        }
    }
}
function saveChanges(item, itemNumber) {
    return function () {
        document.getElementById("editButton" + itemNumber).style.display = "inline-block"
        document.getElementById("saveButton" + itemNumber).style.display = "none"
        document.getElementById("cancelButton" + itemNumber).style.display = "none"
        var fields = item.getElementsByClassName("textInput")
        var fieldsCopy = []
        for (field in fields) {
            fieldsCopy[field] = fields[field] //create shallow copy to prevent errors related to list length
        }
        var i

        for (i = 0; i < fieldsCopy.length; i++) {
            input = fieldsCopy[i]
            input.className = "disabledInput"
            input.disabled = true;
        }
    }
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

