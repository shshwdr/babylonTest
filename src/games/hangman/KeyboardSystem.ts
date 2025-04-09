import * as GUI from "@babylonjs/gui";
import { HangmanSettings } from "./HangmanSettings";

export class KeyboardSystem {
  private ui: GUI.AdvancedDynamicTexture;
  private container: GUI.Grid;
  private onKeyCallback: (letter: string) => void;

  constructor(onKey: (letter: string) => void) {
    this.onKeyCallback = onKey;
    this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    this.container = new GUI.Grid();
    this.container.width = 1;
    this.container.height = "40%";
    this.container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    const rows = 3;
    const cols = 9;
    this.container.addRowDefinition(1 / rows);
    this.container.addRowDefinition(1 / rows);
    this.container.addRowDefinition(1 / rows);
    for (let i = 0; i < cols; i++) {
      this.container.addColumnDefinition(1 / cols);
    }

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    letters.forEach((letter, index) => {
      const button = GUI.Button.CreateSimpleButton(letter, letter);
      button.fontSize = HangmanSettings.keyboardFontSize;
      button.color = "white";
      button.background = "#444";
      button.width = "100%";
      button.height = "100%";
      button.onPointerUpObservable.add(() => {
        button.isEnabled = false;
        this.onKeyCallback(letter.toLowerCase());
      });
      const row = Math.floor(index / cols);
      const col = index % cols;
      this.container.addControl(button, row, col);
    });

    this.ui.addControl(this.container);
  }

  dispose() {
    this.ui.dispose();
  }
}
