precision mediump float;

const vec3 lightColor = vec3(0.8, 0.8, 0.8);
const vec3 ambientLight = vec3(0.2, 0.2, 0.2);

uniform sampler2D uSampler;
uniform vec3 uLightPosition;
uniform bool uClicked;
uniform int uId;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vTexCoord;

void main()
{
    if (uClicked)
    {
        if (uId == 255000000)
        {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
        else if (uId == 255000)
        {
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
        }
    }
    else
    {
        vec4 color = texture2D(uSampler, vTexCoord);
        vec3 normal = normalize(vNormal);
        vec3 lightDirection = normalize(uLightPosition - vPosition);
        float nDotL = max(dot(lightDirection, normal), 0.0);
        vec3 diffuse = lightColor * color.rgb * nDotL;
        vec3 ambient = ambientLight * color.rgb;
        gl_FragColor = vec4(diffuse + ambient, color.a);
    }
}
