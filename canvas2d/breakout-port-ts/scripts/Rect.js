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
    var Rect = /** @class */ (function (_super) {
        __extends(Rect, _super);
        function Rect(ctx, x, y, width, height, color, stroken) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 20; }
            if (height === void 0) { height = 20; }
            if (color === void 0) { color = "#0000FF"; }
            if (stroken === void 0) { stroken = false; }
            var _this = _super.call(this, ctx, x, y, color, stroken) || this;
            _this.width = width;
            _this.height = height;
            return _this;
        }
        Rect.prototype.Draw = function () {
            this.ctx.beginPath();
            this.ctx.rect(this.position.x, this.position.y, this.width, this.height);
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
        return Rect;
    }(Shape_1.Shape));
    exports.Rect = Rect;
});
