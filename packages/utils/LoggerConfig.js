"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const defaultLogConfig = {
    level: 'info',
    dateformat: 'yyyy-mm-dd HH:MM:ss.L',
    inspectOpt: {
        showHidden: false,
        depth: 5 // tells inspect how many times to recurse while formatting the object. This is useful for inspecting large complicated objects. Defaults to 2. To make it recurse indefinitely pass null.
    }
};
exports.defaultLogConfig = defaultLogConfig;
if (config.has('log')) {
    Object.assign(defaultLogConfig, config.get('log'));
}
// 一行显示 Object
if (config.has('log.one_line_object') && config.get('log.one_line_object')) {
    Object.assign(defaultLogConfig, {
        preprocess: function (data) {
            let l = data.args.length;
            for (let i = 0; i < l; i++) {
                if (typeof (data.args[i]) === 'object') {
                    data.args[i] = JSON.stringify(data.args[i], null, 0);
                }
            }
        }
    });
}
console.log('aksjs util logger : defaultLogConfig', defaultLogConfig);
