function createProgram(vertexShaderName, fragmentShaderName)
{
    // Get shader elements
    const vShaderElement = document.getElementById(vertexShaderName);
    const fShaderElement = document.getElementById(fragmentShaderName);
    
    if (vShaderElement == null)
    {
        console.log(`Failed to get an element with name "${vertexShaderName}"`);
        return null;
    }

    if (fShaderElement == null)
    {
        console.log(`Failed to get an element with name "${fragmentShaderName}"`);
        return null;
    }

    const vertShaderSource = vShaderElement.firstChild.textContent;
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertShaderSource);
    gl.compileShader(vShader);
    let ok = gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
    if (!ok)
    {
        console.log("vert: " + gl.getShaderInfoLog(vShader));
        return null;
    };

    const fragShaderSource = fShaderElement.firstChild.textContent;
    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragShaderSource);
    gl.compileShader(fShader);
    ok = gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
    if (!ok)
    {
        console.log("frag: " + gl.getShaderInfoLog(fShader));
        return null;
    };

    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.bindAttribLocation(program, 0, "aPosition");
    gl.bindAttribLocation(program, 1, "aTexCoord");
    gl.linkProgram(program);
    ok = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!ok)
    {
        console.log("link: " + gl.getProgramInfoLog(program));
        return null;
    };
    gl.useProgram(program);

    return program;
}
