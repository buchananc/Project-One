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
//               -> searchCriteria
//                   |
//                   -> selectedEpoch: 
//                   -> selectedMeal:  [breakfast/lunch/dinner]
//                   -> selectedYummlyID:
//
//
//-------------------------------------------------------------------------------------------

var userID = "";
var userName = "";

//-------------------------------------------------------------------------------------------
// Global variables
//-------------------------------------------------------------------------------------------
var ourAPIid = "4dced6d2";
var ourAPIkey = "1a7e0fea32a0ad94892aaeb51b858b48";

var startOfWeekDate = moment().startOf('week');

var breakfast = {
    yummlyID: " ",
    random: "false"
};

var lunch = {
    yummlyID: " ",
    random: "false"
};

var dinner = {
    yummlyID: " ",
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


    mealPlanner.child( userID ).once('value',function(snapshot) {
        var userExists = (snapshot.val() !== null);
        for (i=0; i<7; i++) {
            var epoch = moment(startOfWeekDate).add(i, 'days');
            var epochStr = moment(epoch).format("X");
    
            console.log( epochStr );
            console.log("    "+ moment(epoch).format("YYYY/MM/DD hh:mm:ss"));
            var breakfastYummlyID = " ";
            var lunchYummlyID = " ";
            var dinnerYummlyID = " ";

            if (userExists) {
                console.log("createAweekOfEpochKeys() mealPlanner user EXISTS")
                var epochExists = (snapshot.child(epochStr).val() !== null);
                if (epochExists) {
                  console.log("createAweekOfEpochKeys() mealPlanner epoch EXISTS")
                    breakfastYummlyID = snapshot.child(epochStr).val().breakfast.yummlyID;
                    lunchYummlyID = snapshot.child(epochStr).val().lunch.yummlyID;
                    dinnerYummlyID = snapshot.child(epochStr).val().dinner.yummlyID;
                }
                else {
                  console.log("createAweekOfEpochKeys() mealPlanner epoch NOT EXISTS")

                }
            }
            else {
                console.log("createAweekOfEpochKeys() mealPlanner user NOT EXISTS")
                var breakfast = user.mealPlan.breakfast
                mealPlanner.child(userID+"/"+epochStr).update({
                    breakfast
                });
                var lunch = user.mealPlan.lunch
                mealPlanner.child(userID+"/"+epochStr).update({
                    lunch
                });
                var dinner = user.mealPlan.dinner
                mealPlanner.child(userID+"/"+epochStr).update({
                   dinner 
                });
            }
            buildDayOfMeals(i, epoch, breakfastYummlyID, lunchYummlyID, dinnerYummlyID);

        }
    });
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function buildDayOfMeals( i, epoch, breakfastYummlyID, lunchYummlyID, dinnerYummlyID ) {
    var epochStr = moment(epoch).format("X");

    var startDay = parseInt(moment(epoch).format("DD"));
    var jq_day = $("#day" + i);
    jq_day.attr("value",epochStr);
    jq_day.prepend("<a>" + startDay + "</a>");

    // Breakfast
    var jq_newBreakfastInput = $("#breakfast" + i );
    jq_newBreakfastInput.attr( "value", "breakfast" );
    jq_newBreakfastInput.attr( "epoch", epochStr );
    jq_newBreakfastInput.attr( "yummlyid", breakfastYummlyID );
    if ( breakfastYummlyID == " " ) {
        jq_newBreakfastInput.removeClass("meal");
        jq_newBreakfastInput.addClass("no-meal");
    }
    else {
        jq_newBreakfastInput.removeClass("no-meal");
        jq_newBreakfastInput.addClass("meal");
    }

    // Lunch
    var jq_newLunchInput = $( "#lunch" + i );
    jq_newLunchInput.attr( "value", "lunch" );
    jq_newLunchInput.attr( "epoch", epochStr );
    jq_newLunchInput.attr( "yummlyid", lunchYummlyID );
    if ( lunchYummlyID == " " ) {
        jq_newLunchInput.removeClass("meal");
        jq_newLunchInput.addClass("no-meal");
    }
    else {
        jq_newLunchInput.removeClass("no-meal");
        jq_newLunchInput.addClass("meal");
    }

    // Dinner
    var jq_newDinnerInput = $( "#dinner" + i );
    jq_newDinnerInput.attr( "value", "dinner" );
    jq_newDinnerInput.attr( "epoch", epochStr );
    jq_newDinnerInput.attr( "yummlyid", dinnerYummlyID );
    if ( dinnerYummlyID == " " ) {
        jq_newDinnerInput.removeClass("meal");
        jq_newDinnerInput.addClass("no-meal");
    }
    else {
        jq_newDinnerInput.removeClass("no-meal");
        jq_newDinnerInput.addClass("meal");
    }

}


//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function genRating(rating) {
    let html = `<div> Rating: <b id='rating' value=${rating} <span>`;
    for (var i = 1, j = rating; i <= j; i++) {
        html += '<i class="fa fa-star" aria-hidden="true"></i>';
    }
    html += '</span></b></div>';
    return html;
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function selectFavorite( event ) {
    var selected = $(this);
    var selectedMeal = selected.attr("value");
    var selectedYummlyID = selected.attr("yummlyid");

    displayRecipeModal( selectedMeal, "0", selectedYummlyID );
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function displayRecipeModal( selectedMeal, selectedEpoch, selectedYummlyID ) {

    console.log( "displayRecipeModal() - " + selectedMeal + " " + selectedYummlyID );
    var queryURL = "https://api.yummly.com/v1/api/recipe/" +
                  selectedYummlyID +
                  "?_app_id=" + ourAPIid +
                  "&_app_key=" + ourAPIkey;

    $.ajax({
        type: 'GET',
        url: queryURL,
    }).then(function (result) {
        console.log(queryURL);
        var img = result.images[0].hostedSmallUrl;
        var recipe_name = result.name;
        var rating = result.rating;
        var cookTime = result.totalTimeInSeconds;
        var formattedCookTime = moment.utc(cookTime * 1000).format('HH:mm:ss');
        var link = result.attribution.url;

        var ingredientList = result.ingredientLines;
        var ingredientListArray = [];
        console.log(ingredientList);
        ingredientList.forEach(function (element) {
            ingredientListArray.push(element);
        });
        var formattedIngredients = ingredientListArray.join(', ');


        $("#myModal .modal-title").text(recipe_name);
        $("#myModal .modal-title").empty().append(`<div class='modal-title-info'>${recipe_name}</div>` +
           `<div class='modal-body-info'>` +
               `<div class="row">` +
                   `<div class="col-sm-7">` +
                       `<img src=${img}>` +
                       `<p class="modalRating">` + genRating(rating) + `</p>` + 
                       `<p class="modalCookTime"><b>Cook Time: </b>${formattedCookTime}</p>` +
                       `<p class="modalIngredientList"><b>Ingredients: </b>${formattedIngredients}</p>` +
                    `</div>` +
                   `<div class="col-sm-5">` +
                       `<p id="getRecipeBtn"><a target='_blank' href="${link}">See Full Recipe</a></p>` +
                       `<p id="selectRecipeBtn" style="cursor:pointer" data-value=${selectedYummlyID}>Search for new ${selectedMeal}</p>` +
                    `</div>` +
                `</div>` +
           `</div>`);
        if ( selectedEpoch != 0 ) {
          $("#selectRecipeBtn").addClass("visible");
        }
        else {
          $("#selectRecipeBtn").addClass("hidden");
        }

        $("#myModal").modal("show");
        $("#selectRecipeBtn").on( "click", function () {
            console.log("in display")
            window.location.href="search.html";
        });
    });
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function selectMeal( event ) {
   var selected = $(this);
   var selectedMeal = selected.attr("value");
   var selectedEpoch = selected.attr("epoch");
   var selectedYummlyID = selected.attr("yummlyid");

   event.preventDefault();
   console.log("selectMeal()");

   console.log( selectedMeal + " " + selectedEpoch + " " + selectedYummlyID );

   var searchCriteria = {
        selectedEpoch,
        selectedMeal,
        selectedYummlyID
   }
   activeSearch.child(userID).update({
       searchCriteria
   });

   if ( selectedYummlyID == " " ) { 
       window.location.href="search.html";
    }
    else {
       displayRecipeModal( selectedMeal, selectedEpoch, selectedYummlyID );
    }

}

//-------------------------------------------------------------------------------------------
//  constanly check the data base for an updated favorites 
//  and disply if within view
//-------------------------------------------------------------------------------------------
function buildFavoriteMealArea( meal ) {

    console.log("buildFavoriteMealArea() -> " + meal); 

    favorite.child( userID+"/"+meal ).on('value',function(snapshot) {
        var exists = (snapshot.val() !== null);
        if ( exists ) {
            var yumID = snapshot.val().yummlyID;
            var queryURL = "https://api.yummly.com/v1/api/recipe/" +
                           yumID +
                           "?_app_id=" + ourAPIid +
                           "&_app_key=" + ourAPIkey;

            $.ajax({
                type: 'GET',
                url: queryURL,
            }).then(function (result) {

                var jq_divID = $("#favorite-"+meal);
                jq_divID.empty();
                jq_divID.attr( "yummlyid", yumID );
                jq_divID.attr("style", "cursor:pointer");
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

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
function homepageControl() {
    
    createAweekOfEpochKeys();
    removeActiveSearchDB();
    $("#username").text(userName);
    for (i=0; i<3; i++) {
       if (i == 0) meal = "breakfast";
       if (i == 1) meal = "lunch";
       if (i == 2) meal = "dinner";
       buildFavoriteMealArea( meal );
    }

    $(".meal").on( "click", selectMeal );
    $(".no-meal").on( "click", selectMeal );
    $("#favorite-breakfast").on( "click", selectFavorite );
    $("#favorite-lunch").on( "click", selectFavorite );
    $("#favorite-dinner").on( "click", selectFavorite );
    
};

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
var meal = "default";
for (i=0; i<3; i++) {
    if (i == 0) meal = "breakfast";
    if (i == 1) meal = "lunch";
    if (i == 2) meal = "dinner";
    buildFromRandomMeal( meal );
}

$(document).ready( function() {
    
    auth.onAuthStateChanged( function(user) {
        console.log( "In onAuthStatChange() ");
    
        if (user) {
            // User is signed in.
            console.log( " current UserID -> " + user.uid );
            console.log( user );
            usersRef.child(user.uid).once( 'value', function(snapshot) {
                console.log( 'usersRef userName -> ' + snapshot.val().userName );
                userID = user.uid;
                userName = snapshot.val().userName;
                homepageControl();
            });

        } else {
           // No user is signed in.
           alert( " no current User " );
        }
    });
});