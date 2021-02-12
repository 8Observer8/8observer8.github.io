precision mediump float;

varying vec3 vPosition;

uniform samplerCube uSkyboxSampler;

void main()
{
    gl_FragColor = textureCube(uSkyboxSampler, vPosition);
}
