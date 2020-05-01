function newItemField() {
    let item = document.createElement("div")
    let list = document.getElementById("groceryList")
    list.appendChild(item)
    var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
    var i

    for(i=0; i <fields.length; i++) {
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.id = fields[i]
        label = document.createElement("label")
        label.innerHTML = fields[i]
        item.appendChild(label)
        item.appendChild(input)
    }

document.getElementById("newItem").onclick = newItemField()

    // let item = document.createElement("div")
    // let list = document.getElementById("groceryList")
    // list.appendChild(item)
    // item.classList = "listItems"
    // let nameInput = document.createElement("input")
    // nameInput.setAttribute("type", "text")
    // let nameLabel = document.createElement("label")
    // nameLabel.innerHTML = "Item Name"
    // item.appendChild(nameLabel)
    // item.appendChild(nameInput)
    // let qtyInput = document.createElement("input")
    // qtyInput.setAttribute("type", "text")
    // let qtyLabel = document.createElement("label")
    // qtyLabel.innerHTML = "Quantity"
    // item.appendChild(qtyLabel)
    // item.appendChild(qtyInput)
    // let unitInput = document.createElement("input")
    // unitInput.setAttribute("type", "text")
    // let unitLabel = document.createElement("label")
    // unitLabel.innerHTML = "Unit"
    // item.appendChild(unitLabel)
    // item.appendChild(unitInput)
    // noteInput = document.createElement("input")
    // noteInput.setAttribute("type", "text")
    // noteLabel = document.createElement("label")
    // noteLabel.innerHTML = "Notes(Optional)"
    // item.appendChild(noteLabel)
    // item.appendChild(noteInput)
    // addButton = document.createElement("button")
    // addButton.innerHTML = "Add"
    // addButton.id = "addButton"
    // item.appendChild(addButton)
    // addButton.onclick = addItemDetails(item, nameInput, qtyInput, unitInput, noteInput)
    // editButton = document.createElement("button")
    // editButton.innerHTML = "Edit"
    // item.appendChild(editButton)
    // editButton.id = "edit"
 }