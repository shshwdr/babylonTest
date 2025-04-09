import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

export class FloatingTextManager {
  private static ui: GUI.AdvancedDynamicTexture;
  private static texts: GUI.TextBlock[] = [];

  static init(scene: BABYLON.Scene) {
    this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
  }
  static showFloatingText(text: string, position: BABYLON.Vector3, scene: BABYLON.Scene) {
    const camera = scene.activeCamera!;
    const screenPos = worldToScreen2(position, scene)

    const txt = new GUI.TextBlock();
    txt.text = text;
    txt.color = "red";
    txt.fontSize = 40;
    txt.top = screenPos.y - scene.getEngine().getRenderHeight() / 2 - 20 + "px";
    txt.left = screenPos.x - scene.getEngine().getRenderWidth() / 2 + "px";
    txt.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    txt.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

    this.ui.addControl(txt);
    this.texts.push(txt);
    txt.isPointerBlocker = false

    // 自动销毁
    setTimeout(() => {
      this.ui.removeControl(txt);
      this.texts = this.texts.filter(t => t !== txt);
    }, 1000);
  }

  static clearAll() {
    for (const t of this.texts) {
      this.ui.removeControl(t);
    }
    this.texts.length = 0;
  }
}
export function worldToScreen(worldPos: BABYLON.Vector3, scene: BABYLON.Scene): { x: number; y: number } {
    const engine = scene.getEngine();
    const camera = scene.activeCamera!;
  
    const projected = BABYLON.Vector3.Project(
      worldPos,
      BABYLON.Matrix.Identity(),
      camera.getViewMatrix(),
      camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
    );
  
    return {
      x: projected.x,
      y: projected.y,
    };
  }

  export function worldToScreen2(worldPos: BABYLON.Vector3, scene: BABYLON.Scene): { x: number; y: number } {
    const engine = scene.getEngine();
    const camera = scene.activeCamera as BABYLON.FreeCamera;
  
    if (!camera.orthoLeft || !camera.orthoRight || !camera.orthoTop || !camera.orthoBottom) {
      throw new Error("Camera is not orthographic or ortho bounds not set");
    }
  
    const orthoWidth = camera.orthoRight - camera.orthoLeft;
    const orthoHeight = camera.orthoTop - camera.orthoBottom;
  
    const normalizedX = (worldPos.x - camera.orthoLeft) / orthoWidth;
    const normalizedY = (camera.orthoTop - worldPos.y) / orthoHeight;
  
    const screenX = normalizedX * engine.getRenderWidth();
    const screenY = normalizedY * engine.getRenderHeight();
  
    return { x: screenX, y: screenY };
  }
  
  