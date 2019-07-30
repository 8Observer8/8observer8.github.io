"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShaderProgram = /** @class */ (function () {
    function ShaderProgram(gl, vShaderPath, fShaderPath, callbackFunc) {
        this._vertexShaderSource = null;
        this._fragmentShaderSource = null;
        this._gl = gl;
        this._callbackFunc = callbackFunc;
        this.LoaderShaderFile(vShaderPath, gl.VERTEX_SHADER);
        this.LoaderShaderFile(fShaderPath, gl.FRAGMENT_SHADER);
    }
    Object.defineProperty(ShaderProgram.prototype, "Handle", {
        get: function () {
            return this._handle;
        },
        enumerable: true,
        configurable: true
    });
    ShaderProgram.prototype.LoaderShaderFile = function (fileName, shaderType) {
        var _this = this;
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status !== 404) {
                _this.OnLoadShader(request.responseText, shaderType);
            }
        };
        request.open("GET", fileName, true);
        request.send();
    };
    ShaderProgram.prototype.OnLoadShader = function (fileContent, shaderType) {
        if (shaderType === this._gl.VERTEX_SHADER) {
            this._vertexShaderSource = fileContent;
        }
        else if (shaderType === this._gl.FRAGMENT_SHADER) {
            this._fragmentShaderSource = fileContent;
        }
        // Start rendering, after loading both shaders
        if (this._vertexShaderSource !== null && this._fragmentShaderSource !== null) {
            this.CreateShaderProgram();
        }
    };
    ShaderProgram.prototype.CreateShaderProgram = function () {
        var gl = this._gl;
        var vShader = this.GetShader(this._vertexShaderSource, gl.VERTEX_SHADER);
        var fShader = this.GetShader(this._fragmentShaderSource, gl.FRAGMENT_SHADER);
        if (vShader === null || fShader === null)
            return;
        this._handle = gl.createProgram();
        gl.attachShader(this._handle, vShader);
        gl.attachShader(this._handle, fShader);
        gl.linkProgram(this._handle);
        gl.useProgram(this._handle);
        var status = gl.getProgramParameter(this._handle, gl.LINK_STATUS);
        if (!status) {
            console.log("Failed to link a program. Error message: " +
                gl.getProgramInfoLog(this._handle));
            return;
        }
        this._callbackFunc(this._handle);
    };
    ShaderProgram.prototype.GetShader = function (shaderSource, shaderType) {
        var gl = this._gl;
        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        var status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!status) {
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    };
    return ShaderProgram;
}());
exports.ShaderProgram = ShaderProgram;
