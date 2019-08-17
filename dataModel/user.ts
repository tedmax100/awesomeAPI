import { Request} from "express";
import {Register, Login} from "../repository/user";
import {ErrorCode, APIStatus} from "./APIStatus";

const usernameRegex = "^[a-zA-Z][a-zA-Z0-9.,$;]+$"; 
const  passowrdRegex = "^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"

export class User {
    public username: string;
    public password :string;
    public  name :string;
    public email : string;
    public mobile: string;
    public token?: string;
    public userId: number;
    public errorCode : ErrorCode;

    constructor() {
        this.email = "";
        this.mobile="";
        this.name="";
        this.password="";
        this.token="";
        this.username="";
        this.userId = 0;
        this.errorCode = new ErrorCode();
        this.token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    public SetUserByRequest = (req: Request) : User => {
        this.username = req.body.username;
        this.token =  req.body.token || this.token;
        this.password = req.body.password;
        this.name  = req.body.name;
        this.mobile = req.body.mobile;
        this.email = req.body.email;
        return this;
    }

    private RegexTest = (target :string,  regexPattern : string) : boolean=> {
        return new RegExp(regexPattern).test(target);
    }

    private usernameIsValid = () : boolean => {
        if ( this.RegexTest(this.username, usernameRegex) == false 
            || this.username.length < 6 
            || this.username.length > 20) 
        {
            this.errorCode.SetStatus(ErrorCode.BAD_REQUEST);
            return false;
        }
        return true;
    }

    private passwordIsValid = () : boolean => {
        if ( this.RegexTest(this.password, passowrdRegex) == false 
            || this.password.length < 6 
            || this.password.length > 20) 
        {
            this.errorCode.SetStatus(ErrorCode.BAD_REQUEST);
            return false;
        }
        return true;
    }

    public isValid = () : boolean => {
       return this.usernameIsValid() && this.passwordIsValid()
    }
    
    public  RegisterUser = async () : Promise<Error|undefined> => {
       let registerSuccess = await  Register(this);
       if (registerSuccess[0] != undefined) {
           return registerSuccess[0];
       }
       this.userId = registerSuccess[1]!;
       return undefined;
    }

    public  LoginUser = async () : Promise<Error|undefined> => {
        let loginSuccess = await  Login(this);
        if (loginSuccess != undefined) {
            return loginSuccess;
        }
        return undefined;
     }

    public GetRegisterReponse = (status : APIStatus, error?: number) => {
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

    public GetLoginReponse = (status : APIStatus, error?: number) => {
        if (this.errorCode.status > -1) {
            return {
                sucess : status,
                token : this.token,
                errorCode :  this.errorCode.PatchResponse.Code ,
                errorMessage :this.errorCode.PatchResponse.Message,
            }
        } 
        return {
            sucess : status,
            token : this.token,
            errorCode : error == undefined?  undefined : this.errorCode!.SetStatus(error).PatchResponse.Code ,
            errorMessage : error  == undefined?  undefined : this.errorCode!.SetStatus(error).PatchResponse.Message,
        }
    }
}