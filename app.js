var express = require("express"); // imports express
var app = express();        // create a new instance of express

app.use(express.bodyParser());

var io = require('socket.io').listen(8888); //instantiates socket server and run on 8888
var mongo = require('mongodb');
var host = 'localhost';
var port = mongo.Connection.DEFAULT_PORT;

var optionsWithEnableWriteAccess = { w: 1, r:1 };
var dbName = 'test';
var studentCollection;
var courseCollection;

var client = new mongo.Db(
    dbName,
    new mongo.Server(host, port),
    optionsWithEnableWriteAccess
);

client.open(onDbReady);

function onDbReady(error){
    if (error)
        throw error;
    studentCollection = client.collection('studentCollection');
    courseCollection = client.collection('courseCollection');
}


io.sockets.on("connection", function(socket) {
    socket.on('msg', function(data) {
        socket.emit('status', {success: 'true'});
        io.sockets.emit('newmsg', {body: data.body});
    });
});

var logger = function(error, result){
    if (error)
        throw error;
    console.log(result);
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

function jsonify(doc) {
     
    var s = doc["username"];
    console.log("***************"+s+"*************");
    return s;
}

//COURSE ROUTES

app.post("/course", function(request, response) {
    var id = request.body.id;
    // var course = courseCollection.findOne({id : id}, function(err, doc){
    //     if(err)
    //         throw(err);
    //     console.log(doc);
    // });
    var course = {"Subject" : "Calculus"};
    var data = {course : course};
    response.send({
        data : data,
        success : true
    });
        
});


//STUDENT ROUTES

app.post("/student", function(request, response) {
    var username = request.body.username;
/*    
    var student;
    studentCollection.insert({username : username}, function (err) { });
    var a = studentCollection.find().toArray(
        function(err,docs) {
            console.log(docs);
            student = jsonify(docs[0]);
            });
*/
    var query = {username : username};
    studentCollection.insert(query, logDoc);

    var student = studentCollection.findOne(query, logDoc);

    var students = studentCollection.find().each(logDoc);
    
    //var courses = [1, 2];
    //var student = {"name" : "Faiz",
    //                "courses" : courses,
    //                };
    response.send({
        data : {student : student},
        success : true
    });
        
});

//QUIZ ROUTES

function initServer() {
}

// Finally, initialize the server, then activate the server at port 8889
initServer();
app.listen(8889);
