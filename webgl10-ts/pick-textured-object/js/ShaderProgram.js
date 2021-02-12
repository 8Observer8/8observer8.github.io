define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createShaderProgram = void 0;
    function createShaderProgram(gl, vertShaderSrc, fragShaderSrc) {
        var ok;
        var vShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vShader, vertShaderSrc);
        gl.compileShader(vShader);
        ok = gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
        if (!ok) {
            console.log("Failed to compile the vertex shader:");
            console.log(vertShaderSrc);
        }
        var fShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fShader, fragShaderSrc);
        gl.compileShader(fShader);
        ok = gl.getShaderParameter(fShader, gl.COMPILE_STATUS);
        if (!ok) {
            console.log("Failed to compile the fragment shader:");
            console.log(fragShaderSrc);
        }
        var program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        return program;
    }
    exports.createShaderProgram = createShaderProgram;
});
//# sourceMappingURL=ShaderProgram.js.map