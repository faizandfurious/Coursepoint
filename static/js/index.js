var socket = io.connect("http://localhost:8888");
var login_page = $("#login_content");
var class_list_page = $("#class_list_content");
var quiz_page = $("#quiz_content");
var menu_button = $("#menu_button");
var back_button = $("#back_button");
var add_class_button = $("#add_class_button");
var timer = $("#timer");

// BIND MENU ACTIONS
var menuOpen = false;

var student;
var courses;


$(document).ready(function(){
    hideTopbarButtons();
    refreshCourseList();
    getCourses();
    showLogin();
});

function hideTopbarButtons(){
    menu_button.hide();
    add_class_button.hide();
    back_button.hide();
    timer.css("visibility","hidden");
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
    refreshCourseList();
    class_list_page.show();
    quiz_page.hide();
    login_page.hide();
    showTopbarButtons();
    addGradientToBody();
    back_button.hide();
    timer.css("visibility","hidden");
}

function showQuiz(){
    class_list_page.hide();
    quiz_page.show();
    login_page.hide();
    showTopbarButtons();
    add_class_button.hide();
    addGradientToBody();
    back_button.show();
    timer.css("visibility","visible");
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

back_button.click(function(){
    showClass();
})


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
    }
});




//load student info and all courses for that student
function loadStudentData (username) {
    $.ajax({
        type: "post",
        data: {username: username},
        url: "/student",
        success: function(response){
            console.log(response);
            student = response.data.student;
            console.log("success");
            console.log(student);
            $("#user_name_item").html(username);
            refreshCourseList();
        }
    });
  
}

//ROUTES FOR DATA AND STUFF

//SOCKET MESSAGES
socket.on("newquestions", function(data) {
    console.log("new socket message: "+data.qids);
    var qids = [];
    qids.push(data.qids);
    getQuestions(qids);
});


//Get a specific class via the ID
function getClass(id){
    $.ajax({
        type: "get",
        url:"/course/" + id,
        success: function(data){
            return data;
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

//takes an array of qid's and gets corresponding questions
function getQuestions(questions) {
    console.log("getting: "+questions);
    $.ajax({
        type:"post",
        url:"/questions",
        data:{questions : questions},
        success: function(data){
            console.log(data);
            //handle questions here
        }
    });
}


function getCourses(){
    $.ajax({
        type: "get",
        url:"/courses",
        success: function(data){
            for(i in data.data){
                console.log(data.data[i]);
            }
            courses = data.data;
        }
    });
}

function addCourse(){
    console.log("student");
    console.log(student.username);
    $.ajax({
        type: "post",
        data: {student_name : student.username,
                course_id : "517e6ffbcdef73896e000002"},
        url: "/add_course",
        success: function(data){
            console.log("updated");
            student = data.student;
            refreshCourseList();
            console.log(data);
        }
    })
}

function removeCourse(){
    $.ajax({
        type: "post",
        data: {student_name : student.username,
                course_id : "517e6ffbcdef73896e000002"},
        url: "/remove_course",
        success: function(data){
            console.log("updated");
            student = data.student;
            refreshCourseList();
            console.log(data);
        }
    })
}

function refreshCourseList() {
    $("#classes").html("");
    if(!student)
        return;
    if(student["courses"] === undefined)
        return;
    

    student.courses.forEach( function(course) {
        console.log("course: " + course);
        if(course){
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
        }

    });
}

function startQuiz(time){
    $("#timer").html("");
    $("#timer").css("color","green");

    var quizInterval = setInterval(function(){
        if(time < 16){
            $("#timer").css("color","red");
        }
        if(time <= 0){
            clearInterval(quizInterval);
        }
        if(time > 59){
            var min = Math.floor(time/60);
            var sec = time%60;
            if(sec < 10){
                sec = "0" + sec;
            }
            $("#timer").html(min + ":" + sec);
        }
        else{
            var sec = time%60;
            if(sec < 10){
                sec = "0" + sec;
                console.log(sec);
            }
            $("#timer").html("0:" + sec);
        }
        time--;
    }, 1000);
}

