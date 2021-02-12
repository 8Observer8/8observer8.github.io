define(["require", "exports", "gl-matrix"], function (require, exports, gl_matrix_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Object3DPicked = /** @class */ (function () {
        function Object3DPicked(id, gl, program, aPositionLocation, uMvpMatrixLocation, uIdLocation, vertexPosBuffer, amountOfVertices) {
            this.position = [0, 0, 0];
            this.rotation = [0, 0, 0];
            this.scale = [1, 1, 1];
            this._mvpMatrix = gl_matrix_1.mat4.create();
            this._modelMatrix = gl_matrix_1.mat4.create();
            this.id = id;
            this._gl = gl;
            this._program = program;
            this._aPositionLocation = aPositionLocation,
                this._uMvpMatrixLocation = uMvpMatrixLocation;
            this._uIdLocation = uIdLocation;
            this._vertexPosBuffer = vertexPosBuffer;
            this._amountOfVertices = amountOfVertices;
        }
        Object3DPicked.prototype.draw = function (viewProjMatrix) {
            this._gl.useProgram(this._program);
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexPosBuffer);
            this._gl.vertexAttribPointer(this._aPositionLocation, 3, this._gl.FLOAT, false, 0, 0);
            this._gl.enableVertexAttribArray(this._aPositionLocation);
            gl_matrix_1.mat4.fromTranslation(this._modelMatrix, gl_matrix_1.vec3.fromValues(this.position[0], this.position[1], this.position[2]));
            gl_matrix_1.mat4.rotate(this._modelMatrix, this._modelMatrix, this.rotation[0] * Math.PI / 180, [1, 0, 0]);
            gl_matrix_1.mat4.rotate(this._modelMatrix, this._modelMatrix, this.rotation[1] * Math.PI / 180, [0, 1, 0]);
            gl_matrix_1.mat4.rotate(this._modelMatrix, this._modelMatrix, this.rotation[2] * Math.PI / 180, [0, 0, 1]);
            gl_matrix_1.mat4.scale(this._modelMatrix, this._modelMatrix, gl_matrix_1.vec3.fromValues(this.scale[0], this.scale[1], this.scale[2]));
            gl_matrix_1.mat4.mul(this._mvpMatrix, viewProjMatrix, this._modelMatrix);
            this._gl.uniformMatrix4fv(this._uMvpMatrixLocation, false, this._mvpMatrix);
            this._gl.uniform1i(this._uIdLocation, this.id);
            this._gl.drawArrays(this._gl.TRIANGLES, 0, this._amountOfVertices);
        };
        return Object3DPicked;
    }());
    exports.default = Object3DPicked;
});
//# sourceMappingURL=Object3DPicked.js.map