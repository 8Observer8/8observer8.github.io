
const ElementType = {
    Empty0: 0,
    Empty1: 1,
    Empty2: 2,
    Empty3: 3,
    Empty4: 4,
    Empty5: 5,
    Empty6: 6,
    Empty7: 7,
    Empty8: 8,
    Default: 9,
    Mine: 10
}
Object.freeze(ElementType);

class FieldElement
{
    constructor(program, position, offset, vertPosBuffer, defaultTexCoordBuffer, empty0TexCoordBuffer,
        empty1TexCoordBuffer, empty2TexCoordBuffer, empty3TexCoordBuffer, empty4TexCoordBuffer,
        empty5TexCoordBuffer, empty6TexCoordBuffer, empty7TexCoordBuffer, empty8TexCoordBuffer,
        mineTexCoordBuffer, assetsTexture)
    {
        this.position = position;
        const size = { w: 25, h: 25 };
        this.mine = false;
        this.covered = true;

        this.defaultTexCoordBuffer = defaultTexCoordBuffer;
        this.empty0TexCoordBuffer = empty0TexCoordBuffer;
        this.empty1TexCoordBuffer = empty1TexCoordBuffer;
        this.empty2TexCoordBuffer = empty2TexCoordBuffer;
        this.empty3TexCoordBuffer = empty3TexCoordBuffer;
        this.empty4TexCoordBuffer = empty4TexCoordBuffer;
        this.empty5TexCoordBuffer = empty5TexCoordBuffer;
        this.empty6TexCoordBuffer = empty6TexCoordBuffer;
        this.empty7TexCoordBuffer = empty7TexCoordBuffer;
        this.empty8TexCoordBuffer = empty8TexCoordBuffer;
        this.mineTexCoordBuffer = mineTexCoordBuffer;

        const pixelPositionX = position[0] * size.w + offset[0];
        const pixelPositionY = position[1] * size.h + offset[1];

        const shape = planck.Box(size.w / 2 / worldScale, size.h / 2 / worldScale);
        const body = world.createBody();
        body.createFixture({ shape: shape, userData: { position: position } });
        body.setStatic();
        body.setPosition(planck.Vec2(
            pixelPositionX / worldScale + size.w / 2 / worldScale,
            pixelPositionY / worldScale + size.h / 2 / worldScale));

        this.element = new ObjectForGraphics(program, [pixelPositionX,
            pixelPositionY, position[2]], 0, [size.w, size.h, 1], 6,
            vertPosBuffer, defaultTexCoordBuffer, assetsTexture);
    }

    draw(projViewMatrix)
    {
        this.element.draw(projViewMatrix);
    }

    setElementType(elementType)
    {
        this.covered = false;

        switch (elementType)
        {
            case ElementType.Empty0:
                this.element.texCoordBuffer = this.empty0TexCoordBuffer;
                break;
            case ElementType.Empty1:
                this.element.texCoordBuffer = this.empty1TexCoordBuffer;
                break;
            case ElementType.Empty2:
                this.element.texCoordBuffer = this.empty2TexCoordBuffer;
                break;
            case ElementType.Empty3:
                this.element.texCoordBuffer = this.empty3TexCoordBuffer;
                break;
            case ElementType.Empty4:
                this.element.texCoordBuffer = this.empty4TexCoordBuffer;
                break;
            case ElementType.Empty5:
                this.element.texCoordBuffer = this.empty5TexCoordBuffer;
                break;
            case ElementType.Empty6:
                this.element.texCoordBuffer = this.empty6TexCoordBuffer;
                break;
            case ElementType.Empty7:
                this.element.texCoordBuffer = this.empty7TexCoordBuffer;
                break;
            case ElementType.Empty8:
                this.element.texCoordBuffer = this.empty8TexCoordBuffer;
                break;
            case ElementType.Default:
                this.element.texCoordBuffer = this.defaultTexCoordBuffer;
                break;
            case ElementType.Mine:
                this.element.texCoordBuffer = this.mineTexCoordBuffer;
                break;
            default:
                console.log("Unknown type of element");
                break;
        }
    }
}
