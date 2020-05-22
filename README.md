# Groupceries

Please see our Wiki page on GitHub for more information. 


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
2. Generate a private key file for your service account and add the ervice-account-file.json in your root directory in the place of        groupceries-f6189-firebase-adminsdk-cxupm-fa31b03012
3. var admin = require('firebase-admin'); ( will be there when you clone the repo )

## Firebase authentication
https://firebase.google.com/docs/auth/web/start

### Client side
1. Add the SDK in for firebase firestore ( will be already present when you clone the repo )

### Server side
1. Install firebase npm module
    npm install firebaseauth
2. require('firebase/auth'); ( will be there when you clone the repo )

# Google oAuth
https://developers.google.com/assistant/identity/google-sign-in-oauth

1. Configure a google web project
    https://developers.google.com/assistant/identity/google-sign-in-oauth#configure_the_project
2. Create new oauth credential for your app
3. Add your client id in the layout page line 9 
    meta name="google-signin-client_id" content= *"YOUR_OWN_CLIENT_ID"*>
4. Whitelist your app website in the google oauth credential.

# Algolia
https://www.algolia.com/doc/rest-api/search/

## Client side
1. Add the SDKs ( will be there when you clone the repo )
2. Add your application id and search only api key in algolia.js line 1
    const client = algoliasearch('YOUR_APP_ID', 'YOUR_SEARCH_ONLY_API');

## Server side
1. Install algoliasearch npm module
   npm install algoliasearch
2. Add your application id and admin api key in algoliaController.js line 1
    const client = algoliasearch('YOUR_APP_ID', 'YOUR_ADMIN_API');
    
# Serve-favicon
Set-Up
1. Perform the following command in the terminal: npm install serve-favicon

2. Add the following statement to the top of the app.js file: const favicon = require('serve-favicon'); ( will be there when you clone      the repo )

3. Add the following statement to the app.js file: app.use(favicon(__dirname + 'where the favicon file is stored'));

# SweetAlert API 
1. Paste the SweetAlert CDN into the createListPage.ejs file (will be there when you clone the repo)

# Twitter api
1. Add the twitter SDKS in the twitter.ejs (will be there when you clone the repo)

# Facebook api
https://developers.facebook.com/docs/
1. Make a facebook app.
2. Initialise facebook in layout.ejs
<script>
      window.fbAsyncInit = function() {
        FB.init({
          appId            : 'YOUR_APP_ID',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v7.0'
        });
      };
      $(window).on("load", function(){
        $(".loader-wrapper").fadeOut("slow");
        document.getElementById('loaderImage').style = "animation-iteration-count: 0;"
      });
      // gotten from https://redstapler.co/add-loading-animation-to-website/
    </script>
    <script async defer src="https://connect.facebook.net/en_US/sdk.js"></script>
3. To make your app live, you need to make a privacy policy certificate with facebook and add the privacy policy url ro your app            https://developers.facebook.com/apps/YOUR_APP_ID/settings/basic/
4. Whitelist your website url in faccebook console.

Testing Plan: 
https://docs.google.com/spreadsheets/d/1htzCYm5rM19eaZYk712kJHbJ9eVWcBI4weaWHKEUAOA/edit?usp=sharing

# Members
## Shagun - A01211571
## Ronald Liang - A01199458
## Silvana kalliny - A01207937
## Eric Dong - A01170099

## Overview 

Directory Structure and Layout

 - In the directory, you will find the package.json containing all dependencies, the Firebase Admin SDK, "app.js" which is our server, ".gitignore" and three folders called "views", "public" and "controllers". 
 - The "views" folder contains all ejs pages and partials displayed throughout the app. 
 - The "public" folder contains all JavaScript, CSS and media files. 
 - Finally, the "controllers" folder contains server-side code.

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
