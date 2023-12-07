const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: {
    origin: ["http://127.0.0.1:5500", "https://lavidasocket.onrender.com"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", message);
  });
});

// Use the process.env.PORT provided by Render for dynamic port assignment
const PORT = process.env.PORT || 8080;

http.listen(PORT, () => console.log(`listening on port ${PORT}`));
