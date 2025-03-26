// import * as BABYLON from "@babylonjs/core";
// import { Inspector, inspector } from "@babylonjs/inspector"
// //import '@babylonjs/loaders/glTF'
// //import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";
// import "@babylonjs/loaders";
// import * as GUI from "@babylonjs/gui/2D";
// //registerBuiltInLoaders();
// const canvas = document.getElementById("renderCanvas");
// const engine = new BABYLON.Engine(canvas);

// function createFreeCamera(scene) {
//   var camera = new BABYLON.FreeCamera(
//     "cam", new BABYLON.Vector3(0, 1.7, -2), scene);
//   return camera;
// }
// function createFloor(scene) {
//   var floor = BABYLON.Mesh.CreateGround("floor", 100, 100, 1, scene, false);
//   return floor;
// }
// function createLight(scene) {
//   var ambLight = new BABYLON.HemisphericLight(
//     "ambientLight", new BABYLON.Vector3(1,1,1), scene);
//   var light = new BABYLON.DirectionalLight(
//     "dir01", new BABYLON.Vector3(-0.5, -1, -0.5), scene);
//   // Set a position in order to enable shadows later
//   light.position = new BABYLON.Vector3(20, 40, 20);
//   return light;
// }
// let laneWidth = 3;
// let laneHeight = 0.1;
// let totalLaneLength = 20;
// function createLane(scene) {
//   var lane = BABYLON.Mesh.CreateBox("lane", 1, scene, false);

//   const sphereMaterial = new BABYLON.StandardMaterial();
//   lane.material = sphereMaterial;

//   sphereMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
//   //lane.color
//   lane.scaling = new BABYLON.Vector3(
//     laneWidth, laneHeight, totalLaneLength);
//   lane.position.y = laneHeight / 2; // New position due to mesh centering
//   lane.position.z = totalLaneLength / 2;
//   return lane;
// }
// function createPins(scene) {
//   let pinHeight = 1;
//   let pinDiameter = 0.6;
//   let positionY =  pinHeight/2+laneHeight;
//   var pinPositions = [
//     new BABYLON.Vector3(1, positionY, totalLaneLength - 1),  // 第一个位置
//     new BABYLON.Vector3(0, positionY, totalLaneLength - 1),  // 第一个位置
//     new BABYLON.Vector3(-1, positionY, totalLaneLength - 1),  // 第一个位置
//     new BABYLON.Vector3(-0.5, positionY, totalLaneLength - 2),  // 第一个位置
//     new BABYLON.Vector3(0.5, positionY, totalLaneLength - 2),  // 第一个位置
//   ];
//   // Create the main pin
//   var mainPin = BABYLON.Mesh.CreateCylinder(
//     "pin", pinHeight, pinDiameter , pinDiameter, 6, 1, scene);
//   // Disable it so it won't show
//   mainPin.setEnabled(false);
//   return pinPositions.map(function (positionInSpace, idx) {
//     var pin = new BABYLON.InstancedMesh("pin-" + idx, mainPin);
//     pin.position = positionInSpace;
//     return pin;
//   });
// }
// var canInput = true;

// var strengthCounter = 5;
// var counterUp = function() {
//   strengthCounter += 0.5;
// }


// var ballStartPosition = new BABYLON.Vector3(0, 0, 0);
// function throwBallWithStength(scene,ball,floor){
// // This function will be called on pointer-down events.
// scene.onPointerDown = function(evt, pickInfo) {
//   if(!canInput){
//     return;
//   }
//   // Start increasing the strength counter. 
//   scene.registerBeforeRender(counterUp);
// }
// // This function will be called on pointer-up events.
// scene.onPointerUp = function(evt, pickInfo) {
  
//   if(!canInput){
//     return;
//   }
//   canInput = false;
//   // Stop increasing the strength counter. 
//   scene.unregisterBeforeRender(counterUp);
//   // Calculate throw direction. 
//   var direction = pickInfo.pickedPoint.subtract(ball.position).normalize();
//   // Impulse is multiplied with the strength counter with max value of 25.
//   var impulse = direction.scale(Math.min(strengthCounter, 25));
//   // Apply the impulse.
//   ball.applyImpulse(impulse, ball.getAbsolutePosition());
//   // Register a function that will run before each render call 
//   scene.registerBeforeRender(function ballCheck() {
//     if (ball.intersectsMesh(floor, false)) {
//       // The ball intersects with the floor, stop checking its position.  
//       scene.unregisterBeforeRender(ballCheck);
//       // Let the ball roll around for 1.5 seconds before resetting it. 
//       setTimeout(function() {
//         resetBall(ball, ballStartPosition);
//       }, 1500);
//     }
//   });
//   strengthCounter = 5;
// }
// }

// function resetBall(ball, ballStartPosition) {

//   ball.position = ballStartPosition;
//   ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0)); 
//   ball.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
//   console.log("ball start: ",ballStartPosition);
//   canInput = true;
// }

// function enableCameraCollision(camera, scene) {
//   // Enable gravity on the scene. Should be similar to earth's gravity. 
//   scene.gravity = new BABYLON.Vector3(0, -0.98, 0);
//   // Enable collisions globally. 
//   scene.collisionsEnabled = true;
//   // Enable collision detection and gravity on the free camera. 
//   camera.checkCollisions = true;
//   camera.applyGravity = true;
//   // Set the player size, the camera's ellipsoid. 
//   camera.ellipsoid = new BABYLON.Vector3(0.4, 0.8, 0.4);
// }
// function enableMeshesCollision(meshes) {
//   meshes.forEach(function (mesh) {
//     mesh.checkCollisions = true;
//   });
// }
// const createScene = async () => {
//   const scene = new BABYLON.Scene(engine);
//   //scene.createDefaultCameraOrLight(true, false, true);
//   // Create the main player camera


