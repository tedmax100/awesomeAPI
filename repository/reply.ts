import {User} from "../dataModel/user";
import {Reply} from "../dataModel/reply";
import {GetAwesomeDBConn} from "./connection";
import { ErrorCode } from "../dataModel/APIStatus";

export const ReplyMessage = async (user: User, reply: Reply) : Promise<Error|undefined> => { 
    let tryGetConn = await GetAwesomeDBConn()
    if (tryGetConn[0] = undefined) {
        return tryGetConn[0];
    }   
    return  new Promise<Error|undefined>(resolve => {
        tryGetConn[1]!.query(`INSERT INTO reply (user_id, message_id, reply, time) 
        (
            SELECT ?, ?, ?, ? FROM message WHERE id = ?
        )`
        , [user.userId, reply.messageId, reply.reply, reply.time, reply.messageId]
        , (err, result)=>{
            tryGetConn[1]!.release();
            if (err) {
                return resolve(new Error(ErrorCode.SYSTEM_ERROR.toString()));
            }
            reply.replyId = result.insertId;
            return resolve(undefined);
        })
    })
}