import * as BABYLON from "@babylonjs/core";
import { Component, ComponentUpdateManager } from "./ComponentSystem";
import { AttachHitBox } from "./AttachHitBox";

export class EnemyComponent extends Component {
    public hitbox: BABYLON.Mesh;

    constructor(
        owner: BABYLON.TransformNode,
        private player: BABYLON.TransformNode,
        private speed: number,
        private scene: BABYLON.Scene
    ) {
        super(owner);
        this.hitbox = AttachHitBox(owner, BABYLON.Vector3.One(), scene);
        ComponentUpdateManager.getInstance().register(this);
    }

    public update(deltaTime: number): void {
        const direction = this.calculateDirection();
        const velocity = direction.scale(this.speed * deltaTime);
        this.owner.position.addInPlace(velocity);
    }

    private calculateDirection(): BABYLON.Vector3 {
        const direction = new BABYLON.Vector3(
            this.player.position.x - this.owner.position.x,
            0,
            this.player.position.z - this.owner.position.z
        );
        return direction.normalize();
    }

    public destroy(): void {
        ComponentUpdateManager.getInstance().unregister(this);
    }
}