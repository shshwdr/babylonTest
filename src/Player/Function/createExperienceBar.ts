
import { ProgressBarComponent } from "../../ProgressBarComponent"
import * as GUI from "@babylonjs/gui";
import * as BABYLON from "@babylonjs/core";
// 创建一个经验条 UI（放在屏幕上方）
export function createExperienceBar(scene: BABYLON.Scene): ProgressBarComponent {
    const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("XPBarUI", true, scene);

    const container = new GUI.Rectangle();
    container.width = "60%";
    container.height = "20px";
    container.top = "10px"; // 顶部显示
    container.thickness = 1;
    container.color = "white";
    container.background = "black";
    container.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    ui.addControl(container);

    const fill = new GUI.Rectangle();
    fill.height = 1;
    fill.width = 0;
    fill.background = "yellow";
    fill.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    container.addControl(fill);

    return new ProgressBarComponent(fill, container);
}
