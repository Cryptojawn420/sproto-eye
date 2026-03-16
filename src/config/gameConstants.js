// Game configuration and constants
export const CHARACTERS = [
  { name: "CryptoJawn" },
  { name: "Chode" },
  { name: "VMU" },
  { name: "Keemie" },
  { name: "Bama" },
];

export const CHARACTER_IMAGES = [
  'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/D87AEBB5-6B61-4B72-9D0E-26338F13128D_1_105_c.jpeg',
  'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/3A270C1C-2FB0-4D58-AF37-B384A7303CF5_1_105_c.jpeg',
  'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/5E40F012-943B-45B0-8F04-FFDD1D34FDF5.jpeg',
  'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/3C1BE185-9318-46E1-84E6-E129125B0E6D_1_105_c.jpeg',
  'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/2C99BF23-2F44-4E68-8C93-24A30E19C29B.jpeg',
];

export const VICTORY_IMAGE = 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/E68F483C-AF84-4244-9AE9-1F7AA1F253E1_1_105_c.jpeg';
export const GAMEOVER_IMAGE = 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/97E96CCC-76C0-4C08-BCB3-983DF9EEB7D5_1_105_c.jpeg';

export const WEAPONS = [
  { name: "PISTOL", max: 50, dmg: 22, rate: 220, col: "#FFD700" },
  {
    name: "SHOTGUN",
    max: 16,
    dmg: 30,
    rate: 600,
    col: "#FF6633",
    pellets: 5,
  },
  { name: "SMG", max: 100, dmg: 10, rate: 80, col: "#00DDDD" },
  { name: "ROCKET", max: 8, dmg: 120, rate: 900, col: "#FF3333" },
  { name: "WAND", max: 40, dmg: 45, rate: 400, col: "#AA44FF" },
];

export const DIFFICULTIES = {
  easy: {
    hpMult: 1,
    spdMult: 1,
    countMult: 1,
    bossHP: 800,
    dmgMult: 1,
    goalZ: -380,
    goalX: 35,
  },
  sproto: {
    hpMult: 1.5,
    spdMult: 1.3,
    countMult: 1.6,
    bossHP: 1200,
    dmgMult: 1.4,
    goalZ: -420,
    goalX: -40,
  },
  endgame: {
    hpMult: 2.2,
    spdMult: 1.7,
    countMult: 2.5,
    bossHP: 2000,
    dmgMult: 2,
    goalZ: -480,
    goalX: 45,
  },
};

export const SUPABASE_CONFIG = {
  url: "https://hcvpcpapntythljlxxdw.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdnBjcGFwbnR5dGhsamx4eGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTk2NDUsImV4cCI6MjA4ODY3NTY0NX0.dSTswkdQk6Cy9iMgb5NG_7wfpN9X1Uv-qze-l_wEXkw",
};

export const HAND_COLORS = [0x3355cc, 0xffdd44, 0x3366cc, 0x3366cc, 0xffdd44];
