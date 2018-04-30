//-------------------------------------------------------------------------------------------
//  Firebase db Tree
//
//     /mealPlanner
//         |
//         -> Epoch
//               |
//               -> UserID
//                     |
//                     -> breakfast
//                     -> lunch
//                     -> dinner
//
//     /favorite
//        |
//        -> UserID
//               |
//               -> breakfast
//                    -> yummlyID
//                    -> random  [true/false]
//               -> lunch
//                    -> yummlyID
//                    -> random  [true/false]
//               -> dinner
//                    -> yummlyID
//                    -> random  [true/false]
//
//     /activeSearch
//        |
//        -> UserID
//               |
//               -> epoch
//                   |
//                   -> breakfast
//                        -> yummlyID
//                        -> random  [true/false]
//                   -> lunch
//                        -> yummlyID
//                        -> random  [true/false]
//                   -> dinner
//                        -> yummlyID
//                        -> random  [true/false]
//
//
//-------------------------------------------------------------------------------------------
var config = {
    apiKey: "AIzaSyA_EcDkrbKT89eJoD6Sm_Dc6uXD0SYDZcc",
    authDomain: "project-dean.firebaseapp.com",
    databaseURL: "https://project-dean.firebaseio.com",
    projectId: "project-dean",
    storageBucket: "project-dean.appspot.com",
    messagingSenderId: "894221788473"
  };

firebase.initializeApp( config );

var database = firebase.database();
var mealPlanner = database.ref("/mealPlanner");
var activeSearch = database.ref("/activeSearch");
var favorite = database.ref("/favorite");

// ToDo: firebase.auth().currentUser;
var userID = "3456879bcd4579";

//-------------------------------------------------------------------------------------------
// Global variables
//-------------------------------------------------------------------------------------------
var ourAPIid = "4dced6d2";
var ourAPIkey = "1a7e0fea32a0ad94892aaeb51b858b48";

var startOfWeekDate = moment().startOf('week');

var breakfast = {
    yummlyID: "",
    random: "false"
};

var lunch = {
    yummlyID: "",
    random: "false"
};

var dinner = {
    yummlyID: "",
    random: "false"
};

var mealPlan = {
    breakfast,
    lunch,
    dinner
};

var user = {
    name: "test",
    mealPlan
};


//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function createAweekOfEpochKeys() {

    for (i=0; i<=6; i++) {
        var epoch = moment(startOfWeekDate).add(i, 'days');
        var epochStr = moment(epoch).format("X");

        console.log( epochStr );
        console.log("    "+ moment(epoch).format("YYYY/MM/DD hh:mm:ss"));

        mealPlanner.child(userID+"/"+epochStr).update({
            user
        });
    }
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function buildDayofMeals( epochStr ) {
    // ToDo:  pull data from db on any existing planned meals
    var jq_newDiv = $("<div>");

    // Breakfast
    var jq_newBreakfastDiv = $("<div>");
    var jq_newBreakfastInput = $( "<input>" );
    jq_newBreakfastInput.attr( "type","checkbox" );
    jq_newBreakfastInput.addClass( "meal" );
    jq_newBreakfastInput.attr( "value", "breakfast" );
    jq_newBreakfastInput.attr( "epoch", epochStr );
    jq_newBreakfastDiv.append( jq_newBreakfastInput );
    var jq_newBreakfastLabel = $( "<label>" );
    jq_newBreakfastLabel.attr( "for","breakfast" );
    jq_newBreakfastLabel.text( "Breakfast" );
    jq_newBreakfastDiv.append( jq_newBreakfastLabel );

    // Lunch
    var jq_newLunchDiv = $("<div>");
    var jq_newLunchInput = $( "<input>" );
    jq_newLunchInput.attr( "type","checkbox" );
    jq_newLunchInput.addClass( "meal" );
    jq_newLunchInput.attr( "value", "lunch" );
    jq_newLunchInput.attr( "epoch", epochStr );
    jq_newLunchDiv.append( jq_newLunchInput );
    var jq_newLunchLabel = $( "<label>" );
    jq_newLunchLabel.attr( "for","lunch" );
    jq_newLunchLabel.text( "Lunch" );
    jq_newLunchDiv.append( jq_newLunchLabel );

    // Dinner
    var jq_newDinnerDiv = $("<div>");
    var jq_newDinnerInput = $( "<input>" );
    jq_newDinnerInput.attr( "type","checkbox" );
    jq_newDinnerInput.addClass( "meal" );
    jq_newDinnerInput.attr( "value", "dinner" );
    jq_newDinnerInput.attr( "epoch", epochStr );
    jq_newDinnerDiv.append( jq_newDinnerInput );
    var jq_newDinnerLabel = $( "<label>" );
    jq_newDinnerLabel.attr( "for","dinner" );
    jq_newDinnerLabel.text( "Dinner" );
    jq_newDinnerDiv.append( jq_newDinnerLabel );

    jq_newDiv.append( jq_newBreakfastDiv );
    jq_newDiv.append( jq_newLunchDiv );
    jq_newDiv.append( jq_newDinnerDiv );

    return jq_newDiv;

}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function buildDaysOfWeekInDOM () {

    var startDay = parseInt(moment(startOfWeekDate).format("DD"));

    for (i=0; i<7; i++) {
       var epoch = moment(startOfWeekDate).add(i, 'days');
       var epochStr = moment(epoch).format("X");
       var jq_day = $("#day" + i);
       jq_day.attr("value",epochStr);
       jq_day.append("<a>" + startDay + "</a>");
       jq_day.append( buildDayofMeals(epochStr) );
       ++startDay;
    }

};

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function selectMeal( event ) {
    var selected = $(this);
    var selectedMeal = selected.attr("value");
    var selectedEpoch = selected.attr("epoch");

    event.preventDefault();

    console.log( selectedMeal + " " + selectedEpoch );

    activeSearch.child(userID+"/"+selectedEpoch).update({
        selectedMeal
    });
    window.location.href="search.html";

}

