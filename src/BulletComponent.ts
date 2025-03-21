import * as BABYLON from "@babylonjs/core";
import { EnemyManager } from "./EnemyManager";
import { UpdateManager } from "./UpdateManager";
import { AttachHitBox } from "./AttachHitBox";

export class BulletComponent {
    private direction: BABYLON.Vector3;
    private speed: number;
    private attacker: BABYLON.TransformNode;
    private scene: BABYLON.Scene;
    private bullet: BABYLON.TransformNode;
    private timeAlive: number = 0;
    private maxLifeTime: number = 10;
    private velocity!: BABYLON.Vector3;
    private hitbox!: BABYLON.Mesh;

    constructor(
        bullet: BABYLON.TransformNode,
        direction: BABYLON.Vector3,
        speed: number,
        attacker: BABYLON.TransformNode,
        scene: BABYLON.Scene
    ) {
        this.bullet = bullet;
        this.direction = direction;
        this.speed = speed;
        this.attacker = attacker;
        this.scene = scene;

        UpdateManager.getInstance().register(this);
        this.loadMesh();
    }

    private loadMesh(): void {
        const ball = BABYLON.Mesh.CreateSphere("sphere", 12, 0.22, this.scene);
        this.bullet.addChild(ball);
        this.velocity = this.direction.scale(this.speed);
        this.hitbox = AttachHitBox(ball, BABYLON.Vector3.One(), this.scene);
    }

    public update(deltaTime: number): void {
        this.bullet.position.addInPlace(this.direction.scale(this.speed * deltaTime));
        this.checkCollision();
        this.timeAlive += deltaTime;

        if (this.timeAlive >= this.maxLifeTime) {
            this.destroy();
        }
    }

    private checkCollision(): void {
        EnemyManager.getInstance().getAllEnemies().forEach((enemy) => {
            const bounding = (enemy as any).enemyComponent.hitbox;
            const hpComponent = (enemy as any).hpComponent;
            if (bounding && this.hitbox.intersectsMesh(bounding, false)) {
                hpComponent?.takeDamage?.(5);
                this.destroy();
            }
        });
    }

    public destroy(): void {
        if (this.bullet) {
            this.bullet.dispose();
            UpdateManager.getInstance().unregister(this);
        }
    }
}