// import * as BABYLON from "@babylonjs/core";
// import {Inspector, inspector} from "@babylonjs/inspector"
// //import '@babylonjs/loaders/glTF'
// //import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";
// import "@babylonjs/loaders";
// //registerBuiltInLoaders();
// const canvas = document.getElementById("renderCanvas");
// const engine = new BABYLON.Engine(canvas);
// const createScene = async () => {
//   const scene = new BABYLON.Scene(engine);
//   scene.createDefaultCameraOrLight(true, false, true);

//   // scene.createDefaultLight();
//   // const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);
//   // camera.attachControl(canvas, true);
//   // camera.inputs.addMouseWheel();
//   // camera.setTarget(new BABYLON.Vector3(0,0,-20));

//   const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
//     diameter: 2,
//     segments: 5
//   }, scene);

//   const sphereMaterial = new BABYLON.StandardMaterial();
//   sphere.material = sphereMaterial;

//   // sphereMaterial.diffuseTexture = new BABYLON.Texture('/woodTexture.jpg');
//   sphereMaterial.emissiveTexture = new BABYLON.Texture('/cats.png');

//   sphereMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
//   sphereMaterial.specularColor = new BABYLON.Color3(1, 0, 0);

//   sphereMaterial.ambientColor = new BABYLON.Color3(0, 1, 1);
//   scene.ambientColor = new BABYLON.Color3(0, 1, 0.5);

//   sphereMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);

//   sphereMaterial.alpha = 0.2;

//   sphere.position.x = 1;


//   const box = BABYLON.MeshBuilder.CreateBox("box", {
//     width: 2,
//     height: 0.05,
//     depth: 0.5,
//     faceColors: [
//       new BABYLON.Color4(1, 0, 0, 1),
//       BABYLON.Color3.Green()
//     ]
//   }, scene);

//   //box.rotation.x = Math.PI/2;
//   //box.rotation = new BABYLON.Vector3(0, Math.Pi/6,0 );

//   const utilLayer = new BABYLON.UtilityLayerRenderer(scene);
//   const positionGizmo = new BABYLON.PositionGizmo(utilLayer);
//   positionGizmo.attachedMesh = box;

//   // const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
//   // ground.material = new BABYLON.StandardMaterial("ground", scene);
//   // ground.material.wireframe = true;

//   // const groundFromHeightmap = new BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground","heightmap.png",{
//   //   subdivisions:200
//   // })

//   // const fontData = await(await fetch("/Montserrat_Regular.json")).json();
//   // const text = BABYLON.MeshBuilder.CreateText("text","text",fontData,{
//   //   size:2
//   // });

//   // scene.registerBeforeRender(() => {
//   //   sphere.rotation.x += 0.01;
//   //   sphere.rotation.y += 0.01;
//   //   sphere.rotation.z += 0.01;
//   // });

//   // BABYLON.Animation.CreateAndStartAnimation(
//   //   "rotation",
//   //   sphere,
//   //   "rotation.y",
//   //   10,
//   //   100,
//   //   0,
//   //   Math.PI * 2,

//   //   BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
//   //   new BABYLON.BackEase
//   // );

//   const animation = new BABYLON.Animation(
//     "animation",
//     "position.y",
//     10,
//     BABYLON.Animation.ANIMATIONTYPE_FLOAT,
//     BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE

//   );

//   // const animationKeys = [];
//   // animationKeys.push({
//   //   frame: 0,
//   //   value: 0
//   // });

//   // animationKeys.push({
//   //   frame: 100,
//   //   value: 1
//   // });
//   // animation.setKeys(animationKeys);
//   // sphere.animations = [];
//   // sphere.animations.push(animation);
//   // scene.beginAnimation(sphere, 0, 100, true);

//   //const light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 1, 0), scene);

//   const light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, -1, 0), new BABYLON.Vector3(0, 1, 0), Math.PI / 2, 1, scene);


//   scene.onPointerDown = function (evt, pickResult) {
//     if (pickResult.hit) {
//       const mesh = pickResult.pickedMesh;
//       if (mesh.name === "sphere") {
//         sphere.material.diffuseColor = BABYLON.Color3.Red();
//         BABYLON.Animation.CreateAndStartAnimation(
//           "rotation",
//           sphere,
//           "rotation.y",
//           10,
//           100,
//           0,
//           Math.PI * 2,

//           BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
//           new BABYLON.BackEase
//         );
//       }
//     }
//   }
// //await BABYLON.AppendSceneAsync("/Cow.gltf", scene)
//   BABYLON.SceneLoader.ImportMesh("", "/", "Cow.gltf", scene, function (meshes) {

//   });

//   // scene.onPointerDown = function castRay(){
//   //   const hit = scene.pick(scene.pointerX, scene.pointerY);
//   //   if(hit.pickedMesh && hit.pickedMesh.name === "sphere"){
//   //     hit.pickedMesh.material.diffuseColor = BABYLON.Color3.Red();
//   //   }
//   // }
// const bgMusic = new BABYLON.Sound('bgMusic','/DivKid.mp3',scene,null,{
//   loop: true,
//   autoplay: true,
//   volume: 0.5
// })
//   return scene;
// };
// const scene = await createScene();
// engine.runRenderLoop(() => {
//   scene.render();
// });
// window.addEventListener("resize", () => {
//   engine.resize();
// });

// Inspector.Show(scene, {
 
// });