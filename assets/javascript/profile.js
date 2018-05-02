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
        });
    } else {
        // No user is signed in.
        console.log( " no current User " );
    }
});
//=======================================================



// Looking for changes in Firebase 
// database.ref().on("child_added", function (childSnapshot) {

    // //Store data from database into variables
    // var userDiets = childSnapshot.val().restrictions.Diests.userID.diests;
    // var userAllergies = childSnapshot.val().restrictions.Allergies.userID.allergies;
    // var userBio = childSnapshot.val().users.userId.Bio;
    // var userProfilePicture = childSnapshot.val().users.userID.profilePicture;

    // //Console.loging the last user's data
    // console.log("DIETS");
    // console.log(userDiets);
    // console.log(userAllergies);
    // console.log(userBio);
    // console.log(userProfilePicture);

    // var ava = $("<img>");
    // ava.attr('src', userProfilePicture);
    // $("#ava").html(ava)
// });