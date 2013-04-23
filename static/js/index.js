var login_page = $("#login_content");
var class_list_page = $("#class_list_content");
var quiz_page = $("#quiz_content");
var menu_button = $("#menu_button");
var add_class_button = $("#add_class_button");

// BIND MENU ACTIONS
var menuOpen = false;

var student;
var courses;


$(document).ready(function(){
    showLogin();
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
    add_class_button.hide();
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
        $("#menu").animate({right:0});
    }
    else{
        $("#menu").animate({right:-230});
    }
}


$("#add_class_button").click(function(){
    console.log("add class button clicked");
    addCourse();
});

$(".class_item").click(function(){
    name = $(this).attr(id);
    console.log(name);
    //Put in request to get class information
    getClass(name);


    showQuiz();
});

//This method shows which answer was selected, and adds feedback to the UI.
$(".quiz_answer").click(function(){
    var selected_id = $(this).attr("id");
    var siblings = $(this).parent().children();
    siblings.css({'background-color':'#eeeeee',
                'color':'#333'});
    $(this).css({'background-color':'#727272',
                'color':'#ffffff'});

    console.log("Answer chosen is " + selected_id);
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
        loadStudentData(values["username"]);
        console.log("test");
        showClass();
        $("#user_name_item").html(values["username"]);
    }
});




//load student info and all courses for that student
function loadStudentData (username) {
    $.ajax({
        type: "post",
        data: {username: username},
        url: "/student",
        success: function(response){
            student = response.data.student;
            console.log("success");
            console.log(student);
            refreshCourseList();
        }
    });
    // getCourses();
  
}

//ROUTES FOR DATA AND STUFF
//Get a specific class via the ID
function getClass(id){
    $.ajax({
        type: "get",
        url:"/course/" + id,
        success: function(data){
            console.log(data);
        }
    });
}

//Get all the data
function getData(){
    $.ajax({
        type: "get",
        url:"/all_data",
        success: function(data){
            console.log(data);
        }
    });
}

function getCourses(){
    $.ajax({
        type: "get",
        url:"/courses",
        success: function(data){
            console.log(data);
        }
    });
}

function addCourse(){
    console.log(student._id);
    $.ajax({
        type: "post",
        data: {student_id : student._id,
                course_id : 1},
        url: "/add_course",
        success: function(data){
            refreshCourseList();
        }
    })
}

function refreshCourseList() {
    console.log("refreshed");
    if(student["courses"] === undefined)
        return;

    student["courses"].forEach( function(course) {
        var classli = $('<li>').html("").addClass("class_item").attr("id","calculus");
        classli.addClass("class grey_drop");
        classli.append($('<span>').html("").addClass("class_image"));
        classli.append($('<span>').html(course["name"]).addClass("class_name"));
        classli.append($('<span>').html(course["location"]).addClass("class_location"));
        classli.append($('<span>').html(course["time"]).addClass("class_time"));
        classli.append($('<span>').html("").addClass("arrow"));
        $("#classes").append(classli);
        classli.click(function(){
            name = $(this).attr("id");
            console.log(name);
            //Put in request to get class information
            getClass(name);
            showQuiz();
        });

    });

/*
    for(var i = 0; i < 4; i++){
        var classli = $('<li>').html("").addClass("class_item").attr("id","Calculus");
        classli.addClass("class grey_drop");
        classli.append($('<span>').html("").addClass("class_image"));
        classli.append($('<span>').html("Test " + i).addClass("class_name"));
        classli.append($('<span>').html("Test " + i).addClass("class_location"));
        classli.append($('<span>').html("Test " + i).addClass("class_time"));
        classli.append($('<span>').html("").addClass("arrow"));
        $("#classes").append(classli);
        classli.click(function(){
            name = $(this).attr("id");
            console.log(name);
            //Put in request to get class information
            getClass(name);
            showQuiz();
        });
    }
*/
}
