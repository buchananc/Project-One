/////////////// Global Variables /////////////////
let userData = '';
let userID = '';
let userName = '';

let searchCriteria = {
    selectedEpoch: 0,
    selectedMeal: ' ',
    selectedYummlyID: ' ',
    queryParams: '',
};

////////////////Meal Selected Function////////////////
var selectedYummlyID = ' ';

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

function mealSelected(event) {
    event.preventDefault();

    // console.log("mealSelected()");
    selectedYummlyID = $(this).attr("data-value");
    // console.log(selectedYummlyID);

    if (searchCriteria.selectedMeal == "breakfast") {
        breakfast.yummlyID = selectedYummlyID;
        mealPlanner.child(userID + "/" + searchCriteria.selectedEpoch).update({
            breakfast
        });
    } 
    else if (searchCriteria.selectedMeal == "lunch") {
        lunch.yummlyID = selectedYummlyID;
        mealPlanner.child(userID + "/" + searchCriteria.selectedEpoch).update({
            lunch
        });
    } 
    else if (searchCriteria.selectedMeal == "dinner") {
        dinner.yummlyID = selectedYummlyID;
        mealPlanner.child(userID + "/" + searchCriteria.selectedEpoch).update({
            dinner
        });
    }
    window.location.href = "homepage.html";
}

///////////////Data object constructor/////////////////////////////////////////////
function dataObj() {
    this.uid = '',
        this.foodID = '',
        this.name = '',
        this.url = '',
        this.rating = '',
        this.link = '';
}

///////////////////Rating star function, build up a star for each rating increment////////////////////////
function genRating(rating) {
    let html = `Rating: <b id='rating' value=${rating} <span>`;
    for (var i = 1, j = rating; i <= j; i++) {
        html += '<i class="fa fa-star" aria-hidden="true"></i>';
    }
    html += '</span></b>';
    return html;
}

////////////get array of results from Yummly, loop through, grab data//////////////
function showFood(result, index, array) {
    console.log(result);
    let foodID = result.id;
    let recipe_name = result.recipeName ? result.recipeName : 'Name';
    let rating = result.rating;
    let ingredientList = result.ingredients;
    let cookTime = result.totalTimeInSeconds;
    let formattedCookTime = moment.utc(cookTime * 1000).format('HH:mm:ss');
    // console.log(formattedCookTime);
    // console.log(ingredientList);
    console.log(foodID);
    let ingredientListArray = [];
    ingredientList.forEach(function (element) {
        ingredientListArray.push(element);
    });
    let formattedIngredients = ingredientListArray.join(', ');
    let link = `https://www.yummly.com/#recipe/${foodID}`;
    // console.log(link);
    let img = result.imageUrlsBySize[90];
    // selected date string
    let dateString = moment.unix(parseInt(searchCriteria.selectedEpoch)).format('MMMM DD');
    //


    /////////////push results to html//////////////////////////
    $('div.column_results').append(
        `<div class='col-sm-3'>` +
        `<div class='card' id=${foodID} data-value=${foodID}>` +
        `<div class='row'>` +
        `<div class='col-sm-12' id='cardInfo'>` +
        `<h1><span><i class='fa fa-hand-o-right' aria-hidden='true'></i></span>${recipe_name}</h1>` +
        `<img src=${img} class='recipeImage1'>` +
        `<p>` + genRating(rating) + `</p>` +
        `<button type='button' class='btn btn-primary btn-info testButton' id='button1'><i class="fa fa-external-link" aria-hidden="true"></i><span class='glyphicon glyphicon-cutlery'></span> See More</button>` +
        `<div class='modal-title-info'>${recipe_name}</div>` +
        `<div class='modal-body-info'>` +
        `<div class='row'>` +
        `<div class='col-sm-7'>` +
        `<div id='whatMeal'><b>Meal: </b>${searchCriteria.selectedMeal}</div>` +
        `<div id='whatDate'><b>Date: </b>${dateString}</div>` +
        `<img src=${img} class='recipeImage2'>` +
        `<p class='modalRating'>` + genRating(rating) + `</p>` +
        `<p class='modalCookTime'><b>Cook Time: </b>${formattedCookTime}</p>` +
        `<p class='modalIngredientList'><b>Ingredients: </b>${formattedIngredients}</p>` +
        `</div>` +
        `<div class='col-sm-5'>` +
        `<p class='btn btn-primary btn-success' id='selectRecipeButton' style='cursor:pointer' data-value=${foodID}><span class='glyphicon glyphicon-ok'></span> Select This Meal</p>` +
        `<p class='btn btn-primary btn-info' id='getRecipeBtn'><a target='_blank' href='${link}'><span class='glyphicon glyphicon-new-window'></span> See Full Recipe</a></p>` +
        `</div>` +
        `</div>` +
        `</div>` +
        `</div>` +
        `</div>` +
        `</div>` +
        `</div>` 
    );

    //////////////////create modal///////////////////
    $(".testButton").off("click");
    $(".testButton").on("click", function () {
        console.log('hello');
        $("#myModal .modal-title").empty().append($(this).siblings(".modal-title-info").clone());
        $("#myModal .modal-body").empty().append($(this).siblings(".modal-body-info").clone());
        $("#myModal").modal("show");
        //on click to db here
        $("#selectRecipeButton").on("click", mealSelected);

    });
}

