// tslint:disable-next-line:interface-name
export interface ServerConfig {
    userDB: MySql;
}

export class Config implements ServerConfig {
    public userDB !: MySql;
}

export class MySql {
    public host!: string;
    public port!: number;
    public account!: string;
    public password!: string;
    public database!: string;
    public connectionLimit !: number;
}
