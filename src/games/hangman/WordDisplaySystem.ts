import * as GUI from "@babylonjs/gui";

export class WordDisplaySystem {
  private ui: GUI.AdvancedDynamicTexture;
  private wordText: GUI.TextBlock;

  constructor() {
    this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    this.wordText = new GUI.TextBlock();
    this.wordText.fontSize = 48;
    this.wordText.color = "white";
    this.wordText.top = "-40%";
    this.wordText.text = "";
    this.wordText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.wordText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.ui.addControl(this.wordText);
  }

  updateDisplay(word: string, guessed: Set<string>) {
    const display = word
      .split("")
      .map(c => (guessed.has(c) ? c : "_"))
      .join(" ");
    this.wordText.text = display;
  }

  dispose() {
    this.ui.dispose();
  }
}
