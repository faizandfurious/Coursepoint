var express = require("express"); // imports express
var app = express();        // create a new instance of express
var io = require('socket.io').listen(8888); //instantiates socket server and run on 8888

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
app.get("/static/views/:staticFilename", function (request, response) {
    response.sendfile("static/views/" + request.params.staticFilename);
});

// This is for serving files in the static directory
app.get("/static/js/:staticFilename", function (request, response) {
    response.sendfile("static/js/" + request.params.staticFilename);
});




function initServer() {
}

// Finally, initialize the server, then activate the server at port 8889
initServer();
app.listen(8889);
