function showReceivedRequests() {
    let currentUser = window.localStorage.getItem('uid');
    db.collection(currentUser).doc("Friends").get().then(function (doc) {
        if (doc.exists) {
            doc.data().received.forEach(friendId => {
                addHTML(friendId);
            });
        } else {
            console.log("no such document! ");
        }
    }).catch(error => { console.log(error) });
}

function addHTML(uid) {
    db.collection(uid).doc('userInfo').get().then( (doc) => {
        if (doc.exists) {
            let name = doc.data().name;
            let email = doc.data().email;
            $('#receivedFriends').prepend(generateHTML(name, email, uid));
        }
    }).catch(err => console.log(err));
}

function generateHTML(name, email, uid) {
    return `
    <div class="row">
      <div class="col-md">
        <b>${name}</b>
        <i>${email}</i>
      </div>
      <div class="col-sm">
          <!-- The id for buttons are very important -->
          <!-- Please don't change the id -->
        <button id=${uid} onclick="acceptRequest()">Accept</button>
        <button id=${uid} onclick="declineRequest()">Decline</button>
      </div>
    </div>
  </div>
    `
}

$(document).ready(function(){
     showReceivedRequests();
});