//////////use searchAPI to search the Yummly API, return the recipe/food data jsonp object
function searchAPI(recipe_search, food_search) {
    $('p.search_error').empty();
    let search_params = 'default';
    if (recipe_search) {
        //use the recipe search
        search_params = recipe_search;
    } else if (food_search) {
        //Or, use the food search
        search_params = food_search;
    }
    var recipeData = $(this).attr("data-name");
    var ourAPIid = "4dced6d2";
    var ourAPIkey = "1a7e0fea32a0ad94892aaeb51b858b48";

    var queryURL = "https://api.yummly.com/v1/api/recipes" +
        "?_app_id=" + ourAPIid +
        "&_app_key=" + ourAPIkey +
        "&q=" + search_params;

    // Checks if "use your diets and allergies" box is checked and creats an updated queryURL
    if ($("#search-restrictions").is(':checked')) {
        queryURL = queryURL + searchCriteria.queryParams;
    }
    console.log(queryURL)

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: queryURL,
    }).then(function (result) {
        console.log(result);
        let results_length = result.matches.length; //saves results as a variable

        $('div.column_results').append(`Search Results (${results_length})`);
        result.matches.forEach(showFood);
    });
}

////////// search page control
function searchPageControl() {
    // Recipe/food search, search API
    $('#foodsearch').submit(function (event) {
        event.preventDefault();
        var recipe_search = $('select#recipe_search').val();
        var food_search = $('input#food_search').val();
        if (recipe_search && food_search) {
            $('p.search_error').text("Please only choose recipes OR food search. Click the clear button to start over.");
        } else if (recipe_search || food_search) {
            $('div.column_results').empty();
            searchAPI(recipe_search, food_search);
        } else {
            $('p.search_error').text("Please choose from either recipes OR food type.");
        }
    });
}

//////////erase before pushing///////////////////
// $(document).ready(function () {
// searchPageControl();
// });
/////////////////end erase//////////////

/////////////////////Document Section////////////////////////////////////
$(document).ready(function () {

    ////////////link to profile page///////////////////
    $("#username").on("click", function () {
        window.location.href = "profile.html";
    });

    //////////////Restriction Sidebar////////////////////////
    $('#sidebarCollapse').on('click', function () {
        $("#sidebarCollapse").removeClass("active");
        $('#sidebar').toggleClass('active');
    });
    //Pull user id and name from db, display, 
    //then using callback enable search page functionality
    auth.onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            usersRef.child(user.uid).once('value', function (snapshot) {
                userID = user.uid;
                userName = snapshot.val().userName;
                $("#username").text(userName);

                activeSearch.child(userID).once('value', function (activeSearchSnapshot) {
                    searchCriteria = activeSearchSnapshot.val().searchCriteria;

                    console.log("selectedEpoch -> " + searchCriteria.selectedEpoch);
                    console.log("selecedMeal -> " + searchCriteria.selectedMeal);
                    console.log("selectedYummlyID -> " + searchCriteria.selectedYummlyID);

                    searchPageControl();
                    searchCriteria.queryParams = checkForRestrictions(snapshot);
                });

            });
        } else {
            alert("no current User");
        }
    });

})

// Function for desplaying diets and allergies and creating query parameters for including diets and allergies
function checkForRestrictions(snapshot) {

    console.log('snapshot', snapshot);
    // Pull data from database into variables
    var userDiets = snapshot.val().restrictions.diets;
    var userAllergies = snapshot.val().restrictions.allergies;
    // New variable for query parameter
    var queryParams = [];

    // Append diets from Firebase into selected-diets div
    for (var i = 0; i < userDiets.length; i++) {
        $("#selected-diets").append(userDiets[i].label + "/ ")
    }

    // Append diets from Firebase into selected-allergies div
    for (var j = 0; j < userAllergies.length; j++) {
        $("#selected-allergies").append(userAllergies[j].label + "/ ")
    }

    // Checks if 
    if (userDiets[0].id !== '0') {
        // Loops through the diets array of objects and concatenates ids and lebles into search queries
        for (var i = 0; i < userDiets.length; i++) {
            // Saving label to a variable
            var label = userDiets[i].label;
            // Chacking id diet's id is 387 and changes label 'Vegitarian' to "Lacto-ovo vegetarian" (API docs' requirement)
            if (userDiets[i].id == "387") {
                label = "Lacto-ovo vegetarian";
            }
            // Puts pieces of guery parameters together
            queryParams.push('&allowedDiet[]=' + userDiets[i].id + "^" + label);
        }
    }
    if (userAllergies[0].id !== '0') {
        // Loops through the allergies array of objects and concatenates ids and lebles into search queries
        for (var j = 0; j < userAllergies.length; j++) {
            // Puts pieces of guery parameters together
            queryParams.push('&allowedAllergy[]=' + userAllergies[j].id + "^" + userAllergies[j].label + '-Free');
        }
    }

    console.log(queryParams.join(''))
    // Returns combined query parameters in a string 
    return queryParams.join('');
};
