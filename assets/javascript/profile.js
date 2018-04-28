// function to get data from checkboxes
function selectDiet(){
    // declare an checkbox array 
	var diets = [];
	
	// look for all checkboes that have a class 'chk' attached to it and check if it was checked 
	$(".disable:checked, #no-diet:checked").each(function() {
		diets.push($(this).val());
	});
    
    console.log(diets)

	// check if there is selected checkboxes
	if(diets.length > 0){
		console.log("You have selected " + diets);	
	}else{
		console.log("Please at least check one of the checkbox");	
    }
    return diets;
};

// function to get data from checkboxes
function selectRestrictions(){
    /* declare an checkbox array */
	var restrictions = [];
	
	/* look for all checkboes that have a class 'chk' attached to it and check if it was checked */
	$(".restriction:checked, #no-restriction:checked").each(function() {
		restrictions.push($(this).val());
	});
    
    console.log(restrictions);
	
	
	// check if there is selected checkboxes
	if(restrictions.length > 0){
		console.log("You have selected " + restrictions);	
	}else{
		console.log("Please at least check one of the checkbox");	
    }
    return restrictions;
};

$("#image_uploads").on("change", function(){
    var avatar = $("#image_uploads").prop("files")[0];
    var profilePicture = $(".avatar");
    var reader = new FileReader;
    var img = $("<img>");

    reader.addEventListener("load", function() {
        img.attr('src', reader.result);
        img.attr('id', "profile-preview")
        profilePicture.html(img);
    });

    if (profilePicture) {
        reader.readAsDataURL(avatar);
    }
})

// Changes content on the screen after 'Save' button is cklicked
$("#save").on("click", function () {
    $(".profile-page").attr("id", "visible");
    $(".edit-profile").removeAttr("id", "visible");

    //return input from user
    var avatar = $("#image_uploads").prop("files")[0];
    var bio = $("#bio").val().trim();
    console.log(avatar);
    console.log(bio);

    var diets = selectDiet();
    var restriction = selectRestrictions();
});

// if 'No Diet' is checked other checkboxes are disabled
$("#no-diet, #no-restriction").change(function(){
    var noDiet = $("#no-diet");
    var dietChoise = $(".disable");

    if (noDiet.is(':checked')) {
        console.log(noDiet.is(':checked'));
        dietChoise.prop('checked', false);
        dietChoise.prop('disabled', true);
    }
    else {
        dietChoise.prop('disabled', false);
    }

    var noRestriction = $("#no-restriction");
    var restrictionChise = $(".restriction")

    if (noRestriction.is(':checked')) {
        console.log(noRestriction.is(':checked'));
        restrictionChise.prop('checked', false);
        restrictionChise.prop('disabled', true);
    }
    else {
        restrictionChise.prop('disabled', false);
    }
})

