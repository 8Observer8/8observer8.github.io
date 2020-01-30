
attribute vec3 aPosition;
attribute vec2 aTexCoords;
attribute vec4 aNormal;

uniform mat4 uProjMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;

varying float vDot;
varying vec2 vTexCoords;

void main()
{
    gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    vTexCoords = aTexCoords;

    // vec3 lightDir = vec3(3.0, 5.0, 4.0);
    vec3 lightDir = vec3(1.0, 2.0, 3.0);
    vec3 normal = normalize(vec3(uNormalMatrix * aNormal));
    vDot = max(dot(normal, normalize(lightDir)), 0.0);
}
