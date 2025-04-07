import * as BABYLON from "@babylonjs/core";
import { FruitManager } from "./FruitManager";
import { GameSettings } from "./GameSettings";
import { Component } from "../ComponentSystem";

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
    if (!FruitManager.currentFruit || !this.isDragging || !this.hasStartedDrag) return;
  
    const camera = this.scene.activeCamera as BABYLON.FreeCamera;
  
    if (camera.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
      const orthoLeft = camera.orthoLeft!;
      const orthoRight = camera.orthoRight!;
      const pointerX = this.scene.pointerX;
      const screenWidth = this.engine.getRenderWidth();
  
      const ratio = pointerX / screenWidth;
      const worldX = BABYLON.Scalar.Lerp(orthoLeft, orthoRight, ratio);
  
      const sphere = FruitManager.currentFruit.sphere;
      if (sphere) {
        
    const radius = GameSettings.getFruitInfo(FruitManager.currentFruit.fruitName).radius;
    // ✅ 基于你实际场景的左右墙位置
    const minX = -5 + radius;
    const maxX = 5 - radius;
    const clampedX = BABYLON.Scalar.Clamp(worldX, minX, maxX);
        sphere.position.x = clampedX;
        sphere.position.y = GameSettings.boxSize / 2 - 1;

      }
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
