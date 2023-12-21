import { createClient } from "@supabase/supabase-js";
import { ChatHistory } from "./ChatHistory";

export class ChatStream {
    public client = createClient(
        "https://gwukjihudsttnfxqtqqq.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3dWtqaWh1ZHN0dG5meHF0cXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MDg2MjUsImV4cCI6MjAxNTE4NDYyNX0.V3vkXdseJwCsLA97H_4Zl4t9YW8xLu0o1yOLKErPjsQ"
    );

    public async startStreamingChat(chatID: string, socket: any) {
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
                    let chatHistory: ChatHistory = [newRecord][0] as unknown as ChatHistory;
                    let newMsg = chatHistory.messages[chatHistory.messages.length - 1];
                    socket.emit(`chat=${chatID}`, JSON.stringify(newMsg));
                }
            )
            .subscribe()
    }
}




