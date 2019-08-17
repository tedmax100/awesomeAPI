import * as mysqlClient from "mysql";
import {GetConfigInstance} from "../config";

class MySqlPool {
    private static _instance: MySqlPool;
    private  _pool: mysqlClient.Pool;

    private constructor() {
        this._pool = mysqlClient.createPool({
            connectionLimit : GetConfigInstance().userDB.connectionLimit,
            database : GetConfigInstance().userDB.database,
            host : GetConfigInstance().userDB.host,
            multipleStatements : true,
            password : GetConfigInstance().userDB.password,
            port : GetConfigInstance().userDB.port,
            user : GetConfigInstance().userDB.account,
        });
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public  GetConn = async () : Promise<[Error|undefined, mysqlClient.PoolConnection|undefined]>=>  {
        return new Promise((resolve) => {
            this._pool.getConnection((err, connection) => {
                if (err) {
                    return resolve([err, undefined])
                }
                return resolve([undefined, connection])
            })
        })
    }
}

export let  GetAwesomeDBConn = async () =>  {
   return await MySqlPool.Instance.GetConn()
}
