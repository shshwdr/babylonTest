 import { CreateHealthBar } from "./CreateHealthBar";
import { HPComponent } from "./HPComponent";
import { AttachHitBox } from "./AttachHitBox";
export class Player {
    constructor(mesh, scene) {
        this.mesh = mesh;
        this.scene = scene;
        this.progressBar = CreateHealthBar(scene, mesh,"green");
        //this.progressBar = new ProgressBarComponent(scene);
        this.hpComponent = new HPComponent(this, 10, () => {
            console.log("Player died!");
},this.progressBar);

    this.hitbox = AttachHitBox( mesh,BABYLON.Vector3.One(),scene);
        //this.hpComponent = new HPComponent(this, 100); // 初始化血量组件
        //this.attackComponent = new AttackComponent(this, 1); // 初始化攻击组件（每隔1秒发射子弹）

        // const updateManager = UpdateManager.getInstance(); // 获取单例
        // updateManager.register(this);
    }


    // 更新玩家（如果有任何需要更新的内容，例如移动、攻击等）
    update(deltaTime) {
        this.attackComponent.update(deltaTime);
    }

    position() {
        return this.mesh.position;
    }
    // 获取玩家的鼠标位置
    getMousePosition() {
        const pointerX = this.scene.pointerX;
    const pointerY = this.scene.pointerY;

    // 使用 createPickingRay 获取射线
    const pickRay = this.scene.createPickingRay(pointerX, pointerY, BABYLON.Matrix.Identity(), this.scene.activeCamera);

    // 获取射线的方向和原点
    const rayOrigin = pickRay.origin;
    const rayDirection = pickRay.direction;

    // 如果射线与 y = 0 平面相交，计算交点
    // 计算 t (比例因子)
    if (rayDirection.y !== 0) {
        const t = -rayOrigin.y / rayDirection.y;

        // 计算射线与 y = 0 平面的交点
        const intersection = rayOrigin.add(rayDirection.scale(t));

        // 返回交点
        //console.log("Intersection point on the ground:", intersection);
        return intersection;  // 返回交点位置
    } else {
        // 如果射线的方向与 y = 0 平面平行，返回 null
        console.log("No intersection with ground, ray is parallel to y=0 plane.");
        return null;
    }
    }

}