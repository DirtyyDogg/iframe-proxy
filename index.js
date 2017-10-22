var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname));

io.on('connection', function(socket){
  console.log('New connection from ' + socket.id + "-- " + socket.request.connection.remoteAddress);

  socket.emit('storeClientInfo', socket.id);

  socket.on('runFunction', function(msg){
    console.log("runFunction: " + msg);
    io.emit('runFunction', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
