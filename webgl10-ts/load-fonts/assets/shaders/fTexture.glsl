
precision mediump float;

uniform sampler2D uSampler;
uniform vec4 uColor;

varying vec2 vTexCoord;

void main()
{
    vec4 c = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    vec3 r = vec3(c) * (1.0 - uColor.a) + vec3(uColor) * uColor.a;
    gl_FragColor = vec4(r, c.a);
}
