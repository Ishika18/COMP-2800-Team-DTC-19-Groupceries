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
        document.getElementById("desktopFriendsMenu").style.display = "block"
        document.getElementById("friend").style.display = "none"
        document.getElementById("socialMediaPage").style.display = "block"
        $('#createList').insertAfter('#availableLists');
        $('#newItem').insertAfter('#listTitleSection');
        $('#socialMediaPage').insertAfter('#socialMediaDesktop');
    }else {
        document.getElementById("left").style.display = "none"
        document.getElementById("middle").style.display = "block"
        document.getElementById("right").style.display = "none"
        document.getElementById("middle").className = "col-md-12"
        document.getElementById("desktopFriendsMenu").style.display = "none"
        document.getElementById("socialMediaPage").style = 'display: none'
        $('#newItem').insertAfter('#placeholder');
        $('#createList').insertAfter('placeholderForNewListButton');
        $('#socialMediaPage').insertAfter('#pendingFriends');
    }
}

responsiveDivDisplay()
desktopDeviceWidth.addListener(responsiveDivDisplay)

function listsButton() { //for mobile, allows user to view all their lists and friends' lists when they click the lists button
    document.getElementById("left").style.display = "block"
    document.getElementById("middle").style.display = "none"
    document.getElementById("right").style.display = "none"
    document.getElementById("aboutUsPage").style.display = "none"
    document.getElementById("middle").className = "col-md-12"
    document.getElementById("lists").className = "navbar-brand navbarItemActive"
    document.getElementById("currentList").className = "navbar-brand navbarItem"
    document.getElementById("friends").className = "navbar-brand navbarItem"
    document.getElementById("aboutUs").className = "navbar-brand navbarItem"
    document.getElementById("mergePageButtons").style = 'display: visible'
    document.getElementById("mainPageButtons").style = 'display: none'
    document.getElementById("friendsPageButtons").style = 'display: none'
    document.getElementById("pageTitle").style = 'display: visible'
    document.getElementById("pageTitle").innerHTML = 'Shopping Lists'
    $(".pageArea").css('height', "calc(100vh - 12.366rem)");
}
document.getElementById("lists").onclick = listsButton

function currentListButton() { //for mobile, allows user to view their selected list and friends' lists when they click the current list button
    document.getElementById("left").style.display = "none"
    document.getElementById("middle").style.display = "block"
    document.getElementById("right").style.display = "none"
    document.getElementById("aboutUsPage").style.display = "none"
    document.getElementById("lists").className = "navbar-brand navbarItem"
    document.getElementById("currentList").className = "navbar-brand navbarItemActive"
    document.getElementById("friends").className = "navbar-brand navbarItem"
    document.getElementById("aboutUs").className = "navbar-brand navbarItem"
    document.getElementById("mergePageButtons").style = 'display: none'
    document.getElementById("mainPageButtons").style = 'display: visible'
    document.getElementById("friendsPageButtons").style = 'display: none'
    document.getElementById("pageTitle").style = 'display: none'
    $(".pageArea").css('height', "calc(100vh - 10rem)");

}
document.getElementById("currentList").onclick = currentListButton

function friendsButton() { //for mobile, allows user to view friends list when they click the friends button
    document.getElementById("left").style.display = "none"
    document.getElementById("friend").style.display = "block"
    document.getElementById("middle").style.display = "none"
    document.getElementById("aboutUsPage").style.display = "none"
    document.getElementById("right").style.display = "block"
    document.getElementById("middle").className = "col-md-12"
    document.getElementById("lists").className = "navbar-brand navbarItem"
    document.getElementById("currentList").className = "navbar-brand navbarItem"
    document.getElementById("friends").className = "navbar-brand navbarItemActive"
    document.getElementById("aboutUs").className = "navbar-brand navbarItem"
    document.getElementById("mergePageButtons").style = 'display: none'
    document.getElementById("mainPageButtons").style = 'display: none'
    document.getElementById("friendsPageButtons").style = 'display: visible'
    document.getElementById("pageTitle").style = 'display: visible'
    document.getElementById("pageTitle").innerHTML = 'My Friends'
    $(".pageArea").css('height', "calc(100vh - 12.366rem)");
}
document.getElementById("friends").onclick = friendsButton

function aboutUsButton() { //for mobile, allows user to view about us page
    document.getElementById("left").style.display = "none"
    document.getElementById("middle").style.display = "none"
    document.getElementById("right").style.display = "none"
    document.getElementById("aboutUsPage").style.display = "block"
    document.getElementById("aboutUsPage").className = "col-md-12"
    document.getElementById("lists").className = "navbar-brand navbarItem"
    document.getElementById("currentList").className = "navbar-brand navbarItem"
    document.getElementById("friends").className = "navbar-brand navbarItem"
    document.getElementById("aboutUs").className = "navbar-brand navbarItemActive"
    document.getElementById("mergePageButtons").style = 'display: none'
    document.getElementById("mainPageButtons").style = 'display: none'
    document.getElementById("friendsPageButtons").style = 'display: none'
    document.getElementById("pageTitle").style = 'display: visible'
    document.getElementById("pageTitle").innerHTML = 'About Us'
    $(".pageArea").css('height', "calc(100vh - 8.8rem)");
}
document.getElementById("aboutUs").onclick = aboutUsButton

