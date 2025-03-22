import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { HPComponent } from "./HPComponent";
import { EnemyComponent } from "./EnemyComponent";
import { EnemyDamageComponent } from "./EnemyDamageComponent";
import { EnemyManager } from "./EnemyManager";
import { CreateHealthBar } from "./CreateHealthBar";
import {
    getAllComponents,
    addComponent,
    ComponentUpdateManager,
    Component
} from "./ComponentSystem";

export class EnemySpawnComponent extends Component {
    private lastSpawnTime = 0;

    constructor(
        owner: BABYLON.TransformNode,
        private scene: BABYLON.Scene,
        private interval: number
    ) {
        super(owner);
        ComponentUpdateManager.getInstance().register(this);
    }

    public update(deltaTime: number): void {
        this.lastSpawnTime += deltaTime;
        if (this.lastSpawnTime >= this.interval) {
            this.lastSpawnTime = 0;
            this.spawnEnemy();
        }
    }

    private spawnEnemy(): void {
        const distance = 100;
        const randomX = Math.random() * distance - distance / 2;
        const randomZ = Math.random() * distance - distance / 2;

        BABYLON.SceneLoader.ImportMesh("", "./GLB format/", "character-female-b.glb", this.scene, (meshes) => {
            const enemyMesh = meshes[0];
            enemyMesh.position = new BABYLON.Vector3(randomX, 0, randomZ);
            enemyMesh.computeWorldMatrix(true);

            addComponent(enemyMesh, new EnemyComponent(enemyMesh, (this.scene as any).player.owner, 4, this.scene));
            addComponent(enemyMesh, new EnemyDamageComponent(enemyMesh, (this.scene as any).player, this.scene, 1));
            const healthBar = CreateHealthBar(this.scene, enemyMesh, "red");

            addComponent(enemyMesh, new HPComponent(enemyMesh, 10, () => {
                console.log("Enemy died!");
                this.destroyEnemy(enemyMesh);
            }, healthBar));

            EnemyManager.getInstance().addEnemy(enemyMesh);
        });
    }

    private destroyEnemy(enemyMesh: BABYLON.TransformNode): void {
        getAllComponents(enemyMesh).forEach(c => c.destroy?.());
        enemyMesh.dispose();
        EnemyManager.getInstance().removeEnemy(enemyMesh);
    }

    public destroy(): void {
        ComponentUpdateManager.getInstance().unregister(this);
    }
}