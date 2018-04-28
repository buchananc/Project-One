//------------------------------------------------
//  User types in response
//------------------------------------------------

//create an array for recipes
var recipes = [];

//function for displaying recipe choices
function recipeChoices() {

    //function to delete recipeOption div
    $("#recipeOptions").empty();

    //Loops through recipe array
    for (var i = 0; i < recipes.length; i++) {
        var recipeImg = $("<img>");
        recipeImg.addClass("recipeImage"); //adds a class
        recipeImg.attr("data-name", recipes[i]); //adds a data-attribute
        recipeImg.text(recipes[i]); //adds text to recipe image
        //adding the button to the HTML
        $("#recipeOptions").prepend(recipeImg); //prepends new images to recipeImage div
    }
}

//------------------------------------------
//  Add recipe event
//------------------------------------------

//This function handles image event
$("#addRecipe").on("click", function () {
    event.preventDefault();

    var recipeInput = $("#recipeSearch").val().trim(); //grabs user input
    recipes.push(recipeInput); //add user input to array
    recipeChoices(); //call recipeChoices to make images for all the recipes
    $("#recipeSearch").val("");
});

console.log(recipes);
//------------------------------------------------------------------------------------
//  Display images/recipes from yummly API
//------------------------------------------------------------------------------------
function showImages() {
    var recipeData = $(this).attr("data-name");
    var ourAPIid = "4dced6d2";
    var ourAPIkey = "1a7e0fea32a0ad94892aaeb51b858b48";

    var queryURL = "https://api.yummly.com/v1/api/recipes" +
        "?_app_id=" + ourAPIid +
        "&_app_key=" + ourAPIkey +
        "&q=" + recipeInput;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var results = response.matches; //saves results as a variable
        for (var j = 0; j < results.length; j++) { //looping over every recipe
            var imgDiv = $("<div class='recipe'>"); //creates a div with the class "recipe"
            var showTheImages = $("<img>");
            var p = $("<p>").text(" " + results[i].recipeName); //will give recipe name
            var rating = $("<p>").text(" " + results[i].rating); //will give recipe rating
            showTheImages.attr("src", results[i].images.fixed_height_still.url); //will need to change to fit parameters of recipe images
            showTheImages.attr("data-id", results[i].id); //give data-attr of current meal id, for future query reference



            //-----------------------show rating on hover---------------------------------
            // showGifs.attr("title", "Rating: " + results[i].rating);
            // showGifs.attr("data-still", results[i].images.fixed_height_still.url);
            // showGifs.attr("data-state", "still");
            // showGifs.addClass("gif");
            // showGifs.attr('data-animate', results[i].images.fixed_height.url);
            // gifDiv.append(p);
            // gifDiv.append(showGifs);
            // $("#animalGifs").prepend(gifDiv); //had prepend here before


        }
        console.log("response -> " + response);
        console.log(JSON.stringify(response));
        console.log(recipeName);
    });
}
/////////////////// Show Gifs //////////////////////
$(document).on("click", ".recipe", showImages);

recipeChoices();

