import { Request} from "express";

const usernameRegex = "^[a-zA-Z][a-zA-Z0-9.,$;]+$"; 
const  passowrdRegex = "/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/"

export class User {
    public username: string;
    public password :string;
    public  name :string;
    public email : string;
    public mobile: string;
    public token?: string;

    constructor() {
        this.email = "";
        this.mobile="";
        this.name="";
        this.password="";
        this.token="";
        this.username="";
    }

    public SetUserByRequest(req: Request) {
        this.username = req.body.username;
        this.token = req.body.token ;
        this.password = req.body.password;
        this.name  = req.body.name;
        this.mobile = req.body.mobile;
        this.email = req.body.email;

    }
}