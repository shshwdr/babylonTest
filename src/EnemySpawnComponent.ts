import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { Player } from "./Player";
import { PlayerMovementComponent } from "./PlayerMovementComponent";
import { UpdateManager } from "./UpdateManager";
import { CameraFollowComponent } from "./CameraFollowComponent";
import { AttackComponent } from "./AttackComponent";
import { EnemyComponent } from "./EnemyComponent";
import { EnemyDamageComponent } from "./EnemyDamageComponent";
import { CreateHealthBar } from "./CreateHealthBar";
import { EnemyManager } from "./EnemyManager";
import { HPComponent } from "./HPComponent";

export class EnemySpawnComponent {
    private lastSpawnTime = 0;

    constructor(
        private scene: BABYLON.Scene,
        private interval: number
    ) {
        UpdateManager.getInstance().register(this);
    }

    public update(deltaTime: number): void {
        this.lastSpawnTime += deltaTime;
        if (this.lastSpawnTime >= this.interval) {
            this.lastSpawnTime = 0;
            this.spawnEnemy();
        }
    }

    private spawnEnemy(): void {
        const distance = 100;
        const randomX = Math.random() * distance - distance / 2;
        const randomZ = Math.random() * distance - distance / 2;

        BABYLON.SceneLoader.ImportMesh("", "./GLB format/", "character-female-b.glb", this.scene, (meshes, particleSystems, skeletons, animationGroups) => {
            const enemyMesh = meshes[0];
            enemyMesh.position = new BABYLON.Vector3(randomX, 0, randomZ);
            enemyMesh.computeWorldMatrix(true);

            // @ts-ignore
            enemyMesh.enemyComponent = new EnemyComponent(enemyMesh, (this.scene as any).player.mesh, 4, this.scene);
            // @ts-ignore
            enemyMesh.enemyDamageComponent = new EnemyDamageComponent(enemyMesh, enemyMesh.enemyComponent, (this.scene as any).player, this.scene, 1);

            const healthBar = CreateHealthBar(this.scene, enemyMesh, "red");

            // @ts-ignore
            enemyMesh.hpComponent = new HPComponent(enemyMesh, 10, () => {
                console.log("Enemy died!");
                this.destroyEnemy(enemyMesh);
            }, healthBar);

            EnemyManager.getInstance().addEnemy(enemyMesh);
        });
    }

    private destroyEnemy(enemyMesh: BABYLON.TransformNode): void {
        enemyMesh.dispose();
       ( enemyMesh as any).hpComponent.progressBar.background.dispose();
        //( enemyMesh as any).enemyComponent.hitbox.dispose()
        //this.
        ( enemyMesh as any).enemyDamageComponent.destroy()
        EnemyManager.getInstance().removeEnemy(enemyMesh);

    }
}