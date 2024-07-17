const express = require("express");
const { createServer } = require("http");
const { join } = require("path");
const app = express();
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on('disconnect',()=> {
    console.log("Disconnected");
  })
});

server.listen(8000, () => {
  console.log("server running at http://localhost:8000");
});
