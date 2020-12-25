attribute vec3 aPosition;
attribute vec2 aTexCoord;
uniform mat4 uMvpMatrix;
varying vec2 vTexCoord;

void main()
{
    gl_Position = uMvpMatrix * vec4(aPosition, 1.0);
    vTexCoord = aTexCoord;
}