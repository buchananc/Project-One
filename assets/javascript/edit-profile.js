// FUNCTIONS
///////////////////////////////////////////////////////////////////
// Function to get data from checkboxes
function selectDiet() {
    // declare a checkbox array 
    var diets = [];

    // look for all checkboes that have a class 'disable' and check if it was checked 
    $(".disable:checked, #no-diet:checked").each(function () {
        var values = $(this).val().split("^")

        diets.push({
            id: values[0],
            label: values[1],
        });
    });

    console.log(diets)

    // check if there are selected checkboxes
    if (diets.length > 0) {
    } else {
        $('#no-diet').prop('checked', true);
        diets.push({
            id: '0',
            label: $('#no-diet').val(),
        });
    }
    return diets;
};

// Function to get data from checkboxes
function selectRestrictions() {
    // declare a checkbox array
    var restrictions = [];

    // look for all checkboes that have a class 'disable' and check if it was checked 
    $(".restriction:checked, #no-restriction:checked").each(function () {
        var values = $(this).val().split("^")

        restrictions.push({
            id: values[0],
            label: values[1],
        });
    });

    // check if there are selected checkboxes
    if (restrictions.length > 0) {
    } else {
        $('#no-restriction').prop('checked', true);
        restrictions.push({
            id: '0',
            label: $('#no-restriction').val(),
        });
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
        dietChoise.prop('checked', false);
        dietChoise.prop('disabled', true);
    } else {
        dietChoise.prop('disabled', false);
    }

    var noRestriction = $("#no-restriction");
    var restrictionChise = $(".restriction")

    if (noRestriction.is(':checked')) {
        restrictionChise.prop('checked', false);
        restrictionChise.prop('disabled', true);
    } else {
        restrictionChise.prop('disabled', false);
    }
});

//======================================================
auth.onAuthStateChanged(function (user) {

    if (user) {
        // User is signed in.
        userId = user.uid;
        usersRef.child(userId).once('value', function (snapshot) {
            userName = snapshot.val().userName;
            $("#username").text(userName);
            $("#u-name").text(userName);
            $("#welcome").text(userName);
        });
    } else {
        // No user is signed in.
    }
});
//=======================================================

// Changes content on the screen after 'Save' button is cklicked
$("#save").on("click", function () {
    $("#save").attr("disabled", true);
    $(".profile-page").attr("id", "visible");
    $(".edit-profile").removeAttr("id", "visible");

    // Saves INPUT FROM USER in variables
    var avatar = $("#image_uploads").prop("files")[0];
    var bio = $("#bio").val().trim();


    var userDiets = selectDiet();
    var userAllergies = selectRestrictions();

    // Code for handling pushing data to database
    usersRef.child(userId).update({
        Bio: bio
    })
    usersRef.child(userId).child('restrictions').update({
        diets: userDiets
    })
    usersRef.child(userId).child('restrictions').update({
        allergies: userAllergies
    })

    // Get a reference to the storage service
    var storage = firebase.storage().ref();

    // Path to store an image
    const fileRef = storage.child('/Profile Picture/' + userId);

    if (avatar) {
        fileRef.put(avatar).then(function (result) {
            var userPic = result.metadata.downloadURLs[0]
            usersRef.child(userId).update({
                profilePicture: userPic
            })
            window.location.href = "profile.html";
        })
    } else {
        window.location.href = "profile.html";
    }
});

auth.onAuthStateChanged(user => {
    if (user) {
        if (user.photoURL) {
            $("#pic-placeholder").attr("src", user.photoURL)

            usersRef.child(userId).update({
                profilePicture: user.photoURL
            })
        }
    }
    
});