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

io.on('connection', function(socket){
  socket.emit('storeClientInfo', socket.id);

  socket.on('runFunction', function(msg){
    console.log("reception");
    io.emit('runFunction', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
