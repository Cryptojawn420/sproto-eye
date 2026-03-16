// Audio synthesis system using Web Audio API
export class AudioSystem {
  constructor() {
    this.audioRef = null;
    this.musicRef = null;
    this.ctx = null;
  }

  initContext() {
    if (!this.audioRef) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.audioRef = this.ctx;
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playSound(soundType) {
    try {
      const c = this.initContext();
      const n = c.currentTime;
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g);
      g.connect(c.destination);

      const soundDefs = {
        shoot: [180, 40, 0.08, 0.15, "square"],
        shotgun: [100, 30, 0.15, 0.2, "sawtooth"],
        smg: [250, 80, 0.04, 0.1, "square"],
        rocket: [60, 20, 0.25, 0.2, "sawtooth"],
        wand: [1200, 400, 0.12, 0.1, "sawtooth"],
        hit: [400, 150, 0.05, 0.12, "sine"],
        kill: [500, 50, 0.2, 0.12, "sawtooth"],
        pu: [523, 784, 0.2, 0.1, "square"],
        hurt: [120, 80, 0.1, 0.1, "square"],
        boss: [60, 40, 0.3, 0.2, "sawtooth"],
        win: [523, 1047, 0.4, 0.12, "square"],
        switch: [880, 440, 0.08, 0.08, "square"],
      };

      const s = soundDefs[soundType] || [300, 100, 0.05, 0.1, "sine"];
      o.type = s[4];
      o.frequency.setValueAtTime(s[0], n);
      o.frequency.exponentialRampToValueAtTime(s[1], n + s[2]);
      g.gain.setValueAtTime(s[3], n);
      g.gain.exponentialRampToValueAtTime(0.01, n + s[2]);
      o.start(n);
      o.stop(n + s[2]);
    } catch (e) {
      console.error("SFX error:", e);
    }
  }

  startMusic() {
    if (this.musicRef) return;
    try {
      const ctx = this.initContext();
      const bpm = 140;
      const eighth = 60 / bpm / 2;
      const melody = [
        [523, 1], [523, 1], [523, 1], [0, 1], [523, 1], [587, 1], [659, 2],
        [587, 1], [523, 1], [440, 2], [0, 2], [440, 1], [523, 1], [587, 1],
        [0, 1], [659, 1], [587, 1], [523, 2], [440, 1], [392, 1], [440, 2],
        [0, 2], [523, 1], [659, 1], [784, 1], [0, 1], [880, 1], [784, 1],
        [659, 2], [587, 1], [659, 1], [587, 1], [523, 1], [440, 2], [0, 2],
        [392, 1], [440, 1], [523, 1], [587, 1], [659, 2], [587, 2], [523, 4],
        [0, 4],
      ];

      let mi = 0;
      let mt = ctx.currentTime;

      const play = (f, st, d) => {
        if (f <= 0) return;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.08, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + d * 0.95);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(st);
        o.stop(st + d);

        const b = ctx.createOscillator();
        const bg = ctx.createGain();
        b.type = "triangle";
        b.frequency.value = f / 4;
        bg.gain.setValueAtTime(0.05, st);
        bg.gain.exponentialRampToValueAtTime(0.001, st + d * 0.8);
        b.connect(bg);
        bg.connect(ctx.destination);
        b.start(st);
        b.stop(st + d);
      };

      const loop = () => {
        if (!this.musicRef) return;
        const now = ctx.currentTime;
        while (mt < now + 0.25) {
          const [f, d] = melody[mi % melody.length];
          play(f, mt, d * eighth);
          mt += d * eighth;
          mi++;
        }
        this.musicRef = requestAnimationFrame(loop);
      };

      this.musicRef = requestAnimationFrame(loop);
    } catch (e) {
      console.error("Music error:", e);
    }
  }

  stopMusic() {
    if (this.musicRef) {
      cancelAnimationFrame(this.musicRef);
      this.musicRef = null;
    }
  }
}

export const audioSystem = new AudioSystem();
