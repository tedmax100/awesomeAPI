import { Request, Response, Router } from "express";
import { APIStatus, ErrorCode } from "../dataModel/APIStatus";
import * as models from "../dataModel/Models";
import {VerifyToken} from "../middleware/verifyToken";
// Define routers
export class UserRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
    
        this.init();
    }

    public init() {
        this.router.get("/", this.DefaultHandler);
        this.router.post("/register", this.Register);
        this.router.post("/login", this.Login);
        this.router.post("/message", VerifyToken, this.PostMessage);
        this.router.post("/message/reply", VerifyToken, this.ReplyMessage);
    }
    private DefaultHandler = async (req: Request, res: Response) => {
        return res.json("ok");
    }

    private ReplyMessage = async (req: Request, res: Response) => {
        const user = req.user as models.User;
        let message = new models.Reply().SetReplyByRequest(req);

        let postErr = await   message.ReplyMessage(user);;
        if (postErr ) {
            return res.json(message.GetReplyReponse(APIStatus.FAIL, parseInt(postErr.message))); 
        }
        return res.json(message.GetReplyReponse(APIStatus.SUCCESS));
    }

    private PostMessage = async (req: Request, res: Response) => {
        const user = req.user as models.User;
        let message = new models.Message().SetMessageByRequest(req);

        let postErr = await   message.PostMessage(user);;
        if (postErr ) {
            return res.json(message.GetPostReponse(APIStatus.FAIL, parseInt(postErr.message))); 
        }
        return res.json(message.GetPostReponse(APIStatus.SUCCESS));
    }

    private Register = async (req: Request, res: Response) => {
        const user = new models.User();
        let valid = user.SetUserByRequest(req).isValid();
        if (valid == false) {
            let aa = user.GetRegisterReponse(APIStatus.FAIL);
            return res.json(user.GetRegisterReponse(APIStatus.FAIL));
        }
        let registerErr = await user.RegisterUser();
        if (registerErr ) {
            return res.json(user.GetRegisterReponse(APIStatus.FAIL, parseInt(registerErr.message))); 
        }
        return res.json(user.GetRegisterReponse(APIStatus.SUCCESS));
    }

    private Login = async (req: Request, res: Response) => {
        const user = new models.User();
        let valid = user.SetUserByRequest(req).isValid();
        if (valid == false) {
            return res.json(user.GetLoginReponse(APIStatus.FAIL, undefined));
        }
        let loginErr = await user.LoginUser();
        if (loginErr ) {
            return res.json(user.GetLoginReponse(APIStatus.FAIL, parseInt(loginErr.message))); 
        }
        return res.json(user.GetLoginReponse(APIStatus.SUCCESS));
    }
}

const userRoutes = new UserRoutes();
userRoutes.init();
export let UserServiceRouter: Router = userRoutes.router;
