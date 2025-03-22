import * as BABYLON from "@babylonjs/core";
import { Component, ComponentUpdateManager, getComponent } from "../ComponentSystem";
import { PlayerComponent } from "./PlayerComponent";

export class PlayerMovementComponent extends Component {
    private keyState: Record<string, boolean> = { w: false, a: false, s: false, d: false };
    private speed: number;
    private scene: BABYLON.Scene;

    constructor(owner: BABYLON.TransformNode, speed: number, scene: BABYLON.Scene) {
        super(owner);
        this.speed = speed;
        this.scene = scene;

        ComponentUpdateManager.getInstance().register(this);

        this.scene.onKeyboardObservable.add((kbInfo) => {
            if (
                kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN ||
                kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP
            ) {
                this.handleKeyInput(kbInfo);
            }
        });
    }

    private handleKeyInput(kbInfo: BABYLON.KeyboardInfo): void {
        const down = kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN;
        switch (kbInfo.event.key.toLowerCase()) {
            case "w": this.keyState.w = down; break;
            case "s": this.keyState.s = down; break;
            case "a": this.keyState.a = down; break;
            case "d": this.keyState.d = down; break;
        }
    }

    public update(deltaTime: number): void {
        const playerComponent = getComponent(this.owner, PlayerComponent);
        if (!playerComponent) return;

        const movement = BABYLON.Vector3.Zero();
        if (this.keyState.w) movement.z += 1;
        if (this.keyState.s) movement.z -= 1;
        if (this.keyState.a) movement.x -= 1;
        if (this.keyState.d) movement.x += 1;

        if (movement.length() > 0) {
            movement.normalize().scaleInPlace(this.speed * deltaTime);
            this.owner.position.addInPlace(movement);

            const rotation = Math.atan2(-movement.x, -movement.z);
            const targetRotation = BABYLON.Quaternion.RotationYawPitchRoll(rotation, 0, 0);
            this.owner.rotationQuaternion = targetRotation;
        }
    }

    public destroy(): void {
        this.scene.onKeyboardObservable.clear();
        ComponentUpdateManager.getInstance().unregister(this);
        console.log("PlayerMovementComponent destroyed");
    }
}