var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/framepage.html', function(req, res){
  res.sendFile(__dirname + '/framepage.html');
});

app.get('/style.css', function(req, res){
  res.sendFile(__dirname + '/style.css');
});

app.get('/frameproxy.js', function(req, res){
  res.sendFile(__dirname + '/frameproxy.js');
});


io.on('connection', function(socket){
  console.log("connection client:" + socket.id);
  socket.emit('storeClientInfo', socket.id);

  socket.on('runFunction', function(msg){
    console.log("runFunction: " + msg);
    io.emit('runFunction', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
