import { Component } from "../ComponentSystem";
import * as BABYLON from "@babylonjs/core";
import { ProgressBarComponent } from "../ProgressBarComponent";
import { GameLifecycleManager } from "../GameLifecycleManager";
import { UpgradeUI } from "../UI/UpgradeUI";
import {loadUpgradesFromCSV, UpgradeData} from "../utils/CSVLoader"

export class PlayerExperienceComponent extends Component {
    private currentExperience: number = 0;
    private maxExperience: number = 10;  // 假设升到100时升级
    private progressBar: ProgressBarComponent;
    private level: number = 1;

    constructor(owner: BABYLON.TransformNode, progressBar: ProgressBarComponent) {
        super(owner);
        this.progressBar = progressBar;

       // this.levelUp();
    }

    public addExperience(amount: number): void {
        this.currentExperience += amount;
        this.updateProgressBar();
        if (this.currentExperience >= this.maxExperience) {
            this.levelUp();
        }
    }
    getRandomElements<T>(array: T[], count: number): T[] {
        const copy = [...array];
        const result: T[] = [];
        for (let i = 0; i < count && copy.length > 0; i++) {
            const index = Math.floor(Math.random() * copy.length);
            result.push(copy.splice(index, 1)[0]);
        }
        return result;
    }
    private async levelUp(): Promise<void> {
        // 升级处理
        this.level++;
        this.currentExperience = 0;  // 重置经验
        this.maxExperience = this.maxExperience * 1.5;  // 假设每次升级需要更多经验
        console.log(`Player leveled up to level ${this.level}!`);
        const upgrades =  await loadUpgradesFromCSV("assets/upgrades.csv");
        const choices =this. getRandomElements<UpgradeData>(upgrades, 2);
        // 弹出升级UI
        new UpgradeUI(this.owner.getScene(), choices, (selected) => {
            console.log("Player chose upgrade:", selected);
            GameLifecycleManager.getInstance().resume(); // 恢复游戏
            this.updateProgressBar();
        });

        // 暂停游戏
        GameLifecycleManager.getInstance().pause();
    }

    private updateProgressBar(): void {
        this.progressBar.update(this.currentExperience, this.maxExperience);
    }
}
