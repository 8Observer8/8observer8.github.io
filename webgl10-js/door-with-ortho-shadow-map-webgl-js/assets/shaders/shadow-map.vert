attribute vec4 aPosition;
uniform mat4 uMvpMatrix;

void main()
{
    gl_Position = uMvpMatrix * aPosition;
}
