import * as BABYLON from "@babylonjs/core";
import { FruitManager } from "./FruitManager";
import { GameSettings } from "./GameSettings";
import { Component } from "./ComponentSystem";

export class DragController extends Component {
  private isDragging = true;
  private scene: BABYLON.Scene;
  private engine: BABYLON.Engine;
  private hasStartedDrag = false;

  constructor(owner: BABYLON.TransformNode) {
    super(owner);
    this.scene = owner.getScene();
    this.engine = this.scene.getEngine() as BABYLON.Engine;;
 this.scene.onPointerObservable.add((pointerInfo) => {
    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
      this.hasStartedDrag = true;
    }
  }, BABYLON.PointerEventTypes.POINTERDOWN);
    // 注册 pointer up
    this.scene.onPointerObservable.add(this.onPointerUp, BABYLON.PointerEventTypes.POINTERUP);
  }

  update(): void { 
    if (!FruitManager.currentFruit || !this.isDragging|| !this.hasStartedDrag) return;
  
    const pointerX = this.scene.pointerX;
    const screenWidth = this.engine.getRenderWidth();
    const orthoWidth = GameSettings.boxSize;

    const ratioX = pointerX / screenWidth; // [0 ~ 1]
    const worldX = -orthoWidth / 2 + ratioX * orthoWidth;

    // 直接更新球的位置
    const sphere = FruitManager.currentFruit.sphere;
    if (sphere) {
      sphere.position.x = worldX;
      // 保持y轴位置不变
      sphere.position.y = GameSettings.boxSize / 2 - 1;
    }
  }
  

  private onPointerUp = (eventData: BABYLON.PointerInfo) => {
    if (!this.isDragging || !this.hasStartedDrag) return;
  
    // 只响应主触点的 pointerUp
    if (eventData.type !== BABYLON.PointerEventTypes.POINTERUP) return;
  
    this.isDragging = false;
  
    FruitManager.currentFruit?.startFalling();
    FruitManager.currentFruit = null;
    setTimeout(async () => {
      FruitManager.spawnNewDroppableFruit();
    }, 1000);
  };
  

  destroy(): void {
    this.scene.onPointerObservable.removeCallback(this.onPointerUp);
  }
  
}
