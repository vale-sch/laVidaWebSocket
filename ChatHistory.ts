export interface Message {
    sender_id: string;
    message: string;
    time_sent: string;
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

}