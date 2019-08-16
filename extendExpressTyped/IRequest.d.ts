declare namespace Express {
  // tslint:disable-next-line:interface-name
  interface Request {
    token?: string;
    decode_body?: string;
    accountId?: number;
    apiKey?: string;
    session?: any;
    userId?: number;
    user?: any;
  }
}
