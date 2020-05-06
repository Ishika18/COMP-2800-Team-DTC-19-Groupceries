if (window.innerWidth <= 1024){ //not sure how to get these elements back to original location once we switch back to desktop
    let readyToggle = document.getElementById("readyToggle");
    let shoppingToggle = document.getElementById("shoppingToggle");
    let desktopMerge = document.getElementById("desktopMerge");
    let listSection = document.getElementById("mobileButtonBar")
    listSection.appendChild(readyToggle)
    listSection.appendChild(shoppingToggle)
    listSection.appendChild(desktopMerge)
}

function listsButton() { //for mobile, allows user to view all their lists and friends' lists when they click the lists button
    document.getElementById("left").style.display = "block"
    document.getElementById("left").style.textAlign = "center"
    document.getElementById("left").className = "col-md-12"
    document.getElementById("middle").style.display = "none"
    document.getElementById("right").style.display = "none"
}
document.getElementById("lists").onclick = listsButton

function currentListButton() { //for mobile, allows user to view their selected list and friends' lists when they click the current list button
    document.getElementById("left").style.display = "none"
    document.getElementById("middle").style.display = "block"
    document.getElementById("middle").style.textAlign = "center"
    document.getElementById("middle").className = "col-md-12"
    document.getElementById("right").style.display = "none"
}
document.getElementById("currentList").onclick = currentListButton

function friendsButton() { //for mobile, allows user to view friends list when they click the friends button
    document.getElementById("left").style.display = "none"
    document.getElementById("middle").style.display = "none"
    document.getElementById("right").style.display = "block"
    document.getElementById("right").style.textAlign = "center"
    document.getElementById("right").className = "col-md-12"
}
document.getElementById("friends").onclick = friendsButton