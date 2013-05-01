var express = require("express"); // imports express
var app = express();        // create a new instance of express

app.use(express.bodyParser());

var io = require('socket.io').listen(8888); //instantiates socket server and run on 8888
var mongo = require('mongodb');
var host = 'localhost';
var port = mongo.Connection.DEFAULT_PORT;

var optionsWithEnableWriteAccess = { w: 1, r:1 };
var dbName = 'test';
var questionCollection;
var lectureCollection;
var studentCollection;
var courseCollection;
var BSON = require('mongodb').BSONPure; //For ID searching

var client = new mongo.Db(
    dbName,
    new mongo.Server(host, port),
    optionsWithEnableWriteAccess
);

client.open(onDbReady);

function onDbReady(error){
    if (error)
        throw error;
    questionCollection = client.collection('questionCollection');
    lectureCollection = client.collection('lectureCollection');
    studentCollection = client.collection('studentCollection');
    courseCollection = client.collection('courseCollection');
    initializeDB();
}

function initializeDB(){
    var calculus = {
        course_id : 'a922jdalx120',
        name : 'Calculus',
        location : 'Wean 4301',
        time : '9:30am'
    };
    courseCollection.findOne({name : 'Calculus'}, function(err, doc){
        if(err)
            throw err;
        if(doc === null){
            courseCollection.insert(calculus, function (err, doc) {

            })
        }
    });

    var calculus_lecture_1 = {
        lecture_id : 'j3948ajdhq193',
        course_id : 'a922jdalx120',
        name : 'Lecture 1'
    };

    lectureCollection.findOne({lecture_id : 'j3948ajdhq193'}, function(err, doc){
        if(err)
            throw err;
        if(doc === null){
            lectureCollection.insert(calculus_lecture_1, function (err, doc) {

            })
        }
    });

    var mobile = {
        course_id : 'b9183jfieh493',
        name : 'Mobile Web Apps',
        location : 'DH 1310',
        time : '3:00pm'
    }

    courseCollection.findOne({course_id : 'b9183jfieh493'}, function(err, doc){
        if(err)
            throw err;
        if(doc === null){
            courseCollection.insert(mobile, function (err, doc) {

            });
        }
    });

    var mobile_lecture_1 = {
        lecture_id : 'f1939fjahe932',
        course_id : 'b9183jfieh493',
        name : 'Lecture 1'
    }

    lectureCollection.findOne({lecture_id : 'f1939fjahe932'}, function(err, doc){
        if(err)
            throw err;
        if(doc === null){
            lectureCollection.insert(mobile_lecture_1, function (err, doc) {

            });
        }
    });
    // console.log("Done adding");
    courseCollection.find().each(logDoc);
}


io.sockets.on("connection", function(socket) {

    socket.on('ask', function(data) {
        console.log("asked: " + data);
        socket.emit('status', {success: 'true'});
        io.sockets.emit('newquestions', data);
    });

});

var logger = function(error, result){
    // if (error)
    //     throw error;
    // console.log(result);
}

var logDoc = logger;
var logDocs = logger;


// This is for serving files in the static directory
app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});

// This is for serving files in the static directory
app.get("/static/styles/:staticFilename", function (request, response) {
    response.sendfile("static/styles/" + request.params.staticFilename);
});

// This is for serving files in the static directory
app.get("/static/styles/fonts/:staticFilename", function (request, response) {
    response.sendfile("static/styles/fonts/" + request.params.staticFilename);
});

// This is for serving files in the static directory
app.get("/static/styles/images/:staticFilename", function (request, response) {
    response.sendfile("static/styles/images/" + request.params.staticFilename);
});


// This is for serving files in the static directory
app.get("/static/views/:staticFilename", function (request, response) {
    response.sendfile("static/views/" + request.params.staticFilename);
});

// This is for serving files in the static directory
app.get("/static/views/student/:staticFilename", function (request, response) {
    response.sendfile("static/views/student/" + request.params.staticFilename);
});

// This is for serving files in the static directory
app.get("/static/views/teacher/:staticFilename", function (request, response) {
    response.sendfile("static/views/teacher/" + request.params.staticFilename);
});

// This is for serving files in the static directory
app.get("/static/js/:staticFilename", function (request, response) {
    response.sendfile("static/js/" + request.params.staticFilename);
});

// This is for serving files in the static raphael directory
app.get("/static/js/raphael/:staticFilename", function (request, response) {
    response.sendfile("static/js/raphael/" + request.params.staticFilename);
});

//COURSE ROUTES

