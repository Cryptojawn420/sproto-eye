// Level configuration - easily editable
export const levelData = {
  startZone: {
    floor: {
      width: 160,
      depth: 600,
      color: 0x228b22,
      position: [0, 0, -250],
    },
    checkerboard: {
      startX: -14,
      endX: 14,
      startZ: 18,
      endZ: -80,
      tileSize: 2,
      darkColor: 0x1b6b1b,
    },
    walls: [
      { x: -14, z: -40, w: 2, d: 120, color: 0x8b4513 },
      { x: 14, z: -40, w: 2, d: 120, color: 0x8b4513 },
      { x: 0, z: 20, w: 30, d: 2, color: 0x8b4513 },
    ],
    lights: {
      points: [],
      generate: true, // Generate lights automatically
      spacing: 6,
      startZ: 10,
      endZ: -30,
      color: 0xffffaa,
      intensity: 0.5,
      range: 15,
    },
  },

  corridor: {
    walls: [
      { x: -7, z: -110, w: 2, d: 60, color: 0x2a1a0a },
      { x: 7, z: -110, w: 2, d: 60, color: 0x2a1a0a },
      { x: -12, z: -150, w: 2, d: 30, color: 0x1a0a0a },
      { x: 12, z: -150, w: 2, d: 30, color: 0x1a0a0a },
      { x: -12, z: -164, w: 10, d: 2, color: 0x1a0a0a },
      { x: 12, z: -164, w: 10, d: 2, color: 0x1a0a0a },
    ],
    lights: {
      points: [],
      generate: true,
      positions: [],
      generateLights: function() {
        const lights = [];
        for (let z = -85; z > -135; z -= 15) {
          lights.push({
            x: Math.sin(z * 0.1) * 4,
            z: z,
            color: 0xff4400,
            intensity: 0.4,
            range: 10,
          });
        }
        return lights;
      },
    },
    bossLight: { x: 0, y: 4, z: -150, color: 0xcc4444, intensity: 0.6, range: 25 },
  },

  maze: {
    walls: [
      { x: -5, z: -190, w: 2, d: 50, color: 0x3a2a1a },
      { x: 5, z: -190, w: 2, d: 50, color: 0x3a2a1a },
      { x: 0, z: -216, w: 12, d: 2, color: 0x3a2a1a },
      { x: -5, z: -230, w: 2, d: 30, color: 0x3a2a1a },
      { x: 20, z: -223, w: 32, d: 2, color: 0x3a2a1a },
      { x: 20, z: -237, w: 32, d: 2, color: 0x3a2a1a },
      { x: 35, z: -250, w: 2, d: 28, color: 0x3a2a1a },
      { x: 5, z: -250, w: 2, d: 28, color: 0x3a2a1a },
      { x: 20, z: -265, w: 32, d: 2, color: 0x3a2a1a },
      { x: 35, z: -280, w: 2, d: 32, color: 0x3a2a1a },
      { x: -10, z: -273, w: 32, d: 2, color: 0x3a2a1a },
      { x: -10, z: -287, w: 32, d: 2, color: 0x3a2a1a },
      { x: 35, z: -295, w: 2, d: 20, color: 0x2a1a0a },
      { x: 25, z: -305, w: 22, d: 2, color: 0x2a1a0a },
      { x: -35, z: -295, w: 2, d: 20, color: 0x2a1a0a },
      { x: -25, z: -305, w: 22, d: 2, color: 0x2a1a0a },
      { x: -25, z: -300, w: 2, d: 28, color: 0x3a2a1a },
      { x: -5, z: -300, w: 2, d: 28, color: 0x3a2a1a },
      { x: -15, z: -315, w: 22, d: 2, color: 0x3a2a1a },
      { x: -25, z: -330, w: 2, d: 32, color: 0x3a2a1a },
      { x: 5, z: -330, w: 2, d: 32, color: 0x3a2a1a },
      { x: 20, z: -323, w: 32, d: 2, color: 0x3a2a1a },
      { x: 20, z: -337, w: 32, d: 2, color: 0x3a2a1a },
      { x: 35, z: -350, w: 2, d: 28, color: 0x3a2a1a },
      { x: 5, z: -350, w: 2, d: 28, color: 0x3a2a1a },
    ],
  },

  greenHill: {
    floor: {
      width: 150,
      depth: 200,
      color: 0x33aa33,
      position: [0, 0.02, -420],
    },
    entryWalls: [
      { x: -60, z: -380, w: 2, d: 80, color: 0x228b22 },
      { x: 60, z: -380, w: 2, d: 80, color: 0x228b22 },
      { x: -35, z: -340, w: 52, d: 2, color: 0x228b22 },
      { x: 35, z: -340, w: 52, d: 2, color: 0x228b22 },
    ],
    hills: [
      [-30, -380, 5], [-10, -400, 4], [20, -390, 6], [40, -410, 4],
      [-40, -430, 5], [0, -450, 7], [30, -440, 4], [-20, -460, 5],
      [45, -470, 6], [-45, -480, 4], [15, -485, 5], [-30, -495, 6],
      [35, -500, 4],
    ],
    mazeWalls: [
      { x: -20, z: -390, w: 2, d: 30, color: 0x228b22 },
      { x: 25, z: -400, w: 2, d: 40, color: 0x228b22 },
      { x: -10, z: -430, w: 40, d: 2, color: 0x228b22 },
      { x: 10, z: -450, w: 2, d: 30, color: 0x228b22 },
      { x: -35, z: -460, w: 30, d: 2, color: 0x228b22 },
      { x: 40, z: -470, w: 2, d: 40, color: 0x228b22 },
      { x: -15, z: -480, w: 50, d: 2, color: 0x228b22 },
      { x: 20, z: -490, w: 2, d: 30, color: 0x228b22 },
      { x: -40, z: -500, w: 60, d: 2, color: 0x228b22 },
    ],
    flagHidingWalls: [
      { difficulty: "easy", x: 45, z: -390, w: 30, d: 2, color: 0x228b22 },
      { difficulty: "easy", x: 58, z: -400, w: 2, d: 22, color: 0x228b22 },
      { difficulty: "sproto", x: -55, z: -430, w: 30, d: 2, color: 0x228b22 },
      { difficulty: "sproto", x: -68, z: -445, w: 2, d: 32, color: 0x228b22 },
      { difficulty: "endgame", x: 55, z: -490, w: 30, d: 2, color: 0x228b22 },
      { difficulty: "endgame", x: 68, z: -505, w: 2, d: 32, color: 0x228b22 },
    ],
    boundaryWalls: [
      { x: -75, z: -450, w: 2, d: 200, color: 0x228b22 },
      { x: 75, z: -450, w: 2, d: 200, color: 0x228b22 },
      { x: 0, z: -550, w: 152, d: 2, color: 0x228b22 },
    ],
  },

  buildings: {
    barn: {
      x: -35,
      z: -410,
      baseGeo: [8, 5, 6],
      roofGeo: [5, 3, 4],
      doorGeo: [2, 3, 0.1],
      colors: { base: 0xaa2222, roof: 0x8b4513, door: 0x4a3728 },
    },
    house: {
      x: 35,
      z: -385,
      baseGeo: [6, 4, 5],
      roofGeo: [4.5, 2.5, 4],
      doorGeo: [1.2, 2.2, 0.1],
      colors: { base: 0xf5deb3, roof: 0x654321, door: 0x8b4513 },
    },
    waterTower: {
      x: -50,
      z: -440,
      legRadius: 0.15,
      tankRadius: 2,
      tankHeight: 3,
      totalHeight: 6,
    },
    silo: {
      x: -42,
      z: -415,
      radius: 1.5,
      height: 8,
      roofHeight: 2,
    },
    coop: {
      x: 20,
      z: -470,
      size: [3, 2, 2.5],
    },
    windmill: {
      x: 40,
      z: -420,
      towerRadius: 0.3,
      topRadius: 0.6,
      height: 8,
      blades: 4,
    },
    tractor: {
      x: 15,
      z: -395,
      bodySize: [2, 1.5, 1.5],
      cabSize: [1, 1.2, 1.3],
      wheelBase: 0.7,
    },
  },

  animals: {
    spawns: [
      { type: "cow", x: -15, z: -375 },
      { type: "cow", x: 10, z: -405 },
      { type: "cow", x: -30, z: -455 },
      { type: "cow", x: 25, z: -485 },
      { type: "emu", x: 5, z: -365 },
      { type: "emu", x: -25, z: -425 },
      { type: "emu", x: 35, z: -465 },
      { type: "emu", x: -10, z: -505 },
      { type: "kangaroo", x: 20, z: -375 },
      { type: "kangaroo", x: -40, z: -445 },
      { type: "kangaroo", x: 45, z: -495 },
      { type: "kangaroo", x: 0, z: -515 },
    ],
  },
};

export default levelData;
