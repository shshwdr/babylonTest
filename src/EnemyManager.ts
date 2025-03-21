import * as BABYLON from "@babylonjs/core";

export class EnemyManager {
    private static instance: EnemyManager;
    private enemies: Set<BABYLON.TransformNode> = new Set();

    private constructor() {}

    public static getInstance(): EnemyManager {
        if (!EnemyManager.instance) {
            EnemyManager.instance = new EnemyManager();
        }
        return EnemyManager.instance;
    }

    /** 添加一个敌人实例 */
    public addEnemy(enemy: BABYLON.TransformNode): void {
        this.enemies.add(enemy);
    }

    /** 移除一个敌人实例 */
    public removeEnemy(enemy: BABYLON.TransformNode): void {
        this.enemies.delete(enemy);
    }

    /** 获取所有当前存活的敌人 */
    public getAllEnemies(): BABYLON.TransformNode[] {
        return Array.from(this.enemies);
    }

    /** 清空所有敌人 */
    public clear(): void {
        this.enemies.clear();
    }
}