import * as BABYLON from "@babylonjs/core";
export function AttachHitBox(target: BABYLON.TransformNode, size: BABYLON.Vector3, scene: BABYLON.Scene): BABYLON.Mesh {
    const hitbox = BABYLON.MeshBuilder.CreateBox(`${target.name}_hitbox`, { width: size.x, height: size.y, depth: size.z }, scene);
    hitbox.isVisible = false; // 不显示判定框
    hitbox.parent = target; // 跟随目标模型移动
    hitbox.position = BABYLON.Vector3.Zero(); // 相对于父物体中心
    return hitbox;
}