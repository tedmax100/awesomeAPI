import {NextFunction, Request, RequestHandler, Response} from "express";

const _reqPathToGetAccountIdRegex = new RegExp(/\/bot\/([a-zA-Z_]{1,20})\/(\d{1,20})+/, "i");

/**
 * @param req 
 * @param res 
 * @param next
 * description: check path of request have account_id, and get jwt_key by account_id to verify and decode.
 */
const opts = {
    bodyKey: undefined,
    headerKey: undefined,
    queryKey: undefined,
    reqKey: undefined,
};
const queryKey = opts.queryKey || "access_token";
const bodyKey = opts.bodyKey || "access_token";
const headerKey = opts.headerKey || "Bearer";
const reqKey = opts.reqKey || "token";

let authBearer: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    // tslint:disable-next-line:one-variable-per-declaration
    let token: any;
    let error: boolean = false;

    if (req.query && req.query[queryKey]) {
        token = req.query[queryKey];
    }

    if (req.body && req.body[bodyKey]) {
        if (token) {
          error = true;
        }
        token = req.body[bodyKey];
    }

    if (req.headers && req.headers.authorization) {
        let parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && parts[0] === headerKey) {
          if (token) {
            error = true;
          }
          token = parts[1];
        }
    }

    // RFC6750 states the access_token MUST NOT be provided
    // in more than one place in a single request.
    if (error) {
        res.status(400).send();
      } else {
        req[reqKey] = token;
        next();
      }
};

export = authBearer;

