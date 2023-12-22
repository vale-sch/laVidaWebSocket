import { ChatStream } from "./ChatStream";

export class OpenChats {
    public userID: number = 0;
    public ChatStream: ChatStream = [] as unknown as ChatStream;

    constructor(userID: number, ChatHistory: ChatStream) {
        this.userID = userID;
        this.ChatStream = ChatHistory;
    }
}