export enum APIStatus {
    SUCCESS = 1, 
    FAIL = 0,
}


type NSTypes = {
    [key: number] : string;
} 

export interface StatusAndMessage{
    Code : number,
    Message: string
}
/* export interface Error  */
export  class ErrorCode {
    public status: number;
    public message?: string;

    /* enum properties */
    public static readonly BAD_REQUEST = 0;
    public static readonly USERNAME_DUPLICATE: number = 1;
    public static readonly MOBILE_DUPLICATE = 2;
    public static readonly NO_SUCH_USER=3;
    public static readonly LOGIN_FAIL = 4;
    public static readonly TOKEN_FAIL = 5;
    public static readonly NOT_LOGIN = 6;
    public static readonly SYSTEM_ERROR = 99;
    public Descriptions: NSTypes ; 

    constructor() {
        this.status = -1;
        this.Descriptions = {
            0: "BAD_REQUEST",
            1: "USERNAME_DUPLICATE",
            2: "MOBILE_DUPLICATE",
            3:"NO_SUCH_USER",
            4:"LOGIN_FAIL",
            5: "TOKEN_FAIL",
            6: "NOT_LOGIN",
            99: "SYSTEM_ERROR",
        }
    }

    public SetStatus(status: number) {
        this.status = status;
        this.message = this.Descriptions[status];
        return this;
    }

    get PatchResponse(): StatusAndMessage {
        return {
            Code : this.status,
            Message: this.message!
        }
    }
}
