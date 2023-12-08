import { createClient } from "@supabase/supabase-js";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { InfoStream } from "./InfoStream";
import { ChatHistory } from "./ChatHistory";
import { User } from "./User";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});
let infoStreamObj: InfoStream = new InfoStream();
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
    infoStreamObj = JSON.parse(infoStream) as InfoStream;
    io.emit("infoStream", infoStream);
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



let client = createClient(
  "https://gwukjihudsttnfxqtqqq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3dWtqaWh1ZHN0dG5meHF0cXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MDg2MjUsImV4cCI6MjAxNTE4NDYyNX0.V3vkXdseJwCsLA97H_4Zl4t9YW8xLu0o1yOLKErPjsQ"
);

const changes = client
  .channel('chat_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'chat_history',
      filter: `chat_id=eq.${infoStreamObj.chatID}`//${infoStreamObj.chatID}`
    },
    (payload) => {
      const newRecord = payload.new;
      let chatHistory: ChatHistory = [newRecord] as unknown as ChatHistory;

      console.log(chatHistory);
      io.emit(`chat=${infoStreamObj.chatID}`, JSON.stringify(chatHistory));

    }
  )
  .subscribe()