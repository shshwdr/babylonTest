// ComponentSystem.ts
import * as BABYLON from "@babylonjs/core";

// 所有组件的基类
export abstract class Component {
    constructor(public readonly owner: BABYLON.TransformNode) {}
    update?(deltaTime: number): void;
    destroy?(): void;
}

// 使用 WeakMap 维护每个 node 挂载的组件
const componentMap = new WeakMap<BABYLON.TransformNode, Map<Function, Component>>();

export function addComponent<T extends Component>(node: BABYLON.TransformNode, component: T): T {
    let map = componentMap.get(node);
    if (!map) {
        map = new Map();
        componentMap.set(node, map);
    }
    map.set(component.constructor, component);
    return component;
}

export function getComponent<T extends Component>(node: BABYLON.TransformNode, type: new (...args: any[]) => T): T | undefined {
    const map = componentMap.get(node);
    return map?.get(type) as T | undefined;
}

export function removeComponent<T extends Component>(node: BABYLON.TransformNode, type: new (...args: any[]) => T): void {
    const map = componentMap.get(node);
    map?.delete(type);
}

export function getAllComponents(node: BABYLON.TransformNode): Component[] {
    return Array.from(componentMap.get(node)?.values() ?? []);
}

// 可选：统一 update 调度器（类似 Unity Update）
export class ComponentUpdateManager {
    private static instance: ComponentUpdateManager;
    private updatables = new Set<Component>();

    static getInstance(): ComponentUpdateManager {
        if (!this.instance) this.instance = new ComponentUpdateManager();
        return this.instance;
    }

    register(component: Component): void {
        if (component.update) this.updatables.add(component);
    }

    unregister(component: Component): void {
        this.updatables.delete(component);
    }

    public update(deltaTime: number) {
        if (this.paused) return;
        this.updatables.forEach(c => c.update?.(deltaTime));
      }
      public clear(): void {
        this.updatables.clear();
        this.paused = false;
      }
    private paused = false;

public pause() {
  this.paused = true;
}

public resume() {
  this.paused = false;
}

}

// 用法示例：
// const go = new BABYLON.TransformNode("enemy", scene);
// addComponent(go, new HPComponent(go, 100, onDeath));
// const hp = getComponent(go, HPComponent);
// hp?.takeDamage(10);
