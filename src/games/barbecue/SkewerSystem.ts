import { System, World } from "../../utils/ECSSystem";
import { BarbecueSettings } from "./BarbecueSettings";
import * as BABYLON from "@babylonjs/core";
import { FoodSystem } from "./FoodSystem";
import { InputManager } from "../../utils/InputManager";
import { FloatingTextManager } from "../../utils/FloatingTextManager";

export class SkewerSystem implements System {
  private scene!: BABYLON.Scene;
  private skewer!: BABYLON.Mesh;
  private skewerScale = 1;
  public isPoking = false;
  private lastHitCount = 0; // ✅ 新增字段
  private skewerRoot!: BABYLON.TransformNode;

  constructor(private foodSystem: FoodSystem) {}

  start(world: World): void {
    this.scene = (window as any).scene;

    // 1. 创建控制节点（旋转用）
    this.skewerRoot = new BABYLON.TransformNode("skewerRoot", this.scene);
    this.skewerRoot.position = new BABYLON.Vector3(0, BarbecueSettings.startY, 0);

    // 2. 创建签子本体（缩放用）
    this.skewer = BABYLON.MeshBuilder.CreateBox("skewer", {
      width: 0.2,
      height: 1, // 初始 1 单位长
      depth: 0.2
    }, this.scene);

    // ✅ 将原点设置在底部（即沿 Y 正方向伸展）
    this.skewer.setPivotPoint(new BABYLON.Vector3(0, -0.5, 0)); // 设置 pivot 为底部

    // 3. 父子连接
    this.skewer.parent = this.skewerRoot;
  }

  poke(info:BABYLON.PointerInfo): void {
    if (this.isPoking) return;
    this.isPoking = true;
//const pos =  InputManager.getPointerPos(info);
  const pos = InputManager.getPointerWorldPosFromInfo(info);
    //const clickWorldPos = InputManager.getPointerWorldPos();
    const dir = pos.subtract(this.skewerRoot.position).normalize();
    dir.z = 0;

    dir.normalize();
    // ✅ 旋转父节点
    // const angle = Math.atan2(dir.y, dir.x);
    // this.skewerRoot.rotation.z = angle - Math.PI / 2;

    const from = new BABYLON.Vector2(this.skewerRoot.position.x, this.skewerRoot.position.y);
const to = new BABYLON.Vector2(pos.x, pos.y);
const dir2D = to.subtract(from).normalize();

const angle = Math.atan2(dir2D.y, dir2D.x);
this.skewerRoot.rotation.z = angle - Math.PI / 2;

    // ✅ 重置缩放
    this.skewer.scaling.y = 1;

    setTimeout(() => {
      this.skewer.scaling.y = 15;

      this.lastHitCount = this.checkHit(dir); // 命中检测

      setTimeout(() => {
        this.skewer.scaling.y = 1;
        this.isPoking = false;
        FloatingTextManager.clearAll();
      }, 1200);
    }, 10);
  }

  // ✅ 补上暴露接口
  getLastHitCount(): number {
    return this.lastHitCount;
  }
 
  private checkHit(direction: BABYLON.Vector3): number {
    const foods = this.foodSystem.getCurrentFoods();
    const base = this.skewerRoot.position;
    const skewerEnd = base.add(direction.scale(10));

    let hitCount = 0;

    for (const food of foods) {
      const toFood = food.mesh.position.subtract(base);
      const projection = BABYLON.Vector3.Dot(toFood, direction);
      if (projection < 0) continue;

      const projected = base.add(direction.scale(projection));
      const dist = BABYLON.Vector3.Distance(projected, food.mesh.position);
      const dist2D = BABYLON.Vector2.Distance(
        new BABYLON.Vector2(projected.x, projected.y),
        new BABYLON.Vector2(food.mesh.position.x, food.mesh.position.y)
      );
      if (dist2D <= BarbecueSettings.foodRadius) {
        hitCount++;
        FloatingTextManager.showFloatingText("+"+hitCount, food.mesh.position, this.scene); // 这里可以改为具体分数
        //food.mesh.dispose();
      }
    }

    console.log("刺中数量:", hitCount);
    // TODO: 结算分数
    
    return hitCount;
  }

  update(): void {}
  destroy(): void {}
}
