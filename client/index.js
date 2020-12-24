'use strict'

const TestMessage = require('./testmessage_pb')
const WebSocket = require('ws')
const connectionDateTime = new Date();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const ws = new WebSocket('wss://localhost:7070/', {
    origin: 'https://localhost:7070'
})

ws.on('open', function open() {
    console.log('connected')
})

ws.on('close', function close() {
    console.log('disconnected')
})

ws.on('message', function incoming(data, flags) {
    console.log('message')
    var bytes = Array.prototype.slice.call(data, 0)
    var message = proto.TestMessage.deserializeBinary(bytes)
    console.log(message.getSometext())
})

setInterval(function () {
    if (ws.readyState !== 1) {
        console.log("something wrong is not right")
    } else {
        var diffMilli = Math.abs(new Date().getTime() - connectionDateTime.getTime());
        var diffSeconds = diffMilli / 1000;
        var diffMinutes = diffSeconds / 60;
        var diffHours = diffMinutes / 60;
        var diffDays = diffHours / 24;

        var since = "";

        if (diffDays > 1) {
            since = diffDays.toFixed(2) + " days";
        } else if (diffHours > 1) {
            since = diffHours.toFixed(2) + " hours";
        } else if (diffMinutes > 1) {
            since = diffMinutes.toFixed(2) + " minutes";
        } else if (diffSeconds > 1) {
            since = diffSeconds.toFixed(2) + " seconds";
        } else if (diffMilli > 1) {
            since = diffMilli.toFixed(2) + " milliseconds";
        }

        console.log("Client is sending a message at " + Date.now() + ". Persistent connection running since: " + since + " ago");

        ws.send('Client sends at ' + Date.now() + ". Persistent connection running since: " + since + " ago");
    }
}, 3000);