//-------------------------------------------------------------------------------------------
//  constanly check the data base for an updated favorites 
//  and disply if within view
//-------------------------------------------------------------------------------------------
function buildFavoriteMealArea( meal ) {

    favorite.child( userID+"/"+meal ).on('value',function(snapshot) {
        var exists = (snapshot.val() !== null);
        if ( exists ) {
            var queryURL = "https://api.yummly.com/v1/api/recipe/" +
                           snapshot.val().yummlyID +
                           "?_app_id=" + ourAPIid +
                           "&_app_key=" + ourAPIkey;

    console.log(queryURL);

            $.ajax({
                type: 'GET',
                url: queryURL,
            }).then(function (result) {

                console.log(JSON.stringify(result));
                console.log("buildFavoriteMealArea()" + result.name);
                console.log("buildFavoriteMealArea()" + result.images[0].hostedLargeUrl);
                var jq_divID = $("#favorite-"+meal);
                jq_divID.empty();
                jq_divID.append("<h3>"+meal+"</h3>");
                jq_divID.append("<p>"+result.name+"</p>");
                jq_divID.append("<img src="+result.images[0].hostedLargeUrl+">");

            });
        }
    });

}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function buildFromRandomMeal( meal ) {

    var search_params = meal;
    var queryURL = "https://api.yummly.com/v1/api/recipes" +
        "?_app_id=" + ourAPIid +
        "&_app_key=" + ourAPIkey +
        "&q=" + search_params;

    //  if the user has not selected a favorite meal then randomnly selected one
    favorite.child( userID+"/"+meal ).once('value',function(snapshot) {
        var exists = (snapshot.val() !== null);
        if (!exists || snapshot.val().random) {

            $.ajax({
                type: 'GET',
                url: queryURL,
            }).then(function (result) {
                console.log(meal);
                var result_length = result.matches.length;
                var randomNumber = Math.floor(Math.random() * result_length);

                if (meal == "breakfast") {
                    breakfast.yummlyID = result.matches[randomNumber].id;
                    breakfast.random = true;
                    favorite.child(userID).update({
                        breakfast
                    });
                }
                else if (meal == "lunch") {
                    lunch.yummlyID = result.matches[randomNumber].id;
                    lunch.random = true;
                    favorite.child(userID).update({
                        lunch
                    });
                }
                else if (meal == "dinner") {
                    dinner.yummlyID = result.matches[randomNumber].id;
                    dinner.random = true;
                    favorite.child(userID).update({
                        dinner
                    });
                }
            }); 

        }
    });
};

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function removeActiveSearchDB () {
    console.log("remove activeSearch key in DB");
    var ref = activeSearch.child(userID).once( 'value', function ( snapshot ) {
        snapshot.ref.remove();
    });
 };

removeActiveSearchDB();
createAweekOfEpochKeys();

var meal = "default";
for (i=0; i<3; i++) {
    if (i == 0) meal = "breakfast";
    if (i == 1) meal = "lunch";
    if (i == 2) meal = "dinner";
    buildFromRandomMeal( meal );
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
$(document).ready( function() {

    for (i=0; i<3; i++) {
        if (i == 0) meal = "breakfast";
        if (i == 1) meal = "lunch";
        if (i == 2) meal = "dinner";
        buildFavoriteMealArea( meal );
    }

    buildDaysOfWeekInDOM();

    $(".meal").on( "click", selectMeal );

});