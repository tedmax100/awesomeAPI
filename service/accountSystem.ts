import * as rp from "request-promise";
import { GetConfigInstance} from "../config";
// tslint:disable-next-line:import-spacing
import * as HttpStatusCodes  from "../dataModel/HttpStatusCodes";
import {logger} from "../logger";
import { RemoteControlInput } from "../dataModel/portal/RemoteControlData";
import { APIStatus } from "../dataModel/APIStatus";

const _moduleTag = "accountSystem";

export class AccountSystem {
    public remoteControl = async (data: RemoteControlInput): Promise<[boolean, number]> => {
        const _funTag = _moduleTag + "_remoteControl";
        let reqOptions = {
            body : data,
            json: true,
            method: "POST",
            timeout : 10000,
            uri:  GetConfigInstance().accountSystem.url + "/AccountSystem/seccom/server_service/remoteControl",
        };
        return new Promise<[boolean, number]>((resolve, reject) => {
            let startTime = Date.now();
            rp.post(reqOptions, (err, res, body) => {
                let elapsed = Date.now() - startTime;
                if (err || res.statusCode !== HttpStatusCodes.default.OK) {
                    logger.error(_funTag, {
                        msg: err,
                        url: reqOptions.uri,
                     });
                    return resolve([false, APIStatus.FAIL]); // reject(false);
                }
                logger.debug(_funTag, {elapsed, status: res.statusCode, data});
                if (res.body.status == APIStatus.SUCCESS) {
                    return resolve([true, 1]);
                } else {
                    return resolve([false, res.body.status]);
                }
            });
        });
    }

    public resetPasswordConfirm = async (ticket: string, password: string): Promise<[boolean, number]> => {
        const _funTag = _moduleTag + "_resetPasswordConfirm";
        let reqOptions = {
            form : {
                ticket_id: ticket,
                password: password
            },
            json: true,
            method: "POST",
            timeout : 10000,
            uri:  GetConfigInstance().accountSystem.url + "/AccountSystem/seccom/it_service/change_password_confirm",
        };
        return new Promise<[boolean, number]>((resolve, reject) => {
            let startTime = Date.now();
            rp.post(reqOptions, (err, res, body) => {
                let elapsed = Date.now() - startTime;
                logger.debug(_funTag, {elapsed, status: res.statusCode});
                if (err || res.statusCode !== HttpStatusCodes.default.OK) {
                    logger.error(_funTag, {
                        msg: err,
                        url: reqOptions.uri,
                     });
                    return resolve([false, APIStatus.FAIL]); // reject(false);
                }
                if (res.body.status == APIStatus.SUCCESS) {
                    return resolve([true, 1]);
                } else {
                    return resolve([false, res.body.status]);
                }
            });
        });
    }

    public sendResetPasswordEmail = async (email: string): Promise<[boolean, number]> => {
        const _funTag = _moduleTag + "_resetPassword";
        let reqOptions = {
            form : {
                email: email,
            },
            json: true,
            method: "POST",
            timeout : 10000,
            uri:  GetConfigInstance().accountSystem.url + "/AccountSystem/seccom/portal_service/forget_password",
        };
        return new Promise<[boolean, number]>((resolve, reject) => {
            let startTime = Date.now();
            rp.post(reqOptions, (err, res, body) => {
                let elapsed = Date.now() - startTime;
                logger.debug(_funTag, {elapsed, status: res.statusCode});
                if (err || res.statusCode !== HttpStatusCodes.default.OK) {
                    logger.error(_funTag, {
                        msg: err,
                        url: reqOptions.uri,
                     });
                    return resolve([false, APIStatus.FAIL]); // reject(false);
                }
                if (res.body.status == APIStatus.SUCCESS) {
                    return resolve([true, 1]);
                } else {
                    return resolve([false, res.body.status]);
                }
            });
        });
    }

    public confirmEmailChange = async (ticketId: string): Promise<[boolean, number]> => {
        const _funTag = _moduleTag + "_resetPassword";
        let reqOptions = {
            form : {
                ticket_id: ticketId,
            },
            json: true,
            method: "POST",
            timeout : 10000,
            uri:  GetConfigInstance().accountSystem.url + "/AccountSystem/seccom/it_service/change_email_confirm",
        };
        return new Promise<[boolean, number]>((resolve, reject) => {
            let startTime = Date.now();
            rp.post(reqOptions, (err, res, body) => {
                let elapsed = Date.now() - startTime;
                logger.debug(_funTag, {elapsed, status: res.statusCode});
                if (err || res.statusCode !== HttpStatusCodes.default.OK) {
                    logger.error(_funTag, {
                        msg: err,
                        url: reqOptions.uri,
                     });
                    return resolve([false, APIStatus.FAIL]); // reject(false);
                }
                if (res.body.status == APIStatus.SUCCESS) {
                    return resolve([true, 1]);
                } else {
                    return resolve([false, res.body.status]);
                }
            });
        });
    }

    public getContacs = async (username: string, token: string): Promise<[boolean, number]> => {
        const _funTag = _moduleTag + "_getContacs";
        let reqOptions = {
            form : {
                user_name: username,
                token: token
            },
            headers:{
                device: 'portal'
            },
            json: true,
            method: "POST",
            timeout : 10000,
            uri:  GetConfigInstance().accountSystem.url + "/AccountSystem/seccom/user_service/get_contacts",
        };
        return new Promise<[boolean, number]>((resolve, reject) => {
            let startTime = Date.now();
            rp.post(reqOptions, (err, res, body) => {
                let elapsed = Date.now() - startTime;
                debugger
                logger.debug(_funTag, {elapsed, status: res.statusCode});
                if (err || res.statusCode !== HttpStatusCodes.default.OK) {
                    logger.error(_funTag, {
                        msg: err,
                        url: reqOptions.uri,
                     });
                    return resolve([false, APIStatus.FAIL]); // reject(false);
                }
                if (res.body.status == APIStatus.SUCCESS) {
                    return resolve([true, body.contacts]);
                } else {
                    return resolve([false, res.body.status]);
                }
            });
        });
    }
}

export const accountSystem = new AccountSystem();