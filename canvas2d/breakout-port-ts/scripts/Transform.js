define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Transform = /** @class */ (function () {
        function Transform() {
        }
        Transform.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
        };
        return Transform;
    }());
    exports.Transform = Transform;
});
