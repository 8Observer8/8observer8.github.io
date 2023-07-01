precision mediump float;

const vec3 lightColor = vec3(1.0, 1.0, 1.0);
// const vec3 lightPosition = vec3(3.0, 5.0, 4.0);
// const float ambient = 0.3;

// Point light
// varying vec3 vPosition;
// varying vec3 vNormal;

varying vec2 vTexCoord;
varying float vDot;

uniform sampler2D uSampler;
uniform bool uClick;
uniform vec3 uPickColor;

void main()
{
    if (!uClick)
    {
        vec4 color = texture2D(uSampler, vTexCoord);

        // Point light
        // vec3 normal = normalize(vNormal);
        // vec3 lightDirection = normalize(lightPosition - vPosition);
        // float nDotL = max(dot(lightDirection, normal), ambient);

        vec3 diffuse = lightColor * color.rgb * vDot;
        gl_FragColor = vec4(diffuse, color.a);
    }
    else
    {
        gl_FragColor = vec4(uPickColor, 1.0);
    }
}
