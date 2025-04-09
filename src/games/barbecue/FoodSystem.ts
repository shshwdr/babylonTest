import { System, World } from "../../utils/ECSSystem";
import { BarbecueSettings } from "./BarbecueSettings";
import * as BABYLON from "@babylonjs/core";
import { BarbecueGame } from "./BarbecueGame";
import {randomRange} from "../../utils/MathUtils";


type Food = {
  mesh: BABYLON.Mesh;
  direction: "left" | "right";
  speed: number;
};

export class FoodSystem implements System {
  private scene!: BABYLON.Scene;
  private currentFoods: Food[] = [];

  private startPos: BABYLON.Vector3 = new BABYLON.Vector3(0, BarbecueSettings.startY, 0);
  private skewLine: BABYLON.Vector3[] = [];

  start(world: World) {
    this.scene = (window as any).scene; // or pass in scene
  }

  spawnFoods(round: number, angleDeg: number) {
    const config = BarbecueSettings.rounds[round];
    const count = config.count;
    const speedRange = config.speedRange;

    const angle = (angleDeg * Math.PI) / 180;
    const direction = new BABYLON.Vector3(Math.sin(angle), Math.cos(angle), 0);

    this.skewLine = [];
const diff = 1
const flyTime = randomRange(2, 3)
for (let i = diff; i < count + diff; i++) {
  const distance = i * BarbecueSettings.foodSpacing;
  const finalPos = this.startPos.add(direction.scale(distance));

  const fromLeft = Math.random() > 0.5;
  const horizontalDir = fromLeft ? -1 : 1;
  const dirVec = new BABYLON.Vector3(horizontalDir, 0, 0);

  const [min, max] = speedRange;
  const speed = BABYLON.Scalar.RandomRange(min, max);

  const startX = finalPos.x + dirVec.x * speed * flyTime; // ✅ 注意：+方向反推
  const startPos = new BABYLON.Vector3(startX, finalPos.y, 0);

  const foodImages = [
    "broccoli.png",
    "carrot.png",
    "meat.png",
    "shrimp.png",
    "steak.png",
    "chili.png",

  ];

  const imageName = foodImages[Math.floor(Math.random() * foodImages.length)];
  const texturePath = `/textures/barbecue/${imageName}`;
  
  const food = BABYLON.MeshBuilder.CreatePlane("food", {
    size: BarbecueSettings.foodRadius * 2, // 设置为圆形一样大
  }, this.scene);
  
  // 面朝摄像机（Z朝外）
  food.rotation.x = Math.PI; // 翻转 X 轴让图案面朝镜头（根据你的相机朝向可调整）
  food.position = startPos;
  
  const mat = new BABYLON.StandardMaterial("mat", this.scene);
  mat.diffuseTexture = new BABYLON.Texture(`/textures/barbecue/${imageName}`, this.scene);
  mat.diffuseTexture.hasAlpha = true;
  mat.useAlphaFromDiffuseTexture = true;
  mat.backFaceCulling = false;
  mat.emissiveTexture = new BABYLON.Texture(`/textures/barbecue/${imageName}`, this.scene);
  mat.emissiveTexture.hasAlpha = true;
  mat.disableLighting = true;
food.material = mat;
food.scaling.setAll(1.6);
  




  // const food = BABYLON.MeshBuilder.CreateSphere("food", {
  //   diameter: BarbecueSettings.foodRadius * 2,
  // }, this.scene);

  food.position = startPos;

  // const mat = new BABYLON.StandardMaterial("mat", this.scene);
  // mat.diffuseColor = BABYLON.Color3.Random();
  // food.material = mat;

  this.currentFoods.push({
    mesh: food,
    direction: fromLeft ? "right" : "left",
    speed,
  });

  this.skewLine.push(finalPos);

}
  }
  isAllFoodGone(): boolean {
    return this.currentFoods.length === 0;
  }
  update(dt: number, world: World): void {
    for (const food of this.currentFoods) {
      const dir = food.direction === "left" ? -1 : 1;
      food.mesh.position.x += food.speed * dt * dir;

      if (Math.abs(food.mesh.position.x) > 20) {
        food.mesh.dispose();
      }
    }

    this.currentFoods = this.currentFoods.filter(f => !f.mesh.isDisposed());

    //(world as BarbecueGame).checkAllFoodGone();
  }

  stopMovement() {
    for (const food of this.currentFoods) {
      food.speed = 0;
    }
  }

  getCurrentFoods() {
    return this.currentFoods;
  }

  getSkewLine() {
    return this.skewLine;
  }

  clear() {
    for (const food of this.currentFoods) {
      food.mesh.dispose();
    }
    this.currentFoods = [];
    this.skewLine = [];
  }

  destroy(): void {
    this.clear();
  }
}
