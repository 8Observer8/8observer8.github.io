
class ObjectForGraphics
{
    constructor(program, position, radians, scale, amountOfVertices, vertPosBuffer, texCoordBuffer, texture)
    {
        this.position = position;
        this.radians = radians;
        this.scale = scale;

        this.amountOfVertices = amountOfVertices;
        this.vertPosBuffer = vertPosBuffer;
        this.texCoordBuffer = texCoordBuffer;
        this.texture = texture;

        this.mvpMatrix = glMatrix.mat4.create();
        this.modelMatrix = glMatrix.mat4.create();

        gl.useProgram(program);
        this.uMvpMatrixLocation = gl.getUniformLocation(program, "uMvpMatrix");
        this.program = program;
    }

    bind()
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertPosBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    draw(projViewMatrix)
    {
        gl.useProgram(this.program);

        glMatrix.mat4.fromTranslation(this.modelMatrix, this.position);
        glMatrix.mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.radians);
        glMatrix.mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
        glMatrix.mat4.mul(this.mvpMatrix, projViewMatrix, this.modelMatrix);
        gl.uniformMatrix4fv(this.uMvpMatrixLocation, false, this.mvpMatrix);

        this.bind();
        gl.drawArrays(gl.TRIANGLES, 0, this.amountOfVertices);
    }
}
