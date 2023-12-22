import { User } from "./User";

export class UserSocketID {
    public socketID: string = "";
    public User: User = [] as unknown as User;
    constructor(socketID: string, User: User) {
        this.socketID = socketID;
        this.User = User;
    }
}