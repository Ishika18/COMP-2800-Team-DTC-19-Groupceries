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
        console.log("Current data: ", doc.data().sent);
        doc.data().sent.forEach( function(item) {
            $(".sent").remove();
            addHTML(item);
        })
    })

// function deleteItem(uid) {
//     $(uid + "_S_row").remove();
// }

// function addItem(uid) {
//     addHTML(uid);
// }

// let ids = $('.sent').map(function () {
//     return this.id;
// }).get().join();

// var idArray = [];
// $('.red').each(function () {
//     idArray.push(this.id);
// });
