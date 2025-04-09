import * as BABYLON from "@babylonjs/core";

export class HangmanRenderer {
  private scene: BABYLON.Scene;
  private lines: BABYLON.AbstractMesh[] = [];

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  reset() {
    this.lines.forEach(l => l.dispose());
    this.lines.length = 0;
  }

  drawStep(step: number) {
    switch (step) {
      case 1: this.drawBase(); break;
      case 2: this.drawPole(); break;
      case 3: this.drawBeam(); break;
      case 4: this.drawRope(); break;
      case 5: this.drawHead(); break;
      case 6: this.drawBody(); break;
      case 7: this.drawArms(); break;
      case 8: this.drawLegs(); break;
    }
  }

  private drawBase() {
    const mesh = BABYLON.MeshBuilder.CreateBox("base", { width: 4, height: 0.1 }, this.scene);
    mesh.position = new BABYLON.Vector3(0, 0, 0);
    this.lines.push(mesh);
  }

  private drawPole() {
    const mesh = BABYLON.MeshBuilder.CreateBox("pole", { width: 0.1, height: 3 }, this.scene);
    mesh.position = new BABYLON.Vector3(-1.5, 1.5, 0);
    this.lines.push(mesh);
  }

  private drawBeam() {
    const mesh = BABYLON.MeshBuilder.CreateBox("beam", { width: 3, height: 0.1 }, this.scene);
    mesh.position = new BABYLON.Vector3(0, 3, 0);
    this.lines.push(mesh);
  }

  private drawRope() {
    const mesh = BABYLON.MeshBuilder.CreateBox("rope", { width: 0.05, height: 1 }, this.scene);
    mesh.position = new BABYLON.Vector3(1, 2, 0);
    this.lines.push(mesh);
  }

  private drawHead() {
    const mesh = BABYLON.MeshBuilder.CreateSphere("head", { diameter: 0.8 }, this.scene);
    mesh.position = new BABYLON.Vector3(1, 1.3, 0);
    this.lines.push(mesh);
  }

  private drawBody() {
    const mesh = BABYLON.MeshBuilder.CreateBox("body", { width: 0.1, height: 1.2 }, this.scene);
    mesh.position = new BABYLON.Vector3(1, 0.3, 0);
    this.lines.push(mesh);
  }

  private drawArms() {
    const armL = BABYLON.MeshBuilder.CreateBox("armL", { width: 0.6, height: 0.05 }, this.scene);
    armL.position = new BABYLON.Vector3(0.7, 0.7, 0);
    const armR = BABYLON.MeshBuilder.CreateBox("armR", { width: 0.6, height: 0.05 }, this.scene);
    armR.position = new BABYLON.Vector3(1.3, 0.7, 0);


    this.lines.push(armL, armR);
  }

  private drawLegs() {

    const legL = BABYLON.MeshBuilder.CreateBox("legL", { width: 0.05, height: 0.6 }, this.scene);
    legL.position = new BABYLON.Vector3(0.9, -0.4, 0);
    const legR = BABYLON.MeshBuilder.CreateBox("legR", { width: 0.05, height: 0.6 }, this.scene);
    legR.position = new BABYLON.Vector3(1.1, -0.4, 0);

    this.lines.push(legL, legR);
  }

}
