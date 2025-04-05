
const RADIUS_SCALE =0.3
export const GameSettings = {
    boxSize: 10,
    fruitData: [
        { name: "0", radius: 1 * RADIUS_SCALE, score: 1 },
        { name: "1", radius: 2 * RADIUS_SCALE, score: 2 },
        { name: "2", radius: 3 * RADIUS_SCALE, score: 3 },
        { name: "3", radius: 4 * RADIUS_SCALE, score: 4 },
        { name: "4", radius: 5 * RADIUS_SCALE, score: 5 },
        { name: "5", radius: 6 * RADIUS_SCALE, score: 6 },
        { name: "6", radius: 7 * RADIUS_SCALE, score: 7 },
        { name: "7", radius: 8 * RADIUS_SCALE, score: 8 },
        { name: "8", radius: 9 * RADIUS_SCALE, score: 9 },
        { name: "9", radius: 10 * RADIUS_SCALE, score: 10 },
    ],
    getFruitInfo(name: string) {
        return this.fruitData.find(f => f.name === name)!;
    },
    nextFruit(name: string) {
        const i = this.fruitData.findIndex(f => f.name === name);
        return this.fruitData[i + 1] || null;
    }
};
