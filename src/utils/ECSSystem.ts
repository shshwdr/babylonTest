// ECS Core in a single file

export type Entity = number;

export type ComponentClass<T> = new (...args: any[]) => T;

export interface System {
  start(world: World): void;
  update(dt: number, world: World): void;
  destroy(world: World): void;
}

export class ComponentStore {
  private components = new Map<ComponentClass<any>, Map<Entity, any[]>>();

  add<T>(entity: Entity, comp: T): void {
    const type = (comp as any).constructor as ComponentClass<T>;
    if (!this.components.has(type)) {
      this.components.set(type, new Map());
    }
    const map = this.components.get(type)!;
    if (!map.has(entity)) {
      map.set(entity, []);
    }
    map.get(entity)!.push(comp);
  }
  

  get<T>(entity: Entity, type: ComponentClass<T>): T | undefined {
    const list = this.components.get(type)?.get(entity);
    return list?.[0];
  }

  getAllOfType<T>(entity: Entity, type: ComponentClass<T>): T[] {
    return this.components.get(type)?.get(entity) ?? [];
  }

  getAllComponentsOfType<T>(type: ComponentClass<T>): Map<Entity, T[]> {
    return this.components.get(type) ?? new Map();
  }

  remove<T>(entity: Entity, type: ComponentClass<T>): void {
    this.components.get(type)?.delete(entity);
  }

  removeAllComponents(entity: Entity): void {
    for (const [type, entityMap] of this.components) {
      entityMap.delete(entity);
    }
  }

  clear(): void {
    this.components.clear();
  }
}


export class World {
  private nextId: number = 0;
  private entityPool: Entity[] = [];
  private aliveEntities = new Set<Entity>();
  public components = new ComponentStore();
  private systems: System[] = [];
  private pendingDestroy: Entity[] = []; // ✅ 延迟销毁队列
  getEntitiesWith(...types: ComponentClass<any>[]): Entity[] {
    return [...this.aliveEntities].filter(e =>
      types.every(type => this.components.getAllOfType(e, type).length > 0)
    );
  }
  createEntity(): Entity {
    const id = this.entityPool.length > 0 ? this.entityPool.pop()! : this.nextId++;
    this.aliveEntities.add(id);
    return id;
  }

  destroyEntity(entity: Entity): void {
    this.aliveEntities.delete(entity);
    this.components.removeAllComponents(entity); // 删除其所有组件
    this.entityPool.push(entity);
  }
  destroyEntityLater(entity: Entity): void {
    this.pendingDestroy.push(entity);
  }

  private flushPendingDestroy(): void {
    for (const e of this.pendingDestroy) {
      this.destroyEntity(e);
    }
    this.pendingDestroy.length = 0;
  }

  isAlive(entity: Entity): boolean {
    return this.aliveEntities.has(entity);
  }

  addSystem(system: System): void {
    system.start?.(this); // 新增支持 start 生命周期
    this.systems.push(system);
  }

  update(dt: number): void {
    for (const system of this.systems) {
      system.update(dt, this);
    }
  }

  destroy(): void {
    for (const system of this.systems) {
      system.destroy?.(this);
    }
    this.systems = [];
    this.components.clear();
    this.aliveEntities.clear();
    this.entityPool = [];
  }
}


export class Reactive<T extends object> {
  private listeners: Set<() => void> = new Set();

  private proxy: T;

  constructor(value: T) {
    this.proxy = new Proxy(value, {
      set: (target, key, newValue) => {
        const oldValue = (target as any)[key];
        if (oldValue !== newValue) {
          (target as any)[key] = newValue;
          this.notify();
        }
        return true;
      }
    });
  }

  get value(): T {
    return this.proxy;
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    for (const fn of this.listeners) {
      fn();
    }
  }
}

type EventHandler = (...args: any[]) => void;

class EventBus {
  private listeners = new Map<string, Set<EventHandler>>();

  on(event: string, handler: EventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler): void {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: string, ...args: any[]): void {
    this.listeners.get(event)?.forEach((handler) => {
      handler(...args);
    });
  }

  once(event: string, handler: EventHandler): void {
    const wrapper = (...args: any[]) => {
      this.off(event, wrapper);
      handler(...args);
    };
    this.on(event, wrapper);
  }

  clear(event?: string) {
    if (event) this.listeners.delete(event);
    else this.listeners.clear();
  }
}

// 导出单例
export const EventBusInstance = new EventBus();
