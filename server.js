const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", (socket) => {
  // Welcome current user
  socket.emit("message", "Welcome to Chat Cord App");

  // Broadcast when user connects - Admin
  socket.broadcast.emit("message", "A user has joined the chat.");

  // Runs when clients disconnect
  socket.on("disconnect", () => {
    io.emit("message", "User has left the chat!");
  });

  // Listen for chat message
  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg);
    console.log(msg);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
