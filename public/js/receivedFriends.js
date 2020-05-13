function acceptRequest(friendID) {
    let currentUser = window.localStorage.getItem('uid');
    // document friends of current user
    let currentUserDocs = db.collection(currentUser).doc("Friends");

    // document friends of friend
    let friendDocs = db.collection(friendID).doc("Friends");

    // add the current uid to the friends' accepted
    friendDocs.set({ accepted: firebase.firestore.FieldValue.arrayUnion(currentUser) }, { merge: true }).catch((error) => { console.log(error) });

    // delete the current uid from the friends' sent
    friendDocs.update({ sent: firebase.firestore.FieldValue.arrayRemove(currentUser) }).catch((error) => { console.log(error) });

    // delete the friends' uid from the user's recceived
    currentUserDocs.update({ received: firebase.firestore.FieldValue.arrayRemove(friendID) }).catch((error) => { console.log(error) });

    // send the friend a notification

    // add the friend uid to the cuurent users' accepted
    currentUserDocs.set({ accepted: firebase.firestore.FieldValue.arrayUnion(friendID) }, { merge: true }).catch((error) => { console.log(error) });
}

function declineRequest(friendID) {
    let currentUser = window.localStorage.getItem('uid');
    // document friends of current user
    let currentUserDocs = db.collection(currentUser).doc("Friends");

    // document friends of friend
    let friendDocs = db.collection(friendID).doc("Friends");
    /* If the user declines, should we inform the user who sent the friend request ?*/
    // delete the current email or uid to the friends' sent
    friendDocs.update({ sent: firebase.firestore.FieldValue.arrayRemove(currentUser) }).catch((error) => { console.log(error) });

    // remove the notification (maybe ?)

    // delete the friend email or uid to the cuurent users' recieved
    currentUserDocs.update({ received: firebase.firestore.FieldValue.arrayRemove(friendID) }).catch((error) => { console.log(error) });
}

function addReceivedHTML(uid) {
    db.collection(uid).doc('userInfo').get().then((doc) => {
        if (doc.exists) {
            let name = doc.data().name;
            let email = doc.data().email;
            $('#receivedFriends').prepend(generateReceivedHTML(name, email, uid));
        }
    }).catch(err => console.log(err));
}

function generateReceivedHTML(name, email, uid) {
    return `
    <div class="row received" id=${uid}_R_row>
      <div class="col-md">
        <b>${name}</b>
        <i>${email}</i>
      </div>
      <div class="col-sm">
          <!-- The id for buttons are very important -->
          <!-- Please don't change the id -->
        <button id=${uid}_R onclick="acceptRequest('${uid}')">Accept</button>
        <button id=${uid}_R onclick="declineRequest('${uid}')">Decline</button>
      </div>
    </div>
  </div>
    `
}

db.collection(window.localStorage.getItem('uid')).doc("Friends")
    .onSnapshot(function (doc) {
        if ($('.received').length != doc.data().received) {
            $(".received").remove();
            doc.data().received.forEach(function (item) {
                addReceivedHTML(item);
            })
        }
    })

$(document).ready(function () {
    $(".received").remove();
    let currentUser = window.localStorage.getItem('uid');
    db.collection(currentUser).doc("Friends").get().then(function (doc) {
        if (doc.exists) {
            doc.data().received.forEach(friendId => {
                addReceivedHTML(friendId);
            });
        } else {
            console.log("no such document! ");
        }
    }).catch(error => { console.log(error) });
})