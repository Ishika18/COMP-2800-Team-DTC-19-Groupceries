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
            $('#acceptedFriends').prepend(generateAcceptedHTML(name, email, uid));
        }
    }).catch(err => console.log(err));
}

function generateAcceptedHTML(name, email, uid) {
    return `
    <div class="row received" id=${uid}_A_row>
      <div class="col-md">
        <b>${name}</b>
        <i>${email}</i>
      </div>
      <div class="col-sm">
          <!-- The id for buttons are very important -->
          <!-- Please don't change the id -->
        <button id=${uid}_A onclick="unfriend('${uid}')">Unfriend</button>
      </div>
    </div>
  </div>
    `
}

db.collection(window.localStorage.getItem('uid')).doc("Friends")
    .onSnapshot(function (doc) {
        if ($('.accepted').length != doc.data().received) {
            $(".accepted").remove();
            doc.data().accepted.forEach(function (item) {
                addAcceptedHTML(item);
            })
        }
    })

$(document).ready(function () {
    $(".accepted").remove();
    let currentUser = window.localStorage.getItem('uid');
    db.collection(currentUser).doc("Friends").get().then(function (doc) {
        if (doc.exists) {
            doc.data().accepted.forEach(friendId => {
                addAcceptedHTML(friendId);
            });
        } else {
            console.log("no such document! ");
        }
    }).catch(error => { console.log(error) });
})

