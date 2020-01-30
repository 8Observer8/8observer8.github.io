precision mediump float;

uniform sampler2D uSampler;

varying float vNdotL;
varying vec2 vTexCoords;

void main()
{
    vec4 color = texture2D(uSampler, vec2(vTexCoords.s, 1.0 - vTexCoords.t));
    gl_FragColor = vec4((color.rgb + vec3(0.1, 0.1, 0.1)) * vNdotL, color.a);
}
