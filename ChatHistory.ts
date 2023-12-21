export interface Message {
    sender_id: string;
    message: string;
    time_sent: string;
}
interface ChatHistoryResponse {
    chat_id: string;
    messages: Message[];
    participants: string[];
}

export class ChatHistory {
    public chat_id: string;
    public participants: string[];
    messages: Message[];
    constructor(chat_id: string, messages: Message[], participants: string[]) {
        this.chat_id = chat_id;
        this.messages = messages;
        this.participants = participants;
    }



    static createNew(chat_id: string, sender_id: string, participants: string[]): ChatHistory {
        const newMessage: Message = {
            sender_id: sender_id,
            message: "",
            time_sent: "",
        };

        return new ChatHistory(chat_id, [newMessage], participants);
    }
    static fromDatabase(data: { chat_id: string; messages: Message[], participants: string[] }): ChatHistory {
        return new ChatHistory(data.chat_id, data.messages, data.participants);
    }

    // Modify the method to use the defined interface
    static async getChatHistory(_chatID: string): Promise<ChatHistory | string> {
        try {
            const response = await fetch(`https://lavida-server.vercel.app/api/receive_chat?chatID=${_chatID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                const responseData = await response.json() as ChatHistoryResponse;
                return ChatHistory.fromDatabase(responseData);
            } else {
                const data = await response.json();
                return data as string;
            }
        } catch (error: any) {
            return `Nothing fetched: ${error}`;
        }
    }
}