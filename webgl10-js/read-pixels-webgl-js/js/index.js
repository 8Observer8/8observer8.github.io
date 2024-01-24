let gl = null;

function initWebGLContext(canvasName) {
    const canvas = document.getElementById(canvasName);
    if (canvas === null) {
        console.log(`Failed to get a canvas element with the name "${canvasName}"`);
        return false;
    }
    gl = canvas.getContext("webgl", { alpha: false, premultipliedAlpha: false });
    return true;
}

function init() {
    console.log("------------------init------------------");
    if (!initWebGLContext("renderCanvas")) return;

    gl.clearColor(0.2, 0.2, 0.2, 1.0);

    const vertexShaderSource =
        `
            attribute vec2 aPosition;
            
            void main()
            {
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }`;

    const fragmentShaderSource =
        `
            precision mediump float;
            
            void main()
            {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }`;

    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertexShaderSource);
    gl.compileShader(vShader);

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragmentShaderSource);
    gl.compileShader(fShader);

    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([
        0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPositionLocation = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPositionLocation);

    document.getElementById("output");

    // window.onresize = () => {
    //     gl.canvas.width = gl.canvas.clientWidth;
    //     gl.canvas.height = gl.canvas.clientHeight;
    //     gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
    //     draw();
    // };
    // window.onresize(null);

    const ro = new ResizeObserver(entries => {
        for (const entry of entries) {
            if (entry.target.tagName === "CANVAS") {
                gl.canvas.width = gl.canvas.clientWidth;
                gl.canvas.height = gl.canvas.clientHeight;
                gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
                draw();
            }
        }
    });
    ro.observe(gl.canvas);

    gl.canvas.onclick = (event) => {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = rect.bottom - event.clientY - 1;

        draw();

        const pixels = new Uint8Array(4);
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        const output = `${(pixels[0] / 255.0).toFixed(2)} ${(pixels[1] / 255.0).toFixed(2)} ${(pixels[2] / 255.0).toFixed(2)} `;
        // console.log(
        //     (pixels[0] / 255.0).toFixed(2),
        //     (pixels[1] / 255.0).toFixed(2),
        //     (pixels[2] / 255.0).toFixed(2));
        console.log(output);
    };
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

init();
//# sourceMappingURL=index.js.map
