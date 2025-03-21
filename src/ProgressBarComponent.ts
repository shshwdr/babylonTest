// --- 2. ProgressBarComponent ---
export class ProgressBarComponent {
    constructor(
        private fillBar: BABYLON.GUI.Rectangle,
        private background: BABYLON.GUI.Rectangle
    ) {}

    update(current: number, max: number) {
        const ratio = Math.max(0, Math.min(1, current / max));
        this.fillBar.width = ratio;
    }
}
