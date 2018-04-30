define(["require", "exports", "./Game"], function (require, exports, Game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Program = /** @class */ (function () {
        function Program() {
        }
        Program.main = function () {
            var game = new Game_1.Game("renderCanvas");
        };
        return Program;
    }());
    exports.Program = Program;
    Program.main();
});
