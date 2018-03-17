/* jshint node: true */
/* global document: false, window: false, Square: false, Triangle: false, Circle: false */

"use strict";

var Scene = (function() {
    var _canvas = null;
    var _ctx = null;
    var _backgroundColor = "white";
    var _radioSquare = null;
    var _radioTriangle = null;
    var _radioCircle = null;

    var _eShapeType = Object.freeze({
        eSquare: 0,
        eTriangle: 1,
        eCircle: 2
    });
    var _currentShape = _eShapeType.eSquare;

    var shapeArray = [];

    function Initialize(canvasID) {
        _canvas = document.getElementById(canvasID);
        _ctx = _canvas.getContext("2d");

        _radioSquare = document.getElementById("radioSquare");
        _radioTriangle = document.getElementById("radioTriangle");
        _radioCircle = document.getElementById("radioCircle");
        _radioSquare.onclick = function() {
            _currentShape = _eShapeType.eSquare;
        };
        _radioTriangle.onclick = function() {
            _currentShape = _eShapeType.eTriangle;
        };
        _radioCircle.onclick = function() {
            _currentShape = _eShapeType.eCircle;
        };

        var x, y, r, g, b, size;
        for (var i = 0; i < 2; i++) {
            x = _GetRandomInt(100, 300);
            y = _GetRandomInt(100, 300);
            r = _GetRandomInt(0, 255);
            g = _GetRandomInt(0, 255);
            b = _GetRandomInt(0, 255);
            size = _GetRandomInt(40, 80);
            var square = new Square(_ctx, x, y, size, 'rgba(' + r + ', ' + g + ', ' + b + ', 255)');
            shapeArray.push(square);

            x = _GetRandomInt(100, 300);
            y = _GetRandomInt(100, 300);
            r = _GetRandomInt(0, 255);
            g = _GetRandomInt(0, 255);
            b = _GetRandomInt(0, 255);
            size = _GetRandomInt(40, 80);
            var triangle = new Triangle(_ctx, x, y, size, 'rgba(' + r + ', ' + g + ', ' + b + ', 255)');
            shapeArray.push(triangle);

            x = _GetRandomInt(100, 300);
            y = _GetRandomInt(100, 300);
            r = _GetRandomInt(0, 255);
            g = _GetRandomInt(0, 255);
            b = _GetRandomInt(0, 255);
            size = _GetRandomInt(40, 80);
            var circle = new Circle(_ctx, x, y, size, 'rgba(' + r + ', ' + g + ', ' + b + ', 255)');
            shapeArray.push(circle);
        }

        // Handler for left and right mouse button click
        _canvas.onmousedown = function(evt) {
            var x = evt.clientX;
            var y = evt.clientY;
            var rect = evt.target.getBoundingClientRect();
            x = Math.floor(x - rect.left);
            y = Math.floor(y - rect.top);

            if (evt.button === 0) {
                _AddShape(x, y);
            } else if (evt.button === 2) {
                _DeleteShape(x, y);
            }
        };

        // Hide context menu by right mouse click
        window.oncontextmenu = function() {
            return false;
        };

        _Draw();
    }

    function _AddShape(x, y) {
        var r = _GetRandomInt(0, 255);
        var g = _GetRandomInt(0, 255);
        var b = _GetRandomInt(0, 255);
        var size = _GetRandomInt(40, 80);
        var shape;
        if (_currentShape === _eShapeType.eSquare) {
            shape = new Square(_ctx, x, y, size, 'rgba(' + r + ', ' + g + ', ' + b + ', 255)');
        } else if (_currentShape === _eShapeType.eTriangle) {
            shape = new Triangle(_ctx, x, y, size, 'rgba(' + r + ', ' + g + ', ' + b + ', 255)');
        } else if (_currentShape === _eShapeType.eCircle) {
            shape = new Circle(_ctx, x, y, size, 'rgba(' + r + ', ' + g + ', ' + b + ', 255)');
        }

        shapeArray.push(shape);
        _Draw();
    }

    function _DeleteShape(x, y) {
        for (var i = 0; i < shapeArray.length; i++) {
            if (shapeArray[i].IsCollision(x, y)) {
                shapeArray.splice(i, 1);
                i = -1;
            }
        }
        _Draw();
    }

    /**
     * Returns a random integer between min and max
     * Using Math.round() will give you a non-uniform distribution!
     */
    function _GetRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function _Draw() {
        _ctx.fillStyle = _backgroundColor;
        _ctx.fillRect(0, 0, _canvas.width, _canvas.height);

        for (var i = 0; i < shapeArray.length; i++) {
            shapeArray[i].Draw();
        }
    }

    return {
        Initialize: Initialize
    };
}());