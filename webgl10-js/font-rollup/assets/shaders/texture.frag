precision mediump float;

uniform sampler2D uSampler;
uniform vec3 uColor;
varying vec2 vTexCoord;

void main() {
    vec4 c = texture2D(uSampler, vTexCoord);
    gl_FragColor = vec4(c.r * uColor.r, c.g * uColor.g, c.b * uColor.b, c.a);
}
