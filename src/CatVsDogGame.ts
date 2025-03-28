// CatVsDogGame.ts - 增加背景贴图、风力指示、回合显示、力度条与投掷逻辑改进
import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { Component, addComponent, getComponent, ComponentUpdateManager } from "./ComponentSystem";

class GameManager {
  public playerNode?: BABYLON.Mesh;
  public enemyNode?: BABYLON.Mesh;
  public wall?: BABYLON.Mesh;
  public ground?: BABYLON.Mesh;
  
  public isPlayerTurn = false;
  public windForce = 0;
  private windText?: GUI.TextBlock;
  
  private windLeftBar?: GUI.Rectangle;
  private windRightBar?: GUI.Rectangle;
  private turnText?: GUI.TextBlock;
  private powerBar?: GUI.Rectangle;
  private powerBarInner?: GUI.Rectangle;
  private playerHPFill?: GUI.Rectangle;
  private enemyHPFill?: GUI.Rectangle;
  private ui?: GUI.AdvancedDynamicTexture;
  private chargeTime: number = 0;
  private charging = false;
  private increasing = true;

  private  currentCharacterChoice = "cat";
  private gameStarted = false;
  private isThrowing = false;
  constructor(private scene: BABYLON.Scene) {}

  public async showMainMenu(): Promise<"cat" | "dog"> {
    return new Promise(resolve => {
      this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("MainMenu", true, this.scene);
  
      const panel = new GUI.StackPanel();
      panel.spacing = 20;
      panel.width = "60%";
      panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      this.ui.addControl(panel);
  
      const title = new GUI.TextBlock("title", "Who Are You");
      title.height = "60px";
      title.color = "white";
      title.fontSize = 32;
      panel.addControl(title);
  
      const catBtn = GUI.Button.CreateSimpleButton("cat", "I'm a cat");
      catBtn.height = "60px";
      catBtn.width = "200px";
      catBtn.fontSize = 24;
      catBtn.color = "white";
      catBtn.background = "orange";
      catBtn.onPointerUpObservable.add(() => {
        this.ui?.dispose();
        this.currentCharacterChoice = "cat";
        this.gameStarted = true;
        resolve("cat");
      });
      panel.addControl(catBtn);
  
      const dogBtn = GUI.Button.CreateSimpleButton("dog", "I'm a dog");
      dogBtn.height = "60px";
      dogBtn.width = "200px";
      dogBtn.fontSize = 24;
      dogBtn.color = "white";
      dogBtn.background = "brown";
      dogBtn.onPointerUpObservable.add(() => {
        this.ui?.dispose();
        this.currentCharacterChoice = "dog";
        this.gameStarted = true;
        resolve("dog");
      });
      panel.addControl(dogBtn);
    });
  }
  
  private createGround() {
    const ground = BABYLON.MeshBuilder.CreateBox("ground", { width: 100, height: 1 }, this.scene);
   // const mat = new BABYLON.StandardMaterial("groundMat", this.scene);
   // mat.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2); // 设置为绿色
   // ground.material = mat;
  
    ground.position.y = -2; // 放置在屏幕下方
    ground.checkCollisions = true;

    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.5 },
      this.scene
    );
    return ground;
  }

  public start(playerType: "cat" | "dog") {
    this.createBackground();
    
   this.scene.debugLayer.show({ embedMode: true });
    this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("GameUI", true, this.scene);

    const playerSprite = this.createCharacterSprite(`assets/${playerType.toUpperCase()}.png`, -5);
    const enemyType = playerType === "cat" ? "DOG" : "CAT";
    const enemySprite = this.createCharacterSprite(`assets/${enemyType}.png`, 5);

    this.playerNode = playerSprite;
    this.enemyNode = enemySprite;

    this.playerNode.physicsImpostor!.physicsBody.collisionFilterGroup = 0x01;
    this.playerNode.physicsImpostor!.physicsBody.collisionFilterMask = 0xFF;
    
    this.enemyNode.physicsImpostor!.physicsBody.collisionFilterGroup = 0x02;
    this.enemyNode.physicsImpostor!.physicsBody.collisionFilterMask = 0xFF;


    this.wall = BABYLON.MeshBuilder.CreateBox("wall", { width: 0.5, height: 5 }, this.scene);
    this.wall.position.x = 0;

    this.wall.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.wall,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.6 },
      this.scene
    );

    const wallBody = this.wall!.physicsImpostor!.physicsBody;
