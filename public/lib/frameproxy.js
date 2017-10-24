(function(window) {
  var socketId;
  var hash;
  var socket;
  var functions = {};
  var calls = {};
  var logEnable = false;

  var id = function() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '#' + Math.random().toString(36).substr(2, 9);

  }

  var logConsoleMessage = function(msg) {
    if(logEnable){
      console.log(msg);
    }
  }

  var start = function(url, iframeId, enableLogging) {
    if (!iframeId) {
      hash = window.location.hash;
    } else {
      hash = id();

      if ($("#" + iframeId).length > 0) {
        $("#" + iframeId).attr("src", $("#" + iframeId).attr("src") + hash);
      } else {
        $("iframe").attr("src", $("iframe").attr("src") + hash);
      }
    }

    if(enableLogging){
      logEnable = true;
    }

    socket = io(url);

    socket.on('connect', function() {
      socket.emit("room", hash);
    });    

    socket.on('storeClientInfo', function(msg) {
      socketId = msg;
    });

    socket.on('callback', function(msg) {
      //var params = JSON.parse(msg);
      var params = msg;
      logConsoleMessage(JSON.stringify(msg));

      try {
        if (Array.isArray(params.value))
          calls[params.callbackId].apply(null, params.value);
        else {
          calls[params.callbackId](params.value);
        }
      } catch (e) {
        logConsoleMessage(e);
      } finally {
        delete calls["params.callbackId"];
      }
    });

    socket.on('runFunction', function(msg) {
      //var params = JSON.parse(msg);
      var params = msg;
      logConsoleMessage(JSON.stringify(msg));

      try {

        // Si no soy yo
        if (socketId != params.client) {
          var rtn;
          if (Array.isArray(params.args))
            rtn = functions[params.functionName].apply(null, params.args);
          else {
            rtn = functions[params.functionName](params.args);
          }

          if (params.callbackId) {
            var rtnParams = {
              hash: hash,
              callbackId: params.callbackId,
              value: rtn
            };
            socket.emit('callback', rtnParams);
          }

        }
      } catch (e) {
        logConsoleMessage("Problems to run: " + params.functionName + "error:" + e);
      } finally {

      }
    });
  }

  var subscribeLocalFunction = function(fn) {
    functions[fn.name] = fn;
  }

  var runRemoteFunction = function(functionName, args, callback) {
    var params = {
      client: socketId,
      hash: hash,
      functionName: functionName,
      args: args
    };

    if (callback) {
      params.callbackId = id();
      calls[params.callbackId] = callback;
    }

    socket.emit("runFunction", params);
  }

  var frameproxy = {
    start: function(url, iframeId, enableLogging) {
      return start(url, iframeId, enableLogging);
    },

    runRemoteFunction: function(functionName, args, callback) {
      return runRemoteFunction(functionName, args, callback);
    },

    subscribeLocalFunction: function(fn) {
      return subscribeLocalFunction(fn);
    }
  }

  window.frameproxy = frameproxy;

})(window);
