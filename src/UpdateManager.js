export class UpdateManager {
    constructor() {
        if (UpdateManager._instance) {
            return UpdateManager._instance; // 如果已经有实例，就返回它
        }
        this.updatableComponents = []; // 用于存储所有需要更新的组件
        UpdateManager._instance = this; // 设置 Singleton 实例
    }

    // 获取 UpdateManager 实例
    static getInstance() {
        if (!UpdateManager._instance) {
            new UpdateManager(); // 如果实例不存在，创建一个新的实例
        }
        return UpdateManager._instance;
    }

    // 注册一个组件，使其在每帧更新
    register(component) {
        if (component.update && typeof component.update === "function") {
            this.updatableComponents.push(component);
        }
    }

    // 移除一个组件
    unregister(component) {
        const index = this.updatableComponents.indexOf(component);
        if (index > -1) {
            this.updatableComponents.splice(index, 1);
        }
    }

    // 每帧更新时调用，遍历并执行所有更新方法
    update(deltaTime) {
        for (const component of this.updatableComponents) {
            component.update(deltaTime);
        }
    }
}
