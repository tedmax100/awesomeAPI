import {NextFunction, Request, RequestHandler, Response} from "express";
import { isNullOrUndefined } from "util";
import {BaseRespone} from "../dataModel/baseResponse";
import { ErrorCode, APIStatus } from "../dataModel/APIStatus";
import {TokenVerify} from "../repository/user";

export const VerifyToken : RequestHandler = async (req: Request, res : Response, next: NextFunction) => {
    if ( isNullOrUndefined(req.body.token)) {
        return res.json(new BaseRespone().GetReponse(APIStatus.FAIL, ErrorCode.BAD_REQUEST));
    } 
    let token = req.body.token;
    let [error, user] = await TokenVerify(token);
    if (error) {
        return res.json(new BaseRespone().GetReponse(APIStatus.FAIL, parseInt(error.message)));
    }

    req.user = user;
    return next();
}