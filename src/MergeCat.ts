 import * as BABYLON from "@babylonjs/core";
 import { FruitManager } from "./FruitManager";
 import { UIManager } from "./UIManager";
 import { GameSettings } from "./GameSettings";
 import { FruitScript } from "./FruitScript";
 import { getAllComponentsOfType } from "./ComponentSystem";
 //import Ammo from "ammo.js";
 //import { AmmoJSPlugin2 } from "@babylonjs/core/Physics/Plugins/ammoJSPlugin";

 
export async function createScene(engine: BABYLON.Engine): Promise<BABYLON.Scene> {
const scene = new BABYLON.Scene(engine);

// 添加基础光照和相机
// const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 5, -20), scene);
// camera.setTarget(new BABYLON.Vector3(0, 5, 0));

const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -100), scene);
camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

const halfSize = GameSettings.boxSize ;

camera.orthoLeft = -halfSize;
camera.orthoRight = halfSize;
camera.orthoTop = halfSize;
camera.orthoBottom = -halfSize;

camera.setTarget(BABYLON.Vector3.Zero());


new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
//new BABYLON.AreaLight

  var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
//   const plugin = new AmmoJSPlugin2(true, Ammo); // ✅ 使用 v2 插件
//   scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), plugin);
  var physicsPlugin = new BABYLON.CannonJSPlugin();
  scene.enablePhysics(gravityVector, physicsPlugin);
  createBoundary(scene)
// // 初始化 UI 和第一颗水果
FruitManager.initialize(scene);
 UIManager.createUI(scene);
 FruitManager.spawnNewDroppableFruit();

// 每帧检查碰撞（简化）
scene.registerBeforeRender(() => {
  const fruits = getAllComponentsOfType(FruitScript);

  for (let i = 0; i < fruits.length; i++) {
    for (let j = i + 1; j < fruits.length; j++) {
      const a = fruits[i];
      const b = fruits[j];
      if (a.isMerged || b.isMerged) continue;
      if (a.getMesh().intersectsMesh(b.getMesh(), false)) {
        a.onCollision(b);
      }
    }
  }
});
return scene;
}

function createBoundary(scene: BABYLON.Scene) {
    const ground = BABYLON.MeshBuilder.CreateBox("ground", { width: 10, height: 1, depth: 1 }, scene);
    ground.position = new BABYLON.Vector3(0, -5.5, 0);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground, BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.8 }, scene
    );
  
    const leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", { width: 1, height: 10, depth: 1 }, scene);
    leftWall.position = new BABYLON.Vector3(-5.5, 0, 0);
    leftWall.physicsImpostor = new BABYLON.PhysicsImpostor(
      leftWall, BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.8 }, scene
    );
  
    const rightWall = BABYLON.MeshBuilder.CreateBox("rightWall", { width: 1, height: 10, depth: 1 }, scene);
    rightWall.position = new BABYLON.Vector3(5.5, 0, 0);
    rightWall.physicsImpostor = new BABYLON.PhysicsImpostor(
      rightWall, BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.8 }, scene
    );
  }
  
