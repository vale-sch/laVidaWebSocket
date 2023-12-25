import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { ChatHistory } from "./ChatHistory";

export class ChatStream {

    public client = createClient(
        "https://gwukjihudsttnfxqtqqq.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3dWtqaWh1ZHN0dG5meHF0cXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MDg2MjUsImV4cCI6MjAxNTE4NDYyNX0.V3vkXdseJwCsLA97H_4Zl4t9YW8xLu0o1yOLKErPjsQ"
    );
    public chatID: string = "";
    public socket: any;
    public channel: RealtimeChannel = [] as unknown as RealtimeChannel;
    constructor(chatID: string, socket: any) {
        this.chatID = chatID;
        this.socket = socket;
    }


    public async startStreamingChat() {
        this.channel = this.client
            .channel('chat_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'chat_history',
                    filter: `chat_id=eq.${this.chatID}`//${infoStreamObj.chatID}`
                },
                (payload) => {
                    const newRecord = payload.new;
                    let chatHistory: ChatHistory = [newRecord][0] as unknown as ChatHistory;
                    let newMsg = chatHistory.messages[chatHistory.messages.length - 1];
                    this.socket.emit(this.chatID, JSON.stringify(newMsg));
                }
            )
            .subscribe()
    }

}




