import { WEAPONS } from "../config/gameConstants.js";
import { audioSystem } from "./audioSystem.js";

export class WeaponSystem {
  constructor() {
    this.weapons = WEAPONS;
  }

  getWeapon(idx) {
    return this.weapons[idx] || this.weapons[0];
  }

  getWeaponName(idx) {
    return this.getWeapon(idx).name;
  }

  canShoot(gameState, currentTime) {
    const weapon = this.getWeapon(gameState.weapon.currentIdx);
    const ammo = gameState.weapon.ammo[gameState.weapon.currentIdx];

    return (
      ammo > 0 &&
      currentTime - gameState.weapon.lastShot > weapon.rate
    );
  }

  shoot(gameState, currentTime) {
    const weapon = this.getWeapon(gameState.weapon.currentIdx);

    if (!this.canShoot(gameState, currentTime)) {
      return null;
    }

    // Consume ammo
    gameState.weapon.ammo[gameState.weapon.currentIdx]--;
    gameState.weapon.lastShot = currentTime;

    // Play sound
    const soundMap = {
      0: "shoot",
      1: "shotgun",
      2: "smg",
      3: "rocket",
      4: "wand",
    };
    audioSystem.playSound(soundMap[gameState.weapon.currentIdx] || "shoot");

    // Return projectile info
    return {
      weaponIdx: gameState.weapon.currentIdx,
      damage: weapon.dmg,
      pellets: weapon.pellets || 1,
      color: weapon.col,
    };
  }

  switchWeapon(gameState, newIdx) {
    if (newIdx >= 0 && newIdx < this.weapons.length) {
      gameState.weapon.currentIdx = newIdx;
      audioSystem.playSound("switch");
      return true;
    }
    return false;
  }

  addAmmo(gameState, weaponIdx, amount) {
    const weapon = this.getWeapon(weaponIdx);
    const currentAmmo = gameState.weapon.ammo[weaponIdx];
    const maxAmmo = weapon.max;

    gameState.weapon.ammo[weaponIdx] = Math.min(
      maxAmmo,
      currentAmmo + amount
    );
  }

  refillAmmo(gameState) {
    this.weapons.forEach((weapon, idx) => {
      gameState.weapon.ammo[idx] = weapon.max;
    });
  }
}

export const weaponSystem = new WeaponSystem();
