function undoSentRequest(friendID) {
    let currentUser = window.localStorage.getItem('uid');
    // document friends of current user
    let currentUserDocs = db.collection(window.localStorage.getItem('uid')).doc("Friends");

    // document friends of friend
    let friendDocs = db.collection(friendID).doc("Friends");

    // delete the current uid to the friends'recieved
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
            $('#sentFriends').prepend(generateHTML(name, email, uid));
        }
    }).catch(err => console.log(err));
}

function generateHTML(name, email, uid) {
    return `
    <div class="row sent" id=${uid}_S_row>
      <div class="col-md">
        <b>${name}</b>
        <i>${email}</i>
      </div>
      <div class="col-sm">
          <!-- The id for buttons are very important -->
          <!-- Please don't change the id -->
          <button id="${uid}_S" onclick="undoSentRequest('${uid}')">Undo Request</button>
      </div>
    </div>
  </div>
    `
}

db.collection(window.localStorage.getItem('uid')).doc("Friends")
    .onSnapshot(function (doc) {
        if ($('.sent').length != doc.data().sent) {
            $(".sent").remove();
            doc.data().sent.forEach(function (item) {
                addHTML(item);
            })
        }
    })
