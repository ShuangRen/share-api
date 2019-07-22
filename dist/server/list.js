"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var utils = require("./utils");
var conf = require("./config");
exports.default = (function (ctx, next) {
    var clientIP = utils.getClientIP(ctx);
    var canOpen = true;
    var dataBuffer;
    try {
        dataBuffer = fs.readFileSync(conf.dataPath);
    }
    catch (e) {
        try {
            fs.writeFileSync(conf.dataPath, JSON.stringify(conf.demo));
        }
        catch (e) {
            ctx.body = {
                code: 200,
                data: false,
                msg: e.message
            };
            return;
        }
        ctx.body = {
            code: 200,
            data: conf.demo,
            canOpen: true
        };
        return;
    }
    var data = JSON.parse(dataBuffer.toString());
    if (!data || data.length === 0) {
        data = conf.demo;
    }
    // 如果是外网，并且没有输入 password 的 筛选出允许外部访问的api
    if (!conf.ipList.includes(clientIP) && ctx.query.password !== conf.password) {
        data = data.filter(function (v) { return v.isOpen; });
        canOpen = false;
    }
    ctx.set('Content-Type', 'application/json');
    ctx.body = {
        code: 200,
        data: data,
        canOpen: canOpen
    };
});
