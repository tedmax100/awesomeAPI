import * as http from "http";
import App from "./app";

const _moduleTag = "index";
// -->Set: port
const port = normalizePort(process.argv[3] || "8800");
App.set("port", port);

// -->Set: headers
/*
App.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
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
});
*/
const server = http.createServer(App);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val: number|string): number|string|boolean {
    // tslint:disable-next-line:no-shadowed-variable
    let port: number = (typeof val === "string") ? parseInt(val, 10) : val;
    if (isNaN(port)) { return val; } else if (port >= 0) { return port; } else { return false; }
}

function onError(error: NodeJS.ErrnoException): void {
    const _funTag = _moduleTag + "_Push";
    if (error.syscall !== "listen") { throw error; }
    let bind = (typeof port === "string") ? "Pipe " + port : "Port " + port;
    switch (error.code) {
        case "EACCES":
            //logger.error(_funTag, `${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            //logger.error(_funTag, `${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
}
