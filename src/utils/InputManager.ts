type Vec2 = { x: number; y: number };

export type TapCallback = (pos: Vec2) => void;
export type SwipeCallback = (direction: "up" | "down" | "left" | "right", distance: number) => void;
export type LongPressCallback = (pos: Vec2) => void;

export class InputManager {
  private static canvas: HTMLCanvasElement;
  private static tapListeners = new Set<TapCallback>();
  private static swipeListeners = new Set<SwipeCallback>();
  private static longPressListeners = new Set<LongPressCallback>();

  // 内部状态
  private static touchStartPos: Vec2 | null = null;
  private static touchStartTime: number = 0;
  private static longPressTimeout: number | null = null;

  static init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // 触屏事件
    canvas.addEventListener("touchstart", this.handleTouchStart, false);
    canvas.addEventListener("touchend", this.handleTouchEnd, false);
    canvas.addEventListener("touchmove", this.handleTouchMove, false);

    // PC 模拟
    canvas.addEventListener("mousedown", this.handleMouseDown, false);
    canvas.addEventListener("mouseup", this.handleMouseUp, false);
  }

  // 注册监听
  static onTap(cb: TapCallback) {
    this.tapListeners.add(cb);
  }

  static onSwipe(cb: SwipeCallback) {
    this.swipeListeners.add(cb);
  }

  static onLongPress(cb: LongPressCallback) {
    this.longPressListeners.add(cb);
  }

  static clear() {
    this.tapListeners.clear();
    this.swipeListeners.clear();
    this.longPressListeners.clear();
  }

  // 内部处理函数
  private static getTouchPos(e: TouchEvent | MouseEvent): Vec2 {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e instanceof TouchEvent ? e.touches[0]?.clientX : e.clientX) - rect.left;
    const y = (e instanceof TouchEvent ? e.touches[0]?.clientY : e.clientY) - rect.top;
    return { x, y };
  }

  private static handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    this.touchStartPos = this.getTouchPos(e);
    this.touchStartTime = performance.now();

    // 长按判断
    this.longPressTimeout = window.setTimeout(() => {
      if (this.touchStartPos) {
        for (const cb of this.longPressListeners) cb(this.touchStartPos);
      }
    }, 600); // ms 可调整
  };

  private static handleTouchEnd = (e: TouchEvent) => {
    const endPos = this.getTouchPos(e);
    const startPos = this.touchStartPos;
    const deltaTime = performance.now() - this.touchStartTime;

    window.clearTimeout(this.longPressTimeout!);

    if (startPos) {
      const dx = endPos.x - startPos.x;
      const dy = endPos.y - startPos.y;
      const dist = Math.hypot(dx, dy);

      if (deltaTime < 500 && dist < 10) {
        // tap
        for (const cb of this.tapListeners) cb(endPos);
      } else if (dist >= 20 && deltaTime < 1000) {
        // swipe
        const isHorizontal = Math.abs(dx) > Math.abs(dy);
        const dir: "up" | "down" | "left" | "right" = isHorizontal
          ? dx > 0 ? "right" : "left"
          : dy > 0 ? "down" : "up";

        for (const cb of this.swipeListeners) cb(dir, dist);
      }
    }

    this.touchStartPos = null;
  };

  private static handleTouchMove = (e: TouchEvent) => {
    // 你可以在这里做 joystick 检测等
  };

  private static handleMouseDown = (e: MouseEvent) => {
    this.touchStartPos = this.getTouchPos(e);
    this.touchStartTime = performance.now();

    this.longPressTimeout = window.setTimeout(() => {
      if (this.touchStartPos) {
        for (const cb of this.longPressListeners) cb(this.touchStartPos);
      }
    }, 600);
  };

  private static handleMouseUp = (e: MouseEvent) => {
    const endPos = this.getTouchPos(e);
    const startPos = this.touchStartPos;
    const deltaTime = performance.now() - this.touchStartTime;

    window.clearTimeout(this.longPressTimeout!);

    if (startPos) {
      const dx = endPos.x - startPos.x;
      const dy = endPos.y - startPos.y;
      const dist = Math.hypot(dx, dy);

      if (deltaTime < 500 && dist < 10) {
        for (const cb of this.tapListeners) cb(endPos);
      } else if (dist >= 20 && deltaTime < 1000) {
        const isHorizontal = Math.abs(dx) > Math.abs(dy);
        const dir: "up" | "down" | "left" | "right" = isHorizontal
          ? dx > 0 ? "right" : "left"
          : dy > 0 ? "down" : "up";

        for (const cb of this.swipeListeners) cb(dir, dist);
      }
    }

    this.touchStartPos = null;
  };
}
