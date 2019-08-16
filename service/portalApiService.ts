
import { AccountInfo } from "../dataModel/dbModel/AccountInfo";
import { insertAccountInfo, queryConfirmedUserByEmail, verifyAccountInfo } from "../repository/dao/accountInfoDao";
import { insertTicket, queryTicketById } from "../repository/dao/ticketDao";
import { logger } from "../logger";
import * as jwt from "jsonwebtoken";
import { getCert } from "../middleware/JWT";
import { GetConfigInstance, GetEnv } from "../config";
import { isNullOrUndefined } from "util";
import { APIStatus } from "../dataModel/APIStatus";
import { ItTicket } from "../dataModel/dbModel/ItTicket";
import { setLoginTime, getLoginTime } from "../repository/redisRepository";
import { FeedbackInput } from "../dataModel/portal/Feedback";
import { insertFeedback } from "../repository/dao/feedbackDao";
import { accountSystem } from "./accountSystem";
import { UserProfile } from "../dataModel/portal/UserData";
import { ItTicketStatus } from "../dataModel/enums/ItTicketStatus";

const _moduleTag = "portalApiService";

export class PortalApiService {

    public constructor() {
    }
    
    public register = async (accountInfo: AccountInfo): Promise<[number, number]> => {
        const funcTag = _moduleTag + "_register";
        try {
            return await insertAccountInfo(accountInfo);
        } catch (exp){
            logger.error(funcTag, exp);
        }
        return [APIStatus.FAIL, 0];
    }
    
    public loginAccountInfo = async (accountInfo: AccountInfo): Promise<[number, AccountInfo|undefined]> => {
        const funcTag = `${_moduleTag}_loginAccountInfo`;
        let loginTime: number = await getLoginTime(accountInfo.email);
        if(loginTime > 3){
            return [APIStatus.DATA_LOCK, undefined];
        }
        const result: [boolean, AccountInfo|undefined] = await queryConfirmedUserByEmail(accountInfo.email);
        if( result[0] == false ){
            return [APIStatus.NO_SUCH_USER, undefined];
        }
        if(accountInfo.password != result[1]!.password){
            await setLoginTime(accountInfo.email, loginTime++);
            return [APIStatus.PARAMS_ERROR, undefined];
        }
        return [APIStatus.SUCCESS, result[1]!.hidePrivacy()];
    }

    public refreshTicket = async (itTicket: ItTicket): Promise<string> => {
        insertTicket(itTicket);
        return itTicket.ticketId;
    }

    public verify = async (userId: number, ticket: string): Promise<[boolean, number]> => {
        const funcTag = _moduleTag + "_verify";
        try {
            return await verifyAccountInfo(userId, ticket);
        } catch (exp){
            logger.error(funcTag, exp);
        }
        return [false, APIStatus.FAIL];
    }
    
    public getToken = async (accountInfo: any): Promise<string> => {
        const _option: jwt.SignOptions = GetConfigInstance().jwtOption;
        return jwt.sign({
            data: accountInfo
            }
            , (await getCert()).value!
            , _option);
    }
    
    public isTicketValid = async (ticketId: string): Promise<boolean> => {
        const result: [boolean, any] = await queryTicketById(ticketId);
        if( result[0] == false ||  isNullOrUndefined(result[1]) || result[1].status != ItTicketStatus.ONGOING) {
            return false;
        }
        return true;
    }

    public queryPasswordByMail = async (email: string): Promise<[number, AccountInfo|undefined]> => {
        const funcTag = _moduleTag + "_queryPasswordByMail";
        try {
            const result: [boolean, AccountInfo|undefined] = await queryConfirmedUserByEmail(email);
            if( result[0] == false ){
                return [APIStatus.NO_SUCH_USER, undefined];
            }
            return [APIStatus.SUCCESS, result[1]];
        } catch (exp){
            logger.error(funcTag, exp);
            return [APIStatus.FAIL, undefined];
        }
    }

    public getContacts = async (user: UserProfile): Promise<[number, any]>=> {
        const funcTag = `${_moduleTag}_getContacts`;
        const ss: [boolean, any] = await accountSystem.getContacs(user.userName, user.token);
        if(ss[0]){
            return [APIStatus.SUCCESS, ss[1]];
        }
        return [ss[1], undefined];
    }


    public feedback = (input: FeedbackInput) => {
        const funcTag = _moduleTag + "_feedback";
        insertFeedback(input).then((res: boolean) =>{
            logger.debug({funcTag, res});
        }).catch((err) => {
            logger.error({funcTag, err});
        });
    }

}

export const portalApiService = new PortalApiService();

