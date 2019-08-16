import { Request, Response, Router } from "express";
import {User} from "../dataModel/user";
// Define routers
export class UserRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
    
        this.init();
    }

    public init() {
        this.router.post("/register", this.Register);
        // this.router.post("/login", this.Login);
    }

    private Register = async (req: Request, res: Response) => {
        const user = new User();
        user.SetUserByRequest(req);

        return res.json("ok");
    }
}

const userRoutes = new UserRoutes();
userRoutes.init();
// tslint:disable-next-line:no-default-export
export let portalServiceRouter: Router = userRoutes.router;