app.post("/course", function(request, response) {
    var id = request.body.id;
    var data = {course : course};
    response.send({
        data : data,
        success : true
    });
        
});
//Get all courses
app.get("/courses", function(request, response) {
    var name = request.params.name;
    // console.log(name);
    var waiting = true;
    courseCollection.find().toArray(function(err, docs){
        if(err)
            throw err;
        if(docs){
            response.send({
                data : docs,
                success : true
            })
        }
    });
});

app.get("/course/:name", function(request, response) {
    var name = request.params.name;
    // console.log(name);
    courseCollection.findOne({name : name}, function(err, doc){
        if(err)
            throw err;
        // console.log(doc);
        response.send({
            data : doc,
            success : true
        });
    });
});

app.post("/delete_course", function(request, response){
    var _id = toBSONID(request.body.course_id);
    var query = {_id : _id};
    console.log(_id);
    courseCollection.findOne(query, function(err, doc){
        if(err)
            throw err;
        if(doc === null){
            console.log("Doesn't exist");
        }
        else{
            courseCollection.remove(query, function(err, doc){
                if(err)
                    throw err
                courseCollection.find().toArray(function(err, docs){
                    if(err)
                        throw err;
                    if(docs){
                        response.send({
                            data : docs,
                            success : true
                        });
                    }
                });
            })
        }
    });
});

app.post("/create_course", function(request, response){
    var name = request.body.name;
    var location = request.body.location;
    var time = request.body.time;
    courseCollection.findOne({name : name}, function(err, doc){
    if(err)
        throw err;
    if(doc === null){
        console.log("Doesn't exist");
        var course = {
            course_id : 'a9474asdjha19a',
            name : name,
            location : location,
            time : time
        }
        courseCollection.insert(course, function (err, doc) {
            if(err)
                throw err
            courseCollection.find().toArray(function(err, docs){
                if(err)
                    throw err;
                if(docs){
                    response.send({
                        data : docs,
                        success : true
                    })
                }
            });
        });
    }
    });
})

app.post("/create_question", function(request, response){
    var lecture_name = request.body.lecture_name;
    var body = request.body.body;
    var correctAnswer = request.body.correctAnswer;
    var choices = request.body.choices;
    var course_id = request.body.course_id;
    questionCollection.findOne({lecture_name : lecture_name, course_id : course_id, body : body}, function(err, doc){
    if(err)
        throw err;
    if(doc === null){
        console.log("Doesn't exist");
        var question = {
            course_id : course_id,
            lecture_name : lecture_name,
            correctAnswer : correctAnswer,
            choices : choices,
            body : body,
            correctAnswer : correctAnswer
        }
        questionCollection.insert(question, function (err, doc) {
            if(err)
                throw err
            questionCollection.find({course_id : course_id}).toArray(function(err, docs){
                if(err)
                    throw err;
                if(docs){
                    response.send({
                        data : docs,
                        success : true
                    })
                }
            });
        });
    }
    });
});

app.post("/delete_question", function(request, response){
    var _id = toBSONID(request.body.question_id);
    var query = {_id : _id};
    console.log(_id);
    questionCollection.findOne(query, function(err, doc){
        if(err)
            throw err;
        if(doc === null){
            console.log("Doesn't exist");
        }
        else{
            questionCollection.remove(query, function(err, doc){
                if(err)
                    throw err
                response.send({
                    data : doc,
                    success : true
                });
            });
        }
    });
});

app.get("/get_questions/:course_id", function(request, response){
    
    var course_id = request.params.course_id;
    questionCollection.find({course_id : course_id}).toArray(function(err, docs){
        if(err)
            throw err;
        if(docs){
            response.send({
                data : docs,
                success : true
            });
        }
    });
});


//STUDENT ROUTES

app.post("/student", function(request, response) {
    var username = request.body.username;
    var query = {username : username};

    studentCollection.findOne(query, function(err, doc){
        if(err)
            throw err;
        if(doc === null){
            console.log("Creating new user");
            studentCollection.insert({username : username, courses : []}, function (err, doc) {
                response.send({
                    data : {student : doc[0]},
                    success : true
                });
            });
        }
        else{
            response.send({
                data : {student : doc},
                success : true
            });
        }
    });

});

function Student(doc) {
    this.username = doc["username"];
    this.name = doc["name"];
    this.courses = [];

}

function Course(doc) {
    this.id = doc["course_id"];
    this.name = doc["name"];
    this.time = doc["time"];
    this.location = doc["location"];
    this.lectures = [];
}

function Lecture(doc) {
    this.id = doc["lecture_id"];
    this.course_id = doc["course_id"];
    this.name = doc["name"];
    this.questions = [];
}

