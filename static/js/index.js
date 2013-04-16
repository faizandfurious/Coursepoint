
var login_page = $("#login_content");
var class_list_page = $("#class_list_content");
var quiz_page = $("#quiz_content");


$(document).ready(function(){
    class_list_page.hide();
    quiz_page.hide();
    getData();
});


//THIS CODE IS FOR THE CLASS LIST PAGE
$("#menu_button").click(function(){
    console.log("menu button clicked");
});


$("#add_class_button").click(function(){
    console.log("add class button clicked");
});

$("#0").click(function(){
    console.log("test");
    //Put in request to get class information
    getClass(0);


    class_list_page.hide();
    quiz_page.show();

});


//THIS CODE IS FOR THE LOGIN PAGE
$("#sign_in_button").click(function(){
    // get all the inputs into an array.
    var $inputs = $('#sign_in_form :input');
    var login_successful = false;

    //This object holds the username and password used to sign in with.
    var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
        login_successful = true;
    });

    if(login_successful){
        login_page.hide();
        class_list_page.show();
    }
});




//ROUTES FOR DATA AND STUFF
//Get a specific class via the ID
function getClass(id){
    $.ajax({
        type: "get",
        url:"/get_class_" + id,
        success: function(data){
            console.log(data);
        }
    })
}

//Get all the data
function getData(){
    $.ajax({
        type: "get",
        url:"/all_data",
        success: function(data){
            console.log(data);
        }
    })
}