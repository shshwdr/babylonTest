import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { FruitManager } from "./FruitManager";
export class UIManager {
    static createUI(scene: BABYLON.Scene) {
        const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const scoreText = new GUI.TextBlock("score", "Score: 0");
        scoreText.color = "white";
        scoreText.fontSize = 24;
        scoreText.top = "-45%";
        scoreText.left = "-45%";
        scoreText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        scoreText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        ui.addControl(scoreText);
        FruitManager.scoreText = scoreText;
    }
}
