precision mediump float;
uniform int uId;

void main()
{
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    if (uId == 0) // Cube
    {
        color = vec4(1.0, 0.0, 0.0, 1.0);
    }
    else if (uId == 1) // Cone
    {
        color = vec4(0.0, 1.0, 0.0, 1.0);
    }
    else if (uId == 2) // Cylinder
    {
        color = vec4(0.0, 0.0, 1.0, 1.0);
    }

    gl_FragColor = color;
}
