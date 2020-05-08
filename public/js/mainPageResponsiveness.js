let mobileDeviceWidth = window.matchMedia("(max-width:1024px)")

let desktopDeviceWidth = window.matchMedia("(min-width:1025px)")
function responsiveDivDisplay() {
    if (desktopDeviceWidth.matches) {
        document.getElementById("left").style.display = "block"
        document.getElementById("middle").style.display = "block"
        document.getElementById("right").style.display = "block"
        document.getElementById("left").className = "col-md-3"
        document.getElementById("middle").className = "col-md-6"
        document.getElementById("right").className = "col-md-3"
    }else {
        document.getElementById("left").style.display = "none"
        document.getElementById("middle").style.display = "block"
        document.getElementById("right").style.display = "none"
        document.getElementById("middle").className = "col-md-12"
    }
}

responsiveDivDisplay()
desktopDeviceWidth.addListener(responsiveDivDisplay)

function listsButton() { //for mobile, allows user to view all their lists and friends' lists when they click the lists button
    document.getElementById("left").style.display = "block"
    document.getElementById("middle").style.display = "none"
    document.getElementById("right").style.display = "none"
    document.getElementById("middle").className = "col-md-12"
}
document.getElementById("lists").onclick = listsButton

function currentListButton() { //for mobile, allows user to view their selected list and friends' lists when they click the current list button
    document.getElementById("left").style.display = "none"
    document.getElementById("middle").style.display = "block"
    document.getElementById("right").style.display = "none"
}
document.getElementById("currentList").onclick = currentListButton

function friendsButton() { //for mobile, allows user to view friends list when they click the friends button
    document.getElementById("left").style.display = "none"
    document.getElementById("middle").style.display = "none"
    document.getElementById("right").style.display = "block"
    document.getElementById("middle").className = "col-md-12"
}
document.getElementById("friends").onclick = friendsButton