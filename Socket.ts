import { createServer } from "http";
import { Server } from "socket.io";
import { User } from "./User";
import { ChatStream } from "./ChatStream";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("onconnect", async (userIDSocket: string) => {
    let userID: number = JSON.parse(userIDSocket) as number;
    (await User.fetchUsers()).forEach(user => {
      if (userID == user.id) {
        user.socketID = socket.id;
        user.isActive = true;
        User.update_user_active(user.name, user.isActive);
      }
    });
  });
  socket.on("newChatPartner", (user: User) => {
    io.emit("newChat", user);
  });
  socket.on("startChat", (chatID: string) => {
    let newChatStream: ChatStream = new ChatStream();
    newChatStream.startStreamingChat(chatID, io)
  });
  socket.on("disconnect", async (error: string) => {
    (await User.fetchUsers()).forEach(userInUsers => {
      if (userInUsers.socketID == socket.id) {
        userInUsers.isActive = false;
        User.update_user_active(userInUsers.name, userInUsers.isActive);
      }
    });
  });
});



// Use the process.env.PORT provided by Render for dynamic port assignment
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`));



