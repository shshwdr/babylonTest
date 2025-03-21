import * as BABYLON from "@babylonjs/core";
import { ProgressBarComponent } from "./ProgressBarComponent";
// --- 4. 血条挂载与跟随 ---
import * as GUI from "@babylonjs/gui";

export function CreateHealthBar(scene: BABYLON.Scene, owner: BABYLON.AbstractMesh ,fillColor: string): ProgressBarComponent {
    const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    const container = new GUI.Rectangle();
    container.width = "100px";
    container.height = "12px";
    container.color = "white";
    container.thickness = 1;
    container.background = "black";
    container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    container.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    ui.addControl(container);

    const bar = new GUI.Rectangle();
    bar.height = 1;
    bar.width = 1;
    bar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    bar.background = fillColor;
    container.addControl(bar);

    // ✅ 将血条绑定到人物模型上方
    container.linkWithMesh(owner);
    container.linkOffsetY = -100; // 调整垂直偏移：负值代表往上移动（单位是像素）

    return new ProgressBarComponent(bar, container);
}
