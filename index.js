const http = require("http").createServer();
http.address = "https://lavidasocket.onrender.com";
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

http.listen(8080, () =>
  console.log("listening on https://lavidasocket.onrender.com:8080")
);
