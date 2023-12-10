import { createClient } from "@supabase/supabase-js";
import { ChatHistory } from "./ChatHistory";

export class UserObject {

    public url: string = "";
    public myUsername: string = "";
    public chatID: string = "";
    public partnerUsername: string = "";
    public acceptedChatInvite: boolean = false;
}

