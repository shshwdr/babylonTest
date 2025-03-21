import * as BABYLON from "@babylonjs/core";
import { Inspector, inspector } from "@babylonjs/inspector"
//import '@babylonjs/loaders/glTF'
//import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";
import "@babylonjs/loaders";
import * as GUI from "@babylonjs/gui/2D";
//registerBuiltInLoaders();
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas);
import { Player } from "./Player.js";
import { PlayerMovementComponent } from "./PlayerMovementComponent.js";
import { UpdateManager } from "./UpdateManager.js";
import { CameraFollowComponent } from "./CameraFollowComponent.js";
import { AttackComponent } from "./AttackComponent.js";
import { EnemySpawnComponent } from "./EnemySpawnComponent";
import {AttachHitBox} from "./AttachHitBox.js";

// 播放所有动画的函数
function playAnimationsInSequence(animationGroups) {
  let currentIndex = 0;

  // 播放第一个动画
  playNextAnimation();

  function playNextAnimation() {
      if (currentIndex < animationGroups.length) {
          // 获取当前动画组
          const group = animationGroups[currentIndex];
          console.log("Playing animation: " + group.name);
          
          // 启动动画播放
          group.start(true, 1.0, group.from, group.to, false, 1.0, function () {
              // 动画播放完成后，播放下一个动画
              currentIndex++;
              playNextAnimation();
          });
      } else {
          console.log("All animations played.");
      }
  }
}
const createScene = async () => {
  const scene = new BABYLON.Scene(engine);
  //scene.createDefaultCameraOrLight(true, false, true);
  const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
  const light = new BABYLON.HemisphericLight("light1", BABYLON.Vector3.Up(), scene);

  const updateManager = new UpdateManager();
  //const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
//   BABYLON.SceneLoader.ImportMesh("", "./GLB format/", "character-female-b.glb",scene)
//   BABYLON.SceneLoader.ImportMesh("", "./GLB format/", "character-female-b.glb", scene, function (meshes, particleSystems, skeletons, animationGroups) {
//     加载完模型后，获取所有动画组
//     console.log("Animation Groups: ", animationGroups);

//     获取所有动画组的名称
//     animationGroups.forEach((group, index) => {
//         console.log("Animation Group " + index + ": " + group.name);
//     });

//      查找特定的动画组 "walk"（假设动画组名称为 "walk"）
//      const walkAnimationGroup = animationGroups.find(group => group.name === "walk");

//      if (walkAnimationGroup) {
//          播放 "walk" 动画组
//          console.log("Playing animation: walk");
//          walkAnimationGroup.start(true, 1.0, walkAnimationGroup.from, walkAnimationGroup.to, false, 1.0);
//      } else {
//          console.log("Animation group 'walk' not found.");
//      }

//     播放所有动画
//    playAnimationsInSequence(animationGroups);
// });

const sphereMaterial = new BABYLON.StandardMaterial();

  sphereMaterial.diffuseTexture = new BABYLON.Texture('/ground.jpg');

   const ground = BABYLON.MeshBuilder.CreateGround("ground", { 
    width: 1000, height: 1000, 
  subdivisions:100}, scene);
  sphereMaterial.diffuseTexture.uScale = 50;
  sphereMaterial.diffuseTexture.vScale = 50;
ground.material = sphereMaterial;
  BABYLON.SceneLoader.ImportMesh("", "./GLB format/", "character-female-a.glb", scene, (meshes) => {
    const playerMesh = meshes[0];
    playerMesh.position = new BABYLON.Vector3(0, 0, 0);

    // 设置玩家
    const player = new Player(playerMesh,scene);
    player.movementComponent = new PlayerMovementComponent(player, 5,scene); // 玩家移动速度
    

    player.cameraFollowComponent = new CameraFollowComponent(camera,player);

    player.attackComponent = new AttackComponent(player, 1);


    scene.player = player

});

const enemySpawnManager = new BABYLON.TransformNode("enemySpawn", scene);  // 创建空节点
const enemySpawn = new EnemySpawnComponent(scene,2);

  
    // 游戏主循环
    engine.runRenderLoop(() => {
      const deltaTime = engine.getDeltaTime() / 1000; // 获取每帧的时间差（秒）
      //gameLoop(deltaTime);
      updateManager.update(deltaTime);
  });
  return scene;
};
function withinEpsilon(a, b, epsilon) {
  return Math.abs(a - b) <= epsilon;
}
var scene = await createScene();
engine.runRenderLoop(() => {
  scene.render();
});
window.addEventListener("resize", () => {
  engine.resize();
});
window.addEventListener("keydown", function(event) {
  if (event.key === "r" || event.key === "R") {
      reloadScene();
  }
});
async function reloadScene() {
  // 销毁当前场景
  scene.dispose();
  // 创建并加载新场景
  scene = await createScene();
  engine.runRenderLoop(() => {
      scene.render();
  });
}
Inspector.Show(scene, {

});