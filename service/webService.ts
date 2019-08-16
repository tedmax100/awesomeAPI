
import * as rp from "request-promise";
import * as HttpStatusCodes from "../dataModel/HttpStatusCodes";
import { LoginInput } from "../dataModel/web/Login";
import { loginDevice, confirmLogin, refreshLiveTime, getDeviceLoginByDeviceId, getDeviceLoginByUserIdDeviceId, updateDeviceLoginStatus, getDeviceLoginByUserNameDeviceId } from "../repository/dao/deviceLoginDao";
import crypto from "crypto";
import { DeviceLogin } from "../dataModel/dbModel/DeviceLogin";
import { logger } from "../logger";
import { APIStatus } from "../dataModel/APIStatus";
import { MessageInput } from "../dataModel/web/Message";
import { GetConfigInstance } from "../config";
import { queryTicketById, getRandomId, updateTicketStatusData } from "../repository/dao/ticketDao";
import { isNullOrUndefined } from "util";
import { ItTicketStatus } from "../dataModel/enums/ItTicketStatus";
import DeviceEnum from "../dataModel/enums/DeviceEnum";
import DeviceLoginStatus from "../dataModel/enums/DeviceLoginStatus";

const _moduleTag = "WebService";

export class WebService {

    public constructor() {
    }

    public checkDeviceLogin = async (userId: number, deviceId: number, token: string): Promise<[number, DeviceLogin | undefined]> => {
        const device: [boolean, DeviceLogin | undefined] = await getDeviceLoginByUserIdDeviceId(userId, deviceId);
        if (device[0] === false) {
            return [APIStatus.NO_SUCH_USER, undefined];
        }
        if (device[1]!.status !== DeviceLoginStatus.STATUS_LOGINING) {
            if (device[1]!.status === DeviceLoginStatus.STATUS_DELETE) {
                return [APIStatus.DEVICE_CLEAR, undefined];
            }
            return [APIStatus.NOT_LOGIN, undefined];
        }
        if (device[1]!.token !== token) {
            return [APIStatus.NOT_LOGIN, undefined];
        }
        return [APIStatus.SUCCESS, device[1]];
    }

    public getDeviceId = async (): Promise<number> => {
        for (var i = 0; i < 5; i++) {
            const id = await getRandomId();
            const result: DeviceLogin[] = await getDeviceLoginByDeviceId(id);
            if (result.length === 0) {
                return id;
            }
        }
        return -1;
    }

    public login = async (input: LoginInput, ticketId: string): Promise<[number, number]> => {
        debugger
        const ticket: [boolean, any] = await queryTicketById(ticketId);
        if (ticket[0] === false || isNullOrUndefined(ticket[1]) || ticket[1].status != ItTicketStatus.ONGOING) {
            return [APIStatus.PARAMS_ERROR, 0];
        }
        const data = JSON.parse(ticket[1].data);
        const isSuccess: boolean = await loginDevice(input.setToken(crypto.randomBytes(26).toString('hex')).setDeviceId(data.deviceId).setDevice(DeviceEnum.parse(data.device)));
        if (isSuccess) {
            data.userId = input.userId;
            updateTicketStatusData(ticketId, ItTicketStatus.COMPLETE, data);
        }
        return [isSuccess ? APIStatus.SUCCESS : APIStatus.FAIL, input.deviceId];//code, deviceId
    }

    public isLogin = async (input: LoginInput, ticketId: string): Promise<[boolean, DeviceLogin | undefined]> => {
        const ticket: [boolean, any] = await queryTicketById(ticketId);
        if (ticket[0] === false || isNullOrUndefined(ticket[1]) || ticket[1].status != ItTicketStatus.COMPLETE) {
            return [false, undefined];
        }
        const data = JSON.parse(ticket[1].data);
        const device: [boolean, DeviceLogin | undefined] = await getDeviceLoginByUserIdDeviceId(data.userId, input.deviceId);
        if (device[0] === false || device[1]!.status !== DeviceLoginStatus.STATUS_LOGIN) {
            return device;
        }
        const result: boolean = await confirmLogin(data.userId, input);
        if (result) {
            updateTicketStatusData(ticketId, ItTicketStatus.RECYCLED);
            return device;
        }
        return [false, undefined]
    }

    public refreshLiveTime = async (input: LoginInput): Promise<number> => {
        const result: boolean = await refreshLiveTime(input);
        if (result) {
            return APIStatus.SUCCESS;
        }
        return APIStatus.FAIL
    }

    public logout = async (input: LoginInput): Promise<number> => {
        const result: boolean = await updateDeviceLoginStatus(input.userId, input.deviceId, DeviceLoginStatus.STATUS_NOT_LOGIN);
        if (result) {
            return APIStatus.SUCCESS;
        }
        return APIStatus.FAIL
    }

    public isClear = async (userId: number, deviceId: number): Promise<boolean> => {
        const device: [boolean, DeviceLogin | undefined] = await getDeviceLoginByUserIdDeviceId(userId, deviceId);
        if (device[0] && device[1]!.status === DeviceLoginStatus.STATUS_DELETE) {
            return true
        }
        return false;
    }

    public isClearByName = async (userName: string, deviceId: number): Promise<boolean> => {
        const device: [boolean, DeviceLogin | undefined] = await getDeviceLoginByUserNameDeviceId(userName, deviceId);
        if (device[0] && device[1]!.status === DeviceLoginStatus.STATUS_DELETE) {
            return true
        }
        return false;
    }

    public sendMessage = async (input: MessageInput): Promise<number> => {
        const _funTag = _moduleTag + "_sendMessage";
        const data = {
            messages: [input]
        };
        let reqOptions = {
            body: data,
            headers: {
                Authorization: `Bearer ${Buffer.from(input.token).toString('base64')}`,
                device: 'web'
            },
            json: true,
            method: "POST",
            timeout: 10000,
            uri: GetConfigInstance().MessageService + `/message/send_message/${input.userName}`,
        };
        return new Promise<number>((resolve, reject) => {
            let startTime = Date.now();
            rp.post(reqOptions, (err, res, body) => {
                let elapsed = Date.now() - startTime;
                if (err || res.statusCode !== HttpStatusCodes.default.OK) {
                    logger.error(_funTag, {
                        msg: err,
                        url: reqOptions.uri,
                    });
                    return resolve(APIStatus.FAIL); // reject(false);
                }
                logger.debug(_funTag, { elapsed, status: res.statusCode, data });
                return resolve(res.body.status);
            });
        });
    }
}

export const webService = new WebService();