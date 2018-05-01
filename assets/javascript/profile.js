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
    // Get the avatar from the form
    var avatar = $("#image_uploads").prop("files")[0];
    var profilePicture = $(".avatar");
    var reader = new FileReader;


    reader.addEventListener("load", function () {
        var img = $("<img>");
        img.attr('src', reader.result);
        img.attr('id', "profile-preview");
        profilePicture.html(img);
    });

    if (avatar && profilePicture) {
        reader.readAsDataURL(avatar);
    }

    // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage().ref();

    const file = $('#image_uploads').prop("files")[0];
    console.log(file)

    const name = file.name;

    const fileRef = storage.child('/public/' + name);

    fileRef.put(avatar).then(function(result) {
        console.log(result);
    });
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
//=======================================================

// Changes content on the screen after 'Save' button is cklicked
$("#save").on("click", function () {
    $(".profile-page").attr("id", "visible");
    $(".edit-profile").removeAttr("id", "visible");

    // Saves INPUT FROM USER in variables
    var userAvatar = $("img").attr("src");
    console.log(userAvatar)
    var avatar = $("#image_uploads").prop("files")[0];
    var bio = $("#bio").val().trim();
    console.log(avatar);
    console.log(bio);

    var diets = selectDiet();
    var restrictions = selectRestrictions();
    // var userID = "123";

    // Creates local "temporary" object for holding new user data
    var user = {
        users: {
            userID: {
                name: "user1",
                profilePicture: userAvatar,
                bio: bio,
            },
        },
        restrictions: {
            Diests: {
                userID: {
                    diests: diets,
                },
            },
            Allergies: {
                userID: {
                    allergies: restrictions,
                },
            }
        },
    }
        // Code for handling the push
        database.ref().push(user);
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