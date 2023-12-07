export interface Message {
    sender_id: string;
    message: string;
    time_sent: string;
}

export class ChatHistory {
    public chat_id: string;
    messages: Message[];
    constructor(chat_id: string, messages: Message[]) {
        this.chat_id = chat_id;
        this.messages = messages;

    }

    static createNew(chat_id: string, sender_id: string): ChatHistory {
        const newMessage: Message = {
            sender_id: sender_id,
            message: "",
            time_sent: "",
        };

        return new ChatHistory(chat_id, [newMessage]);
    }

}