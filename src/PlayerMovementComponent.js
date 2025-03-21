import * as BABYLON from "@babylonjs/core";

import { UpdateManager } from "./UpdateManager.js";
export class PlayerMovementComponent {
    constructor(player, speed, scene) {
        this.player = player;
        this.speed = speed; // 玩家移动的速度
        this.scene = scene;

        UpdateManager.getInstance().register(this);
        // 初始化玩家的移动向量
        this.movement = BABYLON.Vector3.Zero();

        // 用于存储每个键的状态
        this.keyState = {
            w: false,
            s: false,
            a: false,
            d: false
        };

        // 在构造函数中注册键盘事件监听器
        this.scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN || kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
                this.handleKeyInput(kbInfo); // 处理按键输入
            }
        });
    }

    // 处理按键输入的函数
    handleKeyInput(kbInfo) {
        if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
            if (kbInfo.event.key === "w") {
                this.keyState.w = true; // 按下 W 键，更新状态
            }
            if (kbInfo.event.key === "s") {
                this.keyState.s = true; // 按下 S 键，更新状态
            }
            if (kbInfo.event.key === "a") {
                this.keyState.a = true; // 按下 A 键，更新状态
            }
            if (kbInfo.event.key === "d") {
                this.keyState.d = true; // 按下 D 键，更新状态
            }
        }

        if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
            if (kbInfo.event.key === "w") {
                this.keyState.w = false; // 松开 W 键，停止移动
            }
            if (kbInfo.event.key === "s") {
                this.keyState.s = false; // 松开 S 键，停止移动
            }
            if (kbInfo.event.key === "a") {
                this.keyState.a = false; // 松开 A 键，停止移动
            }
            if (kbInfo.event.key === "d") {
                this.keyState.d = false; // 松开 D 键，停止移动
            }
        }
    }

    // 更新玩家位置
    update(deltaTime) {
        // 根据键盘状态更新方向向量
        const movement = BABYLON.Vector3.Zero();
        
        if (this.keyState.w) {
            movement.z += 1; // 按下 W 键，向前移动
        }
        if (this.keyState.s) {
            movement.z -= 1; // 按下 S 键，向后移动
        }
        if (this.keyState.a) {
            movement.x -= 1; // 按下 A 键，向左移动
        }
        if (this.keyState.d) {
            movement.x += 1; // 按下 D 键，向右移动
        }

        if (movement.length() > 0) {
            // 归一化方向向量并乘以速度
            movement.normalize();
            movement.scaleInPlace(this.speed * deltaTime);
            this.player.mesh.position.addInPlace(movement); // 更新玩家位置

            const rotation = Math.atan2(-movement.x,-movement.z); // 计算朝向的角度
const targetRotation = BABYLON.Quaternion.RotationYawPitchRoll(rotation, 0, 0); // 转换为 Quaternion
this.player.mesh.rotationQuaternion = targetRotation; // 更新旋转d
        }
    }
    destroy() {
        // 移除键盘事件监听器
        this.scene.onKeyboardObservable.clear();  // 清除所有事件监听器

        // 从 UpdateManager 中注销自己
        UpdateManager.getInstance().unregister(this);

        console.log("PlayerMovementComponent 已销毁");
    }
}
