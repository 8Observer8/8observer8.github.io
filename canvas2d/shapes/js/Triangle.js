/* jshint node: true */
/* global Shape: false, inheritPrototype: false */

"use strict";

function Triangle(ctx, x, y, size, color) {
    Shape.call(this, ctx, x, y, size, color);
}
inheritPrototype(Triangle, Shape);

Triangle.prototype.Draw = function() {
    Shape.prototype.Draw.call(this);

    this._ctx.beginPath();
    this._ctx.moveTo(this._x, this._y - this._size);
    this._ctx.lineTo(this._x - this._size, this._y + this._size);
    this._ctx.lineTo(this._x + this._size, this._y + this._size);
    this._ctx.closePath();

    this._ctx.fill();
};

Triangle.prototype.IsCollision = function(x, y) {
    var Px = x;
    var Py = y;
    var Ax = this._x;
    var Ay = this._y - this._size;
    var Bx = this._x - this._size;
    var By = this._y + this._size;
    var Cx = this._x + this._size;
    var Cy = this._y + this._size;

    var N1 = (By - Ay) * (Px - Ax) - (Bx - Ax) * (Py - Ay);
    var N2 = (Cy - By) * (Px - Bx) - (Cx - Bx) * (Py - By);
    var N3 = (Ay - Cy) * (Px - Cx) - (Ax - Cx) * (Py - Cy);
    var result = ((N1 > 0) && (N2 > 0) && (N3 > 0)) || ((N1 < 0) && (N2 < 0) && (N3 < 0));
    return result;
};