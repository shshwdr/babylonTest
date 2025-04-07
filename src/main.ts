import * as BABYLON from "@babylonjs/core";
import { createScene as mergeCat }  from "./MergeCat";
import { createScene as vs }  from "./CatVsDogGame";

import { ComponentUpdateManager } from "./ComponentSystem";
import { Inspector } from "@babylonjs/inspector";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

let scene: BABYLON.Scene;

 let currentGameMode: number = 1; // 默认为模式 1
  export async function reloadScene(mode: number = currentGameMode): Promise<void> {
  currentGameMode = mode; // 保存当前模式
  await init(); // 重新创建场景
}
async function init() {
  switch (currentGameMode) {
    case 1:
      scene = await mergeCat(engine);
      break;
    case 2:
      scene = await vs(engine);
      break;
    case 3:
      // 添加其他游戏模式的创建逻辑
      break;
    default:
      console.error("Invalid game mode");
      return;
  }
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

  const allowedModes = [1, 2, 3];
const num = Number(event.key);
if (allowedModes.includes(num)) {
  reloadScene(num);
}
    else if (event.key.toLowerCase() === "r") {
        reloadScene();
    }
});

// Inspector.Show(scene, {
 
// });
