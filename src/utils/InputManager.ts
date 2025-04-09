import * as BABYLON from "@babylonjs/core";

type Vec2 = { x: number, y: number };
type TapCallback = (info: BABYLON.PointerInfo) => void;
type SwipeCallback = (dir: "up" | "down" | "left" | "right", distance: number) => void;
type LongPressCallback = (pos: Vec2) => void;

export class InputManager {
  private static scene: BABYLON.Scene;
  private static tapListeners: TapCallback[] = [];
  private static swipeListeners: SwipeCallback[] = [];
  private static longPressListeners: LongPressCallback[] = [];

  private static touchStartPos: Vec2 | null = null;
  private static touchStartTime: number = 0;
  private static longPressTimeout: number | null = null;

  static init(scene: BABYLON.Scene) {
    this.scene = scene;

    scene.onPointerObservable.add(this.handlePointerDown, BABYLON.PointerEventTypes.POINTERDOWN);
    scene.onPointerObservable.add(this.handlePointerUp, BABYLON.PointerEventTypes.POINTERUP);
  }

  static onTap(callback: TapCallback) {
    this.tapListeners.push(callback);
  }

  static onSwipe(callback: SwipeCallback) {
    this.swipeListeners.push(callback);
  }

  static onLongPress(callback: LongPressCallback) {
    this.longPressListeners.push(callback);
  }

  private static handlePointerDown = (info: BABYLON.PointerInfo) => {
    this.touchStartTime = performance.now();
    this.touchStartPos = this.getPointerPos(info);

    this.longPressTimeout = window.setTimeout(() => {
      if (this.touchStartPos) {
        for (const cb of this.longPressListeners) cb(this.touchStartPos);
      }
    }, 600);
  };

  private static handlePointerUp = (info: BABYLON.PointerInfo) => {
    const endPos = this.getPointerPos(info);
    const startPos = this.touchStartPos;
    const deltaTime = performance.now() - this.touchStartTime;

    window.clearTimeout(this.longPressTimeout!);

    if (startPos) {
      const dx = endPos.x - startPos.x;
      const dy = endPos.y - startPos.y;
      const dist = Math.hypot(dx, dy);

      if (deltaTime < 500 && dist < 10) {
        for (const cb of this.tapListeners) cb(info);
      } else if (dist >= 20 && deltaTime < 1000) {
        const isHorizontal = Math.abs(dx) > Math.abs(dy);
        const dir: "up" | "down" | "left" | "right" = isHorizontal
          ? dx > 0 ? "right" : "left"
          : dy > 0 ? "down" : "up";
        for (const cb of this.swipeListeners) cb(dir, dist);
      }
    }

    this.touchStartPos = null;
  };

 static getPointerPos(info: BABYLON.PointerInfo): Vec2 {
    const evt = info.event as PointerEvent;
    const canvas = this.scene.getEngine().getRenderingCanvas()!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }

  static getPointerWorldPosFromEvent(info: BABYLON.PointerInfo): BABYLON.Vector3 {
    const evt = info.event as PointerEvent;
    const canvas = this.scene.getEngine().getRenderingCanvas()!;
    const pick = this.scene.pick(evt.clientX, evt.clientY);
    
    const rect = canvas.getBoundingClientRect();
    //return new BABYLON.Vector3(evt.clientX - rect.left, evt.clientY - rect.top, 0);
    return pick?.pickedPoint ?? new BABYLON.Vector3(0, 0, 0);
  }

  static getPointerWorldPosOnYPlane(info: BABYLON.PointerInfo, y: number = 0): BABYLON.Vector3 {
    const engine = this.scene.getEngine();
    const camera = this.scene.activeCamera!;
    const evt = info.event as PointerEvent;
  
    const canvas = engine.getRenderingCanvas()!;
    const rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const yPixel = evt.clientY - rect.top;
  
    const ray = this.scene.createPickingRay(x, yPixel, BABYLON.Matrix.Identity(), camera, false);
  
    const plane = new BABYLON.Plane(0, 1, 0, -y); // Y = y 平面
    const dist = ray.intersectsPlane(plane);
  
    if (dist === null) return BABYLON.Vector3.Zero();
  
    // ✅ 计算交点位置：origin + direction * distance
    return ray.origin.add(ray.direction.scale(dist));
  }
  static getPointerWorldPosFromInfo(info: BABYLON.PointerInfo): BABYLON.Vector3 {
    const engine = this.scene.getEngine();
    const camera = this.scene.activeCamera!;
    const evt = info.event as PointerEvent;
  
    const canvas = engine.getRenderingCanvas()!;
    const rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
  
    // 从屏幕坐标构建 clip-space 坐标
    const screen = new BABYLON.Vector3(x, y, 0); // Z = 0 表示近平面
  
    return BABYLON.Vector3.Unproject(
      screen,
      engine.getRenderWidth(),
      engine.getRenderHeight(),
      BABYLON.Matrix.Identity(),
      camera.getViewMatrix(),
      camera.getProjectionMatrix()
    );
  }
  
  
  
}
