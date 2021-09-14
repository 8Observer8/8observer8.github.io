precision mediump float;

attribute vec3 aPosition;
attribute vec4 aNormal;
attribute vec2 aTexCoord;
attribute vec3 aJoints;
attribute vec3 aWeights;

uniform mat4 uMvpMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;
uniform mat4 uTransforms[3];
uniform mat4 uRotations[3];

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vTexCoord;

void main()
{
    vec4 totalLocalPos = vec4(0.0);
    vec4 totalNormal = vec4(0.0);
    // mat4 transforms = mat4(
    //     vec4(1.0, 0.0, 0.0, 0.0),
    //     vec4(0.0, 1.0, 0.0, 0.0),
    //     vec4(0.0, 0.0, 1.0, 0.0),
    //     vec4(0.0, 0.0, 0.0, 1.0));

    for (int i = 0; i < 3; i++)
    {
        int jointIndex = int(aJoints[i]);
        mat4 jointTransform = uTransforms[jointIndex];
        vec4 posePosition = jointTransform * vec4(aPosition, 1.0);
        totalLocalPos += posePosition * aWeights[i];

        mat4 rotation = uRotations[jointIndex];
        vec4 worldNormal = rotation * aNormal;
        totalNormal += worldNormal * aWeights[i];
    }

    // mat4 transposed = transpose(transforms);
    // mat4 transformedNormal = inverse(transp);
    
    gl_Position = uMvpMatrix * totalLocalPos;
    vPosition = vec3(uModelMatrix * vec4(aPosition, 1.0));
    // vNormal = normalize(vec3(uNormalMatrix * totalNormal));
    // vNormal = normalize(vec3(totalNormal));
    vNormal = totalNormal.xyz;
    // vNormal = aNormal.xyz;
    // vec4 normal = uNormalMatrix * totalNormal;
    // vDot = max(dot(normalize(normal.xyz), lightDir), 0.0);
    vTexCoord = aTexCoord;
}
