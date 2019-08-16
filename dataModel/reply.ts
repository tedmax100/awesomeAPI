export class reply {
    public replyId : number ;
    public messageId: number;
    public reply : string;

    constructor() {
        this.messageId = 0;
        this.reply = "";
        this.replyId = 0;
    }
}