//   let floor = createFloor(scene);
//   let lane = createLane(scene);
//   let pins = createPins(scene);
//   var ball = BABYLON.Mesh.CreateSphere("sphere", 12, 0.22, scene);
//   ballStartPosition = new BABYLON.Vector3(0, 0.11 + 0.1, 3);
//   ball.position = ballStartPosition
//   enableMeshesCollision([floor, lane, ball]);
//   //scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), new BABYLON.OimoJSPlugin());

//   var gravityVector = new BABYLON.Vector3(0, -9.81, 0);

//   var physicsPlugin = new BABYLON.CannonJSPlugin();
//   scene.enablePhysics(gravityVector, physicsPlugin);

// var restituion = 0.3;
// var friction = 0.1;
// var angularDamping = 0.5
//   ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: restituion,friction:friction }, scene);
//   floor.physicsImpostor = new BABYLON.PhysicsImpostor(floor, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: restituion,friction:friction,angularDamping:angularDamping }, scene);
//   lane.physicsImpostor = new BABYLON.PhysicsImpostor(lane, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: restituion,friction:friction,angularDamping:angularDamping }, scene);

//   //ball.applyImpulse(new BABYLON.Vector3(0, 0, 20), ball.getAbsolutePosition());

//   throwBallWithStength(scene,ball,floor);


//   pins.forEach(function (pin) {
//     pin.physicsImpostor = new BABYLON.PhysicsImpostor(pin, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1, restitution: restituion,friction:friction,angularDamping:angularDamping}, scene);

//   });

//   var light = createLight(scene);
//   var camera = createFreeCamera(scene);
//   enableCameraCollision(camera, scene)
//   // Attach the control from the canvas' user input
//   camera.attachControl(engine.getRenderingCanvas());
//   camera.setTarget(new BABYLON.Vector3(0, 0, 10));
//   camera.inputs.clear(); // 清除所有输入，禁止相机移动
//   // Set the camera to be the main active camera
//   scene.activeCamera = camera;

// scene.onKeyboardObservable
// var atmosphere = new BABYLON.Sound("Ambient", "DivKid.mp3", scene, null, {
//     loop: true,
//     autoplay: true
//   });
  

  
//   var scoreTexture = new BABYLON.DynamicTexture("scoreTexture", 512, scene, true);
// var scoreboard = BABYLON.Mesh.CreatePlane("scoreboard", 5, scene);
// // Position the scoreboard after the lane.
// scoreboard.position.z = 40;
// // Create a material for the scoreboard.
// scoreboard.material = new BABYLON.StandardMaterial("scoradboardMat", scene);
// // Set the diffuse texture to be the dynamic texture.
// scoreboard.material.diffuseColor = new BABYLON.Color3(1,1,1);
//   var score = 0;
//   score = 0;
//   // Clear the dynamic texture and draw a welcome string.
//   scoreTexture.clear();
//   scoreTexture.drawText("welcome!", 120, 100, "bold 72px Arial", "white", "black");
// scene.registerBeforeRender(function() {
//   var newScore = 10 - checkPins(pins, lane);
//   if (newScore != score) {
//     score = newScore;
//     // Clear the canvas. 
//     scoreTexture.clear();
//     // Draw the text using a white font on black background.
//     scoreTexture.drawText(score + " pins down", 40, 100,
//       "bold 72px Arial", "white", "black");
//   }

//   const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
//   const button = GUI.Button.CreateImageButton("but", "Restart",'cats.png');
//   button.width = '200px'
//   button.height = '50px'
//   button.color = "white";
//   button.background = "green";
//   button.onPointerUpObservable.add(() => {
//     reloadScene()
//   });
//   advancedTexture.addControl(button);
//   //advancedTexture.addControl(scoreTexture);
// });
//   return scene;
// };
// function withinEpsilon(a, b, epsilon) {
//   return Math.abs(a - b) <= epsilon;
// }
// function checkPins(pins) {
//   var pinsStanding = 0;
//   pins.forEach(function(pin, idx) {
//     // Is the pin still standing on top of the lane?
//     if (withinEpsilon(0.3, pin.position.y, 0.01)) {
//       pinsStanding++;
//     }
//   });
//   return pinsStanding;
// }
// var scene = await createScene();
// engine.runRenderLoop(() => {
//   scene.render();
// });
// window.addEventListener("resize", () => {
//   engine.resize();
// });
// window.addEventListener("keydown", function(event) {
//   if (event.key === "r" || event.key === "R") {
//       reloadScene();
//   }
// });

// function createHud(){
//   var scoreTexture = new BABYLON.DynamicTexture("scoreTexture", 512, scene, true);
// var scoreboard = BABYLON.Mesh.CreatePlane("scoreboard", 5, scene);
// // Position the scoreboard after the lane.
// scoreboard.position.z = 40;
// // Create a material for the scoreboard.
// scoreboard.material = new BABYLON.StandardMaterial("scoradboardMat", scene);
// // Set the diffuse texture to be the dynamic texture.
// scoreboard.material.diffuseTexture = scoreTexture;
// }
// async function reloadScene() {
//   // 销毁当前场景
//   scene.dispose();
// canInput = true;
//   // 创建并加载新场景
//   scene = await createScene();
//   engine.runRenderLoop(() => {
//       scene.render();
//   });
// }
// // Inspector.Show(scene, {

// // });