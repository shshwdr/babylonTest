import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { GameSettings } from "./GameSettings";
import { DragController } from "./DragController";
import { FruitScript } from "./FruitScript";
import { addComponent,removeComponent } from "../ComponentSystem"; // ✅ 替代 TOOLKIT

export class FruitManager {
  static scene: BABYLON.Scene;
  static currentFruit: FruitScript | null = null;
  static score: number = 0;
  static scoreText: GUI.TextBlock;

  static initialize(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  static spawnFruit(name: string, position?: BABYLON.Vector3): FruitScript {
    const node = new BABYLON.TransformNode("fruit", this.scene);
   // node.position = position ?? new BABYLON.Vector3(0, 10, 0);
    const topY = GameSettings.boxSize / 2 - 1; // 距离顶边留一点空间
    node.position = position ?? new BABYLON.Vector3(0, topY, 0);
    const script = new FruitScript(node, name);
    addComponent(node, script);
  
    return script; // ✅ 返回 script
  }

  static spawnFruitMerge(name: string, position?: BABYLON.Vector3): FruitScript {
    const node = new BABYLON.TransformNode("fruit", this.scene);
    node.position = position!
    const script = new FruitScript(node, name);
    script.startFalling();
    addComponent(node, script);
    script.isMerged = true;
    setTimeout(() => {
      script.isMerged = false;
        }, 200);
      
    return script; // ✅ 返回 script
  }

  static spawnNewDroppableFruit() {
    if (this.currentFruit) {
        removeComponent(this.currentFruit.owner, DragController);
      }

    const fruitScript = this.spawnFruit(randomFruit());
    this.currentFruit = fruitScript;
  
    const drag = new DragController(fruitScript.owner); // ✅ 传入 TransformNode
    addComponent(fruitScript.owner, drag);
  }
  

  static addScore(value: number) {
    this.score += value;
    this.scoreText.text = `Score: ${this.score}`;
  }
}

function randomFruit(): string {
  const list = GameSettings.fruitData.slice(0, 4); // cherry to lemon
  return list[Math.floor(Math.random() * list.length)].name;
}
