define(["require", "exports", "gl-matrix"], function (require, exports, gl_matrix_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CameraRotator = void 0;
    var CameraRotator = /** @class */ (function () {
        function CameraRotator(canvas, drawCallback, viewDistance, rotX, rotY) {
            var _this = this;
            if (rotX === void 0) { rotX = 0; }
            if (rotY === void 0) { rotY = 0; }
            this.xLimit = 85.0;
            this.canvas = canvas;
            canvas.addEventListener("mousedown", function (event) {
                if (event.button === 1) {
                    _this.doMouseDown(event);
                }
            }, false);
            canvas.addEventListener("wheel", function (event) { _this.doMouseWheel(event); }, false);
            this.rotateX = rotX;
            this.rotateY = rotY;
            this.degreesPerPixelX = 90.0 / canvas.height;
            this.degreesPerPixelY = 180.0 / canvas.width;
            this.viewDistance = viewDistance;
            this.drawCallback = drawCallback;
        }
        CameraRotator.prototype.getViewMatrix = function () {
            var cosX = Math.cos(this.rotateX / 180.0 * Math.PI);
            var sinX = Math.sin(this.rotateX / 180.0 * Math.PI);
            var cosY = Math.cos(this.rotateY / 180.0 * Math.PI);
            var sinY = Math.sin(this.rotateY / 180.0 * Math.PI);
            // const mat = [
            //     cosY, sinX * sinY, -cosX * sinY, 0,
            //     0, cosX, sinX, 0,
            //     sinY, -sinX * cosY, cosX * cosY, 0,
            //     0, -1.0, -this.viewDistance, 1
            // ];
            var m = gl_matrix_1.mat4.create();
            m[0] = cosY, m[1] = sinX * sinY, m[2] = -cosX * sinY, m[3] = 0;
            m[4] = 0, m[5] = cosX, m[6] = sinX, m[7] = 0;
            m[8] = sinY, m[9] = -sinX * cosY, m[10] = cosX * cosY, m[11] = 0;
            m[12] = 0, m[13] = -1.0, m[14] = -this.viewDistance, m[15] = 1;
            return m;
        };
        CameraRotator.prototype.doMouseDown = function (event) {
            var _this = this;
            this.isDraging = true;
            document.addEventListener("mousemove", function (event) { _this.doMouseDrag(event); }, false);
            document.addEventListener("mouseup", function (event) {
                if (event.button === 1) {
                    _this.doMouseUp(event);
                }
            }, false);
            var r = this.canvas.getBoundingClientRect();
            this.prevX = event.clientX - r.left;
            this.prevY = event.clientY - r.top;
        };
        CameraRotator.prototype.doMouseDrag = function (event) {
            if (!this.isDraging) {
                return;
            }
            var r = this.canvas.getBoundingClientRect();
            var x = event.clientX - r.left;
            var y = event.clientY - r.top;
            var newRotX = this.rotateX + this.degreesPerPixelX * (y - this.prevY);
            var newRotY = this.rotateY + this.degreesPerPixelY * (x - this.prevX);
            newRotX = Math.max(-this.xLimit, Math.min(this.xLimit, newRotX));
            this.prevX = x;
            this.prevY = y;
            if (newRotX != this.rotateX || newRotY != this.rotateY) {
                this.rotateX = newRotX;
                this.rotateY = newRotY;
                this.drawCallback();
            }
        };
        CameraRotator.prototype.doMouseUp = function (event) {
            var _this = this;
            if (!this.isDraging) {
                return;
            }
            this.isDraging = false;
            document.removeEventListener("mousedown", function (event) { _this.doMouseDrag(event); }, false);
            document.removeEventListener("mouseup", function (event) { _this.doMouseUp(event); }, false);
        };
        CameraRotator.prototype.doMouseWheel = function (event) {
            var delta = event.deltaY / 100.0 / 10.0;
            this.viewDistance += -delta;
            this.drawCallback();
        };
        return CameraRotator;
    }());
    exports.CameraRotator = CameraRotator;
});
//# sourceMappingURL=CameraRotator.js.map