import express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as helmet from "helmet";
import authBearer = require("./middleware/authBearer");
import {UserRoutes} from "./routes/user";
// Creates and configures an ExpressJS web server.
class App {
    public express: express.Application;

    /**
     * Configure Express middleware.
     */
    constructor() {
        // -->Init: routes
        this.express = express();
        this.express.use(cors.default());
    
        this.middleware();
        this.routes();
        
        // todo: prepare your db here
    }
    private middleware(): void {
        this.express.use(helmet.default());
        this.express.use(authBearer);
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.text());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        //if (GetEnv() !== "dev") { this.express.use(decodeJWT); }
        //this.express.use(decodeJWT);
    }

    /**
     * Load all API endpoints
     *      -- create route endpoints here
     *      -- check the sample
     */
    private routes(): void {
        this.express.use("/user", UserRoutes);
    }
}
// tslint:disable-next-line:no-default-export
export default new App().express;
