import * as GUI from "@babylonjs/gui";
import { ComponentUpdateManager } from "../ComponentSystem";

export class GameOverUI {
  private ui: GUI.AdvancedDynamicTexture;

  constructor(scene: BABYLON.Scene, onRestart: () => void) {
    this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("GameOverUI", true, scene);

    const panel = new GUI.StackPanel();
    panel.width = "300px";
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.ui.addControl(panel);

    const title = new GUI.TextBlock();
    title.text = "Game Over";
    title.color = "white";
    title.fontSize = 48;
    panel.addControl(title);

    const button = GUI.Button.CreateSimpleButton("restartBtn", "Restart");
    button.width = "150px";
    button.height = "50px";
    button.color = "white";
    button.background = "red";
    button.onPointerUpObservable.add(() => {
      this.dispose();
      onRestart();
    });
    panel.addControl(button);
  }

  public dispose() {
    this.ui.dispose();
  }
}