function Question(questionDoc, studentDoc) {
    this.id = questionDoc["question_id"];
    this.category = questionDoc["category"];
    this.tags = questionDoc["tags"];
    this.body = questionDoc["body"];
    this.choices = questionDoc["choices"];
    if(questionDoc["complete"] === true) {
        this.studentAnswer = studentDoc["answers"][this.questionId];
        this.complete = true;
        this.correctAnswer = question["correctAnswer"];
        this.explanation = question["explanation"];
    } else {
        this.complete = false;
    }
}

function constructStudent(studentDoc, response) {
    var student = new Student(studentDoc);
    var course;
    var lecture;
    var question;
    console.log("called");

    //Check if courses exists, and if so, if the length is zero, just send the student
    //doc back
    
    if(studentDoc["courses"] === undefined){
        response.send({
            data : {student : student},
            success : true
        });
    }

    else if(studentDoc["courses"].length === 0){
        response.send({
            data : {student : student},
            success : true
        });
    }
    
    else{
        //get each course
        while(studentDoc["courses"].length > 0) {
            var next_course = studentDoc["courses"].pop();

            courseCollection.find({course_id : next_course.course_id}).toArray(function(err,courseDocs) { //get all courses
                console.log("course_id");
                console.log(courseDocs);
                while(courseDocs.length > 0) { 
                    course = new Course(courseDocs.pop());
                    //get each lecture
            
                    lectureCollection.find({course_id : course.id}).toArray(function(err, lectureDocs) { //get all lectures in course
            
                        while(lectureDocs.length > 0) {
                            lecture = new Lecture(lectureDocs.pop());
            
                            questionCollection.find({lecture_id : lecture.id}).toArray(function(err, questionDocs) { //get all questions in lecture
            
                                while(questionDocs.length > 0) {
                                    question = new Question(questionDocs.pop(), studentDoc);
                                    lecture.questions.push(question);
                                }

                                course.lectures.push(lecture);

                                if(studentDoc["courses"].length === 0 && courseDocs.length === 0 && lectureDocs.length === 0) {
                                    student.courses.push(course);
                                    response.send({
                                        data : {student : student},
                                        success : true
                                    });
                                }
            
                            });
                        }
                    });
                }
            });
        }
    }
            
            
}


//QUESTIONS ROUTES

app.post("/ask", function(request, response) {
    var questions = request.body.questions;
    var time = request.body.time;
    
    //get students in class
    //for right now just broadcast to all students

    //socket message to students
    io.sockets.emit('newquestions', {questions: questions, time:time});
    
    response.send({
        data : {},
        success : true
    });


});

//take array of question _id's and return questions and choices
app.post("/questions", function(request, response) {
    var question_ids = request.body.questions;
    var questions = [];
    console.log(questions);

    sendQuestions(question_ids, questions, response);
        
});

function sendQuestions(question_ids, questions, response) {
    if(question_ids.length === 0) {
        response.send({
            data : {questions: questions},
            success : true
        });
        return;
    }

//    var question_id = question_ids.shift();
//just one question for now
    var question_id = question_ids;
    questionCollection.findOne({_id : toBSONID(question_id)}, function(err, doc) {
        if(err)
            throw err;
        console.log("----------------id : " + question_id);
        questions.push(doc["body"]);
        //return sendQuestions(question_ids, questions, response);
        //just one question for now
        return sendQuestions("", questions, response);
        
    });

}

app.post("/studentResponse", function(request, response) {
    var responses = request.body.responses;
    //get array of answers based on reponses

    //send student responses to teacher via socket message

    //return correct answers to student via response


});

