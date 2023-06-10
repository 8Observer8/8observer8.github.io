precision mediump float;

varying vec3 vPosition;
varying vec2 vTexCoord;

uniform sampler2D uSampler;

void main()
{
    gl_FragColor = texture2D(uSampler, vec2(vTexCoord.x, 1.0 - vTexCoord.y));
}
