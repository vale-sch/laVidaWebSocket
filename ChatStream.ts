import { createClient } from "@supabase/supabase-js";
import { ChatHistory, Message } from "./ChatHistory";

export class ChatStream {
    private oldChatHistory: ChatHistory = new ChatHistory("", [], []);

    public client = createClient(
        "https://gwukjihudsttnfxqtqqq.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3dWtqaWh1ZHN0dG5meHF0cXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MDg2MjUsImV4cCI6MjAxNTE4NDYyNX0.V3vkXdseJwCsLA97H_4Zl4t9YW8xLu0o1yOLKErPjsQ"
    );

    public async startStreamingChat(chatID: string, io: any) {
        this.oldChatHistory = await ChatHistory.getChatHistory(chatID) as unknown as ChatHistory;
        this.client
            .channel('chat_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'chat_history',
                    filter: `chat_id=eq.${chatID}`//${infoStreamObj.chatID}`
                },
                (payload) => {
                    const newRecord = payload.new;
                    let chatHistoryTemp: any = [newRecord] as unknown as ChatHistory;
                    let chatHistory: ChatHistory = chatHistoryTemp[0] as unknown as ChatHistory;

                    let newMsg: Message = {
                        sender_id: "",
                        message: "",
                        time_sent: ""
                    };
                    while (this.oldChatHistory.messages.length < chatHistory.messages.length) {
                        newMsg = chatHistory.messages[this.oldChatHistory.messages.length];
                        this.oldChatHistory.messages.push(newMsg);
                    }
                    io.emit(`chat=${chatID}`, JSON.stringify(newMsg));
                    this.oldChatHistory = chatHistory;
                }
            )
            .subscribe()
    }
}