app.post("/remove_course", function(request, response){
    var student_name = request.body.student_name;
    var course_id = toBSONID(request.body.course_id);
    console.log(student_name + ", " + course_id);
    var query = {username : student_name};
    var course_query = {_id : course_id};

    //Find the student via the providede student_id
    studentCollection.findOne(query, function(err, student){
        if(err)
            throw err;
        //if we found the student, attempt to add the course to the student document
        if(student){
            console.log(student);
            //Ensure that the courses array in student exists. If not, create it.
            if(student.courses){
                var courses = student.courses;
                //Now that we have access to the courses array of the student, we attempt to find
                //the course that was provided in the request via the course id, if we find it,
                //we add it to the student document (if it doesn't already exist there).
                courseCollection.findOne(course_query, function(err, course_doc){
                    if(err)
                        throw err;
                    if(course_doc){
                        console.log(course_doc);
                        //We search through the courses array of the student document to try to find
                        //the course in question. If we find it, we do nothing. Otherwise we add the course
                        //document courses array in the student document.
                        var index = indexOfCourseInStudent(course_doc, student);
                        if(index >= 0){
                            console.log("going to remove");
                            //We push the course document to the courses array, and then do a partial update
                            //of the student document.
                            courses.splice(index, 1);
                            var partialUpdate = { $set: { courses: courses } };
                            //Partially update student to include the new course. Since this is an async
                            //task, we place the response in the callback
                            studentCollection.update(query, partialUpdate, function(error, doc){
                                if (error)
                                    throw error;
                                //If there's no error, we look for the student again, and if we do, send it back to the 
                                //client with the updated version of the student.
                                studentCollection.findOne(query, function(err, updated_student){
                                    if(err)
                                        throw err;
                                    //if we found the student, attempt to add the course to the student document
                                    if(updated_student){
                                        console.log(updated_student);
                                        response.send({
                                            student : updated_student,
                                            success : true
                                        });
                                    }
                                });
                            });
                        }
                    }
                });
            }
            //Otherwise, do nothing.
        }
    });

})

//Assume POST: Student ID and Course ID

app.post("/add_course", function(request, response){
    var student_name = request.body.student_name;
    var course_id = toBSONID(request.body.course_id);
    console.log(student_name + ", " + course_id);
    var query = {username : student_name};
    var course_query = {_id : course_id};

    //Find the student via the provided student username
    studentCollection.findOne(query, function(err, student){
        if(err)
            throw err;
        //if we found the student, attempt to add the course to the student document
        if(student){
            console.log("Found student");
            console.log(student);
            //Ensure that the courses array in student exists. If not, create it.
            if(student.courses){
                var courses = student.courses;
            }
            else{
            console.log("Creating courses");
                var courses = [];
            }

            //Now that we have access to the courses array of the student, we attempt to find
            //the course that was provided in the request via the course id, if we find it,
            //we add it to the student document (if it doesn't already exist there).
            courseCollection.findOne(course_query, function(err, course_doc){
                if(err)
                    throw err;
                if(course_doc){
                    console.log("Found course");
                    console.log(course_doc);
                    //We search through the courses array of the student document to try to find
                    //the course in question. If we find it, we do nothing. Otherwise we add the course
                    //document courses array in the student document.
                    if(!courseExistsInStudent(course_doc, student)){
                        console.log("going to add");
                        //We push the course document to the courses array, and then do a partial update
                        //of the student document.
                        courses.push(course_doc);
                        var partialUpdate = { $set: { courses: courses } };
                        //Partially update student to include the new course. Since this is an async
                        //task, we place the response in the callback
                        studentCollection.update(query, partialUpdate, function(error, doc){
                            if (error)
                                throw error;
                            //If there's no error, we look for the student again, and if we do, send it back to the 
                            //client with the updated version of the student.
                            studentCollection.findOne(query, function(err, updated_student){
                                if(err)
                                    throw err;
                                //if we found the student, attempt to add the course to the student document
                                if(updated_student){
                                    console.log(updated_student);
                                    response.send({
                                        student : updated_student,
                                        success : true
                                    });
                                }
                            });
                        });
                    }
                    else{
                        response.send({
                            student : student,
                            success : true
                        });
                    }
                }
                else{
                    console.log("Course does not exist");
                }
            });
            //Otherwise, do nothing.
        }
    });
});

//This function checks to see if the course is already included in the student's course array.
function courseExistsInStudent(course, student){
    if(student.courses){
        console.log("courses exist");
        courses = student.courses;
        for(var i = 0; i < courses.length; i++){
            console.log(courses[i]._id);
            //Compare the string versions of the ids
            if("" + courses[i]._id === "" + course._id){
                console.log("Found the course");
                return true;
            }
        }
        return false;
    }
    return false;
}

//This function checks to see if the course is already included in the student's course array. If it is,
//it returns the index
function indexOfCourseInStudent(course, student){
    if(student.courses){
        console.log("courses exist");
        courses = student.courses;
        for(var i = 0; i < courses.length; i++){
            //Compare the string versions of the ids
            if("" + courses[i]._id === "" + course._id){
                return i;
            }
        }
        return -1;
    }
    return -1;
}

//QUIZ ROUTES

function initServer() {

}

function toBSONID(hexCode){
    console.log(hexCode);
    return BSON.ObjectID.createFromHexString(hexCode);
}

// Finally, initialize the server, then activate the server at port 8889
initServer();
app.listen(8889);
