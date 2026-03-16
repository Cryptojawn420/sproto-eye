// Game state management - all game data in one place
export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    // Player state
    this.player = {
      hp: 100,
      armor: 0,
      position: { x: 0, y: 1.6, z: 0 },
      yaw: Math.PI,
      pitch: 0,
      health: 100,
      maxHealth: 100,
    };

    // Weapon state
    this.weapon = {
      currentIdx: 0,
      ammo: [50, 16, 100, 8, 40],
      lastShot: 0,
      cooldown: 0,
    };

    // Game status
    this.game = {
      screen: "menu", // menu, charselect, diffselect, playing, gameOver, victory
      difficulty: "easy",
      characterIdx: 0,
      zone: "start",
      score: 0,
      kills: 0,
      lastHurt: 0,
      isPaused: false,
    };

    // Boss state
    this.boss = {
      active: false,
      hp: 0,
      maxHp: 800,
      spawned: false,
      dead: false,
    };

    // Level state
    this.level = {
      goalActive: false,
      goalPosition: { x: 35, z: -380 },
      hasGoal: false,
      spawnedZones: {
        start: false,
        mid: false,
        corridor: false,
        boss: false,
        exit: false,
        greenhill: false,
      },
    };

    // Entities
    this.entities = {
      enemies: [],
      pickups: [],
      projectiles: [],
      particles: [],
    };

    // Auth/Leaderboard
    this.auth = {
      user: null,
      username: "",
      authenticated: false,
      authError: "",
    };

    this.leaderboard = [];
  }

  setState(key, value) {
    // Deep merge for nested objects
    if (typeof this[key] === "object" && this[key] !== null) {
      this[key] = { ...this[key], ...value };
    } else {
      this[key] = value;
    }
  }

  // Player methods
  damagePlayer(amount) {
    const armorDamage = Math.min(this.player.armor, amount);
    const healthDamage = amount - armorDamage;
    this.player.armor = Math.max(0, this.player.armor - armorDamage);
    this.player.hp = Math.max(0, this.player.hp - healthDamage);
    this.game.lastHurt = Date.now();
    return this.player.hp <= 0;
  }

  healPlayer(amount) {
    this.player.hp = Math.min(this.player.maxHealth, this.player.hp + amount);
  }

  addArmor(amount) {
    this.player.armor += amount;
  }

  // Weapon methods
  useWeapon(weaponIdx) {
    this.weapon.currentIdx = weaponIdx;
    this.weapon.lastShot = 0;
  }

  consumeAmmo(amount = 1) {
    this.weapon.ammo[this.weapon.currentIdx] -= amount;
    return this.weapon.ammo[this.weapon.currentIdx] >= 0;
  }

  addAmmo(weaponIdx, amount) {
    this.weapon.ammo[weaponIdx] += amount;
  }

  // Entity methods
  addEnemy(enemy) {
    this.entities.enemies.push(enemy);
  }

  removeEnemy(idx) {
    this.entities.enemies.splice(idx, 1);
  }

  addProjectile(projectile) {
    this.entities.projectiles.push(projectile);
  }

  removeProjectile(idx) {
    this.entities.projectiles.splice(idx, 1);
  }

  addPickup(pickup) {
    this.entities.pickups.push(pickup);
  }

  removePickup(idx) {
    this.entities.pickups.splice(idx, 1);
  }

  addParticle(particle) {
    this.entities.particles.push(particle);
  }

  // Score methods
  addScore(amount) {
    this.game.score += amount;
  }

  addKill() {
    this.game.kills += 1;
    this.addScore(10);
  }

  // Zone methods
  moveToZone(zoneName) {
    this.game.zone = zoneName;
    if (!this.level.spawnedZones[zoneName]) {
      this.level.spawnedZones[zoneName] = true;
    }
  }

  // Screen methods
  setScreen(screenName) {
    this.game.screen = screenName;
  }

  // Boss methods
  activateBoss(maxHp) {
    this.boss.active = true;
    this.boss.hp = maxHp;
    this.boss.maxHp = maxHp;
    this.boss.spawned = true;
  }

  damageBoss(amount) {
    this.boss.hp = Math.max(0, this.boss.hp - amount);
    return this.boss.hp <= 0;
  }

  // Goal methods
  activateGoal(x, z) {
    this.level.goalActive = true;
    this.level.goalPosition = { x, z };
  }

  claimGoal() {
    this.level.hasGoal = true;
    this.game.score += 500;
  }

  // Export for debugging
  toJSON() {
    return JSON.stringify(this, null, 2);
  }
}

export const gameState = new GameState();
