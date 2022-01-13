class ObjectForCollider
{
    constructor(position, rotation, shape, mass)
    {
        this.position = position;
        this.rotation = rotation;

        this.tempMotionState = null;
        this.tempTransform = new Ammo.btTransform();
        this.tempRotation = null;
        const initialPosition = new Ammo.btVector3(position[0], position[1], position[2]);
        const initialRotation = new Ammo.btQuaternion(rotation[0], rotation[1], rotation[2], rotation[3]);
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(initialPosition);
        transform.setRotation(initialRotation);
        const motionState = new Ammo.btDefaultMotionState(transform);

        const localInertia = new Ammo.btVector3(0, 0, 0);
        if (mass !== 0)
        {
            shape.calculateLocalInertia(mass, localInertia);
        }

        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        this.body = new Ammo.btRigidBody(rbInfo);
        this.body.setActivationState(4); // Disable deactivation

        // this.body.setFriction(1);
        // this.body.setRollingFriction(1);

        world.addRigidBody(this.body);
    }

    update()
    {
        this.tempMotionState = this.body.getMotionState();
        if (this.tempMotionState)
        {
            this.tempMotionState.getWorldTransform(this.tempTransform);
            this.position[0] = this.tempTransform.getOrigin().x();
            this.position[1] = this.tempTransform.getOrigin().y();
            this.position[2] = this.tempTransform.getOrigin().z();
            this.tempRotation = this.tempTransform.getRotation();
            this.rotation[0] = this.tempRotation.x();
            this.rotation[1] = this.tempRotation.y();
            this.rotation[2] = this.tempRotation.z();
            this.rotation[3] = this.tempRotation.w();
        }
    }
}
