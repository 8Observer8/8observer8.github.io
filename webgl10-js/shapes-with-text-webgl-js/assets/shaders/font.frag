precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D uSampler;

const float width = 0.5;
const float edge = 0.1;

const float borderWidth = 0.6;
const float borderEdge = 0.05;

const vec3 color = vec3(0.70, 0.80, 0.79);
const vec3 outlineColor = vec3(1.0, 0.0, 0.0);

void main()
{
    float distance = 1.0 - texture2D(uSampler, vec2(vTexCoord.x, 1.0 - vTexCoord.y)).a;
    float alpha = 1.0 - smoothstep(width, width + edge, distance);

    float distance2 = 1.0 - texture2D(uSampler, vec2(vTexCoord.x, 1.0 - vTexCoord.y)).a;
    float outlineAlpha = 1.0 - smoothstep(borderWidth, borderWidth + borderEdge, distance2);

    float overallAlpha = alpha + (1.0 - alpha) * outlineAlpha;
    vec3 overallColor = mix(outlineColor, color, alpha / overallAlpha);

    if (overallAlpha < 0.001)
    {
        discard;
    }

    gl_FragColor = vec4(overallColor, overallAlpha);
}
