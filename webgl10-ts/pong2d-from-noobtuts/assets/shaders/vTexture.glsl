
attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uVPMatrix;
uniform mat4 uModelMatrix;

varying vec2 vTexCoord;

void main()
{
    gl_Position = uVPMatrix * uModelMatrix * vec4(aPosition, 1.0);
    vTexCoord = aTexCoord;
}
