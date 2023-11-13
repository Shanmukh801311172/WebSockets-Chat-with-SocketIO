const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let connectedUsers = 0;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  connectedUsers++;
  const userId = connectedUsers; 
  socket.emit('user id', userId); 
  io.emit('user count', connectedUsers);

  console.log(`User ${userId} connected. Total users: ${connectedUsers}`);
  socket.on('chat message', (msg) => {
    io.emit('chat message', { userId, message: msg });
  });

  socket.on('disconnect', () => {
    connectedUsers--;
    io.emit('user count', connectedUsers);
    console.log(`User ${userId} disconnected. Total users: ${connectedUsers}`);
  });
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});