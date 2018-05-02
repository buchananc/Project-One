// FUNCTIONS
///////////////////////////////////////////////////////////////////

//======================================================
auth.onAuthStateChanged( function(user) {
    console.log("In onAuthStatChange() ");

    if (user) {
        // User is signed in.
        userId = user.uid;
        console.log( " current UserID -> " + user.uid );
        console.log( user );
        usersRef.child(userId).once( 'value', function(snapshot) {
            userName = snapshot.val().userName;
            console.log( 'usersRef userName -> ' + userName );
            $("#username").text(userName);
            $("#u-name").text(userName);
            populatePage(snapshot);
        });
    } else {
        // No user is signed in.
        console.log( " no current User " );
    }
});
//=======================================================

// Looking for changes in Firebase 
function populatePage (snapshot) {

    console.log('snapshot', snapshot);
    // Pull data from database into variables
    var userDiets = snapshot.val().restrictions.diets;
    var userAllergies = snapshot.val().restrictions.allergies;
    var userBio = snapshot.val().Bio;
    var userProfilePicture = snapshot.val().profilePicture;

    //Console.loging the last user's data
    console.log("DIETS");
    console.log(userDiets);
    console.log(userAllergies);
    console.log(userBio);
    console.log(userProfilePicture);

    // Update Profile Picture
    $("#pic-placeholder").attr('src', userProfilePicture);

    // Update user's bio
    $('#u-bio').text(userBio);

    for(var i=0; i<userDiets.length; i++){
        $("#u-diets").append('<li class="u-diets">' + userDiets[i])
    }

    for(var j=0; j<userAllergies.length; j++){
        $("#u-allergies").append('<li class="u-allergies">' + userAllergies[j])
    }
    
};