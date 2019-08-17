import {User} from "../dataModel/user";
import {Message} from "../dataModel/message";
import {GetAwesomeDBConn} from "./connection";
import { ErrorCode } from "../dataModel/APIStatus";

export const PostMessage = async (user: User, message: Message) : Promise<Error|undefined> => { 
    let tryGetConn = await GetAwesomeDBConn()
    if (tryGetConn[0] = undefined) {
        return tryGetConn[0];
    }   
    return  new Promise<Error|undefined>(resolve => {
        tryGetConn[1]!.query("INSERT INTO message (user_id, message, time) VALUES (?, ?, ?)"
        , [user.userId, message.message, message.time]
        , (err, result)=>{
            tryGetConn[1]!.release();
            if (err) {
                return resolve(new Error(ErrorCode.SYSTEM_ERROR.toString()));
            }
            message.messageId = result.insertId;
            return resolve(undefined);
        })
    })
}