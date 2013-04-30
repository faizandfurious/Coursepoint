var socket = io.connect("http://localhost:8888");
var timer = $("#timer");
var class_selector = $("#class_selection_pane");
var course_list = $("#course_list");

var courses;


$(document).ready(function(){
    hideTopbarButtons();
    refreshCourseList();
    getCourses();
    $("#course_form").hide();
});

function hideTopbarButtons(){

}

function showTopbarButtons(){

}

function showLogin(){

}


function showClass(){

}

function showQuiz(){

}


function toggleMenu(){

}


$("#add_class_button").click(function(){

});

$(".class_item").click(function(){

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




//load student info and all courses for that student
function loadStudentData (username) {

  
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
            populateCourseSelection();
        }
    });
}



function addCourse(course_id){

}

function removeCourse(course_id){

}

function refreshCourseList() {

}

function startQuiz(time){

}

function populateCourseSelection(){
    course_list.html("");
    courses.forEach(function(course){
        console.log(course);
        var classli = $('<li>').html("").attr("id",course._id);
        classli.css("")
        classli.append($('<span>').html(course.name));
        classli.click(function(){
            $("#course_list").children("*").css("background-color", "#aaa");
            $(this).css("background-color", "orange");
            $("#course_form").fadeOut();
            var main = $("#main");
            main.fadeOut(function(){
                var course_container = $("<div id='course_container'></div>");
                main.html("");
                var title = $("<h1 id = 'course_title'></h1>").html(course.name);
                course_container.append(title);
                var course_info = $("<div id='course_info'></div>");
                var location = $("<div id= 'course_location' class='class_item'></div>").html(course.location);
                var time = $("<div id= 'course_time' class='class_item'></div>").html(course.time);
                course_info.append(location, time);
                course_container.append(course_info);
                main.append(course_container);
                $("#main").fadeIn();
            });
        });
        course_list.append(classli);
    });
    var add_button = $('<li>').html("Add a Course").attr("id", "add_class");

    //This listener waits for the user to click the Add A Course button on the left hand side.
    //When it is clicked, we dynamically create the course form.
    add_button.click(function(){
        //Set all of the buttons on the left hand side (except the one clicked) to grey. The current
        //tab button will be orange.
        $("#course_list").children("*").css("background-color", "#aaa");
        $(this).css("background-color", "orange");
        var main = $("#main");
        main.fadeOut(function(){
            var course_container = $("<div id='course_container'></div>");
            main.html("");
            var title = $("<h1 id = 'course_title'></h1>").html("Create a Course");
            course_container.append(title);
            var form = $("<form id='course_form'</form>");
            var name_input = $("<input type='text' name='name' placeholder='Course Name' autofocus><br>");
            var location_input = $("<input type='text' name='location' placeholder='Course Location'><br>");
            var time_input = $("<input type='text' class= 'required' name='time' placeholder='Course Time'><br>");
            var create_course_button = $("<button id='course_create_button' class='submit btn blue-btn' type='submit' name='submit'>Create</button>");
            form.append(name_input, location_input, time_input, create_course_button);
            //This method listens for the create button in the add a course form to be pressed. Once it is,
            //it attempts to gather the values and create a new course.
            create_course_button.click(function(){
                sendCourseData();
                return false;
            });

            main.append(course_container, form);
            $("#main").fadeIn();
            $("#course_form").fadeIn();
            //Validations for the course form
            $("#course_form").validate({
                   rules: {
                    
                           name: {
                                   required: true,
                                   minlength: 4
                           },
                           location: {
                                   required: true,
                                   minlength: 4
                           },            
                           time: {
                                   required: true,
                                   minlength: 4,
                                   maxlength: 5,
                                   timeformat: true
                           }
                   },
                   messages: {
                           time: {
                                   required: "Has to be HH:MM Format",
                                   minlength: $.format("At least {0} characters required!"),
                                   maxlength: $.format("Maximum {0} characters allowed!")
                           }
                   }
           });
           $.validator.addMethod("timeformat",
                   function(value, element) {
                           return /^(20|21|22|23|[01]\d|\d)(([:][0-5]\d){1,2})$/.test(value);
                   }
            );
        });
    })
    course_list.append(add_button);
}

function sendCourseData(){
    if($("#course_form").valid()){
        data = $("#course_form").serialize();
        $.ajax({
            type:"post",
            data: data,
            url:"/create_course",
            success: function(data){
                courses = data.data;
                populateCourseSelection();
            }
        });


        var $inputs = $('#course_form :input');
        console.log($inputs);

        //This object holds the username and password used to sign in with.
        var values = {};
        $inputs.each(function() {
            console.log($(this).val());
        });
        $('#course_form')[0].reset();
        $('#banner').css("visibility", "visible").addClass("green-btn").html("Course successfully added").fadeIn().delay(7000).fadeOut();
    }
}

