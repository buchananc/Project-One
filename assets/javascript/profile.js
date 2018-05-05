// FUNCTIONS
///////////////////////////////////////////////////////////////////

//======================================================
auth.onAuthStateChanged( function(user) {
    if (user) {
        // User is signed in.
        userId = user.uid;
        usersRef.child(userId).once( 'value', function(snapshot) {
            userName = snapshot.val().userName;
            $("#username").text(userName);
            $("#u-name").text(userName);
            populatePage(snapshot);
        });
    } else {
        // No user is signed in.
    }
});
//=======================================================

// Looking for changes in Firebase 
function populatePage (snapshot) {

    // Pull data from database into variables
    var userDiets = snapshot.val().restrictions.diets;
    var userAllergies = snapshot.val().restrictions.allergies;
    var userBio = snapshot.val().Bio;
    var userProfilePicture = snapshot.val().profilePicture;

    // Update Profile Picture
    $("#pic-placeholder").attr('src', userProfilePicture);

    // Update user's bio
    $('#u-bio').text(userBio);

    for(var i=0; i<userDiets.length; i++){
        $("#u-diets").append('<li class="u-diets">' + userDiets[i].label)
    }

    for(var j=0; j<userAllergies.length; j++){
        $("#u-allergies").append('<li class="u-allergies">' + userAllergies[j].label)
    }
};


