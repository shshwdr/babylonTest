// --- 1. EnemyDamageComponent ---
import * as BABYLON from "@babylonjs/core";
import { UpdateManager } from "./UpdateManager";
import { Player } from "./Player";
import { EnemyComponent } from "./EnemyComponent";

export class EnemyDamageComponent {
    constructor(
        private enemyMesh: BABYLON.Mesh,
        private enemyComponent:EnemyComponent,
        private player: Player,
        private scene: BABYLON.Scene,
        private damage: number,
        private interval: number = 1.0
    ) {
        this.elapsed = 1;
        this.aliveFrames = 0;
        UpdateManager.getInstance().register(this);
    }

    private aliveFrames: number;

    private elapsed: number;

    update(deltaTime: number) {
        if (this.aliveFrames > 0) {
            this.elapsed += deltaTime;
            if (this.enemyComponent.hitbox.intersectsMesh(this.player.hitbox, false)) {
                if (this.elapsed >= this.interval) {
                    this.player.hpComponent?.takeDamage(this.damage);
                    this.elapsed = 0;
                }
            }
        } else {
            this.aliveFrames++;
        }
        // if (this.enemyMesh.intersectsMesh(this.player.mesh, false)) {
        // }
    }

    destroy() {
        UpdateManager.getInstance().unregister(this);
    }
}