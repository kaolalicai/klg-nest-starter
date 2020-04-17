"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// logger 工厂，给用户自定义
const tracer_1 = require("tracer");
const LoggerConfig_1 = require("./LoggerConfig");
function LogFactory(config) {
    Object.assign(LoggerConfig_1.defaultLogConfig, config);
    let logger = tracer_1.colorConsole(LoggerConfig_1.defaultLogConfig);
    // 指定了存储地址的的要按日分割
    if (LoggerConfig_1.defaultLogConfig && LoggerConfig_1.defaultLogConfig.root) {
        LoggerConfig_1.defaultLogConfig.transport = function (data) {
            console.log(data.output);
        };
        logger = tracer_1.dailyfile(LoggerConfig_1.defaultLogConfig);
    }
    return logger;
}
exports.LogFactory = LogFactory;
