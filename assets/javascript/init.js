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
const mealPlanner = database.ref("/mealPlanner");
const activeSearch = database.ref("/activeSearch");
const favorite = database.ref("/favorite");


const signOut = function(){
    auth.signOut(); // Firebase provided function to sign users out.. couldn't be any easier
    window.location.assign('./index.html'); // Redirects user to main sign in page
}