import * as BABYLON from "@babylonjs/core";
import { Component, ComponentUpdateManager, getComponent } from "../ComponentSystem";
import { EnemyComponent } from "../Enemy/EnemyComponent";
import { EnemyManager } from "../EnemyManager";

export class FrostAuraComponent extends Component {
    private radius: number;
    private slowFactor: number;
    private visualMesh?: BABYLON.Mesh;
    private scene: BABYLON.Scene;

    constructor(owner: BABYLON.TransformNode, radius: number, slowFactor: number, scene: BABYLON.Scene) {
        super(owner);
        this.radius = radius;
        this.slowFactor = slowFactor;
        this.scene = scene;

       // this.createVisualRing(); // 或 createParticleEffect()
        this.createParticleEffect();

        ComponentUpdateManager.getInstance().register(this);
    }

    public update(deltaTime: number): void {
        const enemies = EnemyManager.getInstance().getAllEnemies();

        for (const enemy of enemies) {
            const enemyComponent = getComponent(enemy, EnemyComponent);
            if (!enemyComponent) continue;

            const distance = BABYLON.Vector3.Distance(this.owner.position, enemy.position);
            if (distance <= this.radius) {
                enemyComponent.setSpeedModifier?.(this.slowFactor);
            } else {
                enemyComponent.setSpeedModifier?.(1.0); // 恢复正常速度
            }
        }

        // 让环跟随 player
        this.visualMesh?.position.copyFrom(this.owner.position);
    }

    public destroy(): void {
        this.visualMesh?.dispose();
        ComponentUpdateManager.getInstance().unregister(this);
    }

    // ✅ 环可视化效果（基础模型）
    private createVisualRing(): void {
        const torus = BABYLON.MeshBuilder.CreateTorus("frostRing", {
            diameter: this.radius * 2,
            thickness: 0.1,
            tessellation: 32
        }, this.scene);

        torus.rotation.x = Math.PI / 2;
        torus.position.copyFrom(this.owner.position);
        torus.parent = this.owner; // 必须在 rotation 之后设置
        this.visualMesh = torus;
        
        torus.parent = this.owner;
        torus.isPickable = false;

        const mat = new BABYLON.StandardMaterial("frostMat", this.scene);
        mat.diffuseColor = new BABYLON.Color3(0.5, 0.8, 1);
        mat.alpha = 0.4;
        torus.material = mat;

        this.visualMesh = torus;
    }

    // ✅ 替代：粒子系统效果
    private createParticleEffect(): void {
        const ps = new BABYLON.ParticleSystem("frostParticles", 100, this.scene);
        ps.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
ps.emitter = this.owner;
ps.minEmitBox = new BABYLON.Vector3(-this.radius, 0, -this.radius);
ps.maxEmitBox = new BABYLON.Vector3(this.radius, 0, this.radius);
ps.color1 = new BABYLON.Color4(0.6, 0.8, 1.0, 0.6);
ps.color2 = new BABYLON.Color4(0.0, 0.5, 1.0, 0.8);
ps.minSize = 0.2;
ps.maxSize = 0.4;
ps.minLifeTime = 0.5;
ps.maxLifeTime = 1.5;
ps.emitRate = 35;
// ps.createSphereEmitter(this.radius)
// ps.minEmitPower = 0.5;
// ps.maxEmitPower = 1.0;
// ps.direction1 = new BABYLON.Vector3(0, 1, 0);
// ps.direction2 = new BABYLON.Vector3(0, 1, 0);
ps.direction1 = new BABYLON.Vector3(0, 1, 0);
ps.direction2 = new BABYLON.Vector3(0, 1, 0);
ps.gravity = new BABYLON.Vector3(0, -0.5, 0);
ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
ps.particleTexture.hasAlpha = true;
ps.start();
        // 你可以存下来在 destroy() 时 particleSystem.dispose()
    }
}
