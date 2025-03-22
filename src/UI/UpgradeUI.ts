import * as GUI from "@babylonjs/gui";
import * as BABYLON from "@babylonjs/core";

export class UpgradeUI {
    private ui: GUI.AdvancedDynamicTexture;

    constructor(scene: BABYLON.Scene, onContinue: () => void) {
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UpgradeUI", true, scene);

        const panel = new GUI.StackPanel();
        panel.width = "300px";
        panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.ui.addControl(panel);

        const title = new GUI.TextBlock();
        title.text = "Level Up!";
        title.color = "white";
        title.fontSize = 48;
        panel.addControl(title);

        const continueButton = GUI.Button.CreateSimpleButton("continueBtn", "Continue");
        continueButton.width = "150px";
        continueButton.height = "50px";
        continueButton.color = "white";
        continueButton.background = "blue";
        continueButton.onPointerUpObservable.add(() => {
            this.dispose();
            onContinue();  // 点击继续按钮后恢复游戏
        });
        panel.addControl(continueButton);
    }

    public dispose() {
        this.ui.dispose();
    }
}
