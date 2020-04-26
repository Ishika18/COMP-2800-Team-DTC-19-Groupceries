function onSignIn(googleUser) {
    console.log(googleUser);
    let id_token = googleUser.getAuthResponse().id_token;

    // do not login the user here, just send the id_token to app.js
    sendIDToken(id_token);
    document.getElementById('signOut').style = 'display: visible';
    document.getElementById('signIn').style = 'display: none';
}

function sendIDToken(id_token) {
    let id = {idToken: id_token};
    $.ajax({
      type: 'POST',
      url: '/home',
      data: id,
      success: function(data){
        console.log(data);
        //do something with the data via front-end framework
        location.reload();
      }
    });
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });

  // make a post request and logout user in the server side
  logOutInServer();

  document.getElementById('signIn').style = 'display: visible';
  document.getElementById('signOut').style = 'display: none';
}

function logOutInServer() {
  // send back a null user id.
  let id = {idToken: null};
  $.ajax({
    type: 'POST',
    url: '/home',
    data: id,
    success: function(data){
      console.log(data);
      //do something with the data via front-end framework
      location.reload();
    }
  });
}