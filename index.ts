import { createClient } from "@supabase/supabase-js";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { InfoStream } from "./InfoStream";
import { ChatHistory } from "./ChatHistory";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});
let infoStreamObj: InfoStream = new InfoStream();
let client = createClient(
  "https://gwukjihudsttnfxqtqqq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3dWtqaWh1ZHN0dG5meHF0cXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MDg2MjUsImV4cCI6MjAxNTE4NDYyNX0.V3vkXdseJwCsLA97H_4Zl4t9YW8xLu0o1yOLKErPjsQ"
);


io.on("connection", (socket) => {
  console.log(`a user connected, ID: ${socket.id}`);
  socket.on("infoStream", (infoStream) => {
    infoStreamObj = JSON.parse(infoStream) as InfoStream;

    io.emit("infoStream", infoStream);
  });
});

// Use the process.env.PORT provided by Render for dynamic port assignment
const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`));




let increment: number = 0;
const changes = client
  .channel('chat_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'chat_history',
      filter: `chat_id=eq.1701971307720`//${infoStreamObj.chatID}`
    },
    (payload) => {
      const newRecord = payload.new;
      let chatHistory: ChatHistory = [newRecord] as unknown as ChatHistory;

      console.log(chatHistory);
      io.emit("chat=1701971307720", JSON.stringify(chatHistory));

    }
  )
  .subscribe()