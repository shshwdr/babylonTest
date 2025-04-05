import * as BABYLON from "@babylonjs/core";
import { createScene }  from "./MergeCat";
import { ComponentUpdateManager } from "./ComponentSystem";
import { Inspector } from "@babylonjs/inspector";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

let scene: BABYLON.Scene;

async function init() {
  scene = await createScene(engine);
  engine.runRenderLoop(() => {
    ComponentUpdateManager.getInstance().update(engine.getDeltaTime() / 1000);
    scene.render();
  });
}

init();

window.addEventListener("resize", () => {
    engine.resize();
  //   var dist = 10
  //   var camera = scene.activeCamera as BABYLON.FreeCamera;
  //   const aspect = engine.getAspectRatio(camera);
  // camera.orthoLeft = -dist * aspect;
  // camera.orthoRight = dist * aspect;
});

window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "r") {
        reloadScene();
    }
});

export async function reloadScene(): Promise<void> {
  init()
}
// Inspector.Show(scene, {
 
// });
