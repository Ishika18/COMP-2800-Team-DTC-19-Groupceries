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
          <button id="${uid}_S" onclick="undoSentRequest()">Undo Request</button>
      </div>
    </div>
  </div>
    `
}

db.collection(window.localStorage.getItem('uid')).doc("Friends")
    .onSnapshot(function (doc) {
        $(".sent").remove();
        $(".received").remove();
        console.log("Current data: ", doc.data().sent);
        doc.data().sent.forEach( function(item) {
            addHTML(item);
        })
    })
