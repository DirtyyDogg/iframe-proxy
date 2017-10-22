(function(window) {
  var socketId;
  var hash;
  var socket = io('http://localhost:3000');
  var functions = {};

  var id = function() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '#' + Math.random().toString(36).substr(2, 9);

  }

  var start = function(url, iframeName) {

    if(!iframeName){
      hash = window.location.hash;
    }else{
      hash = id();
      $("iframe").attr("src", $("iframe").attr("src") + hash);
    }

    socket = io(url);

    socket.on('storeClientInfo', function(msg) {
      socketId = msg;
    });

    socket.on('runFunction', function(msg) {
      var params = JSON.parse(msg);
      console.log(msg);

      try {
        if (socketId != params.client && hash == params.hash) {
          $('#messages').append($('<li>').text(msg));

          //eval(params.functionName)(params.args[0], params.args[1]);
          if(Array.isArray(params.args))
            functions[params.functionName].apply(null, params.args);
          else {
            functions[params.functionName](params.args);
          }
        }
      } catch (e) {
        console.log("Problems to run: " + params.functionName + "error:" + e);
      } finally {

      }
    });
  }

  var subscribeLocalFunction = function(fn) {
    functions[fn.name] = fn;
  }

  var runRemoteFunction = function(functionName, args) {
    var params = {
      client: socketId,
      hash: hash,
      functionName: functionName,
      args: args
    };
    socket.emit('runFunction', JSON.stringify(params));
  }

  var frameproxy = {
    start: function(url, iframeName) {
      return start(url, iframeName);
    },

    runRemoteFunction: function(functionName, args) {
      return runRemoteFunction(functionName, args);
    },

    subscribeLocalFunction: function(fn) {
      return subscribeLocalFunction(fn);
    }
  }

  window.frameproxy = frameproxy;

})(window);
