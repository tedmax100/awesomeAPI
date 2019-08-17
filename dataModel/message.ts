import { Request} from "express";
import {PostMessage} from "../repository/message";
import { User } from "./user";
import { APIStatus, ErrorCode } from "./APIStatus";

export class Message {
    public messageId: number;
    public message: string;
    public time: number;
    public errorCode : ErrorCode;

    constructor() {
        this.message = "";
        this.messageId = 0;
        this.time = 0;
        this.errorCode = new ErrorCode();
    }

    public SetMessageByRequest = (req: Request) : Message => {
        this.message = req.body.message;
        return this;
    }

    public  PostMessage = async (user: User) : Promise<Error|undefined> => {
        this.time= Date.now();

        let registerSuccess = await  PostMessage(user, this);
        if (registerSuccess) {
            return registerSuccess;
        }
        return undefined;
     }

     public GetPostReponse = (status : APIStatus, error?: number) => {
        return {
            sucess : status,
            messageId : this.messageId,
            errorCode : error == undefined?  undefined : this.errorCode!.SetStatus(error).PatchResponse.Code ,
            errorMessage : error  == undefined?  undefined : this.errorCode!.SetStatus(error).PatchResponse.Message,
        }
    }
 }