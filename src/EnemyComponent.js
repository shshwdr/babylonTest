
import { UpdateManager } from "./UpdateManager.js";

import { AttachHitBox } from "./AttachHitBox";
import { CreateHealthBar } from "./CreateHealthBar";
export class EnemyComponent {
    constructor(enemy, player, speed, scene) {
        this.enemy = enemy;  // 敌人节点
        this.player = player;  // 玩家对象
        this.speed = speed;  // 敌人的移动速度
        this.scene = scene;  // 场景

        // 每一帧更新时会调用 update() 方法
        UpdateManager.getInstance().register(this);
        
        this.hitbox =  AttachHitBox( enemy,BABYLON.Vector3.One(),scene);
    }

    // 更新敌人的位置
    update(deltaTime) {
        // 计算敌人到玩家的方向
        const direction = this.calculateDirection();

        // 让敌人朝玩家的方向移动
        const velocity = direction.scale(this.speed * deltaTime);
        this.enemy.position.addInPlace(velocity);  // 更新敌人位置
    }

    // 计算从敌人到玩家的方向向量
    calculateDirection() {
        const direction = new BABYLON.Vector3(
            this.player.position.x - this.enemy.position.x,  // 计算 x 方向
            0,  // 保持 y 不变，敌人仅在水平面移动
            this.player.position.z - this.enemy.position.z   // 计算 z 方向
        );

        // 归一化方向向量，确保其长度为 1
        return direction.normalize();
    }

    // 销毁时从 UpdateManager 中注销自己
    destroy() {
        UpdateManager.getInstance().unregister(this);
    }
}
