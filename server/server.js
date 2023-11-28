const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {cors: '*'});

const path = require('path');

const PORTA = process.env.PORTA || 3000;
const PORTB = process.env.PORTB || 5000; // Use port 5000 for socket.io
console.log('starting server')


const cors = require("cors");

app.use(cors({
  origin: '*',
}));

const buildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(buildPath));


app.get('/', (req, res) => {
  // res.send('Hello, World!');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORTA, () => {
  console.log(`Server is listening at http://localhost:${PORTA}`);
});


// WebSocket setup
io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);

  // upon connection - only to user
  socket.emit('message',
    {
      type: "admin",
      body: `Welcome, your username is ${socket.id.substring(0, 5)}`
    }
  )

  socket.emit('usernameAtrib', `${socket.id.substring(0, 5)}`)

  // upon connection - to everyoneelse
  socket.broadcast.emit('message',
    {
      type: "admin",
      body: `User ${socket.id.substring(0, 5)} connected`
    }
  )

  // Handle chat messages
  socket.on('message', (data) => {
    console.log(`${socket.id.substring(0, 5)}: ${data}`);

    // Broadcast the message to all connected clients
    io.emit('message', {
      type: "user",
      author: `${socket.id.substring(0, 5)}`,
      body: `${data}`
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
    socket.broadcast.emit('message', {
      type: "admin",
      body: `User ${socket.id.substring(0, 5)} disconnected`
    })
  });

  // listen for activity
  socket.on('activity', (name) => {
    socket.broadcast.emit('activity', name)
  })

});

server.listen(PORTB, () => {
  console.log(`Socket.IO server is running on port ${PORTB}`);
});