// Initializing Firebase
var config = {
    apiKey: "AIzaSyCeZJWPPfaCh9IqHcd0SLw6AdKkH46qZRQ",
    authDomain: "cross-bite.firebaseapp.com",
    databaseURL: "https://cross-bite.firebaseio.com",
    projectId: "cross-bite",
    storageBucket: "cross-bite.appspot.com",
    messagingSenderId: "789203245949"
  };
  firebase.initializeApp(config);

const database = firebase.database();
const auth = firebase.auth();

// Get a reference to the storage service
var storage = firebase.storage().ref();

// Creating a reference to my users in Firebase
const usersRef = database.ref().child('users');