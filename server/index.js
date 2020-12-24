'use strict'

const TestMessage = require('./testmessage_pb')

const Express = require('express')
const Https = require('https')
const WebSocket = require('ws')
const FileSystem = require('fs')
const app = Express()

app.use(function (req, res) {
    res.send({ msg: "Hello" + Date.now()});
})

const server = Https.createServer({
    key: FileSystem.readFileSync('key.pem'),
    cert: FileSystem.readFileSync('cert.pem'),
    passphrase: 'protobufjstest'
}, app)

const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
    })

    var message = new proto.TestMessage()

    message.setSometext('Hello Protocol Buffers ' +  Date.now());

    var bytes = message.serializeBinary()
    ws.send(bytes)
})

// WebSocket server
wss.on('request', function(request) {
    var connection = request.accept(null, request.origin);
  
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
         console.log('received: %s', message)
      }
    });
  
    connection.on('close', function(connection) {
        console.log('disconecting: %s', message)
    });
  });

server.listen(7070, function listening() {
    console.log('Listening on %d', server.address().port)
})
