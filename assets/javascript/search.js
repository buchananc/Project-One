/////////////// Global Variables /////////////////
let userData = '';

//Data object constructor
function dataObj() {
    this.uid = '',
        this.foodID = '',
        this.fromElement = '',
        this.toElement = '',
        this.name = '',
        this.url = '',
        this.rating = '',
        this.link = ''
}

// --Rating star function, build up a star for each rating increment, return the appropriate html
function genRating(rating) {
    let html = `Rating: <b id='rating' value=${rating} <span>`;
    for (var i = 1, j = rating; i <= j; i++) {
        html += '<i class="fa fa-star yellow" aria-hidden="true"></i>';
    }
    html += '</span></b>';
    return html;
}

//get array of results from Yummly, loop through, grab data

function showFood(result, index, array) {
    let foodID = result.id;
    let recipe_name = result.recipeName = result.recipeName ? result.recipeName : 'Name';
    let rating = result.rating;

    let link = `https://www.yummly.com/recipes?q=`;
    let encoded_name = encodeURIComponent(recipe_name);
    link += encoded_name;
    let img = result.imageUrlsBySize[90];


    $('div.column_results').append(
        `<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all card' id=${foodID} data-value=${foodID}` +
        `><div class='portlet-header ui-widget-header ui-sortable-handle ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle'><i class='fa fa-hand-o-right' aria-hidden='true'></i></span>${recipe_name}` +
        "</div><div class='portlet-content'>" +
        `<img src=${img}` + "><p>" +
        genRating(rating) +
        `</p></div><div><a href="${link}" target='_blank' class="external_link"><i class="fa fa-external-link" aria-hidden="true"></i> View Recipe </a></div>`);
}
// var newCard = $('<div>').attr('data-value', result[i].id).addClass('card');

// --searchAPI to search the Yummly API, return the recipe/food data jsonp object
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

    $.ajax({
        type: 'GET',
        url: queryURL,
        //dataType: 'jsonp'
    }).then(function (result) {
        console.log(result);
        let results_length = result.matches.length; //saves results as a variable
        
        $('div.column_results').append(`Search Results (${results_length})`);
        result.matches.forEach(showFood);
     }); 
}


// --Document Section--
$(document).ready(function () {
    // Recipe/food search, search API from form
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
});



























//------------------------------------------------
//  User types in response
//------------------------------------------------

// //create an array for recipes
// var recipes = [];

// //function for displaying recipe choices
// function recipeChoices() {

//     //function to delete searchResults div
//     $("#searchResults").empty();

//     //Loops through recipe array
//     for (var i = 0; i < recipes.length; i++) {
//         var recipeImg = $("<img>");
//         recipeImg.addClass("recipeImage"); //adds a class
//         recipeImg.attr("data-name", recipes[i]); //adds a data-attribute
//         recipeImg.text(recipes[i]); //adds text to recipe image
//         //adding the button to the HTML
//         $("#searchResults").prepend(recipeImg); //prepends new images to recipeImage div
//     }
// }

// //------------------------------------------
// //  Add recipe event
// //------------------------------------------

// //This function handles image event
// $("#addRecipe").on("click", function () {
//     event.preventDefault();

//     var recipeInput = $("#recipeSearch").val().trim(); //grabs user input
//     recipes.push(recipeInput); //add user input to array
//     recipeChoices(); //call recipeChoices to make images for all the recipes
//     $("#recipeSearch").val("");
// });

// console.log(recipes);
// //------------------------------------------------------------------------------------
// //  Display images/recipes from yummly API
// //------------------------------------------------------------------------------------
// function showImages() {
//     var recipeData = $(this).attr("data-name");
//     var ourAPIid = "4dced6d2";
//     var ourAPIkey = "1a7e0fea32a0ad94892aaeb51b858b48";

//     var queryURL = "https://api.yummly.com/v1/api/recipes" +
//         "?_app_id=" + ourAPIid +
//         "&_app_key=" + ourAPIkey +
//         "&q=" + recipeInput;

//     $.ajax({
//         url: queryURL,
//         method: "GET"
//     }).then(function (response) {
//         console.log(response);
//         var results = response.matches; //saves results as a variable
//         for (var j = 0; j < results.length; j++) { //looping over every recipe
//             var imgDiv = $("<div class='recipe'>"); //creates a div with the class "recipe"
//             var showTheImages = $("<img>");
//             var p = $("<p>").text(" " + results[i].recipeName); //will give recipe name
//             var rating = $("<p>").text(" " + results[i].rating); //will give recipe rating
//             showTheImages.attr("src", results[i].images.fixed_height_still.url); //will need to change to fit parameters of recipe images
//             showTheImages.attr("data-id", results[i].id); //give data-attr of current meal id, for future query reference



//             //-----------------------show rating on hover---------------------------------
//             // showGifs.attr("title", "Rating: " + results[i].rating);
//             // showGifs.attr("data-still", results[i].images.fixed_height_still.url);
//             // showGifs.attr("data-state", "still");
//             // showGifs.addClass("gif");
//             // showGifs.attr('data-animate', results[i].images.fixed_height.url);
//             // gifDiv.append(p);
//             // gifDiv.append(showGifs);
//             // $("#animalGifs").prepend(gifDiv); //had prepend here before


//         }
//         console.log("response -> " + response);
//         console.log(JSON.stringify(response));
//         console.log(recipeName);
//     });
// }
// /////////////////// Show Gifs //////////////////////
// $(document).on("click", ".recipe", showImages);

// recipeChoices();