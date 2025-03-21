 import { UpdateManager } from "./UpdateManager";
    import { ProgressBarComponent } from "./ProgressBarComponent";
    import * as BABYLON from "@babylonjs/core";

// --- 3. HPComponent ---
export class HPComponent {
    constructor(
        private owner: BABYLON.Mesh,
        private maxHP: number,
        private onDeath: () => void,
        private progressBar?: ProgressBarComponent
    ) {
        this.currentHP = maxHP;
        this.updateBar();
    }

    private currentHP: number;

    takeDamage(amount: number) {

        console.log("HPComponent: takeDamage", amount);
        this.currentHP -= amount;
        if (this.currentHP <= 0) {
            this.currentHP = 0;
            console.log("HPComponent: dead");
            this.updateBar();
            this.onDeath();
        } else {
            this.updateBar();
        }
    }

    private updateBar() {
        this.progressBar?.update(this.currentHP, this.maxHP);
    }
}