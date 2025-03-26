import * as BABYLON from "@babylonjs/core";
import { Component } from "./ComponentSystem";
import { ComponentUpdateManager, getComponent } from "./ComponentSystem";
import { EnemyManager } from "./EnemyManager";
import { AttachHitBox } from "./General/Function/AttachHitBox";
import { EnemyComponent } from "./Enemy/EnemyComponent";
import { HPComponent } from "./HPComponent";

export class BulletComponent extends Component {
    private direction: BABYLON.Vector3;
    private speed: number;
    private attacker: BABYLON.TransformNode;
    private scene: BABYLON.Scene;
    private timeAlive: number = 0;
    private maxLifeTime: number = 10;
    private velocity!: BABYLON.Vector3;
    private hitbox!: BABYLON.Mesh;
    private attack: number;

    constructor(
        owner: BABYLON.TransformNode,
        direction: BABYLON.Vector3,
        speed: number,
        attack: number,
        attacker: BABYLON.TransformNode,
        scene: BABYLON.Scene
    ) {
        super(owner);
        this.direction = direction;
        this.speed = speed;
        this.attacker = attacker;
        this.attack = attack;
        this.scene = scene;

        ComponentUpdateManager.getInstance().register(this);
        this.loadMesh();
    }

    private loadMesh(): void {
        const ball = BABYLON.Mesh.CreateSphere("sphere", 12, 0.22, this.scene);
        this.owner.addChild(ball);
        ball.position = BABYLON.Vector3.Zero()
        this.velocity = this.direction.scale(this.speed);
        this.hitbox = AttachHitBox(ball, BABYLON.Vector3.One(), this.scene);
    }

    public update(deltaTime: number): void {
        this.owner.position.addInPlace(this.direction.scale(this.speed * deltaTime));
        this.checkCollision();
        this.timeAlive += deltaTime;

        if (this.timeAlive >= this.maxLifeTime) {
            this.destroy();
        }
    }

    private checkCollision(): void {
        EnemyManager.getInstance().getAllEnemies().forEach((enemy) => {

            var enemyComponent = getComponent<EnemyComponent>(enemy, EnemyComponent)
var hpComponent = getComponent<HPComponent>(enemy, HPComponent)
            const bounding = enemyComponent?.hitbox;
           // const hpComponent = enemyComponent.hpComponent;
            if (bounding && this.hitbox.intersectsMesh(bounding, false)) {
                hpComponent?.takeDamage?.(this.attack);
                this.destroy();
            }
        });
    }

    public destroy(): void {
        this.owner.dispose();
        ComponentUpdateManager.getInstance().unregister(this);
    }
}
