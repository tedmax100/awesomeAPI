import { isNullOrUndefined } from "util";
import {User} from "../dataModel/user"l;
import * as mysqlClient from "mysql";
const _conn: mysqlClient.Pool;

this._writablePool = mysqlClient.createPool({
    connectionLimit : _config.writer,
    database : _config.database,
    host : _config.clusterPoint, // "debug-cluster-1.cluster-cbblyhmktdq8.ap-northeast-1.rds.amazonaws.com",
    multipleStatements : true,
    password : _config.password,
    port : _config.port,
    user : _config.account,
    charset:"utf8mb4",
});
export const register = async (user: User) : Promise<[number, number]> => {
 
    return new Promise<[number, number]>((resolve, reject) => {
        _conn.query("INSERT INTO user (username,  password,  name, email, mobile, token) VALUES (?,? , ?,?,?,?);"
            , [user.username, user.password, user.name, user.email, user.mobile, user.token]
            , (queryErr, result) => {
                if (queryErr) {
                    _conn.release();
                    return resolve([APIStatus.FAIL, 0]);
                }
                return resolve(result.insertId)
            });
    });
};
