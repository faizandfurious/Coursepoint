var express = require("express"); // imports express
var app = express();        // create a new instance of express
var io = require('socket.io').listen(8888); //instantiates socket server and run on 8888
var mongo = require('mongodb');
var host = 'localhost';
var port = mongo.Connection.DEFAULT_PORT;

var optionsWithEnableWriteAccess = { w: 1 };
var dbName = 'testDb';

var client = new mongo.Db(
    dbName,
    new mongo.Server(host, port),
    optionsWithEnableWriteAccess
);

io.sockets.on("connection", function(socket) {
    socket.on('msg', function(data) {
        socket.emit('status', {success: 'true'});
        io.sockets.emit('newmsg', {body: data.body});
    });
});

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

//get a student object by id (for the student ux)
app.get("/students/:id", function(request, response) {
    var query = {id : request.params.id};
    var student = client.studentInfo.findOne(query);
    response.send({
        student : student,
        sucess : true
    });
});
//CLASS ROUTES

//STUDENT ROUTES



//QUIZ ROUTES
//RETREIVE ALL QUIZ DATA
app.get("/all_data", function(request, response){

    var info = client.studentInfo.find({}).toArray(function(error, result){
        if (error)
            throw error;
        console.log(result);
    });

    var data = { allData : info};
    response.send({
        data : data,
        success : true
    });
});




function initServer() {
}

// Finally, initialize the server, then activate the server at port 8889
initServer();
app.listen(8889);
