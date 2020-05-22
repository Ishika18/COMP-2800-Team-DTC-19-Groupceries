# Groupceries

# Members
## Shagun - A01211571
## Ronald Liang - A01199458
## Silvana kalliny - A01207937
## Eric Dong - A01170099

Include everything a new developer who just joined your team needs in order to quickly and seamlessly set up their local development environment and use the repo to begin contributing immediately to the web app.

All your source files, all your test files, all your asset files, etc. Make sure it’s all in your repo. 

Include any scripts needed to populate test databases, etc. Everything you’ve made. All of it. Put it all in the repo.

Augment your readme.md. It must contain clear, precise, and correct instructions for how to set up a development environment in Windows and/or macOS, depending on what your team uses.

Tell the new developer how to use the GitHub repo to begin working on your web app, including:

What does the developer need to install (don’t leave anything out!) like:
language(s)
IDEs
Database(s)
Other software
Which 3rd party APIs and frameworks does the developer need to download?
Do they need any API keys?
In which order should they install things?
Include detailed configuration instructions and any additional notes including passwords to servers, etc.
Include a link to 04b Surprise challenge #2b testing plan you have completed so the reader can see your testing history.

Languages:

Groupceries is written in JavaScript, JQuery and Node.js.

IDEs:

Our development team uses Visual Studio Code to develop.

Other Software:

SourceTree is used for git management.

Download & install the following 3rd Party APIs & frameworks:
- jQuery
- Bootstrap
- SweetAlert
- Google OAuth
- Firebase
- Algolia
- Twitter API
- Facebook API
- Express
- Node js

Steps to install
# Firebase intialisation
1. Make a firebase account ( https://firebase.google.com/ )
2. Go to firebase console and create a new app if you don't have one made already.
3. Register the app and add firebase SDKs to the botton of your <body> tag ( change the firebaseConfig with your own firebaseConfig )
    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js"></script>

    <!-- TODO: Add SDKs for Firebase products that you want to use
         https://firebase.google.com/docs/web/setup#available-libraries -->

    <script>
      // Your web app's Firebase configuration
      var firebaseConfig = {
        apiKey: "Your_api_key",
        authDomain: "auth_domain_provided_by_firebaese",
        databaseURL: "database_url_provided_by_firebaese",
        projectId: "projectID_provided_by_firebaese",
        storageBucket: "storage_bucket_provided_by_firebaese",
        messagingSenderId: "*******",
        appId: "Your_app_Id_provided_by_firebase"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
    </script>

## Firebase Firestore
https://firebase.google.com/docs/firestore/quickstart

### Client side
1. Add the SDK in for firebase firestore ( will be already present when you clone the repo )

### Server side
1. Install firebase npm module
    npm init
    npm install --save firebase
2. var firebase = require('firebase/app'); ( will be there when you clone the repo )

## Firebase admin SDK
https://firebase.google.com/docs/admin/setup

### Client side 
not required ( only works for server side )

### Server side
1. npm install firebase admin SDK
    $ npm install firebase-admin --save
2. var admin = require('firebase-admin'); ( will be there when you clone the repo )

## Firebase authentication
https://firebase.google.com/docs/auth/web/start

### Client side
1. Add the SDK in for firebase firestore ( will be already present when you clone the repo )

### Server side
1. Install firebase npm module
    npm install firebaseauth
2. require('firebase/auth'); ( will be there when you clone the repo )

Testing Plan: 
https://docs.google.com/spreadsheets/d/1htzCYm5rM19eaZYk712kJHbJ9eVWcBI4weaWHKEUAOA/edit?usp=sharing