wallBody.collisionFilterGroup = 0x08;
wallBody.collisionFilterMask = 0xFFFF;
    addComponent(playerSprite, new HPComponent(playerSprite, 3, () => this.onDeath("enemy")));
    addComponent(enemySprite, new HPComponent(enemySprite, 3, () => this.onDeath("player")));

    this .ground = this.createGround();
    this.ground.physicsImpostor!.physicsBody.collisionFilterGroup = 0x10;
    this.ground.physicsImpostor!.physicsBody.collisionFilterMask = 0xFFFF;
    this.createHUD();
    this.registerInput();
    this.nextTurn();
  }

  private createCharacterSprite(texturePath: string, x: number): BABYLON.Mesh {
    const plane = BABYLON.MeshBuilder.CreatePlane("char", { width: 2, height: 2 }, this.scene);
    plane.position.x = x;
    const mat = new BABYLON.StandardMaterial("mat", this.scene);
    mat.diffuseTexture = new BABYLON.Texture(texturePath, this.scene);
    mat.diffuseTexture.hasAlpha = true;
    mat.backFaceCulling = false;
    plane.material = mat;


    plane.physicsImpostor = new BABYLON.PhysicsImpostor(
      plane,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.5 },
      this.scene
    );
    
    plane.checkCollisions = true; // ✅ 现在合法
    return plane;
  }

  private createBackground() {
    const bg = BABYLON.MeshBuilder.CreatePlane("bg", { width: 40, height: 30 }, this.scene);
    bg.rotation = new BABYLON.Vector3(0, Math.PI, 0);
    bg.position.z = 1; // 放在前景

    const mat = new BABYLON.StandardMaterial("bgMat", this.scene);
    mat.diffuseTexture = new BABYLON.Texture("assets/bg.jpg", this.scene);
    mat.diffuseTexture.hasAlpha = false;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    mat.backFaceCulling = false;
    bg.material = mat;
  }

  private createWindBar(){
    if (!this.ui) return;
    // Wind Bar 背景容器
// Wind Bar 背景容器
const windBarContainer = new GUI.Rectangle();
windBarContainer.width = "300px";
windBarContainer.height = "20px";
windBarContainer.thickness = 1;
windBarContainer.color = "white";
windBarContainer.background = "black";
windBarContainer.top = "150px";
windBarContainer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
windBarContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
this.ui.addControl(windBarContainer);

// 创建左右各占一半的容器（绝不拉伸）
const windLeftBox = new GUI.Rectangle();
windLeftBox.width = "50%";
windLeftBox.height = "100%";
windLeftBox.thickness = 0;
windLeftBox.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
windBarContainer.addControl(windLeftBox);

const windRightBox = new GUI.Rectangle();
windRightBox.width = "50%";
windRightBox.height = "100%";
windRightBox.thickness = 0;
windRightBox.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
windBarContainer.addControl(windRightBox);

// windLeft 实际蓝条（从右向左填充）
const windLeftBar = new GUI.Rectangle();
windLeftBar.width = "0%";
windLeftBar.height = "100%";
windLeftBar.background = "blue";
windLeftBar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
windLeftBox.addControl(windLeftBar);

// windRight 实际红条（从左向右填充）
const windRightBar = new GUI.Rectangle();
windRightBar.width = "0%";
windRightBar.height = "100%";
windRightBar.background = "red";
windRightBar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
windRightBox.addControl(windRightBar);

// 保存引用
this.windLeftBar = windLeftBar;
this.windRightBar = windRightBar;
  }

  private createHUD() {
    if (!this.ui) return;

    this.turnText = new GUI.TextBlock("turn", "Your Turn");
    this.turnText.color = "white";
    this.turnText.fontSize = 28;
    this.turnText.top = "0";
    this.turnText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.turnText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.ui.addControl(this.turnText);

    this.windText = new GUI.TextBlock("wind", "Wind");
    this.windText.color = "white";
    this.windText.fontSize = 24;
    this.windText.top = "50";
    this.windText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.windText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.ui.addControl(this.windText);

    this.createWindBar();


    const powerBar = new GUI.Rectangle();
    powerBar.width = "200px";
    powerBar.height = "20px";
    powerBar.color = "white";
    powerBar.thickness = 2;
    powerBar.background = "black";
    powerBar.top = "200";
    powerBar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    powerBar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

    const inner = new GUI.Rectangle();
    inner.width = "0%";
    inner.height = "100%";
    inner.background = "lime";
    inner.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    powerBar.addControl(inner);
    this.ui.addControl(powerBar);
    this.powerBar = powerBar;
    this.powerBarInner = inner;

    // 玩家 HP 条（左侧）
const playerHPBar = new GUI.Rectangle();
playerHPBar.width = "100px";
playerHPBar.height = "20px";
playerHPBar.color = "white";
playerHPBar.thickness = 1;
playerHPBar.background = "black";
playerHPBar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
playerHPBar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
playerHPBar.top =  "0px";
playerHPBar.left = "10px";
this.ui.addControl(playerHPBar);

const playerHPFill = new GUI.Rectangle();
playerHPFill.width = "100%";
playerHPFill.height = "100%";
playerHPFill.background = "lime";
playerHPFill.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
playerHPBar.addControl(playerHPFill);
this.playerHPFill = playerHPFill;

// 敌人 HP 条（右侧）
const enemyHPBar = new GUI.Rectangle();
enemyHPBar.width = "100px";
enemyHPBar.height = "20px";
enemyHPBar.color = "white";
enemyHPBar.thickness = 1;
enemyHPBar.background = "black";
enemyHPBar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
enemyHPBar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
enemyHPBar.top =  "0px";
enemyHPBar.left = "-10px";
this.ui.addControl(enemyHPBar);

const enemyHPFill = new GUI.Rectangle();
enemyHPFill.width = "100%";
enemyHPFill.height = "100%";
enemyHPFill.background = "red";
enemyHPFill.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
enemyHPBar.addControl(enemyHPFill);
this.enemyHPFill = enemyHPFill;
  }

  private registerInput() {
    const maxCharge = 2;
  
    this.scene.onPointerDown = () => {
      if (!this.isPlayerTurn || !this.gameStarted || this.isThrowing) return;
      this.charging = true;
      this.chargeTime = 0;
      this.increasing = true;
    };
  
    this.scene.onPointerUp = () => {
      if (!this.isPlayerTurn || !this.charging || !this.gameStarted || this.isThrowing) return;
      this.charging = false;
      const powerRatio = Math.min(this.chargeTime / maxCharge, 1);
      this.throwProjectile(powerRatio,this.currentCharacterChoice);
      this.isThrowing = true;
    };
  
    // 修复：绑定外部 this 引用
    const manager = this;
    class ChargeBarComponent extends Component {
      update(dt: number): void {
        if (!manager.charging || !manager.powerBarInner) return;
        manager.chargeTime += (manager.increasing ? 1 : -1) * dt;
        if (manager.chargeTime > maxCharge) {
          manager.chargeTime = maxCharge;
          manager.increasing = false;
        } else if (manager.chargeTime < 0) {
          manager.chargeTime = 0;
          manager.increasing = true;
        }
        const percent = Math.min(manager.chargeTime / maxCharge, 1);
        manager.powerBarInner.width = `${Math.floor(percent * 100)}%`;
      }
    }
  
    ComponentUpdateManager.getInstance().register(new ChargeBarComponent(null as any));
  }

  private throwProjectile(strength: number,character:string) {
    if (!this.playerNode || !this.enemyNode) return;

    const thrower = this.isPlayerTurn ? this.playerNode : this.enemyNode;
    const throwMat = thrower.material as BABYLON.StandardMaterial;
const actionTex = new BABYLON.Texture(`assets/${character.toUpperCase()}_Throw.png`, this.scene);

actionTex.hasAlpha = true;
throwMat.diffuseTexture = actionTex;

setTimeout(() => {
const originalTex = new BABYLON.Texture(`assets/${character.toUpperCase()}.png`, this.scene);

originalTex.hasAlpha = true;
  throwMat.diffuseTexture = originalTex;
}, 500);

    const plane = BABYLON.MeshBuilder.CreateSphere("proj",  { diameter: 0.5 },this.scene);
    if(this.isPlayerTurn){

      plane.position = this.playerNode.position.clone();
    }else{
      plane.position = this.enemyNode.position.clone();
    }
    const mat = new BABYLON.StandardMaterial("pMat", this.scene);
    var projectileImage = character == "cat"?"Can":"Bone";
    mat.diffuseTexture = new BABYLON.Texture("assets/"+projectileImage+".png", this.scene);
    mat.diffuseTexture.hasAlpha = true;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    plane.material = mat;
    plane.physicsImpostor = new BABYLON.PhysicsImpostor(
      plane,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 0.8 },
      this.scene
    );

    plane.checkCollisions = true;
    
    const dir = this.isPlayerTurn ? 1 : -1
    var force =  8 + strength * 10 + this.windForce;
    force= force*0.5
    plane.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(dir * force, force, 0));
    const group = 0x04; // 任意未占用组
    
    const mask =
      this.isPlayerTurn
        ? 0xFF & ~0x01 // 不与玩家碰撞
        : 0xFF & ~0x02; // 不与敌人碰撞
    
    plane.physicsImpostor!.physicsBody .collisionFilterGroup = group;
    plane.physicsImpostor!.physicsBody .collisionFilterMask = mask;
    //plane.physicsImpostor!.physicsBody.collisionFilterMask = 0xFFFF; 


    plane.physicsImpostor.registerOnPhysicsCollide([
      this.playerNode.physicsImpostor!,
      this.enemyNode.physicsImpostor!,
      this.ground.physicsImpostor!,
      this.wall!.physicsImpostor!
    ], (main, collided) => {
      const target = (collided.object as unknown) as BABYLON.TransformNode;
      // const node = collided.object as BABYLON.TransformNode;

      if (target === thrower) return;
      const hp = getComponent(target, HPComponent);
      if (hp) {
        hp.takeDamage(1);
        this.updateHPDisplay();
      }
      plane.dispose();
      this.nextTurn();
    });

  // const velocity = dir.scale(force);

  //   addComponent(plane, new ProjectileComponent(plane, velocity, (hit) => this.onProjectileHit(hit)));
    //this.isPlayerTurn = !this.isPlayerTurn ;
  }

  private onProjectileHit(hit: BABYLON.TransformNode | null) {
    if (hit) {
      const hp = getComponent(hit, HPComponent);
      hp?.takeDamage(1);
      this.updateHPDisplay();
    }
    setTimeout(() => this.nextTurn(), 1000);
  }

  private updateHPDisplay() {
    const p = getComponent(this.playerNode!, HPComponent);
    const e = getComponent(this.enemyNode!, HPComponent);
    this.playerHPFill!.width = `${(p ? p.hp : 0) / 3 * 100}%`;
this.enemyHPFill!.width = `${(e ? e.hp : 0) / 3 * 100}%`;
  }

  private nextTurn() {

    //this code works to decrease HP
    // const hp = getComponent(this.playerNode!, HPComponent);
    // hp?.takeDamage(1);
    // this.updateHPDisplay();


    this.isPlayerTurn = !this.isPlayerTurn;

    const thrower = this.isPlayerTurn ? this.playerNode : this.enemyNode;
    if(thrower){

      const throwMat = thrower.material as BABYLON.StandardMaterial;
    const originalTex = throwMat.diffuseTexture;
    
    var character = this.isPlayerTurn? this.currentCharacterChoice : this.enemyName();
const actionTex = new BABYLON.Texture(`assets/${character.toUpperCase()}_Preparing.png`, this.scene);

actionTex.hasAlpha = true;
throwMat.diffuseTexture = actionTex;
    }


    this.windForce = Math.round((Math.random() - 0.5) * 10);
    //if (this.windText) this.windText.text = `风力: ${this.windForce}`;

    const percent = Math.abs(this.windForce) / 5;
    if(this.windLeftBar && this.windRightBar){

      this.windLeftBar.width = this.windForce < 0 ? `${percent * 50}%` : "0%";
      this.windRightBar.width = this.windForce > 0 ? `${percent * 50}%` : "0%";
    }

    if (this.powerBarInner) this.powerBarInner.width = "0%";

    if (this.turnText) this.turnText.text = this.isPlayerTurn ? "You turn" : "Enemy turn";
    this.isThrowing = false;
    if (!this.isPlayerTurn) {
      setTimeout(() => {
        const strength = Math.random();
        this.throwProjectile(strength,this.enemyName());
      }, 500);
    }
  }

  private enemyName(){
    if(this.currentCharacterChoice == "cat"){
      return "dog";
    }
    return "cat";
  }

  private onDeath(who: "player" | "enemy") {
    const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("EndUI", true, this.scene);
    const text = new GUI.TextBlock("end", who === "enemy" ? "Win!" : "Lose...");
    text.color = "white";
    text.fontSize = 40;
    text.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    text.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    ui.addControl(text);
  }
}

