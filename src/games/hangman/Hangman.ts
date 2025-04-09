
import * as BABYLON from "@babylonjs/core";
import { World } from "../../utils/ECSSystem";
import { HangmanSystem } from "./HangmanSystem";

export async function createScene(engine: BABYLON.Engine): Promise<{ scene: BABYLON.Scene, world: World }> {
  const scene = new BABYLON.Scene(engine);
  const world = new World();
  const camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 0, -10), scene);
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  camera.setTarget(BABYLON.Vector3.Zero());
  scene.activeCamera = camera;
  camera.attachControl(true);
  
  // ✅ 设置适应不同比例的正交参数（结合你的 ScreenAdapter）
  const ratio = engine.getRenderWidth() / engine.getRenderHeight();
  const orthoHalfHeight = 5; // 你可以自定义逻辑单位
  camera.orthoTop = orthoHalfHeight;
  camera.orthoBottom = -orthoHalfHeight;
  camera.orthoLeft = -orthoHalfHeight * ratio;
  camera.orthoRight = orthoHalfHeight * ratio;
  
  // 创建并注册系统（若 HangmanSystem 是 system）
  const hangman = new HangmanSystem(scene,world); // 你也可以 addSystem 到 world 中

  return { scene, world };
}

