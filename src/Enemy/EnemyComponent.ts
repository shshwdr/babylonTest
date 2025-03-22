import * as BABYLON from "@babylonjs/core";
import { Component, ComponentUpdateManager, getComponent,addComponent} from "../ComponentSystem";
import { AttachHitBox } from "../General/Function/AttachHitBox";
import { ExperienceItemComponent } from "./ExperienceItemComponent";
import { PlayerExperienceComponent} from "../Player/PlayerExperienceComponent";
import { ExperienceCollectorComponent } from  "../OtherBattleObject/ExperienceCollectorComponent";


export class EnemyComponent extends Component {
    public hitbox: BABYLON.Mesh;

    constructor(
        owner: BABYLON.TransformNode,
        private player: BABYLON.TransformNode,
        private speed: number,
        private scene: BABYLON.Scene,
        private experienceValue: number
    ) {
        super(owner);
        this.hitbox = AttachHitBox(owner, BABYLON.Vector3.One(), scene);
        ComponentUpdateManager.getInstance().register(this);
    }

    public update(deltaTime: number): void {
        const direction = this.calculateDirection();
        const velocity = direction.scale(this.speed * deltaTime);
        this.owner.position.addInPlace(velocity);
    }

    private calculateDirection(): BABYLON.Vector3 {
        const direction = new BABYLON.Vector3(
            this.player.position.x - this.owner.position.x,
            0,
            this.player.position.z - this.owner.position.z
        );
        return direction.normalize();
    }

    public destroy(): void {
        ComponentUpdateManager.getInstance().unregister(this);
        
    }

    public die(): void {
        const expMesh = BABYLON.MeshBuilder.CreateBox("expItem", { size: 0.1 }, this.scene);
    expMesh.position = this.owner.position.clone();
    expMesh.position.y = 0.5;

    // 添加 ExperienceItemComponent
    const itemComp = addComponent(expMesh, new ExperienceItemComponent(expMesh, this.experienceValue));

    // 查找玩家经验组件
    const xpComponent = getComponent<PlayerExperienceComponent>(this.player, PlayerExperienceComponent);
    if (xpComponent) {
        // 添加自动收集逻辑
        addComponent(expMesh, new ExperienceCollectorComponent(expMesh, this.player, itemComp, xpComponent));
    }
    }

    
}