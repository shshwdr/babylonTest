
const RADIUS_SCALE =0.2
const RADIUS_Origin =0.4
export const GameSettings = {
    boxSize: 10,
    fruitData: [
        { name: "1", radius: RADIUS_Origin+0 * RADIUS_SCALE, score: 1 },
        { name: "2", radius:  RADIUS_Origin+1 * RADIUS_SCALE, score: 2 },
        { name: "3", radius:  RADIUS_Origin+2 * RADIUS_SCALE, score: 3 },
        { name: "4", radius:  RADIUS_Origin+3 * RADIUS_SCALE, score: 4 },
        { name: "5", radius:  RADIUS_Origin+4 * RADIUS_SCALE, score: 5},
        { name: "6", radius:  RADIUS_Origin+5 * RADIUS_SCALE, score: 6 },
        { name: "7", radius:  RADIUS_Origin+6 * RADIUS_SCALE, score: 7 },


        //keep going
        { name: "8", radius:  RADIUS_Origin+7 * RADIUS_SCALE, score: 8 },
        { name: "9", radius:  RADIUS_Origin+8 * RADIUS_SCALE, score: 9 },
        { name: "10", radius:  RADIUS_Origin+9 * RADIUS_SCALE, score: 10},




    ],
    getFruitInfo(name: string) {
        return this.fruitData.find(f => f.name === name)!;
    },
    nextFruit(name: string) {
        const i = this.fruitData.findIndex(f => f.name === name);
        return this.fruitData[i + 1] || null;
    }
};
