import * as BABYLON from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";
import "@babylonjs/loaders";
import * as GUI from "@babylonjs/gui/2D";

import { PlayerComponent } from "./Player/PlayerComponent";
import { PlayerMovementComponent } from "./Player/PlayerMovementComponent";
import { CameraFollowComponent } from "./CameraFollowComponent";
import { AttackComponent } from "./Player/AttackComponent";
import { EnemySpawnComponent } from "./Enemy/EnemySpawnComponent";
import { ComponentUpdateManager, addComponent } from "./ComponentSystem";
import { GameLifecycleManager } from "./GameLifecycleManager";
import { PauseMenuUI } from "./PauseMenuUI";
import {createExperienceBar} from "./Player/Function/createExperienceBar";
import { PlayerExperienceComponent } from "./Player/PlayerExperienceComponent";
import { GameManager } from "./GameManager";
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas);


const createScene = async (): Promise<BABYLON.Scene> => {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    new BABYLON.HemisphericLight("light1", BABYLON.Vector3.Up(), scene);

    const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    //groundMaterial.diffuseTexture = new BABYLON.Texture("/ground.jpg", scene);
  
   // groundMaterial.diffuseTexture.scale = 50;
    //groundMaterial.diffuseTexture.vScale = 50;
    const texture = new BABYLON.Texture("assets/ground.jpg", scene);
texture.uScale = 50;
texture.vScale = 50;
groundMaterial.diffuseTexture = texture;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 1000, height: 1000, subdivisions: 100 }, scene);
    ground.material = groundMaterial;

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "character-female-a.glb", scene, (meshes) => {
        const playerMesh = meshes[0];
        playerMesh.position = new BABYLON.Vector3(0, 0, 0);

        const player = addComponent(playerMesh, new PlayerComponent(playerMesh, scene));
        addComponent(playerMesh, new PlayerMovementComponent(playerMesh, 5, scene));
        addComponent(playerMesh, new CameraFollowComponent(playerMesh, camera, playerMesh));
        addComponent(playerMesh, new AttackComponent(playerMesh, 1));

        const expBar = createExperienceBar(scene);
const xpComponent = addComponent(playerMesh, new PlayerExperienceComponent(playerMesh, expBar));
        (scene as any).player = player;
        
GameManager.getInstance().setPlayer(playerMesh, player);
    });

    const enemySpawnerNode = new BABYLON.TransformNode("enemySpawner", scene);
    addComponent(enemySpawnerNode, new EnemySpawnComponent(enemySpawnerNode, scene, 2));

    GameLifecycleManager.init(engine, canvas, createScene);
    engine.runRenderLoop(() => {
        const deltaTime = engine.getDeltaTime() / 1000;
        ComponentUpdateManager.getInstance().update(deltaTime);
        scene.render();
    });

    return scene;
};
let scene
async function init() {
   scene = await createScene();
  // Additional logic after scene is created
}
init();

window.addEventListener("resize", () => {
    engine.resize();
});

window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "r") {
        reloadScene();
    }
});

export async function reloadScene(): Promise<void> {
  scene.dispose();
  scene = await createScene();
  engine.runRenderLoop(() => {
    scene.render();
  });
}

// Inspector.Show(scene, {
 
// });

window.addEventListener("keydown", (ev) => {
  if (ev.key === "i") {
    scene.debugLayer.isVisible()
      ? scene.debugLayer.hide()
      : scene.debugLayer.show();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    GameLifecycleManager.getInstance().pause(); // Pause the game
    new PauseMenuUI(scene, () => {
      console.log("Game resumed");
    }, () => {
      console.log("Game restarted");
    });
  }
});