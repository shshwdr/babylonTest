import * as BABYLON from "@babylonjs/core";
import { Component, ComponentUpdateManager, addComponent, getComponent } from "../ComponentSystem";
import { EnemyManager } from "../EnemyManager";
import { AttachHitBox } from "../General/Function/AttachHitBox";
import { EnemyComponent } from "../Enemy/EnemyComponent";
import { HPComponent } from "../HPComponent";
import { PlayerComponent } from "../Player/PlayerComponent";

export class FireballComponent extends Component {
    private interval: number;
    private timer: number = 0;
    private damage: number;
    private speed: number;
    private scene: BABYLON.Scene;
    private player: PlayerComponent;
    private fireballSize: number;

    constructor(
        owner: BABYLON.TransformNode,
        player: PlayerComponent,
        scene: BABYLON.Scene,
        interval: number = 3.0, // Seconds between fireballs
        damage: number = 5,
        speed: number = 10,
        fireballSize: number = 0.5
    ) {
        super(owner);
        this.interval = interval;
        this.damage = damage;
        this.speed = speed;
        this.scene = scene;
        this.player = player;
        this.fireballSize = fireballSize;

        ComponentUpdateManager.getInstance().register(this);
    }

    public update(deltaTime: number): void {
        this.timer += deltaTime;
        
        if (this.timer >= this.interval) {
            this.createFireball();
            this.timer = 0;
        }
    }

    private createFireball(): void {
        // Get mouse position
        const mousePosition = this.player.getMousePosition();
        if (!mousePosition) return;

        // Calculate direction from player to mouse position
        const playerPosition = this.player.position();
        const direction = mousePosition.subtract(playerPosition);
        direction.y = 0; // Keep fireball on the ground plane
        
        if (direction.length() === 0) return;
        
        direction.normalize();

        // Create fireball node
        const fireball = new BABYLON.TransformNode("fireball", this.scene);
        fireball.position = playerPosition.clone();
        
        // Offset the fireball in front of the player
        const offset = direction.scale(1.5);
        fireball.position.addInPlace(offset);

        // Create the fireball projectile
        this.createFireballProjectile(fireball, direction);
    }

    private createFireballProjectile(fireball: BABYLON.TransformNode, direction: BABYLON.Vector3): void {
        // Create the visual mesh
        const sphere = BABYLON.MeshBuilder.CreateSphere(
            "fireballMesh", 
            { diameter: this.fireballSize * 2 }, 
            this.scene
        );
        sphere.parent = fireball;
        
        // Create material for the fireball
        const fireballMaterial = new BABYLON.StandardMaterial("fireballMaterial", this.scene);
        fireballMaterial.diffuseColor = new BABYLON.Color3(1, 0.3, 0);
        fireballMaterial.emissiveColor = new BABYLON.Color3(1, 0.3, 0);
        sphere.material = fireballMaterial;

        // Add hitbox
        const hitbox = AttachHitBox(
            fireball, 
            new BABYLON.Vector3(this.fireballSize, this.fireballSize, this.fireballSize), 
            this.scene
        );

        // Add particle system for fire effect
        this.createFireParticleSystem(fireball);

        // Add component to handle movement and collision
        addComponent(fireball, new FireballProjectileComponent(
            fireball,
            direction,
            this.speed,
            this.damage,
            hitbox,
            this.scene
        ));
    }

    private createFireParticleSystem(emitter: BABYLON.TransformNode): void {
        const particleSystem = new BABYLON.ParticleSystem("fireballParticles", 100, this.scene);
        
        // Texture
        particleSystem.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
        
        // Emission
        // Use the first child mesh as the emitter (the sphere we created)
        const emitterMesh = emitter.getChildMeshes()[0];
        particleSystem.emitter = emitterMesh;
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);
        
