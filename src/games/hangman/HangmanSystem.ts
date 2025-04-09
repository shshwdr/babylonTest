import { HangmanSettings } from "./HangmanSettings";
import { WordDisplaySystem } from "./WordDisplaySystem";
import { KeyboardSystem } from "./KeyboardSystem";
import { World } from "../../utils/ECSSystem";
import * as BABYLON from "@babylonjs/core";
import { HangmanRenderer } from "./HangmanRenderer";

export class HangmanSystem {
  private word: string = "";
  private guessed = new Set<string>();
  private mistakes = 0;
  private score = 0;
private scene: BABYLON.Scene;
private world: World;
  private wordDisplay: WordDisplaySystem;
  private keyboard: KeyboardSystem;

  private renderer: HangmanRenderer;
  constructor(private s: BABYLON.Scene, private w: World) {
    this.scene = s;
    this.world = w;
    this.wordDisplay = new WordDisplaySystem();
    this.keyboard = new KeyboardSystem(this.onLetter.bind(this));
    this.renderer = new HangmanRenderer(s);
    this.startNewWord();
  }
  

  private onLetter(letter: string) {
    if (this.word.includes(letter)) {
      this.guessed.add(letter);
      this.wordDisplay.updateDisplay(this.word, this.guessed);
      this.checkWin();
    } else {
      this.mistakes++;
      console.log(`错了 ${this.mistakes} 次`);
      this.renderer.drawStep(this.mistakes);
      this.checkLose();
    }
  }

  private startNewWord() {
    const randomIndex = Math.floor(Math.random() * HangmanSettings.words.length);
    this.word = HangmanSettings.words[randomIndex];
    this.guessed.clear();
    this.mistakes = 0;
    this.wordDisplay.updateDisplay(this.word, this.guessed);
  }

  private checkWin() {
    const allRevealed = this.word.split("").every(c => this.guessed.has(c));
    if (allRevealed) {
      alert(`🎉 恭喜猜对了 "${this.word}"，当前得分 ${++this.score}`);
      this.restart();
    }
  }

  private checkLose() {
    if (this.mistakes >= HangmanSettings.maxMistakes) {
      alert(`💀 被吊死了！词是 "${this.word}"，总分清零！`);
      this.score = 0;
      this.restart();
    }
  }

  private restart() {
    this.wordDisplay.dispose();
    this.keyboard.dispose();
    new HangmanSystem(this.scene,this.world); // 重新创建
    this.renderer.reset();
  }
}
