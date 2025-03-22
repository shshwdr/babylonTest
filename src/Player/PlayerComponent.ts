import * as BABYLON from "@babylonjs/core";
import { Component } from "../ComponentSystem";
import { CreateHealthBar } from "../CreateHealthBar";
import { HPComponent } from "../HPComponent";
import { AttachHitBox } from "../AttachHitBox";
import { addComponent } from "../ComponentSystem";
import { ComponentUpdateManager } from "../ComponentSystem";
import { GameOverUI } from "../UI/GameOverUI";
import { reloadScene } from "../main";
import { GameLifecycleManager } from "../GameLifecycleManager";

export class PlayerComponent extends Component {
    public hpComponent: HPComponent;
    public hitbox: BABYLON.Mesh;
    public progressBar: any; // You can replace this with a proper ProgressBarComponent type

    constructor(owner: BABYLON.TransformNode, private scene: BABYLON.Scene) {
        super(owner);

        this.progressBar = CreateHealthBar(scene, owner, "green");

        this.hpComponent = addComponent(owner, new HPComponent(owner, 10, () => {
            console.log("Player died!");
            ComponentUpdateManager.getInstance().pause(); // 停止更新
            new GameOverUI(scene, () =>  GameLifecycleManager.getInstance().restartGame());
        }, this.progressBar));
        

        this.hitbox = AttachHitBox(owner, BABYLON.Vector3.One(), scene);
    }

    public getMousePosition(): BABYLON.Vector3 | null {
        const pointerX = this.scene.pointerX;
        const pointerY = this.scene.pointerY;

        const pickRay = this.scene.createPickingRay(pointerX, pointerY, BABYLON.Matrix.Identity(), this.scene.activeCamera);

        const rayOrigin = pickRay.origin;
        const rayDirection = pickRay.direction;

        if (rayDirection.y !== 0) {
            const t = -rayOrigin.y / rayDirection.y;
            const intersection = rayOrigin.add(rayDirection.scale(t));
            return intersection;
        } else {
            console.log("No intersection with ground, ray is parallel to y=0 plane.");
            return null;
        }
    }

    public position(): BABYLON.Vector3 {
        return this.owner.position;
    }
}
