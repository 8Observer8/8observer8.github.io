precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D uSampler;

const float width = 0.5;
const float edge = 0.1;

void main()
{
    float distance = 1.0 - texture2D(uSampler, vec2(vTexCoord.x, 1.0 - vTexCoord.y)).a;
    float alpha = 1.0 - smoothstep(width, width + edge, distance);
    if (alpha < 0.001)
    {
        discard;
    }
    gl_FragColor = vec4(0.78, 0.50, 0.14, alpha);
}
