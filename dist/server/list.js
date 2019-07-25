"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var utils = require("./utils");
var conf = require("./config");
exports.default = (function (ctx, next) {
    var clientIP = utils.getClientIP(ctx);
    var canOpen = true;
    var dataBuffer;
    // rep
    var data = null;
    var msg = null;
    try {
        dataBuffer = fs.readFileSync(conf.dataPath);
    }
    catch (e) {
        dataBuffer = null;
        try {
            fs.writeFileSync(conf.dataPath, JSON.stringify(conf.demo));
        }
        catch (e) {
            msg = e.message;
        }
        data = conf.demo;
    }
    if (dataBuffer) {
        data = JSON.parse(dataBuffer.toString());
    }
    if (!data || data.length === 0) {
        data = conf.demo;
    }
    // 是否开启了 private 私有化配置
    if (conf.enablePrivate) {
        // 如果是外网，并且没有输入 password 的 筛选出允许外部访问的api
        if (!conf.ipList.includes(clientIP) && ctx.query.password !== conf.password) {
            data = data.filter(function (v) { return v.isOpen; });
            canOpen = false;
        }
    }
    ctx.set('Content-Type', 'application/json');
    var body = {
        code: 200,
        data: data,
        canOpen: canOpen,
        enablePrivate: conf.enablePrivate
    };
    if (msg) {
        body['msg'] = msg;
    }
    ctx.body = body;
});
