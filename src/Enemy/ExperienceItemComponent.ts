import * as BABYLON from "@babylonjs/core";
import { Component } from "../ComponentSystem";

export class ExperienceItemComponent extends Component {
    private experienceValue: number;

    constructor(owner: BABYLON.TransformNode, experienceValue: number) {
        super(owner); // 设置 owner，即经验块的 TransformNode
        this.experienceValue = experienceValue;
    }

    public getExperienceValue(): number {
        return this.experienceValue;
    }
}
