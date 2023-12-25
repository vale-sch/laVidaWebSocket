import { createServer } from "http";
import { Server } from "socket.io";
import { User } from "./User";
import { ChatStream } from "./ChatStream";
import { OpenChats } from "./OpenChats";
import { UserSocketID } from "./UserSocketID";



let openChatsUsers: OpenChats[] = [] as unknown as OpenChats[];
let userSocketIDs: UserSocketID[] = [] as unknown as UserSocketID[];
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("onconnect", async (userIDSocket: string) => {
    let userID: number = JSON.parse(userIDSocket) as number;
    let user: User = (await User.fetchUsers()).find(user => user.id == userID) as User;
    userSocketIDs.push(new UserSocketID(socket.id, user));
    user.isActive = true;
    User.update_user_active(user.name, user.isActive);
  });

  socket.on("newChatPartner", (user: User) => {
    io.emit("newChat", user);
  });

  socket.on("newChatRequest", (usersInfo: string[]) => {
    io.emit(`${usersInfo[1]}`, usersInfo[0]);
  });

  socket.on("startChat", (chatID: string, userID: number) => {
    let chatIDInOpenChats = openChatsUsers.find(openChat => openChat.ChatStream.chatID == chatID)?.ChatStream.chatID;
    let userIDInOpenChats = openChatsUsers.find(openChat => openChat.userID == userID)?.userID;
    if (chatIDInOpenChats)
      if (userID == userIDInOpenChats)
        return;
    let newChatStream: ChatStream = new ChatStream(chatID, socket);
    newChatStream.startStreamingChat();
    let newOpenChat: OpenChats = new OpenChats(userID, newChatStream);
    openChatsUsers.push(newOpenChat);

  });

  socket.on("disconnect", async (error: string) => {
    let disconnectedUser: User = userSocketIDs.find(userSocketID => userSocketID.socketID == socket.id)?.User as User;
    if (disconnectedUser == undefined) return;
    disconnectedUser.isActive = false;
    //unsubscribe from all open chats from disconnected user
    let openChatsOfDisconnectedUser: OpenChats[] = openChatsUsers.filter(openChat => openChat.userID == disconnectedUser.id);
    openChatsOfDisconnectedUser.forEach(openChat => {
      openChat.ChatStream.channel.unsubscribe();
    });

    openChatsUsers = openChatsUsers.filter(openChat => openChat.userID != disconnectedUser.id);

    User.update_user_active(disconnectedUser.name, disconnectedUser.isActive);
  });
});



// Use the process.env.PORT provided by Render for dynamic port assignment
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`));



