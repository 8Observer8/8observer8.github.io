define(["require", "exports", "gl-matrix"], function (require, exports, gl_matrix_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Object3D = /** @class */ (function () {
        function Object3D(vertexBuffers, locations, texture) {
            this.position = [0, 0, 0];
            this.rotation = [0, 0, 0];
            this.scale = [1, 1, 1];
            this.mvpMatrix = gl_matrix_1.mat4.create();
            this.modelMatrix = gl_matrix_1.mat4.create();
            this.normalMatrix = gl_matrix_1.mat4.create();
            this.vertexPosBuffer = vertexBuffers.vertexPosBuffer;
            this.normalBuffer = vertexBuffers.normalBuffer;
            this.textureCoordBuffer = vertexBuffers.textureCoordBuffer;
            this.amountOfVertices = vertexBuffers.amountOfVertices;
            this.aPositionLocation = locations.aPositionLocation;
            this.aNormalLocation = locations.aNormalLocation;
            this.aTextureCoordLocation = locations.aTextureCoordLocation;
            this.uMvpMatrixLocation = locations.uMvpMatrixLocation;
            this.uModelMatrixLocation = locations.uModelMatrixLocation;
            this.uNormalMatrixLocation = locations.uNormalMatrixLocation;
            this.texture = texture;
        }
        Object3D.prototype.draw = function (gl, program, viewProjMatrix) {
            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
            gl.vertexAttribPointer(this.aPositionLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.aPositionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(this.aNormalLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.aNormalLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
            gl.vertexAttribPointer(this.aTextureCoordLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.aTextureCoordLocation);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl_matrix_1.mat4.fromTranslation(this.modelMatrix, gl_matrix_1.vec3.fromValues(this.position[0], this.position[1], this.position[2]));
            gl_matrix_1.mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[0] * Math.PI / 180, [1, 0, 0]);
            gl_matrix_1.mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[1] * Math.PI / 180, [0, 1, 0]);
            gl_matrix_1.mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[2] * Math.PI / 180, [0, 0, 1]);
            gl_matrix_1.mat4.scale(this.modelMatrix, this.modelMatrix, gl_matrix_1.vec3.fromValues(this.scale[0], this.scale[1], this.scale[2]));
            gl.uniformMatrix4fv(this.uModelMatrixLocation, false, this.modelMatrix);
            gl_matrix_1.mat4.invert(this.normalMatrix, this.modelMatrix);
            gl_matrix_1.mat4.transpose(this.normalMatrix, this.normalMatrix);
            gl.uniformMatrix4fv(this.uNormalMatrixLocation, false, this.normalMatrix);
            gl_matrix_1.mat4.mul(this.mvpMatrix, viewProjMatrix, this.modelMatrix);
            gl.uniformMatrix4fv(this.uMvpMatrixLocation, false, this.mvpMatrix);
            gl.drawArrays(gl.TRIANGLES, 0, this.amountOfVertices);
        };
        return Object3D;
    }());
    exports.default = Object3D;
});
//# sourceMappingURL=Object3D.js.map