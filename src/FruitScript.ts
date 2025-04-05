import * as BABYLON from "@babylonjs/core";
import { GameSettings } from "./GameSettings";
import { FruitManager } from "./FruitManager";
import { Component } from "./ComponentSystem";

export class FruitScript extends Component {
  public fruitName: string;
  private body: BABYLON.PhysicsBody | null = null;
  public sphere: BABYLON.Mesh | null = null;
  public isMerged:boolean = false;
  public spritePlane: BABYLON.Mesh | null = null;

  constructor(owner: BABYLON.TransformNode, fruitName: string) {
    super(owner);
    this.fruitName = fruitName;

    this.setupVisualAndPhysics(); // 相当于原 start()
  }

  private setupVisualAndPhysics(): void {
    const scene = this.owner.getScene();
    const info = GameSettings.getFruitInfo(this.fruitName);
  
    // ✅ 1. 创建用于物理碰撞的隐藏球体
    const sphere = BABYLON.MeshBuilder.CreateSphere("fruitCollider", {
      diameter: info.radius * 2
    }, scene);
    sphere.isVisible = false; // 不显示
    this.sphere = sphere;
    
    sphere.position = this.owner.position.clone();
  
    // ✅ 2. 创建用于渲染的 2D 平面
    const plane = BABYLON.MeshBuilder.CreatePlane("fruitSprite", {
      size: info.radius * 2
    }, scene);
    plane.position = this.owner.position.clone();
    plane.rotationQuaternion = BABYLON.Quaternion.Identity(); // ✅ 显式初始化
plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_NONE;
    this.spritePlane = plane;
  
    const mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseTexture = new BABYLON.Texture(`/textures/${info.name}.png`, scene);
    mat.diffuseTexture.hasAlpha = true;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    mat.backFaceCulling = false;
    plane.material = mat;
  
    // ✅ 3. 创建物理体
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
      sphere,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {
        mass: 0,
        restitution: 0.2,
        friction: 0.1
      },
      scene
    );
  
    // ✅ 4. 禁止 Z 方向移动
    sphere.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
    sphere.physicsImpostor.registerBeforePhysicsStep(() => {
      const vel = sphere.physicsImpostor!.getLinearVelocity();
      sphere.physicsImpostor!.setLinearVelocity(new BABYLON.Vector3(vel!.x, vel!.y, 0));
    });
  }

  update(): void {
    if (!this.sphere || !this.spritePlane) return;
  
    // 同步位置
    this.spritePlane.position.copyFrom(this.sphere.position);
  
    // 同步旋转
    if (this.sphere.rotationQuaternion && this.spritePlane.rotationQuaternion) {
      this.spritePlane.rotationQuaternion.copyFrom(this.sphere.rotationQuaternion);
    }
  }
  
  public startFalling(): void {
    if (!this.sphere?.physicsImpostor) return;
  
    // 设置质量，使其可以自由掉落
    this.sphere.physicsImpostor.setMass(1);
    // 重置速度
    this.sphere.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
    // 重置角速度
    this.sphere.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
  }
  
  public onCollision(other: FruitScript): void {
    if (this.isMerged || other.isMerged) return;
    if (other.fruitName !== this.fruitName) return;
  
    const next = GameSettings.nextFruit(this.fruitName);
    if (!next) return;
  
    this.isMerged = true;
    other.isMerged = true;
  
    // 1. 计算两个球之间的中点
    const collisionPoint = BABYLON.Vector3.Lerp(
      this.sphere!.position,
      other.sphere!.position,
      0.5
    );
  
    // 2. 向上偏移（避免立刻压住）
    const newRadius = GameSettings.getFruitInfo(next.name).radius;
    collisionPoint.y += newRadius;
  
    // 3. 向场景中心稍微偏移（避免贴边撞墙）
    const centerOffsetDir = new BABYLON.Vector3(0, 0, 0).subtract(collisionPoint).normalize();
    const inwardOffset = 0.3; // ← 可调数值，越大越靠中心
    collisionPoint.addInPlace(centerOffsetDir.scale(inwardOffset));
  
    // 4. 销毁原来的
    this.destroy();
    other.destroy();
  
    // 5. 生成新水果
    const newFruit = FruitManager.spawnFruitMerge(next.name, collisionPoint);
    if (newFruit.sphere?.physicsImpostor) {
      newFruit.sphere.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
      newFruit.sphere.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
    }
  
    // 6. 加分
    FruitManager.addScore(next.score);
  }
  

  destroy(): void {
    this.sphere?.dispose();
    this.body?.dispose();
    this.spritePlane?.dispose();
this.owner.dispose();
  }
  public getMesh(): BABYLON.Mesh {
        return this.sphere!;
    
       }
}