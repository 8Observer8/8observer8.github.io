var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./Shape"], function (require, exports, Shape_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Circle = /** @class */ (function (_super) {
        __extends(Circle, _super);
        function Circle(ctx, x, y, radius, color, stroken) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (radius === void 0) { radius = 20; }
            if (color === void 0) { color = "#00FF00"; }
            if (stroken === void 0) { stroken = false; }
            var _this = _super.call(this, ctx, x, y, color, stroken) || this;
            _this.radius = radius;
            return _this;
        }
        Circle.prototype.Draw = function () {
            this.ctx.beginPath();
            this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
            if (this.stroken) {
                this.ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
                this.ctx.stroke();
            }
            else {
                this.ctx.fillStyle = this.color;
                this.ctx.fill();
            }
            this.ctx.closePath();
        };
        return Circle;
    }(Shape_1.Shape));
    exports.Circle = Circle;
});
