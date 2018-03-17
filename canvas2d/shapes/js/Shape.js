/* jshint node: true */

"use strict";

function Shape(ctx, x, y, size, color) {
    this._ctx = ctx;
    this._x = x;
    this._y = y;
    this._size = size;
    this._color = color;
}

Shape.prototype.Draw = function() {
    this._ctx.fillStyle = this._color;
};

Shape.prototype.IsCollision = function(x, y) {

};

function inheritPrototype(subClass, superClass) {
    var prototype = Object.create(superClass.prototype);
    prototype.constructor = subClass;
    subClass = prototype;
}