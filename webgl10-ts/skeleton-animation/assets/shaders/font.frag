precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D uSampler;

const float width = 0.5;
const float edge = 0.18;

void main()
{
    float distance = 1.0 - texture2D(uSampler, vTexCoord).a;
    float alpha = 1.0 - smoothstep(width, width + edge, distance);
    gl_FragColor = vec4(0.7, 0.7, 0.7, alpha);
}
