import * as _path from "path";
import * as _winston from "winston";
const config_1 = require("./config");
const CloudWatchTransport = require("winston-aws-cloudwatch");
// tslint:disable-next-line:no-var-requires
require("winston-daily-rotate-file");
import * as circularjson from "circular-json"

const logFolderPath = _path.resolve("./log");
// console.log(logFolderPath);

const logger = _winston.createLogger({
    transports: [
        new _winston.transports.File(
            {
                filename: logFolderPath + "/serverInfo.log",
                maxsize: 5242880, // 5MB
                // tslint:disable-next-line:object-literal-sort-keys
                maxFiles: 10,
                level: "debug",
                // zippedArchive : true,
            }),
        new CloudWatchTransport({
            logGroupName: process.argv[2].toUpperCase() + "-Messaging-api",
            logStreamName: "PortalApi",
            // tslint:disable-next-line:object-literal-sort-keys
            createLogGroup: true,
            createLogStream: true,
            batchSize: 10,
            awsConfig: {
               accessKeyId: "AKIAIGEONGPQZ3BSY43A",
               secretAccessKey: "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",
               // tslint:disable-next-line:object-literal-sort-keys
               region: "ap-northeast-1",
           },
            level: "debug",
            formatLog(item: any) {
                
               item.meta.label = item.message;
               item.meta.timestamp = new Date().toISOString();
               item.meta.level = item.level;
               try {
                   return circularjson.stringify(item.meta);
               } catch(exp) {
                   return "";
               }
               // return item.level + ': [' + item.message + '] ' + JSON.stringify(item.meta) + ',' + new Date().toUTCString()
           },
            retentionInDays: 30,
      }),
    ],
    // tslint:disable-next-line:object-literal-sort-keys
    exceptionHandlers: [
      new _winston.transports.File({
          filename: logFolderPath + "/serverError.log",
        }),
    ],
  });

const redundantMsgLogger = _winston.createLogger({
    transports: [
        new _winston.transports.File({
            filename: logFolderPath + "/redudantMsg.log",
            maxsize: 5242880,
            // tslint:disable-next-line:object-literal-sort-keys
            maxFiles: 10,
            level: "info",
            zippedArchive: true,
        }),
    ],
})

const apiWatcherLogger = _winston.createLogger({
    transports: [
        new _winston.transports.File({
            filename: logFolderPath + "/apiWatcher.log",
            maxsize: 5242880,
            // tslint:disable-next-line:object-literal-sort-keys
            maxFiles: 10,
            level: "debug",
            zippedArchive: true,
        }),
        new CloudWatchTransport({
            logGroupName: process.argv[2].toUpperCase() + "-Messaging-api",
            logStreamName: "PortalApi",
            // tslint:disable-next-line:object-literal-sort-keys
            createLogGroup: true,
            createLogStream: true,
            batchSize: 10,
            awsConfig: {
               accessKeyId: "AKIAIGEONGPQZ3BSY43A",
               secretAccessKey: "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",
               // tslint:disable-next-line:object-literal-sort-keys
               region: "ap-northeast-1",
           },
            level: "debug",
            formatLog(item: any) {
                
               item.meta.label = item.message;
               item.meta.timestamp = new Date().toISOString();
               item.meta.level = item.level;
               try {
                   return circularjson.stringify(item.meta);
               } catch(exp) {
                   return "";
               }
               // return item.level + ': [' + item.message + '] ' + JSON.stringify(item.meta) + ',' + new Date().toUTCString()
           },
            retentionInDays: 30,
      }),
    ],
});

// tslint:disable-next-line:no-default-export
export {logger, redundantMsgLogger, apiWatcherLogger};
