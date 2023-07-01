precision mediump float;

const vec3 lightColor = vec3(1.0, 1.0, 1.0);
// const vec3 lightPosition = vec3(3.0, 5.0, 4.0);
// const float ambient = 0.3;

// Point light
// varying vec3 vPosition;
// varying vec3 vNormal;

varying vec2 vTexCoord;
varying float vDot;
varying vec4 vPositionFromLight;

uniform sampler2D uSampler;
uniform sampler2D uShadowMap;
uniform bool uClick;
uniform vec3 uPickColor;

// Recalculate the z value from the rgba
float unpackDepth(const in vec4 rgbaDepth)
{
    const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));

    // Use dot() since the calculations is same
    float depth = dot(rgbaDepth, bitShift);

    return depth;
}

void main()
{
    if (!uClick)
    {
        vec3 shadowCoord = (vPositionFromLight.xyz/vPositionFromLight.w)/2.0 + 0.5;
        vec4 rgbaDepth = texture2D(uShadowMap, shadowCoord.xy);
        float depth = unpackDepth(rgbaDepth); // Recalculate the z value from the rgba
        float visibility = (shadowCoord.z > depth + 0.0015) ? 0.7 : 1.0;

        vec4 color = texture2D(uSampler, vTexCoord);

        // Point light
        // vec3 normal = normalize(vNormal);
        // vec3 lightDirection = normalize(lightPosition - vPosition);
        // float nDotL = max(dot(lightDirection, normal), ambient);

        vec3 diffuse = lightColor * color.rgb * vDot;
        gl_FragColor = vec4(diffuse * visibility, color.a);
    }
    else
    {
        gl_FragColor = vec4(uPickColor, 1.0);
    }
}
