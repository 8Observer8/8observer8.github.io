attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uProjMatrix;
uniform mat4 uViewMatrix;

varying vec2 vTexCoord;

void main()
{
    gl_Position = uProjMatrix * uViewMatrix * vec4(aPosition, 1.0);
    vTexCoord = aTexCoord;
}
