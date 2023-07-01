attribute vec4 aPosition;
attribute vec4 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uMvpMatrix;
uniform mat4 uMvpMatrixFromLight;
uniform mat4 uNormalMatrix;
varying vec2 vTexCoord;

const vec3 lightPosition = vec3(-3.0, 10.0, 7.0);
const vec3 lightDirection = normalize(lightPosition);
const float ambient = 0.3;

// Point light
// uniform mat4 uModelMatrix;
// varying vec3 vPosition;
// varying vec3 vNormal;

varying float vDot;
varying vec4 vPositionFromLight;

void main()
{
    gl_Position = uMvpMatrix * aPosition;

    // Point light
    // vPosition = vec3(uModelMatrix * aPosition);
    // vNormal = normalize(vec3(uNormalMatrix * aNormal));

    // Directional light
    vec4 normal = uNormalMatrix * aNormal;
    vDot = max(dot(normalize(normal.xyz), lightDirection), ambient);

    vPositionFromLight = uMvpMatrixFromLight * aPosition;
    vTexCoord = aTexCoord;
}
