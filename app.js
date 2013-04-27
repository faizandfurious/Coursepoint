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
    studentCollection = client.collection('studentCollection');
    courseCollection = client.collection('courseCollection');
    initializeDB();
}

function initializeDB(){
    var calculus = {
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

    var mobile = {
        name : 'Mobile Web Apps',
        location : 'DH 1310',
        time : '3:00pm'
    }

    courseCollection.findOne({name : 'Mobile Web Apps'}, function(err, doc){
        if(err)
            throw err;
        if(doc === null){
            courseCollection.insert(mobile, function (err, doc) {

            });
        }
    });
    // console.log("Done adding");
    courseCollection.find().each(logDoc);
}


io.sockets.on("connection", function(socket) {

    socket.on('newquestions', function(data) {
        socket.emit('status', {success: 'true'});
        io.sockets.emit('newquestions', {qids: data.qids});
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
app.get("/static/js/:staticFilename", function (request, response) {
    response.sendfile("static/js/" + request.params.staticFilename);
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


//STUDENT ROUTES

app.post("/student", function(request, response) {
    var username = request.body.username;
    var query = {username : username};
    var student;

    studentCollection.findOne(query, function(err, doc){
        if(err)
            throw err;
        if(doc === null){
            studentCollection.insert({username : username}, function (err, doc) {
                response.send({
                    data : {student : doc},
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

    var students = studentCollection.find().each(logDoc);
    
    //var courses = [1, 2];
    //var student = {"name" : "Faiz",
    //                "courses" : courses,
    //                };

        
});

//QUESTIONS ROUTES

//take array of question _id's and return questions and choices
app.post("/questions", function(request, response) {
    var questions = request.body.questions;
    var docs = [];
    console.log(questions);

    docs = getQuestions(questions, docs, response);
    console.log("docs: "+docs);

    
        
});

function getQuestions(questions, docs, response) {
    if(questions.length === 0) {
        response.send({
            data : {questions: docs},
            success : true
        });
    }

    var qid = questions.shift();
    questionCollection.findOne({qid : qid}, function(err, doc) {
        if(err)
            throw err;
        docs.push(doc);
        return getQuestions(questions, docs, response);
        
    });

}

//Assume POST: Student ID and Course ID

app.post("/add_course", function(request, response){
    console.log(request.body.student_id);
    var student_id = toBSONID(request.body.student_id);
    var course_id = toBSONID(request.body.course_id);
    console.log(student_id + ", " + course_id);
    var query = {_id : student_id};
    var course_query = {_id : course_id};

    //Find the student via the providede student_id
    studentCollection.findOne(query, function(err, doc){
        if(err)
            throw err;
        //if we found the student, attempt to add the course to the student document
        if(doc){
            //Ensure that the courses array in student exists. If not, create it.
            if(doc.courses){
                var courses = doc.courses;
            }
            else{
                var courses = [];
            }

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
                    if(courses.indexOf(doc) === -1){
                        //We push the course document to the courses array, and then do a partial update
                        //of the student document.
                        courses.push(doc);
                        var partialUpdate = { $set: { courses: courses } };
                        //Partially update student to include the new course. Since this is an async
                        //task, we place the response in the callback
                        studentCollection.update(query, partialUpdate, function(error, doc){
                            if (error)
                                throw error;
                            response.send({
                                student : doc,
                                success : true
                            });
                        });
                    }
                }
            });
            //Otherwise, do nothing.
        }
    });
});

//QUIZ ROUTES

function initServer() {

}

function toBSONID(hexCode){
    return BSON.ObjectID.createFromHexString(hexCode);
}

// Finally, initialize the server, then activate the server at port 8889
initServer();
app.listen(8889);
