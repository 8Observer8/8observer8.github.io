attribute vec2 aPosition;
attribute vec3 aColor;

uniform mat4 uModelMatrix;

varying vec3 vColor;
            
void main()
{
    gl_Position = uModelMatrix * vec4(aPosition, 0.0, 1.0);
    vColor = aColor;
}