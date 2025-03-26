// GameManager.ts
import * as BABYLON from "@babylonjs/core";
import { PlayerComponent } from "./Player/PlayerComponent";

export class GameManager {
    private static instance: GameManager;

    private _scene!: BABYLON.Scene;
    private _player!: BABYLON.TransformNode;
    private _playerComponent!: PlayerComponent;

    private constructor() {}

    public static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    public setScene(scene: BABYLON.Scene) {
        this._scene = scene;
    }

    public get scene(): BABYLON.Scene {
        return this._scene;
    }

    public setPlayer(node: BABYLON.TransformNode, component: PlayerComponent) {
        this._player = node;
        this._playerComponent = component;
    }

    public get playerNode(): BABYLON.TransformNode {
        return this._player;
    }

    public get playerComponent(): PlayerComponent {
        return this._playerComponent;
    }

    // ✅ 可扩展更多全局资源
}
