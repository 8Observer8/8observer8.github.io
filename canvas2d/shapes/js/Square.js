/* jshint node: true */
/* global Shape: false, inheritPrototype: false */

"use strict";

function Square(ctx, x, y, size, color) {
    Shape.call(this, ctx, x, y, size, color);
}
inheritPrototype(Square, Shape);

Square.prototype.Draw = function() {
    Shape.prototype.Draw.call(this);
    this._ctx.fillRect(this._x - this._size / 2, this._y - this._size / 2, this._size, this._size);
};

Square.prototype.IsCollision = function(x, y) {
    return (this._x - this._size / 2 <= x && x <= this._x + this._size / 2 &&
        this._y - this._size / 2 <= y && y <= this._y + this._size / 2);
};