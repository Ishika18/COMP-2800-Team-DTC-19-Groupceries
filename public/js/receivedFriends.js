function showReceivedRequests() {
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
}

function addReceivedHTML(uid) {
    db.collection(uid).doc('userInfo').get().then( (doc) => {
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
        <button id=${uid}_R onclick="acceptRequest()">Accept</button>
        <button id=${uid}_R onclick="declineRequest()">Decline</button>
      </div>
    </div>
  </div>
    `
}

db.collection(window.localStorage.getItem('uid')).doc("Friends")
    .onSnapshot(function (doc) {
        console.log("Current data: ", doc.data().sent);
        doc.data().received.forEach( function(item) {
            $(".received").remove();
            addReceivedHTML(item);
        })
    })