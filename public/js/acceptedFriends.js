function unfriend(friendID) {
    let currentUser = window.localStorage.getItem('uid');
    // document friends of current user
    let currentUserDocs = db.collection(currentUser).doc("Friends");
    // document friends of friend
    let friendDocs = db.collection(friendID).doc("Friends");
    currentUserDocs.update({ accepted: firebase.firestore.FieldValue.arrayRemove(friendID) }).catch((error) => { console.log(error) });
    friendDocs.update({ accepted: firebase.firestore.FieldValue.arrayRemove(currentUser) }).catch((error) => { console.log(error) });
}

function addAcceptedHTML(uid) {
    db.collection(uid).doc('userInfo').get().then((doc) => {
        if (doc.exists) {
            let name = doc.data().name;
            let email = doc.data().email;
            if (!document.getElementById(uid + "_A_row")) {
                $('.acceptedFriends').prepend(generateAcceptedHTML(name, email, uid));
            }
        }
    }).catch(err => console.log(err));
}

function generateAcceptedHTML(name, email, uid) {
    return `
    <div class="p-2 listCollapsibleLayer2 accepted" id=${uid}_A_row>
        <label class="inputLabels"><h4 class="collapsibleText">${name}</h4></label>
        <button id=${uid}_A onclick="unfriend('${uid}')" class="btn removeFriendButton"><i class="fas fa-user-times"></i></button>
    </div>
    `
}

db.collection(window.localStorage.getItem('uid')).doc("Friends")
    .onSnapshot(function (doc) {
        if ($('.accepted').length != doc.data().accepted.length) {
            $(".accepted").remove();
            doc.data().accepted.forEach(function (item) {
                addAcceptedHTML(item);
            })
        }
    })
