// FUNCTIONS
///////////////////////////////////////////////////////////////////
// Function to get data from checkboxes
function selectDiet() {
    // declare a checkbox array 
    var diets = [];

    // look for all checkboes that have a class 'disable' and check if it was checked 
    $(".disable:checked, #no-diet:checked").each(function () {
        diets.push($(this).val());
    });

    console.log(diets)

    // check if there are selected checkboxes
    if (diets.length > 0) {
        console.log("You have selected " + diets);
    } else {
        console.log("Please at least check one of the checkbox");
    }
    return diets;
};

// Function to get data from checkboxes
function selectRestrictions() {
    // declare a checkbox array
    var restrictions = [];

    // look for all checkboes that have a class 'disable' and check if it was checked 
    $(".restriction:checked, #no-restriction:checked").each(function () {
        restrictions.push($(this).val());
    });

    console.log(restrictions);

    // check if there are selected checkboxes
    if (restrictions.length > 0) {
        console.log("You have selected " + restrictions);
    } else {
        console.log("Please at least check one of the checkbox");
    }
    return restrictions;
};


///////////////////////////////////////////////////////////////////
// EVENT LISTENERS

// Event listener for uploading profile picture
$("#image_uploads").on("change", function () {
    // Get the picture from the form
    var avatar = $("#image_uploads").prop("files")[0];
    // Select a div for preview and assign it to the variable
    var profilePicture = $(".avatar");
    // Setting up a file reader
    var reader = new FileReader;

    // After the read operation is complete put the result into img tag
    reader.addEventListener("load", function () {
        var img = $("<img>");
        img.attr('src', reader.result);
        img.attr('id', "profile-preview");
        // Append a preview image to the div
        profilePicture.html(img);
    });

    if (avatar) {
        // Returns  a result that contains the data as a URL representing the file's data as a base64 encoded string
        reader.readAsDataURL(avatar);
    }
});

// if 'No Diet' is checked other checkboxes are disabled
$("#no-diet, #no-restriction").change(function () {
    var noDiet = $("#no-diet");
    var dietChoise = $(".disable");

    if (noDiet.is(':checked')) {
        console.log(noDiet.is(':checked'));
        dietChoise.prop('checked', false);
        dietChoise.prop('disabled', true);
    } else {
        dietChoise.prop('disabled', false);
    }

    var noRestriction = $("#no-restriction");
    var restrictionChise = $(".restriction")

    if (noRestriction.is(':checked')) {
        console.log(noRestriction.is(':checked'));
        restrictionChise.prop('checked', false);
        restrictionChise.prop('disabled', true);
    } else {
        restrictionChise.prop('disabled', false);
    }
});

//======================================================
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAn4RjRZUhRhWm3u2hHcM6hK-0lmOxIASs",
    authDomain: "cross-bite-test.firebaseapp.com",
    databaseURL: "https://cross-bite-test.firebaseio.com",
    projectId: "cross-bite-test",
    storageBucket: "cross-bite-test.appspot.com",
    messagingSenderId: "966977937164"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

var auth = firebase.auth();

var userId = AIUHER89732RH;
//======================================================
auth.onAuthStateChanged( function(user) {
    console.log( "In onAuthStatChange() ");

    if (user) {
        // User is signed in.
        userId = user.uid;
        console.log( " current UserID -> " + user.uid );
        console.log( user );
    } else {
        // No user is signed in.
        console.log( " no current User " );
    }
});
//=======================================================

// Changes content on the screen after 'Save' button is cklicked
$("#save").on("click", function () {
    $(".profile-page").attr("id", "visible");
    $(".edit-profile").removeAttr("id", "visible");

    // Saves INPUT FROM USER in variables
    var avatar
    var bio = $("#bio").val().trim();
    console.log(bio);

    var userDiets = selectDiet();
    var userAllergies = selectRestrictions();
    // var userID = "123";

    // Creates local "temporary" object for holding new user data
   
    // Code for handling the push
    
    database.ref().child(users).child(uid).set({diets: avatar})
    database.ref().child(users).child(uid).set({diets: bio})
    database.ref().child(users).child(uid).child('restrictions').set({diets: userDiets})
    database.ref().child(users).child(uid).child('restrictions').set({allergies: userAllergies})
    
    

    // Get a reference to the storage service
    var storage = firebase.storage().ref();

    const file = $('#image_uploads').prop("files")[0];
    
    console.log(file)


    const name = file.name;
    console.log('I am the file name: ' + userId)

    // Path to store an image
    const fileRef = storage.child('/public/' + userId);

    fileRef.put(avatar).then(function (result) {
        console.log(result);
    });
});

// Looking for changes in Firebase 
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    // Store data from database into variables
    var userDiets = childSnapshot.val().restrictions.Diests.userID.diests;
    var userAllergies = childSnapshot.val().restrictions.Allergies.userID.allergies;
    var userBio = childSnapshot.val().users.userID.bio;
    var userProfilePicture = childSnapshot.val().users.userID.profilePicture;

    // Console.loging the last user's data
    console.log("DIETS");
    console.log(userDiets);
    console.log(userAllergies);
    console.log(userBio);
    console.log(userProfilePicture);

    var ava = $("<img>");
    ava.attr('src', userProfilePicture);
    $("#ava").html(ava)
});