import * as BABYLON from "@babylonjs/core";
import { Component } from "./ComponentSystem";
import { ProgressBarComponent } from "./ProgressBarComponent";

export class HPComponent extends Component {
    private currentHP: number;

    constructor(
        owner: BABYLON.TransformNode,
        private maxHP: number,
        private onDeath: () => void,
        private progressBar?: ProgressBarComponent
    ) {
        super(owner);
        this.currentHP = maxHP;
        this.updateBar();
    }

    public takeDamage(amount: number): void {
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

    private updateBar(): void {
        this.progressBar?.update(this.currentHP, this.maxHP);
    }
}
