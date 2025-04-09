import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { FoodSystem } from "./FoodSystem";
import { SkewerSystem } from "./SkewerSystem";
import { BarbecueSettings } from "./BarbecueSettings";
import { World } from "../../utils/ECSSystem";
import { InputManager } from "../../utils/InputManager";
import { ScreenAdapter } from "../../utils/ScreenAdapter";
import { FloatingTextManager } from "../../utils/FloatingTextManager";
import { randomRange } from "../../utils/MathUtils";

let scene: BABYLON.Scene;
let camera: BABYLON.FreeCamera;
let world: World;

let foodSystem: FoodSystem;
let skewerSystem: SkewerSystem;
let ui: GUI.AdvancedDynamicTexture;
let scoreText: GUI.TextBlock;
let tipText: GUI.TextBlock;

let currentRound = 0;
let score = 0;

enum GameState {
  WaitingToStart,
  PlayingRound,
  Result,
}

let state: GameState = GameState.WaitingToStart;

export async function createScene(engine: BABYLON.Engine):  Promise<{ scene: BABYLON.Scene, world: World }> {
  scene = new BABYLON.Scene(engine);
  (window as any).scene = scene; // for system access

  // camera
  camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);
  ScreenAdapter.apply(camera, 16);

  // background
  scene.clearColor = new BABYLON.Color4(0.95, 0.9, 0.8, 1);

  // GUI
  ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  scoreText = new GUI.TextBlock("score", "Score: 0");
  scoreText.color = "black";
  scoreText.fontSize = 32;
  scoreText.top = "-45%";
  scoreText.left = "-45%";
  scoreText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  scoreText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  ui.addControl(scoreText);

  tipText = new GUI.TextBlock("tip", "Tap Anywhere to Start");
  tipText.color = "black";
  tipText.fontSize = 36;
  ui.addControl(tipText);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 1.0;
  // world
  world = new World();

  foodSystem = new FoodSystem();
  skewerSystem = new SkewerSystem(foodSystem);
  FloatingTextManager.init(scene);
  world.addSystem(foodSystem);
  world.addSystem(skewerSystem);
  InputManager.init(scene);
  //InputManager.init(engine.getRenderingCanvas()!);
  InputManager.onTap((info) => {
    if (state === GameState.WaitingToStart) {
      tipText.text = "";
      currentRound = 0;
      score = 0;
      updateScore(0);
      startRound();
    } else if (state === GameState.PlayingRound) {
      if(!skewerSystem.isPoking){

        skewerSystem.poke(info);
        foodSystem.stopMovement();
        state = GameState.WaitingToStart; // prevent double tap
        setTimeout(() => {
          const hit = skewerSystem.getLastHitCount();
          const point = BarbecueSettings.pointTable[hit - 1] || 0;
          score += point;
          updateScore(score);
          nextRound();
        }, 300);
      }
    } else if (state === GameState.Result) {
      tipText.text = "Tap Anywhere to Start";
      scoreText.text = "Score: 0";
      state = GameState.WaitingToStart;
    }
  });

  return  {scene,world};
}

function updateScore(val: number) {
  scoreText.text = "Score: " + val;
}

function getCurrentSkewerDirection(): BABYLON.Vector3 {
  const angle = Math.random() * BarbecueSettings.maxSkewerAngle;
  const rad = (angle * Math.PI) / 180;
  return new BABYLON.Vector3(Math.sin(rad), 1, 0).normalize();
}

function startRound() {
  state = GameState.PlayingRound;

 // const angle = Math.random() * BarbecueSettings.maxSkewerAngle;
 const angle = randomRange(-BarbecueSettings.maxSkewerAngle,BarbecueSettings.maxSkewerAngle)
  foodSystem.clear();
  foodSystem.spawnFoods(currentRound, angle);
}

function nextRound() {
  currentRound++;
  if (currentRound >= BarbecueSettings.totalRounds) {
    showResult();
  } else {
    startRound();
  }
}

function showResult() {
  
  foodSystem.clear();
  state = GameState.Result;
  const label = BarbecueSettings.ratingTable.find(r => score >= r.score)?.label || "Out of Rank";
  tipText.text = `Score: ${score}\nRating: ${label}\nTap to Restart`;
}

export function checkAllFoodGone(){
  if (state === GameState.PlayingRound && foodSystem.isAllFoodGone()) {
    nextRound(); // 没有点就跳过
    state = GameState.WaitingToStart;
  }
}