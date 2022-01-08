class ObjectForPhysics extends ObjectForGraphics
{
    constructor(program, position, rotation, scale, color, amountOfVertices, vertPosBuffer, normalBuffer,
        texCoordBuffer, texture, world, shape, isStatic)
    {
        super(program, position, color, amountOfVertices, vertPosBuffer, normalBuffer, texCoordBuffer, texture);
        this.rotation = rotation;
        this.scale = scale;

        if (isStatic)
        {
            this.body = new CANNON.Body({ mass: 0 });
        }
        else
        {
            this.body = new CANNON.Body({ mass: 10 });
        }

        this.body.addShape(shape);
        this.body.position = new CANNON.Vec3(position[0], position[1], position[2]);
        this.body.quaternion = new CANNON.Quaternion(this.rotation[0], this.rotation[1], this.rotation[2], this.rotation[3]);
        world.addBody(this.body);
    }

    update()
    {
        this.position[0] = this.body.position.x;
        this.position[1] = this.body.position.y;
        this.position[2] = this.body.position.z;

        this.rotation[0] = this.body.quaternion.x;
        this.rotation[1] = this.body.quaternion.y;
        this.rotation[2] = this.body.quaternion.z;
        this.rotation[3] = this.body.quaternion.w;
    }
}
