
import { UpdateManager } from "./UpdateManager.js";
export class CameraFollowComponent {
    constructor(camera, player) {
        this.camera = camera;
        camera.fov = Math.PI / 3;
        this.player = player;
        this.cameraOffset = new BABYLON.Vector3(0, 5, -10); // 相机偏移量
        UpdateManager.getInstance().register(this);
    }

    update(time) {
        // 将相机跟随玩家的位置，保持斜45度视角
        const playerPos = this.player.mesh.position;
        const offset = this.cameraOffset;

        // 设置相机位置
        this.camera.position = new BABYLON.Vector3(
            playerPos.x + offset.x,
            playerPos.y + offset.y,
            playerPos.z + offset.z
        );

        // 相机始终指向玩家
        this.camera.setTarget(playerPos);
    }
    
    destroy() {
        // 从 UpdateManager 中注销自己
        UpdateManager.getInstance().unregister(this);

        console.log("CameraFollowComponent 已销毁");
    }
}
