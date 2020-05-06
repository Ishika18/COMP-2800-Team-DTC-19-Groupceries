function newItemField() {
    let item = document.createElement("div")
    item.className = "listItems"
    let list = document.getElementById("groceryList")
    list.appendChild(item)
    var fields = ["Name", "Quantity", "Units", "Notes(Optional)"]
    var i

    for (i = 0; i < fields.length; i++) {
        input = document.createElement("input")
        input.setAttribute("type", "text")
        input.id = fields[i]
        input.classList = "textInput"
        label = document.createElement("label")
        label.innerHTML = fields[i]
        item.appendChild(label)
        item.appendChild(input)
    }
    addButton = document.createElement("button")
    addButton.innerHTML = "Add"
    addButton.id = "addButton"
    item.appendChild(addButton)
    addButton.onclick = addItemDetails(item)
}

document.getElementById("newItem").onclick = newItemField

function addItemDetails(item) {
    return function () {
        var fields = item.getElementsByClassName("textInput")
        var fieldsCopy = []
        for (field in fields) {
            fieldsCopy[field] = fields[field] //create shallow copy to prevent errors related to list length
        }
        var i

        for (i = 0; i < fieldsCopy.length; i++) {
            input = fieldsCopy[i]
            inputData = input.value
            inputText = document.createElement("p")
            inputText.innerHTML = inputData
            item.replaceChild(inputText, input)
        }
    }
}