class HPComponent extends Component {
  public hp: number;
  constructor(node: BABYLON.TransformNode, hp: number, private onDeath: () => void) {
    super(node);
    this.hp = hp;
  }
  takeDamage(dmg: number) {
    this.hp -= dmg;
    if (this.hp <= 0) this.onDeath();
  }
}

// class ProjectileComponent extends Component {
//   private velocity: BABYLON.Vector3;
//   private gravity = -9.8;
//   private onHit: (hit: BABYLON.TransformNode | null) => void;
//   private life = 3;

//   constructor(node: BABYLON.TransformNode, velocity: BABYLON.Vector3, onHit: (hit: BABYLON.TransformNode | null) => void) {
//     super(node);
//     this.velocity = velocity;
//     this.onHit = onHit;
//     ComponentUpdateManager.getInstance().register(this);
//   }

//   update(dt: number): void {
//     this.velocity.y += this.gravity * dt;
//     this.owner.position.addInPlace(this.velocity.scale(dt));
//     this.life -= dt;

//     if (this.life <= 0) {
//       this.onHit(null);
//       this.destroy();
//     }

//     const hitTest = ["player", "enemy", "wall", "ground"];
//     for (const name of hitTest) {
//       const node = this.owner.getScene().getTransformNodeByName(name);
//       if (node && BABYLON.Vector3.Distance(this.owner.position, node.position) < 1) {
//         this.onHit(node);
        
//         // if (name === "ground") {
//         //   setTimeout(() => this.nextTurn(), 1000); // 碰到地面后进入下一个回合
//         // }
//         this.destroy();
//         return;
//       }
//     }
//   }

//   destroy(): void {
//     this.owner.dispose();
//     ComponentUpdateManager.getInstance().unregister(this);
//   }
// }

export async function createScene(engine: BABYLON.Engine): Promise<BABYLON.Scene> {
  const scene = new BABYLON.Scene(engine);

  var gravityVector = new BABYLON.Vector3(0, -9.81, 0);

  var physicsPlugin = new BABYLON.CannonJSPlugin();
  scene.enablePhysics(gravityVector, physicsPlugin);

  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  const camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 0, -20), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.layerMask = 0xFFFFFFFF;
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  const dist = 10;
  camera.orthoTop = dist;
  camera.orthoBottom = -dist;
  camera.orthoLeft = -dist * engine.getAspectRatio(camera);
  camera.orthoRight = dist * engine.getAspectRatio(camera);

  const manager = new GameManager(scene);
  setTimeout(async () => {
    const choice = await manager.showMainMenu();
    manager.start(choice);
  }, 0);

  return scene;
}