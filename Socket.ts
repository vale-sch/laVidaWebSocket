import { createClient } from "@supabase/supabase-js";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { UserObject } from "./UserObject";
import { ChatHistory } from "./ChatHistory";
import { User } from "./User";
import { ChatStream } from "./ChatStream";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});
let infoStreamObj: UserObject = new UserObject();
let users: User[] = Array<User>();

User.fetchUsers();

io.on("connection", (socket) => {
  console.log(`a user connected, ID: ${socket.id}`);
  socket.on("onconnect", (userIDSocket: string) => {
    let userID: number = JSON.parse(userIDSocket) as number;
    User.usersDB.forEach(user => {
      if (userID == user.id) {
        user.isActive = true;
        User.update_user_active(user.name, user.isActive);
      }
    });
  });


  socket.on("infoStream", (infoStream: string) => {
    infoStreamObj = JSON.parse(infoStream) as UserObject;
    io.emit("infoStream", infoStream);
    let newChatStream: ChatStream = new ChatStream();
    newChatStream.startStreamingChat(infoStreamObj.chatID, io)
  });

  socket.on("disconnect", (error: string) => {
    // users.forEach(userInUsers => {
    //   if (userInUsers.ioClientID == socket.id) {
    //     console.log("USER CONNECTION CLOSED");
    //     userInUsers.isActive = false;
    //     User.update_user_active(userInUsers.name, userInUsers.isActive);
    //   }
    // });
  });
});



// Use the process.env.PORT provided by Render for dynamic port assignment
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`));



