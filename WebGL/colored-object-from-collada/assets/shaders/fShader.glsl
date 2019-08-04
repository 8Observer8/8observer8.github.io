
precision mediump float;

varying vec4 vColor;
varying float vDot;

void main()
{
    vec3 diffuseLight = vec3(1.0, 1.0, 1.0);
    vec3 diffuse = diffuseLight * vColor.rgb * vDot;
    vec3 ambientLight = vec3(0.2, 0.2, 0.2);
    vec3 ambient = ambientLight * vColor.rgb;
    gl_FragColor = vec4(diffuse + ambient, vColor.a);
}
