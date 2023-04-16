precision mediump float;

const vec3 lightColor = vec3(1.0, 1.0, 1.0);
const vec3 lightPosition = vec3(2.0, 5.0, 10.0);
const float ambient = 0.3;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vTexCoord;

uniform sampler2D uSampler;

void main()
{
    vec4 color = texture2D(uSampler, vTexCoord);
    vec3 normal = normalize(vNormal);
    vec3 lightDirection = normalize(lightPosition - vPosition);
    float nDotL = max(dot(lightDirection, normal), ambient);
    vec3 diffuse = lightColor * color.rgb * nDotL;
    gl_FragColor = vec4(diffuse, color.a);
}
