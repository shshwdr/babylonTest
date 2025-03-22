import * as GUI from "@babylonjs/gui";
import * as BABYLON from "@babylonjs/core";

import * as GUI from "@babylonjs/gui";
import { GameLifecycleManager } from "./GameLifecycleManager";

export class PauseMenuUI {
  private ui: GUI.AdvancedDynamicTexture;

  constructor(scene: BABYLON.Scene, onResume: () => void, onRestart: () => void) {
    this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("PauseMenuUI", true, scene);

    // 给 UI 背景设置一个半透明背景，避免黑色背景显示
    const background = new GUI.Rectangle();
    background.width = "100%";
    background.height = "100%";
    background.color = "white";
    background.background = "rgba(0, 0, 0, 0.5)";  // 半透明背景
    this.ui.addControl(background);

    // 创建一个 Grid 面板
    const grid = new GUI.Grid();
    grid.width = "300px";
    grid.height = "200px";
    grid.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    grid.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    grid.addRowDefinition(50, true); // 第一行：标题
    grid.addRowDefinition(50, false); // 第二行：按钮间距
    grid.addRowDefinition(50, true); // 第三行：按钮

    this.ui.addControl(grid);

    // 标题放置在第一个单元格
    const title = new GUI.TextBlock();
    title.text = "Game Paused";
    title.color = "white";
    title.fontSize = 48;
    title.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    title.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    grid.addControl(title, 0, 0); // 第一行，第一列

    // 恢复按钮
    const resumeButton = GUI.Button.CreateSimpleButton("resumeBtn", "Resume");
    resumeButton.width = "150px";
    resumeButton.height = "50px";
    resumeButton.color = "white";
    resumeButton.background = "green";
    resumeButton.onPointerUpObservable.add(() => {
      GameLifecycleManager.getInstance().resume();
      this.dispose();
      onResume(); // Callback for when resume is clicked
    });
    grid.addControl(resumeButton, 1, 0); // 第三行，第一列

    // 重启按钮
    const restartButton = GUI.Button.CreateSimpleButton("restartBtn", "Restart");
    restartButton.width = "150px";
    restartButton.height = "50px";
    restartButton.color = "white";
    restartButton.background = "red";
    restartButton.onPointerUpObservable.add(() => {
      GameLifecycleManager.getInstance().restartGame();
      this.dispose();
      onRestart(); // Callback for when restart is clicked
    });
    grid.addControl(restartButton, 2, 0); // 第三行，第一列
  }

  public dispose(): void {
    this.ui.dispose(); // Remove the entire UI when disposed
  }
}
