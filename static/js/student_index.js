var socket = io.connect("http://localhost:8888");
var login_page = $("#login_content");
var class_list_page = $("#class_list_content");
var quiz_page = $("#quiz_content");
var menu_button = $("#menu_button");
var back_button = $("#back_button");
var add_class_button = $("#add_class_button");
var timer = $("#timer");
var class_selector = $("#class_selection_pane");
var course_list = $("#course_list");

// BIND MENU ACTIONS
var menuOpen = false;

var student;
var courses;


$(document).ready(function(){
    hideTopbarButtons();
    refreshCourseList();
    getCourses();
    showLogin();
    createQuiz();
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
    class_selector.hide();
    login_page.show();
    hideTopbarButtons();
    addGatesImageToBody();
}

function addGatesImageToBody(){
    $("body").css({
        'overflow':'hidden',
        'background-image': 'url("../../styles/images/ghc.jpg")',
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
    populateCourseSelection();
    if(class_selector.css("display") === "none"){
        class_selector.show();
        add_class_button.css("background-image", 'url("../../styles/images/close_button.png")');
    }
    else{
        class_selector.hide();
        add_class_button.css("background-image", 'url("../../styles/images/add_button.png")');
    }
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
            populateCourseSelection();
        }
    });
  
}

//ROUTES FOR DATA AND STUFF

//SOCKET MESSAGES
socket.on("newquestions", function(data) {
    console.log("new socket message: "+data.questions);
    var qids = data.questions;
    var time = data.time;
    getQuestions(qids, time);
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
function getQuestions(questions, time) {
    console.log("getting: "+questions);
    $.ajax({
        type:"post",
        url:"/questions",
        data:{questions : questions},
        success: function(data){
            console.log(data);
            //handle questions here
            createQuiz(data);
            startQuiz(data.questions, time);
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

function addCourse(course_id){
    console.log("student");
    console.log(student.username);
    $.ajax({
        type: "post",
        data: {student_name : student.username,
                course_id : course_id},
        url: "/add_course",
        success: function(data){
            console.log("updated");
            student = data.student;
            refreshCourseList();
            console.log(data);
        }
    })
}

function removeCourse(course_id){
    $.ajax({
        type: "post",
        data: {student_name : student.username,
                course_id : course_id},
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

function startQuiz(questions, time){
    $("#timer").html("");
    $("#timer").css("color","green");

//this timer code was adapted from the example in
//http://www.sitepoint.com/creating-accurate-timers-in-javascript/    
    var start = new Date().getTime()+time*1000;

    var quizTimer = setInterval(function() {
        var timeLeft = start - (new Date().getTime());
        if(timeLeft <= 0) {
            timeLeft = 0;
        } 
        
        var display = Math.floor(timeLeft / 1000);

        if(display < 16){
            $("#timer").css("color","red");
        }
           
        var min = Math.floor(display/60);
        var sec = display%60;
        if(sec < 10){
            sec = "0" + sec;
        }
        $("#timer").html(min + ":" + sec);

        
        if(timeLeft <= 0) {
            clearInterval(quizTimer);
            sendResponses(questions);
        }
    }, 100);
    
}

function sendResponses(questions) {
    var responses = collectResponses(questions);
    
    $.ajax({
        type : "post",
        url : "/studentResponse",
        data : {username : student["username"],
                responses : responses},
        success : function(data) {
            showAnswers(data.answers);
        }
    });

}

function collectResponses(questions) {
    var responses=[];

/*    while(questions.length >0) {
        question = questions.pop();*/
        var question = questions; //just handle one question for now
        choiceList = $("#"+question);
        console.log(choiceList);
        var choices = choiceList.children().toArray()
        while(choices.length >0) {
            child = choices.pop();
            if(child.style.background === "rgb(114, 114, 114)") {
                responses[question["question_id"]] = child.id;    
            }
        }
//    }

    return responses;
   
}


function createQuiz(data){
    console.log(data.data.question);
    var question = data.data.question;
    var question_container = $("<div class='question'></div>");
    var question_h3 = $("<h3></h3>").html("Question");
    var question_prompt = $("<p id='question_prompt'></p>").html(question.body);
    var answer_h3 = $("<h3></h3>").html("Answer");
    var ul = $("<ul id='' class='answer_list'></ul>");
    for(var i = 0; i < question.choices.length; i++){
        var li = $("<li id='' class='quiz_answer'></li>").html(question.choices[i]);
        li.click(function(){
            var selected_id = $(this).attr("id");
            console.log(selected_id);
            var siblings = $(this).parent().children();
            
            siblings.css({'background-color':'#eeeeee',
                'color':'#333'});
            $(this).css({'background-color':'#727272',
                'color':'#ffffff'});
        });
        ul.append(li);
    }
    question_container.append(question_h3, question_prompt, answer_h3, ul);
    $("#quiz_content").append(question_container);
}
function showAnswers(answers) {
    //highlights correct answer for each question
}

function populateCourseSelection(){
    course_list.html("");
    courses.forEach(function(course){
        console.log(course);
        var classli = $('<li>').html("").attr("id",course._id);
        classli.append($('<span>').html(course.name));
        var found = false;
        var button;
        student.courses.forEach(function(stu_course){
            if(!found){

                console.log("The Ids");
                console.log(stu_course.course_id);
                console.log(course.course_id);
                if(stu_course.course_id === course.course_id){
                    found = true;
                    button = $('<button class="btn red-btn">').html("Delete");
                    button.click(function(){
                        removeCourse(course._id);
                    });
                }
            }
        });
        if(!found){
            button = $('<button class="btn green-btn">').html("Sign Up");
                button.click(function(){
                    addCourse(course._id);
                });
        }
        classli.append(button);
        course_list.append(classli);
    });
}

