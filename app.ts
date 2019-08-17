import express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import {UserServiceRouter} from "./routes/user";

// Creates and configures an ExpressJS web server.
class App {
    public express: express.Application;

    /**
     * Configure Express middleware.
     */
    constructor() {
        // -->Init: routes
        this.express = express();
    
        this.middleware();
        this.routes();
    }
    private middleware(): void {
        this.express.use(helmet.default());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.text());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    /**
     * Load all API endpoints
     */
    private routes(): void {
        this.express.use("/user", UserServiceRouter);
    }
}

export default new App().express;
