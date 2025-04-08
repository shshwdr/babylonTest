
import * as BABYLON from "@babylonjs/core";
export class ScreenAdapter {
  static targetAspectRatio = 9 / 16;

  static apply(camera: BABYLON.FreeCamera, baseHeight: number = 16) {
    const engine = camera.getEngine();
    const aspect = engine.getRenderWidth() / engine.getRenderHeight();
    const baseWidth = baseHeight * aspect;

    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    camera.orthoTop = baseHeight / 2;
    camera.orthoBottom = -baseHeight / 2;
    camera.orthoLeft = -baseWidth / 2;
    camera.orthoRight = baseWidth / 2;
  }
}
