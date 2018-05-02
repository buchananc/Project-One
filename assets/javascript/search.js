/////////////// Global Variables /////////////////
let userData = '';
let userID = "";
let userName = "";

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
    console.log(formattedCookTime);
    console.log(ingredientList);
    let ingredientListArray = [];
    ingredientList.forEach(function (element) {
        ingredientListArray.push(element);
    });
    let formattedIngredients = ingredientListArray.join(', ');
    let link = `https://www.yummly.com/#recipe/${foodID}`;
    console.log(link);
    let img = result.imageUrlsBySize[90];

    /////////////push results to html//////////////////////////
    $('div.column_results').append(
        `<div class='card' id=${foodID} data-value=${foodID}` +
        `><div><span><i class='fa fa-hand-o-right' aria-hidden='true'></i></span>${recipe_name}` +
        "</div><div>" +
        `<img src=${img}` + "><p>" + //adds image
        genRating(rating) + //adds rating stars
        `</p></div><div><button type='button' class='btn btn-info btn-lg trigger testButton' id='button1'><i class="fa fa-external-link" aria-hidden="true"></i>View More Information</button><div class='modal-title-info'>${recipe_name}</div><div class='modal-body-info'>` +
        `<img src=${img}` + "><p>" + //adds image
        `<p class='modalRating'>${rating}</p>` +
        `<p class="modalCookTime">${formattedCookTime}</p>` +
        `<p class="modalIngredientList">${formattedIngredients}</p>` +
        `<button class="recipeButtonLink">` +
        `<a target='_blank' href="${link}">View Recipe!</a></div></div>`);

    //////////////////create modal///////////////////
    $(".testButton").off("click");
    $(".testButton").on('click', function () {
        console.log('hello');
        // $("#myModal .modal-title").text(recipe_name);
        $("#myModal .modal-title").empty().append($(this).siblings(".modal-title-info").clone());
        $('#myModal .modal-body').empty().append($(this).siblings(".modal-body-info").clone());
        $("#myModal").modal("show");
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

/////////////////////Document Section////////////////////////////////////
$(document).ready(function () {

    /////////////////////Pull user id and name from db, display, 
    /////////////////////   then using callback enable search page functionality
    auth.onAuthStateChanged( function(user) {
        if (user) {
            // User is signed in.
            usersRef.child(user.uid).once( 'value', function(snapshot) {
                userID = user.uid;
                userName = snapshot.val().userName;
                $("#username").text(userName);

                searchPageControl();

            });
        } else {
            alert( "no current User" );
        }
    });

})