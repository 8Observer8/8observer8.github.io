attribute vec4 aPosition;
attribute vec4 aNormal;

uniform mat4 uMvpMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
    gl_Position = uMvpMatrix * aPosition;
    vPosition = vec3(uModelMatrix * aPosition);
    vNormal = normalize(vec3(uNormalMatrix * aNormal));
}
