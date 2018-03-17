/* jshint node: true */
/* global Shape: false, inheritPrototype: false */

"use strict";

function Circle(ctx, x, y, size, color) {
    Shape.call(this, ctx, x, y, size, color);
}
inheritPrototype(Circle, Shape);

Circle.prototype.Draw = function () {
    Shape.prototype.Draw.call(this);

    this._ctx.beginPath();
    this._ctx.arc(this._x, this._y, this._size, 0, 2 * Math.PI, false);
    this._ctx.closePath();
    
    this._ctx.fill();
};

Circle.prototype.IsCollision = function (x, y) {
    var dx = Math.abs(x - this._x);
    var dy = Math.abs(y - this._y);
    return Math.sqrt(dx * dx + dy * dy) < this._size;
};