import * as BABYLON from "@babylonjs/core";
import { Component } from "../ComponentSystem";
import { ComponentUpdateManager, getComponent } from "../ComponentSystem";
import { BulletComponent } from "../BulletComponent";
import { PlayerComponent } from "../Player/PlayerComponent";

export class AttackComponent extends Component {
    private interval: number;
    private lastAttackTime: number = 0;

    constructor(owner: BABYLON.TransformNode, interval: number) {
        super(owner);
        this.interval = interval;
        ComponentUpdateManager.getInstance().register(this);
    }

    public update(deltaTime: number): void {
        this.lastAttackTime += deltaTime;
        if (this.lastAttackTime >= this.interval) {
            this.lastAttackTime = 0;
            this.attack();
        }
    }

    private attack(): void {
        const player = getComponent<PlayerComponent>(this.owner, PlayerComponent);
        if (!player) return;

        const mousePos = player.getMousePosition();
        const direction = this.calculateDirection(mousePos);

        const bulletNode = new BABYLON.TransformNode("bulletNode", this.owner.getScene());
        
         var worldPos =this.owner.getAbsolutePosition();
        bulletNode.position = worldPos.add(new BABYLON.Vector3(0, 0.5, 0));

        //bulletNode.position = this.owner.position.clone().add(new BABYLON.Vector3(0, 0.5, 0));
        new BulletComponent(bulletNode, direction, 10, this.owner, this.owner.getScene());
    }

    private calculateDirection(mousePos: BABYLON.Vector3): BABYLON.Vector3 {
        const direction = new BABYLON.Vector3(
            mousePos.x - this.owner.position.x,
            0,
            mousePos.z - this.owner.position.z
        );
        return direction.normalize();
    }

    public destroy(): void {
        ComponentUpdateManager.getInstance().unregister(this);
    }
}