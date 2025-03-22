import * as BABYLON from "@babylonjs/core";
import { Component, ComponentUpdateManager } from "./ComponentSystem";

export class CameraFollowComponent extends Component {
    private cameraOffset: BABYLON.Vector3 = new BABYLON.Vector3(0, 5, -10);

    constructor(
        owner: BABYLON.TransformNode,
        private camera: BABYLON.Camera,
        private playerMesh: BABYLON.TransformNode
    ) {
        super(owner);
        this.camera.fov = Math.PI / 3;
        ComponentUpdateManager.getInstance().register(this);
    }

    public update(deltaTime: number): void {
        const playerPos = this.playerMesh.position;
        const offset = this.cameraOffset;

        this.camera.position = new BABYLON.Vector3(
            playerPos.x + offset.x,
            playerPos.y + offset.y,
            playerPos.z + offset.z
        );

        this.camera.setTarget(playerPos);
    }

    public destroy(): void {
        ComponentUpdateManager.getInstance().unregister(this);
        console.log("CameraFollowComponent destroyed");
    }
}