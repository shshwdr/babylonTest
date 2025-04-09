export const BarbecueSettings = {
  totalRounds: 8,
  skewerDuration: 0.1, // 签子伸出的动画时长（秒）
  maxSkewerAngle: 30, // 签子最大偏离垂直角度（度）
  foodSpacing: 2.0, // 每个食物间隔（单位世界坐标）
  foodRadius: 0.5, // 食物的半径
  startY: -7, // 签子的起点 y 坐标（底部）
  endY: 5, // 食物排列线在顶端位置附近

  rounds: [
    {count:1,speedRange: [3, 3]},
    { count: 3, speedRange: [3, 3] },
    { count: 4, speedRange: [3, 4] },
    { count: 5, speedRange: [3, 5] },
    { count: 5, speedRange: [3, 5] },
    { count: 6, speedRange: [3, 5] },
    { count: 6, speedRange: [3, 5] },
    { count: 6, speedRange: [3, 5] },
    { count: 6, speedRange: [3, 5] },
  ],

  pointTable: [1, 3, 6, 10, 15, 21],
  ratingTable: [
    { score: 120, label: "SSS" },
    { score: 100, label: "SS" },
    { score: 80, label: "S" },
    { score: 60, label: "A" },
    { score: 50, label: "B" },
    { score: 40, label: "C" },
    { score: 30, label: "D" },
    { score: 20, label: "E" },
    { score: 10, label: "F" },
    { score: 0, label: "Out of Rank" },
  ],

  foodTextures: ["meat.png", "corn.png", "mushroom.png", "fish.png"],
};
