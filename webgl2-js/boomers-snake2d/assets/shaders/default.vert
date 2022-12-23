#version 300 es

in vec2 aPosition;
in vec2 aTexCoord;
uniform mat4 uMvpMatrix;
out vec2 vTexCoord;

void main() {
    gl_Position = uMvpMatrix * vec4(aPosition, 0.0, 1.0);
    vTexCoord = aTexCoord;
}