        // Colors
        particleSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1);
        particleSystem.color2 = new BABYLON.Color4(1, 0.2, 0, 1);
        particleSystem.colorDead = new BABYLON.Color4(0.7, 0, 0, 0);
        
        // Size and lifetime
        particleSystem.minSize = 0.2;
        particleSystem.maxSize = 0.5;
        particleSystem.minLifeTime = 0.1;
        particleSystem.maxLifeTime = 0.5;
        
        // Emission rate and power
        particleSystem.emitRate = 50;
        particleSystem.minEmitPower = 0.5;
        particleSystem.maxEmitPower = 1.5;
        
        // Direction and gravity
        particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
        particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
        particleSystem.gravity = new BABYLON.Vector3(0, -1, 0);
        
        // Blending
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
        
        // Start the particle system
        particleSystem.start();
    }

    public destroy(): void {
        ComponentUpdateManager.getInstance().unregister(this);
    }
}

// Helper component to handle individual fireball projectile behavior
class FireballProjectileComponent extends Component {
    private direction: BABYLON.Vector3;
    private speed: number;
    private damage: number;
    private hitbox: BABYLON.Mesh;
    private scene: BABYLON.Scene;
    private timeAlive: number = 0;
    private maxLifeTime: number = 5; // Maximum lifetime in seconds
    private rotationAxis: BABYLON.Vector3;
    private rotationSpeed: number = 5; // Rotation speed

    constructor(
        owner: BABYLON.TransformNode,
        direction: BABYLON.Vector3,
        speed: number,
        damage: number,
        hitbox: BABYLON.Mesh,
        scene: BABYLON.Scene
    ) {
        super(owner);
        this.direction = direction;
        this.speed = speed;
        this.damage = damage;
        this.hitbox = hitbox;
        this.scene = scene;
        
        // Create a rotation axis perpendicular to the direction of movement
        this.rotationAxis = BABYLON.Vector3.Cross(
            this.direction, 
            new BABYLON.Vector3(0, 1, 0)
        );
        if (this.rotationAxis.length() === 0) {
            // If direction is parallel to up vector, use a different axis
            this.rotationAxis = new BABYLON.Vector3(1, 0, 0);
        }
        this.rotationAxis.normalize();

        ComponentUpdateManager.getInstance().register(this);
    }

    public update(deltaTime: number): void {
        // Move the fireball
        this.owner.position.addInPlace(this.direction.scale(this.speed * deltaTime));
        
        // Rotate the fireball to simulate rolling
        const rotationAmount = this.speed * this.rotationSpeed * deltaTime;
        const rotation = BABYLON.Quaternion.RotationAxis(this.rotationAxis, rotationAmount);
        
        // Apply rotation to the fireball mesh (first child of the owner)
        if (this.owner.getChildMeshes().length > 0) {
            const fireballMesh = this.owner.getChildMeshes()[0];
            if (!fireballMesh.rotationQuaternion) {
                fireballMesh.rotationQuaternion = BABYLON.Quaternion.Identity();
            }
            const currentRotation = fireballMesh.rotationQuaternion.clone();
            rotation.multiplyToRef(currentRotation, fireballMesh.rotationQuaternion);
        }
        
        // Check for collisions with enemies
        this.checkCollision();
        
        // Update lifetime and destroy if too old
        this.timeAlive += deltaTime;
        if (this.timeAlive >= this.maxLifeTime) {
            this.destroy();
        }
    }

    private checkCollision(): void {
        EnemyManager.getInstance().getAllEnemies().forEach((enemy) => {
            const enemyComponent = getComponent<EnemyComponent>(enemy, EnemyComponent);
            const hpComponent = getComponent<HPComponent>(enemy, HPComponent);
            
            const enemyHitbox = enemyComponent?.hitbox;
            
            if (enemyHitbox && this.hitbox.intersectsMesh(enemyHitbox, false)) {
                hpComponent?.takeDamage?.(this.damage);
                this.destroy();
            }
        });
    }

    public destroy(): void {
        this.owner.dispose();
        ComponentUpdateManager.getInstance().unregister(this);
    }
}
