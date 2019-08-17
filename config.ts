import * as fs from "fs";
import * as path from "path";
import {Config} from "./dataModel/config";

let configPath = path.resolve("./") +　"/env.json";

export function GetConfigInstance(): Config  {
    let configCotent: Config = Object.assign(
        new Config(),
        JSON.parse(fs.readFileSync(configPath, "utf8")),
    );
    return configCotent;
}