function mergeListsButton () { // toggle display on for cancel and confirm merge buttons, off for mergeListsButton
    document.getElementById("cancelMergeButton").style = 'display: visible'
    document.getElementById("mergeListsButton").style = 'visibility: hidden'
    document.getElementById("confirmMergeButton").style = 'display: visible'
}
document.getElementById("mergeListsButton").onclick = mergeListsButton

function confirmOrCancelMergeButton () { // toggle display off for cancel and confirm merge buttons, on for mergeListsButton
    document.getElementById("cancelMergeButton").style = 'display: none'
    document.getElementById("mergeListsButton").style = 'visibility: visible'
    document.getElementById("confirmMergeButton").style = 'display: none'
}
document.getElementById("cancelMergeButton").onclick = confirmOrCancelMergeButton
document.getElementById("confirmMergeButton").onclick = confirmOrCancelMergeButton

function currentFriendsPage() {
    document.getElementById("mobileContainerAcceptedFriends").style = 'display: block'
    document.getElementById("pendingFriends").style = 'display: none'
    document.getElementById("socialMediaPage").style = 'display: none'
    document.getElementById("friendsPageFriendsButton").style = 'color: white'
    document.getElementById("friendsPagePendingButton").style = 'color: grey'
    document.getElementById("friendsPageSocialMediaButton").style = 'color: grey'
    document.getElementById("pageTitle").innerHTML = 'My Friends'
    document.getElementById("receivedFriendListCollapsible").style = 'display: none'
    document.getElementById("sentFriendListCollapsible").style = 'display: none'    
    document.getElementById("friendListCollapsible").style = 'display: block'
    document.getElementById("addFriendContainer").style = 'display: flex'
};
document.getElementById("friendsPageFriendsButton").onclick = currentFriendsPage

function pendingFriendsPage() {
    document.getElementById("mobileContainerAcceptedFriends").style = 'display: none'
    document.getElementById("pendingFriends").style = 'display: block'
    document.getElementById("socialMediaPage").style = 'display: none'
    document.getElementById("friendsPageFriendsButton").style = 'color: grey'
    document.getElementById("friendsPagePendingButton").style = 'color: white'
    document.getElementById("friendsPageSocialMediaButton").style = 'color: grey'
    document.getElementById("pageTitle").innerHTML = 'Pending Requests'
    document.getElementById("friendListCollapsible").style = 'display: none'
    document.getElementById("receivedFriendListCollapsible").style = 'display: block'
    document.getElementById("sentFriendListCollapsible").style = 'display: block'  
    document.getElementById("mobileContainerReceivedFriends").style = 'display: block'
    document.getElementById("mobileContainerSentFriends").style = 'display: block'
    document.getElementById("addFriendContainer").style = 'display: flex'
};
document.getElementById("friendsPagePendingButton").onclick = pendingFriendsPage

function socialMediaPage() {
    document.getElementById("friendListCollapsible").style = 'display: none'
    document.getElementById("mobileContainerAcceptedFriends").style = 'display: none'
    document.getElementById("pendingFriends").style = 'display: none'
    document.getElementById("socialMediaPage").style = 'display: block'
    document.getElementById("friendsPageFriendsButton").style = 'color: grey'
    document.getElementById("friendsPagePendingButton").style = 'color: grey'
    document.getElementById("friendsPageSocialMediaButton").style = 'color: white'
    document.getElementById("pageTitle").innerHTML = 'Social Media'
    document.getElementById("addFriendContainer").style = 'display: none'
    fixSocialMediaForDesktop()
};
document.getElementById("friendsPageSocialMediaButton").onclick = socialMediaPage

function fixSocialMediaForDesktop() {
    let i=0;
    let x=0;
    for (i=0; i <= 2; i++) {
        let widgetId = '#twitter-widget-' + i
        $(widgetId).insertAfter('#twitterButtonFixerContainer');
    }
    for (x=0; x <= 2; x++) {
        let widgetId = '#twitter-widget-' + x
        $(widgetId).insertAfter('#postFixLocationForTwitterButtons');
    }
}
document.getElementById("socialMediaModalToggleButton").onclick = fixSocialMediaForDesktop

function setDocHeight() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
};

setDocHeight()
document.getElementById("currentList").className = "navbar-brand navbarItemActive"
document.getElementById("mergePageButtons").style = 'display: none'
document.getElementById("mainPageButtons").style = 'display: visible'
document.getElementById("friendsPageButtons").style = 'display: none'
document.getElementById("mergeListsButton").style = 'display: visible'
document.getElementById("cancelMergeButton").style = 'visibility: hidden'
document.getElementById("confirmMergeButton").style = 'visibility: hidden'
document.getElementById("aboutUsPage").style = 'display: none'
document.getElementById("pageTitle").style = 'display: none'
document.getElementById("mobileContainerAcceptedFriends").style = 'display: block'
document.getElementById("pendingFriends").style = 'display: none'
document.getElementById("friendsPageFriendsButton").style = 'color: white'
addEventListener('resize', setDocHeight)
addEventListener('orientationchange', setDocHeight)