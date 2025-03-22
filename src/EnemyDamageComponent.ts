import * as BABYLON from "@babylonjs/core";
import { Component, ComponentUpdateManager } from "./ComponentSystem";
import { PlayerComponent } from "./Player/PlayerComponent";
import { EnemyComponent } from "./EnemyComponent";
import { getComponent } from "./ComponentSystem";

export class EnemyDamageComponent extends Component {
    private elapsed: number = 1;
    private aliveFrames: number = 0;

    constructor(
        owner: BABYLON.TransformNode,
        private player: PlayerComponent,
        private scene: BABYLON.Scene,
        private damage: number,
        private interval: number = 1.0
    ) {
        super(owner);
        ComponentUpdateManager.getInstance().register(this);
    }

    public update(deltaTime: number): void {
        if (this.aliveFrames > 0) {
            this.elapsed += deltaTime;

            var enemyComponent = getComponent<EnemyComponent>(this.owner,EnemyComponent)

            //const enemyComponent = this.owner as any as { hitbox?: BABYLON.AbstractMesh };
            if (enemyComponent.hitbox?.intersectsMesh(this.player.hitbox, false)) {
                if (this.elapsed >= this.interval) {
                    this.player.hpComponent?.takeDamage(this.damage);
                    this.elapsed = 0;
                }
            }
        } else {
            this.aliveFrames++;
        }
    }

    public destroy(): void {
        ComponentUpdateManager.getInstance().unregister(this);
    }
}