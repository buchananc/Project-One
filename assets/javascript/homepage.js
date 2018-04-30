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
//     /activeSearch
//        |
//        -> UserID
//               |
//               -> epoch
//               -> meal
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

// ToDo: firebase.auth().currentUser;
var userID = "3456879bcd4579";

//-------------------------------------------------------------------------------------------
// Global variables
//-------------------------------------------------------------------------------------------
var startOfWeekDate = moment().startOf('week');

var mealPlan = {
    breakfast: "cereal",
    lunch: "sandwich",
    dinner: "chicken"
};

var user = {
    name: "test",
    mealPlan
};


var database = firebase.database();
var mealPlanner = database.ref("/mealPlanner");
var activeSearch = database.ref("/activeSearch");

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
//-------------------------------------------------------------------------------------------
function removeActiveSearchDB () {
    console.log("remove activeSearch key in DB");
    var ref = activeSearch.child(userID).once( 'value', function ( snapshot ) {
        snapshot.ref.remove();
    });
 };

removeActiveSearchDB();
createAweekOfEpochKeys();

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
$(document).ready( function() {

    buildDaysOfWeekInDOM();

    $(".meal").on( "click", selectMeal );

});