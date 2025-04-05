import * as BABYLON from "@babylonjs/core";
import { GameSettings } from "./GameSettings";
import { FruitManager } from "./FruitManager";
import { Component } from "./ComponentSystem";

export class FruitScript extends Component {
  public fruitName: string;
  private body: BABYLON.PhysicsBody | null = null;
  public sphere: BABYLON.Mesh | null = null;
  public isMerged:boolean = false;
  

  constructor(owner: BABYLON.TransformNode, fruitName: string) {
    super(owner);
    this.fruitName = fruitName;

    this.setupVisualAndPhysics(); // 相当于原 start()
  }

  private setupVisualAndPhysics(): void {
    const scene = this.owner.getScene();
    const info = GameSettings.getFruitInfo(this.fruitName);

    const sphere = BABYLON.MeshBuilder.CreateSphere("fruit", { diameter: info.radius * 2 }, scene);
    sphere.position = this.owner.position.clone();
    //sphere.parent = this.owner;
    this.sphere = sphere

    const mat = new BABYLON.StandardMaterial("mat", scene);
    //mat.diffuseTexture = new BABYLON.Texture(`/textures/${this.fruitName}.png`, scene);
    mat.diffuseTexture = new BABYLON.Texture(`/textures/cherry.png`, scene);
    sphere.material = mat;

    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
        sphere,
        BABYLON.PhysicsImpostor.SphereImpostor,
        {
          mass: 0,
          restitution: 0.2,      // 弹性小点
          friction: 1,           // 增加摩擦
         // angularDamping: 0.4,   // 限制旋转惯性
         // linearDamping: 0.2,    // 限制水平滑动
        },
        scene
      );
    // 当物体开始掉落前
sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));

// 限制刚体只能左右滚 + 下落（无 Z 轴变化）
sphere.physicsImpostor.registerBeforePhysicsStep(() => {
  const vel = sphere.physicsImpostor!.getLinearVelocity();
  sphere.physicsImpostor!.setLinearVelocity(new BABYLON.Vector3(vel!.x, vel!.y, 0));
});
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
    if (other.fruitName === this.fruitName) {
      const next = GameSettings.nextFruit(this.fruitName);
      if (next) {
        this.isMerged = true;
        other.isMerged = true;
        this.destroy();
        other.destroy();

        
        const mergePos = BABYLON.Vector3.Center(this.owner.position, other.owner.position);
        FruitManager.spawnFruitMerge(next.name, mergePos);

        FruitManager.addScore(next.score);
      }
    }
  }

  destroy(): void {
    this.sphere?.dispose();
    this.body?.dispose();
    this.owner.dispose();
  }
  public getMesh(): BABYLON.Mesh {
    return this.sphere!;
  }
}
