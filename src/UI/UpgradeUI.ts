import * as GUI from "@babylonjs/gui";
import * as BABYLON from "@babylonjs/core";
import {UpgradeData} from "../utils/CSVLoader"
import { GameManager } from "../GameManager";
import { BulletModifierComponent } from "../Skills/BulletModifierComponent";
import { FrostAuraComponent } from "../Skills/FrostAuraComponent";
import { FireballComponent } from "../Skills/FireballComponent";
import { addComponent, getComponent, removeComponent } from "../ComponentSystem";


export class UpgradeUI {
    private ui: GUI.AdvancedDynamicTexture;

    constructor(scene: BABYLON.Scene, options: UpgradeData[], onChoose: (selected: UpgradeData) => void) {
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UpgradeUI", true, scene);

        const panel = new GUI.StackPanel();
        panel.spacing = 20;
        panel.width = "60%";
        panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.ui.addControl(panel);

        const title = new GUI.TextBlock("title", "Choose an upgrade");
        title.height = "60px";
        title.color = "white";
        title.fontSize = 32;
        panel.addControl(title);

        options.forEach(option => {
            const btn = GUI.Button.CreateSimpleButton(option.id, `${option.name}   ${option.description}`);
            btn.height = "60px";
            btn.color = "white";
            btn.background = "green";
            btn.onPointerUpObservable.add(() => {
                this.ui.dispose();
                onChoose(option); // 返回玩家的选择
var playerNode = GameManager.getInstance().playerNode;
                switch(option.id){
                    case "1": addComponent(playerNode, new FireballComponent(playerNode, GameManager.getInstance().playerComponent, scene, 3.0, 5, 10, 0.5)); break;
    case "2": addComponent(playerNode, new FrostAuraComponent(playerNode, 3.5,0.3,scene)); break;
    case "3": //addComponent(player, new HealOnDamageComponent(player)); break;
    case "4": addComponent(playerNode, new BulletModifierComponent(playerNode)); break;
                }
            });
            panel.addControl(btn);
        });
    }
}
