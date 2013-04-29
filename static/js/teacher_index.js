var socket = io.connect("http://localhost:8888");
var timer = $("#timer");
var class_selector = $("#class_selection_pane");
var course_list = $("#course_list");

var courses;


$(document).ready(function(){
    hideTopbarButtons();
    refreshCourseList();
    getCourses();
    showLogin();
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
        classli.append($('<span>').html(course.name));

        course_list.append(classli);
    });
    var add_button = $('<li>').html("Add a Course").attr("id", "add_class");
    add_button.css("background-color", "#ddd");
    add_button.click(function(){
        console.log("clicked");
    })
    course_list.append(add_button);
}

