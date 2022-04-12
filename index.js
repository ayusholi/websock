const express = require("express");
const Websocket = require('ws');
const app = express();
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const wss = new Websocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
    console.log('One client connected');
    ws.on("message", msg => {
        ws.send(`msg is = ${msg}`);
    });
})

wss.on('connection', function connection(ws) {
    console.log("A new Client Connected");
    // ws.send('Welcome New Client');
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
    console.log(req.query);
    // Broadcast URL to connected ws clients
    wss.clients.forEach((client) => {
        // Check that connect are open and still alive to avoid socket error
        if (client.readyState === Websocket.OPEN) {
            var requestdata;
            const filedata = fs.readFile('./var.json', (err, data) => {
                if (err) {
                    console.log(err)
                    return
                }
                requestdata = data.toString();
                // let response = req.query;
                let response = requestdata;
                client.send(JSON.stringify(response));
            });
        }
    });

    res.status(200).send({ message: "Notification sent to websockets" });
});

app.listen(3000, () => console.log('Listening on Port: 3000'))