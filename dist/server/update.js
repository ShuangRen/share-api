"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var conf = require("./config");
exports.default = (function (ctx) {
    try {
        fs.writeFileSync(conf.dataPath, JSON.stringify(ctx.request.body));
    }
    catch (e) {
        ctx.body = {
            code: 400,
            data: false,
            msg: e.message
        };
        return;
    }
    ctx.body = {
        code: 200,
        data: true
    };
});
