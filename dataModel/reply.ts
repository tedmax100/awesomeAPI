import { Request} from "express";
import {ReplyMessage} from "../repository/reply";
import { User } from "./user";
import { APIStatus, ErrorCode } from "./APIStatus";

export class Reply {
    public messageId: number;
    public replyId: number;
    public reply: string;
    public time: number;
    public errorCode : ErrorCode;

    constructor() {
        this.reply = "";
        this.messageId = 0;
        this.replyId = 0 ;
        this.time = 0;
        this.errorCode = new ErrorCode();
    }

    public SetReplyByRequest = (req: Request) : Reply => {
        this.reply = req.body.reply;
        this.messageId = req.body.messageId;
        return this;
    }

    public  ReplyMessage = async (user: User) : Promise<Error|undefined> => {
        this.time= Date.now();

        let replySuccess = await  ReplyMessage(user, this);
        if (replySuccess) {
            return replySuccess;
        }
        return undefined;
     }

     public GetReplyReponse = (status : APIStatus, error?: number) => {
        return {
            sucess : status,
            replyId : this.replyId,
            errorCode : error == undefined?  undefined : this.errorCode!.SetStatus(error).PatchResponse.Code ,
            errorMessage : error  == undefined?  undefined : this.errorCode!.SetStatus(error).PatchResponse.Message,
        }
    }
 }