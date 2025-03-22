import * as BABYLON from "@babylonjs/core";
import { ComponentUpdateManager } from "./ComponentSystem";

export class GameLifecycleManager {
    private static _instance: GameLifecycleManager;
    private currentScene: BABYLON.Scene | null = null;
    private engine: BABYLON.Engine;
    private canvas: HTMLCanvasElement;
    private createSceneFn: () => Promise<BABYLON.Scene>;
    private paused: boolean = false;

    private constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement, createSceneFn: () => Promise<BABYLON.Scene>) {
        this.engine = engine;
        this.canvas = canvas;
        this.createSceneFn = createSceneFn;
    }

    public static init(engine: BABYLON.Engine, canvas: HTMLCanvasElement, createSceneFn: () => Promise<BABYLON.Scene>) {
        if (!this._instance) {
            this._instance = new GameLifecycleManager(engine, canvas, createSceneFn);
        }
    }

    public static getInstance(): GameLifecycleManager {
        if (!this._instance) throw new Error("GameLifecycleManager not initialized.");
        return this._instance;
    }

    public async startGame(): Promise<void> {
        this.currentScene = await this.createSceneFn();
        this.currentScene.activeCamera?.attachControl(this.canvas, true);
        this.paused = false;
        // this.engine.runRenderLoop(() => {
        //     if (!this.paused) {
        //         ComponentUpdateManager.getInstance().update(this.engine.getDeltaTime() / 1000);
        //         this.currentScene?.render();
        //     }
        // });
    }

    public async restartGame(): Promise<void> {
        console.log("Restarting game...");
    
        // 清理更新管理器和其他相关内容
        ComponentUpdateManager.getInstance().clear();
    
        // 停止当前的渲染循环
        if (this.engine) {
            this.engine.stopRenderLoop(); // 停止当前渲染循环
        }
    
        // 清理当前场景
        if (this.currentScene) {
            this.currentScene.activeCamera?.detachControl();
            this.currentScene.dispose();
        }
    
        // 等待并启动新场景
        await this.startGame();
    
        // 注册新的渲染循环
        // this.engine.runRenderLoop(() => {
        //     if (!this.paused) {
        //         确保每帧的 deltaTime 是基于当前帧计算的
        //         const deltaTime = this.engine.getDeltaTime() / 1000; // 每帧的时间增量（秒）
        //         ComponentUpdateManager.getInstance().update(deltaTime); // 更新组件
        //         this.currentScene?.render(); // 渲染当前场景
        //     }
        // });
    }

    public pause(): void {
        this.paused = true;
        ComponentUpdateManager.getInstance().pause();
    }

    public resume(): void {
        this.paused = false;
        ComponentUpdateManager.getInstance().resume();
    }

    public getScene(): BABYLON.Scene | null {
        return this.currentScene;
    }

    public isPaused(): boolean {
        return this.paused;
    }
}
