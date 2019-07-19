"use strict";
var app_1 = require("./app");
var conf = require("./config");
module.exports = /** @class */ (function () {
    function ApiDoc() {
    }
    ApiDoc.prototype.config = function (opts) {
        Object.keys(opts).forEach(function (v) {
            conf[v] = opts[v];
        });
    };
    ApiDoc.prototype.start = function () {
        app_1.default();
    };
    return ApiDoc;
}());
