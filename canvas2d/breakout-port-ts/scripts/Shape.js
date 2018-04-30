define(["require", "exports", "./Transform"], function (require, exports, Transform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shape = /** @class */ (function () {
        function Shape(ctx, x, y, color, stroken) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (color === void 0) { color = "#FF0000"; }
            if (stroken === void 0) { stroken = false; }
            this.ctx = ctx;
            this.color = color;
            this.stroken = stroken;
            this.visible = true;
            this.position = new Transform_1.Transform();
            this.position.x = x;
            this.position.y = y;
        }
        return Shape;
    }());
    exports.Shape = Shape;
});
