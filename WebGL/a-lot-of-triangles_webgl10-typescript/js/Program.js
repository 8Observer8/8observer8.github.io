"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scene_1 = require("./Scene");
var Program = /** @class */ (function () {
    function Program() {
    }
    Program.Main = function () {
        var scene = new Scene_1.Scene("renderCanvas");
    };
    return Program;
}());
// Debug Version
Program.Main();
// Release Version
// window.onload = () => Program.Main();
