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

function getQuestionsByCourseId(course_id){
    console.log("getting: questions");
    console.log("getting: "+course_id);
    $.ajax({
        type:"get",
        url:"/get_questions/" + course_id,
        data:{course_id : course_id},
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

//teacher assigns questions and waits for responses then calls displayResponses
function startQuiz(questions, time){
     var data = {questions : questions, time : time};
     socket.emit("ask", data);
}

function displayResponses(responses) {
    //format: responses[questionId][studentId] = response
    //display student responses (using raphael...?)
}

function populateCourseSelection(){
    course_list.html("");
    courses.forEach(function(course){
        console.log(course);
        var classli = $('<li>').html("").attr("id",course._id);
        classli.css("")
        classli.append($('<span>').html(course.name));
        classli.click(function(){
            getQuestionsByCourseId(course._id);
            $("#course_list").children("*").css("background-color", "#aaa");
            $(this).css("background-color", "orange");
            $("#course_form").fadeOut();
            var main = $("#main");
            main.fadeOut(function(){
                var course_container = $("<div id='course_container'></div>");
                main.html("");
                var title = $("<h1 id = 'course_title'></h1>").html(course.name);
                var delete_button = $("<button id='delete_button' class='btn red-btn'>Delete</button>");
                delete_button.click(function(){
                    console.log(course._id);
                    $.ajax({
                        type:"post",
                        data: {course_id : course._id},
                        url:"/delete_course",
                        success: function(data){
                            courses = data.data;
                            populateCourseSelection();
                        }
                    });
                });
                course_container.append(title);
                var course_info = $("<div id='course_info'></div>");
                var location = $("<div id= 'course_location' class='class_item'></div>").html(course.location);
                var time = $("<div id= 'course_time' class='class_item'></div>").html(course.time);
                course_info.append(location, time);
                course_container.append(course_info);
                main.append(course_container);
                var dynamic_course_content = $("<div id='dynamic_course_content'></div>");
                dynamic_course_content.append(delete_button);

                var quiz_create_button = $("<button id='quiz_create_button' class='btn blue-btn'>Create a Question</button>");
                dynamic_course_content.append(quiz_create_button);
                var i = 0;
                quiz_create_button.click(function(){
                    $("#create_question_form").html("");
                    var add_choice_button = $("<button id = 'add_a_choice' class='btn blue-btn'>Add Another Answer</button>");
                    add_choice_button.click(function(){
                        if(i >= 4){

                        }
                        else{
                            ++i;
                            var choice_label = $("<label>Answer " + (i+1) +": </label>");
                            var choice_desc = $("<span class='small_text'>Create an Answer</label>");
                            var choice = $("<input type='text' placeholder='Possible Answer...' name='choice' class='text_box'></input>");
                            var ans = $("<input type='radio' name='correctAnswer' id="+i+" value="+ i +"></input><br>");
                            choice_label.append(choice_desc);
                            form.append(choice_label, choice, ans);
                        }
                    });
                    var create_title = $("<h1>Create a Question");
                    var form = $("<form id='create_question_form'></form>");
                    var name_label = $("<label>Lecture Name: </label>");
                    var name_desc = $("<span class='small_text'>What's the lecture called?</label>");
                    name_label.append(name_desc);
                    var name_input = $("<input type='text' name='lecture_name' placeholder='Lecture Name' autofocus><br>");
                    var body = $("<input type='text' name='body' placeholder='Question?'><br>");
                    var body_label = $("<label>Question: </label>");
                    var body_desc = $("<span class='small_text'>What's the Question?</label>");
                    body_label.append(body_desc);
                    var choice_label = $("<label>Answer " + (i+1) +": </label>");
                    var choice_desc = $("<span class='small_text'>Create an Answer</label>");
                    var choice = $("<input type='text' placeholder='Possible Answer...' name='choice' class='text_box'></input>");
                    var ans = $("<input type='radio' name='correctAnswer' id="+i+" value="+ i +"></input><br>");
                    choice_label.append(choice_desc);
                    form.append(name_label, name_input, body_label, body, choice_label, choice, ans);
                    var create_quiz_button = $("<button id='create_quiz_button' class='submit btn blue-btn' type='submit' name='submit'>Create</button>");
                    dynamic_course_content.append(add_choice_button, form, create_quiz_button);
                    //This method listens for the create button in the add a course form to be pressed. Once it is,
                    //it attempts to gather the values and create a new course.
                    create_quiz_button.click(function(){
                        checkQuizData(course._id);
                        return false;
                    });
                    //Create the validations for the form.
                    $("#create_question_form").validate({
                       rules: {
                        
                               lecture_name: {
                                       required: true
                               },
                               body: {
                                       required: true
                               },            
                               choice: {
                                       required: true
                               }
                       }
                   });
                });
                main.append(dynamic_course_content);
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
            var form = $("<form id='course_form'></form>");
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

function checkQuizData(course_id){
    console.log(course_id);
    if($("#create_question_form").valid()){
        var $inputs = $('#create_question_form :input');

        // not sure if you wanted this, but I thought I'd add it.
        // get an associative array of just the values.
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
        });

        var $choice_inputs = $('input:text[name=choice]');
        var choices = [];
        $choice_inputs.each(function() {
            choices.push($(this).val());
        });
        console.log(choices);

        delete values["choice"];
        values["choices"] = choices;
        values["course_id"] = course_id;

        $.ajax({
            type:"post",
            data: values,
            url:"/create_question",
            success: function(data){
                console.log(data);
            }
        });
    }
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

