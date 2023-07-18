import { Application, Entity, Color } from 'playcanvas-mjs';

const canvas = document.getElementById("renderCanvas");

const app = new Application(canvas);

// Fill the available space at full resolution
// app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
// app.setCanvasResolution(RESOLUTION_AUTO);

// Ensure canvas is resized when window changes size
window.addEventListener("resize", () => app.resizeCanvas());

// Create box entity
const box = new Entity("cube");
box.addComponent("model", {
    type: "box"
});
app.root.addChild(box);

// Create camera entity
const camera = new Entity("camera");
camera.addComponent("camera", {
    clearColor: new Color(0.1, 0.1, 0.1)
});
app.root.addChild(camera);
camera.setPosition(0, 0, 3);

// Create directional light entity
const light = new Entity("light");
light.addComponent("light");
app.root.addChild(light);
light.setEulerAngles(45, 0, 0);

// Rotate the box according to the delta time since the last frame
app.on("update", dt => box.rotate(10 * dt, 20 * dt, 30 * dt));

app.start();
//# sourceMappingURL=index.js.map
