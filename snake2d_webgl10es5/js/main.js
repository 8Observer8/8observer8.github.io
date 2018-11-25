"use strict";
/* jshint node: true  */
/* global window: false, document: false, mat4: false, vec3: false */

var gl;

var u_Color;
var u_ModelProjMatrix;
var interval = 200;

var snake = [{ x: 20, y: 20 }];
var food = [];
var snakeDir = { x: 1, y: 0 };
var fieldWidth = 50;
var fieldHeight = 50;

function setTransomsAndColors(x, y, width, height)
{
    var modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(x, y, 0.0));
    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(width, height, 1.0));

    var projMatrix = mat4.create();
    mat4.ortho(projMatrix, 0, fieldWidth, 0, fieldHeight, 1, -1);

    var modelProjMatrix = mat4.create();
    mat4.multiply(modelProjMatrix, projMatrix, modelMatrix);

    gl.uniformMatrix4fv(u_ModelProjMatrix, false, modelProjMatrix);
}

function drawTriangle(x, y, width, height)
{
    setTransomsAndColors(x, y, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function drawRect(x, y, width, height)
{
    setTransomsAndColors(x, y, width, height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 3, 4);
}

function drawSnake()
{
    gl.uniform3f(u_Color, 0.635, 0.450, 0.125);
    snake.forEach(function(element)
    {
        drawRect(element.x, element.y, 1, 1);
    });
}

function drawFood()
{
    gl.uniform3f(u_Color, 0.5, 0.5, 1.0);
    food.forEach(function(element)
    {
        drawRect(element.x, element.y, 1, 1);
    });
}

function getRandomInt(max)
{
    return Math.floor(Math.random() * Math.floor(max));
}

function draw()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
    drawFood();
    drawSnake();
}

function update()
{
    var newPosX = snake[0].x + snakeDir.x;
    var newPosY = snake[0].y + snakeDir.y;

    snake.unshift({ x: newPosX, y: newPosY });
    snake.pop();

    var headX = snake[0].x;
    var headY = snake[0].y;

    food.forEach(function(f, index)
    {
        if (headX === f.x && headY === f.y)
        {
            snake.push({ x: f.x, y: f.y });
            food.splice(index, 1);
        }
    });

    var r = getRandomInt(20);
    if (r === 0)
    {
        var x = getRandomInt(fieldWidth);
        var y = getRandomInt(fieldHeight);
        food.push({ x: x, y: y });
    }

    draw();
    setTimeout(update, interval);
}

function keyboard(keyEvent)
{
    switch (keyEvent.key)
    {
        case "w":
            snakeDir.x = 0;
            snakeDir.y = 1;
            break;
        case "a":
            snakeDir.x = -1;
            snakeDir.y = 0;
            break;
        case "s":
            snakeDir.x = 0;
            snakeDir.y = -1;
            break;
        case "d":
            snakeDir.x = 1;
            snakeDir.y = 0;
            break;
        default:
            console.log("This key is not used.");
            break;
    }
}

function main()
{
    var vertexShaderSource = [
        "attribute vec2 a_Position;",
        "uniform mat4 u_ModelProjMatrix;",

        "void main()",
        "{",
        "    gl_Position = u_ModelProjMatrix * vec4(a_Position, 0.0, 1.0);",
        "}"].join('\n');

    var fragmentShaderSource = [
        "precision mediump float;",

        "uniform vec3 u_Color;",

        "void main()",
        "{",
        "    gl_FragColor = vec4(u_Color, 1.0);",
        "}"].join('\n');

    gl = document.getElementById("renderCanvas").getContext("webgl");

    var vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertexShaderSource);
    gl.compileShader(vShader);

    var fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragmentShaderSource);
    gl.compileShader(fShader);

    var program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    var vertices = new Float32Array([
        -0.5, 0.0, 0.5, 0.0, 0.0, 1.0,  // triangle
        0.0, 0.0,  // square
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ]);

    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    u_Color = gl.getUniformLocation(program, "u_Color");

    u_ModelProjMatrix = gl.getUniformLocation(program, "u_ModelProjMatrix");

    gl.clearColor(0.898, 0.984, 0.905, 1.0);

    // drawTriangle(0.0, 5.0, 6.0, 3.0);
    // drawTriangle(0.0, 2.0, 10.0, 4.0);
    // drawTriangle(0.0, -2.0, 12.0, 6.0);

    window.onkeypress = keyboard;

    update();
}

window.onload = main;