import { createServer } from "http";
import { Server } from "socket.io";
import { User } from "./User";
import { ChatStream } from "./ChatStream";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});
let users: User[] = Array<User>();

User.fetchUsers();

io.on("connection", (socket) => {
  console.log(`a user connected, ID: ${socket.id}`);
  socket.on("onconnect", (userIDSocket: string) => {
    let userID: number = JSON.parse(userIDSocket) as number;
    User.usersDB.forEach(user => {
      if (userID == user.id) {
        user.socketID = socket.id;
        user.isActive = true;
        User.update_user_active(user.name, user.isActive);
      }
    });
  });


  socket.on("startChat", (chatID: string) => {
    let newChatStream: ChatStream = new ChatStream();
    newChatStream.startStreamingChat(chatID, io)
  });

  socket.on("disconnect", (error: string) => {
    users.forEach(userInUsers => {
      if (userInUsers.socketID == socket.id) {
        console.log("USER CONNECTION CLOSED");
        userInUsers.isActive = false;
        User.update_user_active(userInUsers.name, userInUsers.isActive);
      }
    });
  });
});



// Use the process.env.PORT provided by Render for dynamic port assignment
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`));



