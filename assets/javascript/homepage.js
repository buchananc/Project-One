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
    id: "2346782348",
    name: "test",
    mealPlan
};

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
//                     |
//                     -> lunch
//                     |
//                     -> dinner
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

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function createAweekOfEpochKeys() {

    for (i=0; i<=6; i++) {
        var epoch = moment(startOfWeekDate).add(i, 'days');
        var epochStr = moment(epoch).format("X");

        console.log( epochStr );
        console.log("    "+ moment(epoch).format("YYYY/MM/DD hh:mm:ss"));

        mealPlanner.child(epochStr).update({
            user
        });
    }
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function buildDayofMeals(i) {

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
       jq_day.append( buildDayofMeals(i) );
       ++startDay;
    }

};

createAweekOfEpochKeys();

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
$(document).ready( function() {

    buildDaysOfWeekInDOM();

});