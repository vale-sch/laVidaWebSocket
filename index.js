const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", message);
  });
});

// Specify your deployed address here without the protocol
const deployedAddress = "lavidasocket.onrender.com";

http.listen(10000, deployedAddress, () =>
  console.log(`listening on ${deployedAddress}:10000`)
);
