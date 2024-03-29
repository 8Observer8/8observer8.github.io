attribute vec3 aPosition;

uniform mat4 uMvpMatrix;

varying vec3 vPosition;

void main()
{
    gl_Position = uMvpMatrix * vec4(aPosition, 1.0);
    vPosition = aPosition;
}
