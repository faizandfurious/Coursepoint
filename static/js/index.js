
var login_page = $("#login_content");
var class_list_page = $("#class_list_content");
var quiz_page = $("#quiz_content");
var menu_button = $("#menu_button");
var add_class_button = $("#add_class_button");
// BIND MENU ACTIONS
var menuOpen = false;



$(document).ready(function(){
    showLogin();
    getData();
});

//If HTML is clicked, hide the side menu (if necessary)
$('html').click(function() {
    if(menuOpen){
        toggleMenu();
    }
 });

function hideTopbarButtons(){
    menu_button.hide();
    add_class_button.hide();
}

function showTopbarButtons(){
    menu_button.show();
    add_class_button.show();
}

function showLogin(){
    class_list_page.hide();
    quiz_page.hide();
    login_page.show();
    hideTopbarButtons();
    addGatesImageToBody();
}

function addGatesImageToBody(){
    $("body").css({
        'overflow':'hidden',
        'background-image': 'url("../styles/images/ghc.jpg")',
        'background-repeat':'no-repeat',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
    });
}

function addGradientToBody(){
    $("body").css({
        'overflow':'',
        'background-image':'',
        'border-bottom': '1px solid #ddd',
        /* fallback */
        'background-color': '#F2F2F2',
        'background-repeat': 'repeat-x',
        /* Safari 4-5, Chrome 1-9 */
        'background': '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#F2F2F2), to(#E6E6E6))',
        /* Safari 5.1, Chrome 10+ */
        'background': '-webkit-linear-gradient(top, #F2F2F2, #E6E6E6)',
        /* Firefox 3.6+ */
        'background': '-moz-linear-gradient(top, #F2F2F2, #E6E6E6)',
        /* IE 10 */
        'background': '-ms-linear-gradient(top, #F2F2F2, #E6E6E6)',
        /* Opera 11.10+ */
        'background': '-o-linear-gradient(top, #F2F2F2, #E6E6E6)'
    });
}

function showClass(){
    class_list_page.show();
    quiz_page.hide();
    login_page.hide();
    showTopbarButtons();
    addGradientToBody();
}


function showQuiz(){
    class_list_page.hide();
    quiz_page.show();
    login_page.hide();
    showTopbarButtons();
    addGradientToBody();
}

//THIS CODE IS FOR THE CLASS LIST PAGE
$("#menu_button").click(function(){
    toggleMenu();
});

$("#home_button").click(function(){
    toggleMenu();
    showClass();
});

$("#logout_button").click(function(){
    toggleMenu();
    showLogin();
});


function toggleMenu(){
    menuOpen = !menuOpen;
    if (menuOpen){
        $("#menu").animate({left:0});
    }
    else{
        $("#menu").animate({left:-230});
    }
    event.stopPropagation();
}
 $('#menu').click(function(event){
    event.stopPropagation();
 });

$("#add_class_button").click(function(){
    console.log("add class button clicked");
});

$("#0").click(function(){
    console.log("test");
    //Put in request to get class information
    getClass(0);


    showQuiz();

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
        showClass();
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