import { Component } from "../ComponentSystem";
import * as BABYLON from "@babylonjs/core";
import { ProgressBarComponent } from "../ProgressBarComponent";
import { GameLifecycleManager } from "../GameLifecycleManager";
import { UpgradeUI } from "../UI/UpgradeUI";

export class PlayerExperienceComponent extends Component {
    private currentExperience: number = 0;
    private maxExperience: number = 10;  // 假设升到100时升级
    private progressBar: ProgressBarComponent;
    private level: number = 1;

    constructor(owner: BABYLON.TransformNode, progressBar: ProgressBarComponent) {
        super(owner);
        this.progressBar = progressBar;
    }

    public addExperience(amount: number): void {
        this.currentExperience += amount;
        if (this.currentExperience >= this.maxExperience) {
            this.levelUp();
        }
        this.updateProgressBar();
    }

    private levelUp(): void {
        // 升级处理
        this.level++;
        this.currentExperience = 0;  // 重置经验
        this.maxExperience = this.maxExperience * 1.5;  // 假设每次升级需要更多经验
        console.log(`Player leveled up to level ${this.level}!`);

        // 弹出升级UI
        new UpgradeUI(this.owner.getScene(), () => {
            GameLifecycleManager.getInstance().resume();
        });

        // 暂停游戏
        GameLifecycleManager.getInstance().pause();
    }

    private updateProgressBar(): void {
        this.progressBar.update(this.currentExperience, this.maxExperience);
    }
}
