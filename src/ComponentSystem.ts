// ComponentSystem.ts
import * as BABYLON from "@babylonjs/core";

// 所有组件的基类
export abstract class Component {
    constructor(public readonly owner: BABYLON.TransformNode) {}
    update?(deltaTime: number): void;
    destroy?(): void;
    awake?(): void;
start?(): void;
public readonly uuid = crypto.randomUUID();
}

export function destroyNode(node: BABYLON.TransformNode) {
  const comps = componentMap.get(node);
  comps?.forEach(list => list.forEach(c => c.destroy?.()));
  componentMap.delete(node);
  node.dispose();
}
// 使用 WeakMap 维护每个 node 挂载的组件
// 原来的不可枚举
//const componentMap = new WeakMap<BABYLON.TransformNode, Map<Function, Component[]>>();

// ✅ 改成 Map 就可以使用 .entries()
const componentMap = new Map<BABYLON.TransformNode, Map<Function, Component[]>>();

export function addComponent<T extends Component>(node: BABYLON.TransformNode, component: T): T {
    let map = componentMap.get(node);
    if (!map) {
        map = new Map();
        componentMap.set(node, map);
    }

    const type = component.constructor;
    if (!map.has(type)) {
        map.set(type, []);
    }
    map.get(type)!.push(component);

    if ((component as any).awake) component.awake?.();
ComponentUpdateManager.getInstance().register(component);
setTimeout(() => component.start?.(), 0); // 或使用 requestAnimationFrame

    return component;
}

export function getComponent<T extends Component>(
    node: BABYLON.TransformNode,
    type: new (...args: any[]) => T
  ): T | undefined {
    const map = componentMap.get(node);
    const components = map?.get(type) as T[] | undefined;
    return components?.[0];
  }
  

  export function removeComponent<T extends Component>(
    node: BABYLON.TransformNode,
    type: new (...args: any[]) => T
  ): void {
    const map = componentMap.get(node);
    const components = map?.get(type);
    if (components) {
      components.forEach(c => {
        ComponentUpdateManager.getInstance().unregister(c); // ⛳️ 这一行必须有！
        c.destroy?.();
      });
      map!.delete(type);
    }
  }
  

export function getAllComponents<T extends Component>(
    node: BABYLON.TransformNode,
    type: new (...args: any[]) => T
): T[] {
    const map = componentMap.get(node);
    return (map?.get(type) as T[]) ?? [];
}

export function getAllComponentsOfType<T extends Component>(
  type: new (...args: any[]) => T
): T[] {
  const result: T[] = [];
  for (const [node, compMap] of componentMap.entries()) {
    const comps = compMap.get(type);
    if (comps) result.push(...(comps as T[]));
  }
  return result;
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
