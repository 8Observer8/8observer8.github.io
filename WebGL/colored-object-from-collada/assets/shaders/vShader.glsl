
attribute vec3 aPosition;
attribute vec4 aColor;
attribute vec4 aNormal;

uniform mat4 uProjMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;

varying vec4 vColor;
varying float vDot;

void main()
{
    gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    vColor = aColor;

    vec3 lightDir = vec3(3.0, 5.0, 4.0);
    vec3 normal = normalize(vec3(uNormalMatrix * aNormal));
    vDot = max(dot(normal, normalize(lightDir)), 0.0);
}
