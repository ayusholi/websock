const express = require('express')
const app = express()
const server = require('http').createServer(app)

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server: server });

wss.on('connection', function connection(ws) {
    console.log("A new Client Connected");
    ws.send('Welcome New Client');
    ws.on('message', function incoming(message, isBinary) {
        console.log('received: %s', message);

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message, { binary: isBinary })
            }
        });
    });
});


app.get('/new-relic-notify', (req, res) => {
    ws.send(req.body);
});

server.listen(3000, () => console.log('Listening on Port: 3000'))