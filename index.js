var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

io.on('connection', function(socket){
  console.log('New connection from ' + socket.id);
  socket.join('some room');

  socket.emit('storeClientInfo', socket.id);

  socket.on('runFunction', function(msg){
    console.log("runFunction: " + JSON.stringify(msg));
    io.emit('runFunction', msg);
  });

  socket.on('callback', function(msg){
    console.log("callback: " + JSON.stringify(msg));
    io.emit('callback', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});


// Corregir en socket.io para funcionar en la aplicación de mapa
/*

Socket.prototype.dispatch = function(event){
  debug('dispatching an event %j', event);
  var self = this;
  function dispatchSocket(err) {
    process.nextTick(function(){
      if (err) {
        return self.error(err.data || err.message);
      }

      // JNC Correccion socket io node packete mal enviado del cliente
      // 42"[\"runFunction\",{\"client\":\"e52sg32iDM7R2XMDAAAE\",\"hash\":\"#8fhwsq0zn\",\"functionName\":\"IniciarMapa\",\"args\":\"Hola\"}]"
      // Probable error en las barras rel runFunction
      if(!Array.isArray(event))
        event = JSON.parse(event);
        //event = JSON.parse("[" + event + "]")
      

      emit.apply(self, event);
    });
  }
  this.run(event, dispatchSocket);
};


*/