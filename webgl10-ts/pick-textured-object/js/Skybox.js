define(["require", "exports", "gl-matrix", "./ShaderProgram"], function (require, exports, gl_matrix_1, ShaderProgram_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Skybox = /** @class */ (function () {
        function Skybox() {
            this._modelMatrix = gl_matrix_1.mat4.create();
            this._mvpMatrix = gl_matrix_1.mat4.create();
        }
        Skybox.prototype.init = function (gl, size) {
            this._program = ShaderProgram_1.createShaderProgram(gl, this.vertexShaderSource, this.fragmentShaderSource);
            gl.useProgram(this._program);
            // gl.enable(gl.CULL_FACE);
            var skyboxLocation = gl.getUniformLocation(this._program, "uSkyboxSampler");
            gl.uniform1i(skyboxLocation, 0);
            var vertexArrays = this.cube(size);
            this._size = size;
            this._vertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexArrays.vertexPositions, gl.STATIC_DRAW);
            this._aPositionLocation = gl.getAttribLocation(this._program, "aPosition");
            this._uMvpMatrixLocation = gl.getUniformLocation(this._program, "uMvpMatrix");
            this._elementIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._elementIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertexArrays.indices, gl.STATIC_DRAW);
            this._amountOfVertices = vertexArrays.indices.length;
            this._texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._texture);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.skybox_px);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.skybox_ny);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.skybox_pz);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.skybox_nx);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.skybox_py);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.skybox_nz);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        };
        Skybox.prototype.draw = function (gl, viewProjMatrix) {
            gl.useProgram(this._program);
            gl.depthMask(false);
            gl.enableVertexAttribArray(this._aPositionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexPositionBuffer);
            gl.vertexAttribPointer(this._aPositionLocation, 3, gl.FLOAT, false, 0, 0);
            // mat4.fromScaling(this._modelMatrix, vec3.fromValues(1, 1, 1));
            gl_matrix_1.mat4.fromRotation(this._modelMatrix, Math.PI, gl_matrix_1.vec3.fromValues(1, 0, 0));
            gl_matrix_1.mat4.mul(this._mvpMatrix, viewProjMatrix, this._modelMatrix);
            gl.uniformMatrix4fv(this._uMvpMatrixLocation, false, this._mvpMatrix);
            // gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._texture);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._elementIndexBuffer);
            gl.drawElements(gl.TRIANGLES, this._amountOfVertices, gl.UNSIGNED_SHORT, 0);
            gl.disableVertexAttribArray(this._aPositionLocation);
            gl.depthMask(true);
        };
        Skybox.prototype.cube = function (size) {
            var s = (size || 1) / 2;
            var coords = [];
            var indices = [];
            function face(xyz) {
                var start = coords.length / 3;
                var i;
                for (i = 0; i < 12; i++) {
                    coords.push(xyz[i]);
                }
                indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
            }
            face([-s, -s, s, s, -s, s, s, s, s, -s, s, s]);
            face([-s, -s, -s, -s, s, -s, s, s, -s, s, -s, -s]);
            face([-s, s, -s, -s, s, s, s, s, s, s, s, -s]);
            face([-s, -s, -s, s, -s, -s, s, -s, s, -s, -s, s]);
            face([s, -s, -s, s, s, -s, s, s, s, s, -s, s]);
            face([-s, -s, -s, -s, -s, s, -s, s, s, -s, s, -s]);
            return {
                vertexPositions: new Float32Array(coords),
                indices: new Uint16Array(indices)
            };
        };
        return Skybox;
    }());
    exports.default = Skybox;
});
//# sourceMappingURL=Skybox.js.map