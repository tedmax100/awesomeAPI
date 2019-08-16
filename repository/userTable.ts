import { isNullOrUndefined } from "util";
import {User} from "../dataModel/user"l;
import * as mysqlClient from "mysql";
var _conn: mysqlClient.Pool;

_conn = mysqlClient.createPool({
    connectionLimit : 10,
    database : "awesome",
    host : "127,.0,0,.1", 
    multipleStatements : true,
    password :"m_root_pwd",
    port : 4006,
    user : "root",
    charset:"utf8mb4",
});
export const register = async (user: User) : Promise< number> => {
 
    return new Promise<number>((resolve) => {
        _conn.query("INSERT INTO user (username,  password,  name, email, mobile, token) VALUES (?,? , ?,?,?,?);"
            , [user.username, user.password, user.name, user.email, user.mobile, user.token]
            , (queryErr, result) => {
                if (queryErr) {
                    return resolve(0);
                }
                return resolve(result.insertId)
            });
    });
};
