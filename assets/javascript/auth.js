var thisUser;
// Developed by Caleb Sears as part of the UNCC Coding Bootcamp - Group Project 1
$(() => {
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
  // Creating a reference to my users in Firebase
  const usersRef = database.ref().child('users');

  // Assigning DOM elements to global variables
  const userEmail = $('#email_login');
  const userPass = $('#pass_login');
  const userName = $('#set_username');
  const signIn = $('#sign_in');
  const signInGoogle = $('#sign_in_google')
  const signUp = $('#sign_up');
  const signOut = $('#sign_out');
  const newHere = $('#new_here');
  const createNewAcct = $('#create_new_acct');
  const usernameInput = $('#username_input');



  // START AUTH STATE CHECK
  // =====================================================================================
      auth.onAuthStateChanged(user => {
          if (user){
              window.location.assign('./homepage.html');
          }
      })
      // TODO -- check if user has already visited site, if so direct them to the homepage
  // END AUTH STATE CHECK
  // =====================================================================================
  


  // START SIGN IN FUNCTION
  // =====================================================================================
  // When user clicks 'sign in'...
  signIn.click(() => {
    // Get the user's input for user name and password...
    let email = userEmail.val();
    let pass = userPass.val();
    // With that info sign IN the user with this input (sign in existing user)
    const promise = auth.signInWithEmailAndPassword(email, pass);
        promise
            // Display this user's id
            .then(user => {
                console.log('Hello, ' + user.displayName + '!');
                window.location.assign('./homepage.html');
            })
            // Catch any errors
            .catch(err => {
                console.log('Error: ' + err.code);
                console.log(err.message);
                if (err.code == 'auth/user-not-found'){
                    alert ('User profile not found. Check that your email and password are correct.')
                }
            })
  });
  // END SIGN IN FUNCTION
  // =====================================================================================

  // BEGIN CREATE NEW ACCOUNT FUNCTION
  // =====================================================================================
  // When the user clicks 'create new account'...
  createNewAcct.click(() => {
      // Hide the 'sign in' button and 'new here' link...
      signIn.addClass('hidden');
      newHere.addClass('hidden');
      signInGoogle.addClass('hidden');
      // Show the 'choose username' input and 'sign up' button
      usernameInput.removeClass('hidden');
      signUp.removeClass('hidden');
  });
  // END CREATE NEW ACCOUNT FUNCTION
  // =====================================================================================

  // BEGIN SIGN UP FUNCTION
  // =====================================================================================
  // When user clicks 'sign up'...
  signUp.click(() => {
      // Get the user's input for username, email, and password...
      let myName = userName.val();
      let email = userEmail.val();
      let pass = userPass.val();
      // With that info sign UP the user with this input (creating a new user)
      const promise = auth.createUserWithEmailAndPassword(email, pass);
        promise
            // Grab the created user id
            .then(user => {
                usersRef.child(user.uid).set({'userName': myName});
                window.location.assign('./edit-profile.html');
            })
            // Log any errors to the console
            .catch(err => {
                console.log('Error: ' + err.code)
                console.log(err.message);
                // Alert the user if password is too short
                if (err.code == 'auth/weak-password'){
                    alert(err.message);
                }
            })
  })


  //BEGIN SIGN IN WITH GOOGLE
  //======================================================================================
  signInGoogle.click(() =>{
      const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');

        firebase.auth().signInWithPopup(provider).then(result =>{
            // This gives you a Google Access Token. You can use it to access the Google API.
            let token = result.credential.accessToken;
            // The signed-in user info.
            let user = result.user;
            // Extract displayName from user and set users/uid/userName equal to the returned value
            usersRef.child(user.uid).update({'userName': user.displayName})
            // ...
            }).catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // The email of the user's account used.
            let email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            let credential = error.credential;
            });
        // TODO -- handel linking accounts with oAuth
  })
  // END SIGN UP FUNCTION
  // =====================================================================================

  
})