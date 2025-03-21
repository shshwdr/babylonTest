
import { UpdateManager } from "./UpdateManager.js";
import { BulletComponent } from "./BulletComponent";
export class AttackComponent {
    constructor(player, interval) {
        this.player = player;
        this.interval = interval;
        this.lastAttackTime = 0;
                UpdateManager.getInstance().register(this);
    }

    update(deltaTime) {
        this.lastAttackTime += deltaTime;
        if (this.lastAttackTime >= this.interval) {
            this.lastAttackTime = 0;
            this.attack();
        }
    }

    attack() {
        // 获取玩家当前的方向
        const mousePos = this.player.getMousePosition();
        const direction = this.calculateDirection(mousePos);
        
        // 创建一个子弹并发射
        const bulletNode = new BABYLON.TransformNode("bulletNode", this.player.scene);  // 创建空节点
        new BulletComponent(bulletNode, direction, 5,this.player,this.player.scene);

        bulletNode.position = this.player.mesh.position.clone().add(new BABYLON.Vector3(0, 0.5, 0));;
       // const bullet = new Bullet(this.player.position, direction);
       // this.player.scene.add(bullet);
    }

    calculateDirection(mousePos) {
        if(mousePos){

        // 计算玩家位置到鼠标位置的方向
        const direction = new BABYLON.Vector3(
            mousePos.x - this.player.position().x,  // 计算 x 方向
            0,                                      // 保持 y 坐标一致
            mousePos.z - this.player.position().z   // 计算 z 方向
        );
    
        //console.log("direction2 ",direction);
        return direction.normalize();  // 归一化方向向量
        }
    }
    
}
