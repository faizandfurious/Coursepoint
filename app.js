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

            });
        }
    }
    var mobile = {
        name : 'Mobile Web Apps',
        location : 'DH 1310',
        time : '3:00pm'
    };
    courseCollection.findOne({name : 'Mobile Web Apps'}, function(err, doc){
        if(err)
            throw err;
        if(doc === null){
            courseCollection.insert(mobile, function (err, doc) {

            });
        }
    }
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

//COURSE ROUTES

app.post("/course", function(request, response) {
    var id = request.body.id;
    var data = {course : course};
    response.send({
        data : data,
        success : true
    });
        
});

app.get("/course/:name", function(request, response) {
    var name = request.params.name;
    console.log(name);
    courseCollection.findOne({name : name}, function(err, doc){
        if(err)
            throw err;
        console.log(doc);
    })
    data = id;
    response.send({
        data : data,
        success : true
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

//QUIZ ROUTES

function initServer() {

}

// Finally, initialize the server, then activate the server at port 8889
initServer();
app.listen(8889);
