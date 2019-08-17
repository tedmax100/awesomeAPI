import { Request} from "express";
import {ErrorCode, APIStatus} from "./APIStatus";

export class BaseRespone {
    public errorCode : ErrorCode;

    constructor() {
        this.errorCode = new ErrorCode();
    }
    public GetReponse = (status : APIStatus, error?: number) => {
        if (this.errorCode.status > -1) {
            return {
                sucess : status,
                errorCode :  this.errorCode.PatchResponse.Code ,
                errorMessage :this.errorCode.PatchResponse.Message,
            }
        } 
        return {
            sucess : status,
            errorCode : error == undefined?  undefined : this.errorCode!.SetStatus(error).PatchResponse.Code ,
            errorMessage : error  == undefined?  undefined : this.errorCode!.SetStatus(error).PatchResponse.Message,
        }
    }
}