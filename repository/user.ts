import {User} from "../dataModel/user";
import {GetAwesomeDBConn} from "./connection";
import { ErrorCode } from "../dataModel/APIStatus";

export const TokenVerify = async (token: string) : Promise<[Error|undefined, User]> => {
    let tryGetConn = await GetAwesomeDBConn()
    if (tryGetConn[0] = undefined) {
        return [tryGetConn[0] , new User()];
    }
    return new Promise<[Error|undefined, User]>(resolve => {
        tryGetConn[1]!.query(`SELECT u.user_id
        FROM login AS l 
        INNER JOIN user AS u ON l.user_id = u.user_id
        WHERE l.token = ? AND l.time > ?
        ORDER BY id DESC
        LIMIT 1;`
        , [token, Date.now()-600000], (err, userData) => {
            if (err) {
                tryGetConn[1]!.release();
                return resolve([new Error(ErrorCode.SYSTEM_ERROR.toString()), new User()]);
            }
            if (userData.length == 0 ){
                tryGetConn[1]!.release();
                return resolve([new Error(ErrorCode.TOKEN_FAIL.toString()), new User()]);
            }
            let user = new User();
            user.userId = userData[0].user_id;
            return resolve([undefined, user]);
        })
    })
}

export const Login = async (user: User) : Promise<Error|undefined> => {
    let tryGetConn = await GetAwesomeDBConn()
    if (tryGetConn[0] = undefined) {
        return tryGetConn[0] ;
    }
    return new Promise<Error|undefined>(resolve => {
        tryGetConn[1]!.query("SELECT user_id, password FROM user WHERE username=?"
        , [user.username], (err, userData) => {
            if (err) {
                tryGetConn[1]!.release();
                return resolve(new Error(ErrorCode.SYSTEM_ERROR.toString()));
            }
            if (userData.length == 0 ){
                tryGetConn[1]!.release();
                return resolve(new Error(ErrorCode.NO_SUCH_USER.toString()));
            }
            if (user.password != userData[0].password) {
                tryGetConn[1]!.release();
                return resolve(new Error(ErrorCode.LOGIN_FAIL.toString()));
            }
            user.userId = userData[0].user_id;

            tryGetConn[1]!.query("INSERT INTO login (user_id, token, time) VALUES(?, ?,?)", [
                user.userId, user.token,  Date.now()
            ], (loginErr) => {
                tryGetConn[1]!.release();
                if (loginErr) {
                    return resolve(new Error(ErrorCode.SYSTEM_ERROR.toString()));
                }
                return resolve(undefined);
            })
        })
    })
};

export const Register = async (user: User) : Promise<[Error|undefined, number|undefined]> => {
    let tryGetConn = await GetAwesomeDBConn()
    if (tryGetConn[0] = undefined) {
        return [tryGetConn[0] , undefined];
    }
    return new Promise<[Error|undefined, number|undefined]>(resolve => {
        tryGetConn[1]!.query("INSERT INTO user (username,  password,  name, email, mobile) VALUES (?,? , ?,?,?);"
        , [user.username, user.password, user.name, user.email, user.mobile], (err, result) => {
            tryGetConn[1]!.release();
            if (err) {
                if (err.errno == 1062) {
                   if (err.message.indexOf("username") > -1) {
                    return resolve([new Error(ErrorCode.USERNAME_DUPLICATE.toString()), undefined]);
                   }
                   if (err.message.indexOf("mobile") > -1) {
                    return resolve([new Error(ErrorCode.MOBILE_DUPLICATE.toString()), undefined]);
                   }
                }
                return resolve([new Error(ErrorCode.SYSTEM_ERROR.toString()), undefined]);
            }
            return resolve([undefined, result.insertId]);
        })
    })
};
