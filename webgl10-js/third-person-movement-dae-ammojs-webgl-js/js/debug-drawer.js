class DebugDrawer
{
    constructor(edge)
    {
        this.edge = edge;
        this.projViewMatrix = null;

        this.heap = null;
        this.debugDrawer = new Ammo.DebugDrawer();
        this.debugDrawer.drawLine = ((from, to, color) => { this.drawLine(from, to, color) }).bind(this);
        this.debugDrawer.setDebugMode = () => { };

        this.debugMode = 1; // 0 - 0ff, 1 - on
        this.debugDrawer.getDebugMode = () => { return this.debugMode; };
        this.debugDrawer.setDebugMode(1);

        this.debugDrawer.drawContactPoint = (pointOnB, normalOnB, distance, lifeTime, color) => { };
        this.debugDrawer.reportErrorWarning = (warningString) => { };
        this.debugDrawer.draw3dText = (location, textString) => { };

        world.setDebugDrawer(this.debugDrawer);

        this.fromX = 0;
        this.fromY = 0;
        this.fromZ = 0;
        this.toX = 0;
        this.toY = 0;
        this.toZ = 0;
        this.centerX = 0;
        this.centerY = 0;
        this.centerZ = 0;

        this.length = 0;
        this.vec = glMatrix.vec3.create();
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.unitX = glMatrix.vec3.fromValues(1, 0, 0);
    }

    drawLine(from, to, color)
    {
        this.heap = Ammo.HEAPF32;

        this.fromX = this.heap[(parseInt(from) + 0) / 4];
        this.fromY = this.heap[(parseInt(from) + 4) / 4];
        this.fromZ = this.heap[(parseInt(from) + 8) / 4];

        this.toX = this.heap[(parseInt(to) + 0) / 4];
        this.toY = this.heap[(parseInt(to) + 4) / 4];
        this.toZ = this.heap[(parseInt(to) + 8) / 4];

        if (this.fromX > this.toX)
        {
            this.centerX = this.toX + Math.abs(this.fromX - this.toX) / 2;
        }
        else
        {
            this.centerX = this.fromX + Math.abs(this.toX - this.fromX) / 2;
        }

        if (this.fromY > this.toY)
        {
            this.centerY = this.toY + Math.abs(this.fromY - this.toY) / 2;
        }
        else
        {
            this.centerY = this.fromY + Math.abs(this.toY - this.fromY) / 2;
        }

        if (this.fromZ > this.toZ)
        {
            this.centerZ = this.toZ + Math.abs(this.fromZ - this.toZ) / 2;
        }
        else
        {
            this.centerZ = this.fromZ + Math.abs(this.toZ - this.fromZ) / 2;
        }

        this.vec[0] = this.toX - this.fromX;
        this.vec[1] = this.toY - this.fromY;
        this.vec[2] = this.toZ - this.fromZ;
        this.length = glMatrix.vec3.length(this.vec);

        glMatrix.vec3.normalize(this.vec, this.vec);
        glMatrix.quat.rotationTo(this.edge.rotation, this.unitX, this.vec);

        this.edge.scale = [this.length, 0.05, 0.05];
        this.edge.position = [this.centerX, this.centerY, this.centerZ];
        this.edge.draw(this.projViewMatrix);
    }
}
