const firebase = require('firebase/app');

const firebaseConfig = {
    apiKey: "AIzaSyC59-CinZU4yGdTnIcQPXEaIOC5R7cGfLA",
    authDomain: "groupceries-f6189.firebaseapp.com",
    databaseURL: "https://groupceries-f6189.firebaseio.com",
    projectId: "groupceries-f6189",
    storageBucket: "groupceries-f6189.appspot.com",
    messagingSenderId: "688161851064",
    appId: "1:688161851064:web:23a0bc2b403535a57f964d"
};

// Initialize Firebase
// make sure it is not initialized before
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const admin = require('firebase-admin');

let serviceAccount = require(".././groupceries-f6189-firebase-adminsdk-cxupm-fa31b03012.json.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://groupceries-f6189.firebaseio.com"
});

let userController = {
    listAllUsers: (nextPageToken) => {
      let allUsers = [];
      // List batch of users, 1000 at a time.
      return admin.auth().listUsers(1000, nextPageToken)
        .then(function (listUsersResult) {
          listUsersResult.users.forEach(function (userRecord) {
            let userInfo = userRecord.toJSON();
            allUsers.push({ name: userInfo.displayName, email: userInfo.email, dp: userInfo.photoURL, objectID: userInfo.uid });
          });
          if (listUsersResult.pageToken) {
            // List next batch of users.
            listAllUsers(listUsersResult.pageToken);
          }
          return allUsers;
        })
        .catch(function (error) {
          console.log('Error listing users:', error);
        });
    },
  
    getUID: (email) => {
      return admin.auth().getUserByEmail(email)
        .then(function (userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          return userRecord.toJSON().uid;
        })
        .catch(function (error) {
          console.log('Error fetching user data:', error);
        });
    }
  }
  
  module.exports = userController;