"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShaderProgram_1 = require("./ShaderProgram");
var Scene = /** @class */ (function () {
    function Scene(canvasName) {
        var _this = this;
        this.Init = function (program) {
            var gl = _this._gl;
            _this._program = program;
            _this._aPosition = gl.getAttribLocation(_this._program, "aPosition");
            if (_this._aPosition < 0) {
                console.log("Failed to get the storage location of aPosition");
                return;
            }
            _this._aColor = gl.getAttribLocation(_this._program, "aColor");
            if (_this._aColor < 0) {
                console.log("Failed to get the storage location of aColor");
                return;
            }
            _this.GenTriangles();
            _this.Draw();
        };
        var btnOkName = "btnOk";
        this._btnOk = document.getElementById(btnOkName);
        if (this._btnOk === null || this._btnOk === undefined) {
            console.log("Failed to get a button element with the name: " + btnOkName);
            return;
        }
        this._btnOk.onclick = function () { return _this.OnBtnOn_Click(); };
        var amountOfTrianglesName = "amountOfTrianglesElement";
        this._amountOfTrianglesElement = document.getElementById(amountOfTrianglesName);
        if (this._amountOfTrianglesElement === null || this._amountOfTrianglesElement === undefined) {
            console.log("Failed to get a button element with the name: " + amountOfTrianglesName);
            return;
        }
        this._amountOfTriangles = parseInt(this._amountOfTrianglesElement.value);
        var canvas = document.getElementById(canvasName);
        if (canvas === null || canvas === undefined) {
            console.log("Failed to get a canvas element with the name: " + canvasName);
            return;
        }
        var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl === null || gl === undefined) {
            console.log("Your browser does not support WebGL");
            return;
        }
        this._gl = gl;
        var shaderProgram = new ShaderProgram_1.ShaderProgram(gl, "shaders/vShader.glsl", "shaders/fShader.glsl", this.Init);
    }
    Scene.prototype.OnBtnOn_Click = function () {
        this._amountOfTriangles = parseInt(this._amountOfTrianglesElement.value);
        this.GenTriangles();
        this.Draw();
    };
    Scene.prototype.GenTriangles = function () {
        var gl = this._gl;
        var coords = [];
        var colors = [];
        var x, y;
        var r, g, b;
        for (var i = 0; i < this._amountOfTriangles; i++) {
            r = Math.random();
            g = Math.random();
            b = Math.random();
            x = this.Random(-1, 1);
            y = this.Random(-1, 1);
            coords.push(x, y);
            colors.push(r, g, b);
            x = this.Random(-1, 1);
            y = this.Random(-1, 1);
            coords.push(x, y);
            colors.push(r, g, b);
            x = this.Random(-1, 1);
            y = this.Random(-1, 1);
            coords.push(x, y);
            colors.push(r, g, b);
        }
        var coords_vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, coords_vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(this._aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._aPosition);
        var colors_vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colors_vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(this._aColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._aColor);
    };
    Scene.prototype.Draw = function () {
        var gl = this._gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, this._amountOfTriangles * 3);
    };
    Scene.prototype.Random = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    return Scene;
}());
exports.Scene = Scene;
