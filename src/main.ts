import * as BABYLON from "@babylonjs/core";
import { createScene as mergeCat }  from "./games/mergeCat/MergeCat";
import { createScene as vs }  from "./games/vs/CatVsDogGame";
import { createScene as barbecue } from "./games/barbecue/BarbecueGame";
import { createScene as hangman } from "./games/hangman/Hangman";

import { ComponentUpdateManager } from "./ComponentSystem";
import { Inspector } from "@babylonjs/inspector";
import { World } from "./utils/ECSSystem";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

let scene: BABYLON.Scene;

 let currentGameMode: number = 3; // 默认为模式 1
  export async function reloadScene(mode: number = currentGameMode): Promise<void> {
  currentGameMode = mode; // 保存当前模式
  await init(); // 重新创建场景
}
async function init() {
  let result;
  let world:World;
  switch (currentGameMode) {
    case 1:
      scene = await mergeCat(engine);
      break;
    case 2:
      scene = await vs(engine);
      break;
      case 3:
        result  = await barbecue(engine);
        scene = result.scene;
        world = result.world;
        break;
        case 4:
          result  = await hangman(engine);
          scene = result.scene;
          world = result.world;
      break;
    default:
      console.error("Invalid game mode");
      return;
  }
  engine.runRenderLoop(() => {
    ComponentUpdateManager.getInstance().update(engine.getDeltaTime() / 1000);;
    world?.update(engine.getDeltaTime() / 1000); // ✅ 加上这句
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
let isInspectorVisible = false;
window.addEventListener("keydown", (event) => {

  const allowedModes = [1, 2, 3];
const num = Number(event.key);
if (allowedModes.includes(num)) {
  reloadScene(num);
}
    else if (event.key.toLowerCase() === "r") {
        reloadScene();
    } else if (event.key.toLowerCase() === "i") {
      isInspectorVisible = !isInspectorVisible;
      if (isInspectorVisible) {
        Inspector.Show(scene, {});
      } else {
        Inspector.Hide();
      }
    }
});

// Inspector.Show(scene, {
 
// });
