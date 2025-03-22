import { Component, ComponentUpdateManager } from "../ComponentSystem";
import { PlayerExperienceComponent } from "../Player/PlayerExperienceComponent";
import { ExperienceItemComponent } from "../Enemy/ExperienceItemComponent";
import * as BABYLON from "@babylonjs/core";

export class ExperienceCollectorComponent extends Component {
    private player: BABYLON.TransformNode;
    private playerExperienceComponent: PlayerExperienceComponent;
    private experienceItem: ExperienceItemComponent;

    constructor(
        owner: BABYLON.TransformNode, // 经验球的 TransformNode
        player: BABYLON.TransformNode,
        experienceItem: ExperienceItemComponent,
        playerExperienceComponent: PlayerExperienceComponent
    ) {
        super(owner); // 👈 关键：传给父类以设置 this.owner
        this.player = player;
        this.experienceItem = experienceItem;
        this.playerExperienceComponent = playerExperienceComponent;

        ComponentUpdateManager.getInstance().register(this); // ✅ 现在合法了
    }

    public update(deltaTime: number): void {
        const distance = BABYLON.Vector3.Distance(this.player.position, this.owner.position);

        if (distance < 2) {
            this.playerExperienceComponent.addExperience(this.experienceItem.getExperienceValue());
            this.owner.dispose(); // 销毁经验块
            ComponentUpdateManager.getInstance().unregister(this);
        }
    }

    public destroy(): void {
        ComponentUpdateManager.getInstance().unregister(this);
    }
}
