function undoSentRequest(friendID) {
    let currentUser = window.localStorage.getItem('uid');
    // document friends of current user
    let currentUserDocs = db.collection(window.localStorage.getItem('uid')).doc("Friends");

    // document friends of friend
    let friendDocs = db.collection(friendID).doc("Friends");

    // delete the current uid to the friends'received
    friendDocs.update({ received: firebase.firestore.FieldValue.arrayRemove(currentUser) }).catch((error) => { console.log(error) });

    // remove the notification (maybe ?)

    // delete the friend email or uid to the cuurent users' sent
    currentUserDocs.update({ sent: firebase.firestore.FieldValue.arrayRemove(friendID) }).catch((error) => { console.log(error) });
}

function addHTML(uid) {
    db.collection(uid).doc('userInfo').get().then((doc) => {
        if (doc.exists) {
            let name = doc.data().name;
            let email = doc.data().email;
            if (!document.getElementById(uid + "_S_row")) {
                $('.sentFriends').prepend(generateHTML(name, email, uid));
            }
        }
    }).catch(err => console.log(err));
}

function generateHTML(name, email, uid) {
    return `
    <div class="p-2 listCollapsibleLayer2 sent" id=${uid}_S_row>
        <label class="inputLabels"><h4 class="collapsibleText">${name}</h4></label>
        <button id="${uid}_S" onclick="undoSentRequest('${uid}')" class="btn cancelRequestButton"><i class="fas fa-times"></i></button>
    </div>
    `
}

db.collection(window.localStorage.getItem('uid')).doc("Friends")
    .onSnapshot(function (doc) {
        if ($('.sent').length != doc.data().sent.length) {
            $(".sent").remove();
            doc.data().sent.forEach(function (item) {
                addHTML(item);
            })
        }
    })