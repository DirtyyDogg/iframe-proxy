# FRAMEPROXY

Frameproxy is a proxy application for solving cross-origin frame policies. The idea of the project is to use a nodejs websocket server to bypass the js calls between the host html and the iframe.

### Features
- Call remote functions on iframe/host  avoid same origin policy.
- Add parameters and callbacks.
- Link host with iframe by hashtag.

### Dependencies

#### Client
```
  <script src="socket.io/socket.io.js"></script>
  <script src="https://code.jquery.com/jquery-3.2.1.slim.js"></script>
```

#### Server

    "dependencies": {
        "express": "^4.16.2",
        "socket.io": "^2.0.3"
      }

### Installing

Get dependencies:

```
npm install
```

## Getting started

### Code on Host
Add frameproxy.js reference to html

    <script src="lib/frameproxy.js"></script>

Create a local function and register it

    function functionOnHost(arg0, arg1) {
            $('#messages').append($('<li>').text("functionOnHost executed params: " + arg0 + " - " + arg1));
          }
          frameproxy.subscribeLocalFunction(functionOnHost);

When frameproxy is started, remote registered client can call the function.

Connect to node.js through socket.io adding iframe id to the parameters:

    frameproxy.start('http://localhost:3000', "myIframe", true);

### Code on iframe

Connect to node.js and call previous registered function on host:

    frameproxy.start('http://localhost:3000', null, true);
    frameproxy.runRemoteFunction("functionOnHost", "Hola");

Full example on repository.

### Running
    npm start

## Authors

* **Javier colombera** - *Initial work* - [javis86](https://gitlab.com/javis86)