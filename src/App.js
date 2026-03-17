import React, { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { MobileControls } from "./modules/mobileControls.js";

const supabase = createClient(
  "https://hcvpcpapntythljlxxdw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdnBjcGFwbnR5dGhsamx4eGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTk2NDUsImV4cCI6MjA4ODY3NTY0NX0.dSTswkdQk6Cy9iMgb5NG_7wfpN9X1Uv-qze-l_wEXkw"
);

import * as THREE from "three";

function SprotoEye() {
  const containerRef = useRef(null);
  const [screen, setScreen] = useState("menu");
  const [charIdx, setCharIdx] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");

  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [armor, setArmor] = useState(0);
  const [ammo, setAmmo] = useState(50);
  const [kills, setKills] = useState(0);
  const [bossHP, setBossHP] = useState(0);
  const [maxBossHP, setMaxBossHP] = useState(800);
  const [showBoss, setShowBoss] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [hasGoal, setHasGoal] = useState(false);
  const [zone, setZone] = useState("start");
  const [enemyCount, setEnemyCount] = useState(0);
  const [wpnIdx, setWpnIdx] = useState(0);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [authScreen, setAuthScreen] = useState("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authEmail, setAuthEmail] = useState("");  const [leaderboard, setLeaderboard] = useState([]);  
  const audioRef = useRef(null);
  const musicRef = useRef(null);

  const CHARS = [
    { name: "CryptoJawn" },
    { name: "Chode" },
    { name: "VMU" },
    { name: "Keemie" },
    { name: "Bama" },
  ];
const CHAR_IMAGES = [
    'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/D87AEBB5-6B61-4B72-9D0E-26338F13128D_1_105_c.jpeg',
    'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/3A270C1C-2FB0-4D58-AF37-B384A7303CF5_1_105_c.jpeg',
    'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/5E40F012-943B-45B0-8F04-FFDD1D34FDF5.jpeg',
    'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/3C1BE185-9318-46E1-84E6-E129125B0E6D_1_105_c.jpeg',
    'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/2C99BF23-2F44-4E68-8C93-24A30E19C29B.jpeg',
  ];
  const VICTORY_IMAGE = 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/E68F483C-AF84-4244-9AE9-1F7AA1F253E1_1_105_c.jpeg';
  const GAMEOVER_IMAGE = 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/97E96CCC-76C0-4C08-BCB3-983DF9EEB7D5_1_105_c.jpeg';

  const WPNS = [
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

  const DIFF = {
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

  const sfx = useCallback((t) => {
    try {
      if (!audioRef.current)
        audioRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      const c = audioRef.current;
      if (c.state === "suspended") c.resume();
      const n = c.currentTime,
        o = c.createOscillator(),
        g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      const S = {
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
      const s = S[t] || [300, 100, 0.05, 0.1, "sine"];
      o.type = s[4];
      o.frequency.setValueAtTime(s[0], n);
      o.frequency.exponentialRampToValueAtTime(s[1], n + s[2]);
      g.gain.setValueAtTime(s[3], n);
      g.gain.exponentialRampToValueAtTime(0.01, n + s[2]);
      o.start(n);
      o.stop(n + s[2]);
    } catch (e) {}
  }, []);

  const startMusic = useCallback(() => {
    if (musicRef.current) return;
    try {
      const ctx =
        audioRef.current ||
        new (window.AudioContext || window.webkitAudioContext)();
      audioRef.current = ctx;
      if (ctx.state === "suspended") ctx.resume();
      const bpm = 140,
        eighth = 60 / bpm / 2;
      const melody = [
        [523, 1],
        [523, 1],
        [523, 1],
        [0, 1],
        [523, 1],
        [587, 1],
        [659, 2],
        [587, 1],
        [523, 1],
        [440, 2],
        [0, 2],
        [440, 1],
        [523, 1],
        [587, 1],
        [0, 1],
        [659, 1],
        [587, 1],
        [523, 2],
        [440, 1],
        [392, 1],
        [440, 2],
        [0, 2],
        [523, 1],
        [659, 1],
        [784, 1],
        [0, 1],
        [880, 1],
        [784, 1],
        [659, 2],
        [587, 1],
        [659, 1],
        [587, 1],
        [523, 1],
        [440, 2],
        [0, 2],
        [392, 1],
        [440, 1],
        [523, 1],
        [587, 1],
        [659, 2],
        [587, 2],
        [523, 4],
        [0, 4],
      ];
      let mi = 0,
        mt = ctx.currentTime;
      const play = (f, st, d) => {
        if (f <= 0) return;
        const o = ctx.createOscillator(),
          g = ctx.createGain();
        o.type = "square";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.08, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + d * 0.95);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(st);
        o.stop(st + d);
        const b = ctx.createOscillator(),
          bg = ctx.createGain();
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
        if (!musicRef.current) return;
        const now = ctx.currentTime;
        while (mt < now + 0.25) {
          const [f, d] = melody[mi % melody.length];
          play(f, mt, d * eighth);
          mt += d * eighth;
          mi++;
        }
        musicRef.current = requestAnimationFrame(loop);
      };
      musicRef.current = requestAnimationFrame(loop);
    } catch (e) {}
  }, []);

  const stopMusic = useCallback(() => {
    if (musicRef.current) {
      cancelAnimationFrame(musicRef.current);
      musicRef.current = null;
    }
  }, []);


const CharPortrait = ({idx,size=80}) => {
    return <img src={CHAR_IMAGES[idx]} alt={CHARS[idx]} style={{width:size,height:size,borderRadius:'50%',objectFit:'cover'}} />;
  };  useEffect(() => {
    if (screen !== "playing") {
      stopMusic();
      return;
    }
    if (!containerRef.current) return;
    const diff = DIFF[difficulty];
    setMaxBossHP(diff.bossHP);
    startMusic();
    const W = containerRef.current.clientWidth,
      H = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 10, 60);
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 200);
    camera.position.set(0, 1.6, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const sun = new THREE.DirectionalLight(0xffffee, 0.6);
    sun.position.set(10, 20, 5);
    scene.add(sun);
    const playerLight = new THREE.PointLight(0xffaa44, 0.6, 15);
    scene.add(playerLight);
// === WALL ART SYSTEM ===
    const textureLoader = new THREE.TextureLoader();
    const artworks = [
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/B6E700A4-41C1-4A59-91E5-A9EA456AFF4D_1_105_c.jpeg', x: 0, y: 2.5, z: 18, w: 4, h: 4, ry: Math.PI },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/2D0D0D12-4934-470C-8565-12BF70E58D93_1_105_c.jpeg', x: -13, y: 2.5, z: -20, w: 3, h: 3, ry: Math.PI/2 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/5E40F012-943B-45B0-8F04-FFDD1D34FDF5.jpeg', x: 13, y: 2.5, z: -40, w: 3, h: 3, ry: -Math.PI/2 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/B6BCB5FC-47F9-42A4-9B5A-71A6860A51D9_1_105_c.jpeg', x: -6, y: 2.5, z: -100, w: 2.5, h: 2.5, ry: Math.PI/2 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/B6C70F54-F07B-4788-ADEC-34BBDB89515_1_105_c.jpeg', x: 6, y: 2.5, z: -115, w: 2.5, h: 2.5, ry: -Math.PI/2 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/B6741123-B5EA-4389-BB0C-4405F69D2ABB_1_105_c.jpeg', x: -11, y: 2.5, z: -150, w: 3, h: 3, ry: Math.PI/2 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/D2D15C63-46FC-4816-A8D3-802E3BFADAC6_1_105_c.jpeg', x: -34, y: 3, z: -407, w: 2, h: 2, ry: 0 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/323B3CE6-620A-4967-B113-26BFB1C61340_1_105_c.jpeg', x: 13, y: 2.5, z: -15, w: 3, h: 3, ry: -Math.PI/2 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/3C1BE185-9318-46E1-84E6-E129125B0E6D_1_105_c.jpeg', x: -13, y: 2.5, z: -60, w: 3, h: 3, ry: Math.PI/2 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/7F76819D-ADF7-46E6-9C04-3E56A8D1419E_1_105_c.jpeg', x: 6, y: 3, z: -160, w: 2.5, h: 2.5, ry: -Math.PI/2 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/5601F851-DB8C-47D5-BF92-60119457FB26_1_105_c.jpeg', x: 0, y: 3, z: -300, w: 3, h: 3, ry: Math.PI },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/5B36DD98-7518-4D1D-A6CB-49C0ADEB65EB_1_105_c.jpeg', x: 0, y: 3.5, z: -360, w: 3.5, h: 3.5, ry: 0 },    ];
    
    artworks.forEach(art => {
      textureLoader.load(art.url, (texture) => {
        const frameGeo = new THREE.BoxGeometry(art.w + 0.3, art.h + 0.3, 0.15);
        const frameMat = new THREE.MeshLambertMaterial({color: 0x4a3728});
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(art.x, art.y, art.z);
        frame.rotation.y = art.ry;
        scene.add(frame);
        
        const picGeo = new THREE.PlaneGeometry(art.w, art.h);
        const picMat = new THREE.MeshBasicMaterial({map: texture});
        const pic = new THREE.Mesh(picGeo, picMat);
        pic.position.set(art.x, art.y, art.z);
        if (art.ry === Math.PI/2) pic.position.x += 0.08;
        if (art.ry === -Math.PI/2) pic.position.x -= 0.08;
        if (art.ry === Math.PI) pic.position.z -= 0.08;
        if (art.ry === 0) pic.position.z += 0.08;
        pic.rotation.y = art.ry;
        scene.add(pic);
      });
 // === BILLBOARDS ===
    const billboards = [
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/1373A55F-9767-44B5-BFF3-1FE0D8CA8398_4_5005_c.jpeg', x: 0, y: 7, z: -10, w: 8, h: 5, ry: 0 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/DAE39BEE-C326-4EED-A2D3-7FADAE6D60DF_1_105_c.jpeg', x: -10, y: 7, z: -90, w: 7, h: 5, ry: Math.PI/2 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/2AF10C78-84A6-4887-89C9-5139DD68821D_4_5005_c.jpeg', x: 0, y: 9, z: -200, w: 8, h: 6, ry: 0 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/EB45E878-8865-44E9-B00A-5BD255B66450_4_5005_c.jpeg', x: 20, y: 8, z: -370, w: 7, h: 5, ry: 0 },
    ];
    billboards.forEach(bb => {
      const ry = bb.ry || 0;
      textureLoader.load(bb.url, (texture) => {
        const frame = new THREE.Mesh(
          new THREE.BoxGeometry(bb.w + 0.5, bb.h + 0.5, 0.25),
          new THREE.MeshLambertMaterial({ color: 0x111111 })
        );
        frame.position.set(bb.x, bb.y, bb.z);
        frame.rotation.y = ry;
        scene.add(frame);
        const img = new THREE.Mesh(
          new THREE.PlaneGeometry(bb.w, bb.h),
          new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        );
        img.position.set(bb.x, bb.y, bb.z + 0.14);
        img.rotation.y = ry;
        scene.add(img);
      });
      [-1, 1].forEach(side => {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.15, bb.y, 10),
          new THREE.MeshLambertMaterial({ color: 0x666666 })
        );
        post.position.set(bb.x + side * bb.w * 0.35, bb.y / 2, bb.z);
        scene.add(post);
      });
  // === FLOATING IMAGES ===
    let floaterMeshes = [];
    const floaters = [
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/F2144D57-979A-4D61-891F-04908E4303EC.jpeg', x: 5, y: 4, z: -55, w: 3, h: 3, spinSpeed: 0.018 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/BDC1C57B-36BF-4DBC-BCE7-0605D897BB24.jpeg', x: -8, y: 5, z: -130, w: 3.5, h: 3.5, spinSpeed: -0.022 },
      { url: 'https://raw.githubusercontent.com/Cryptojawn420/sproto-eye/main/D87AEBB5-6B61-4B72-9D0E-26338F13128D_1_105_c.jpeg', x: -15, y: 5, z: -430, w: 4, h: 4, spinSpeed: -0.02 },
    ];
    floaters.forEach(fl => {
      textureLoader.load(fl.url, (texture) => {
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(fl.w, fl.h),
          new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        );
        mesh.position.set(fl.x, fl.y, fl.z);
        mesh.userData.spinSpeed = fl.spinSpeed;
        mesh.userData.baseY = fl.y;
        mesh.userData.floatOffset = Math.random() * Math.PI * 2;
        scene.add(mesh);
        floaterMeshes.push(mesh);
      });
    });});});    let enemies = [],
      pickups = [],
      particles = [],
      projectiles = [],
      walls = [];
    let yaw = Math.PI,
      pitch = 0,
      lDown = false,
      rDown = false,
      lmx = 0,
      lmy = 0,
      lastShot = 0;
    let hp = 100,
      arm = 0,
      wAmmo = [50, 16, 100, 8, 40],
      wIdx = 0,
      fid;
    let bossUp = false,
      bossDead = false,
      goal = null,
      lastHurt = 0;
    let spawnedZones = {
      start: false,
      mid: false,
      corridor: false,
      boss: false,
      exit: false,
      greenhill: false,
    };
    let curZone = "start";

    // === MOBILE CONTROLS ===
    let mobileInput = {
      moveX: 0,
      moveY: 0,
      lookX: 0,
      lookY: 0,
      fire: false,
    };
    let mobileControls = null;

    // Initialize mobile controls
    if (containerRef.current) {
      mobileControls = new MobileControls(containerRef.current);
      mobileControls.init();

      mobileControls.onMove((x, y) => {
        mobileInput.moveX = x;
        mobileInput.moveY = y;
      });

      mobileControls.onLook((x, y) => {
        mobileInput.lookX = x;
        mobileInput.lookY = y;
      });

      mobileControls.onFire((pressed) => {
        mobileInput.fire = pressed;
      });

      mobileControls.onWeaponSwap((direction) => {
        const newIdx = wIdx + direction;
        if (newIdx >= 0 && newIdx < WPNS.length) {
          wIdx = newIdx;
          setWpnIdx(newIdx);
          sfx("switch");
        }
      });
    }

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(160, 600),
      new THREE.MeshLambertMaterial({ color: 0x228b22 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -250);
    scene.add(floor);

    for (let x = -14; x < 14; x += 2)
      for (let z = 18; z > -80; z -= 2)
        if ((Math.floor(x / 2) + Math.floor(z / 2)) % 2 === 0) {
          const t = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.MeshLambertMaterial({ color: 0x1b6b1b })
          );
          t.rotation.x = -Math.PI / 2;
          t.position.set(x + 1, 0.01, z - 1);
          scene.add(t);
        }

    const mkWall = (x, z, w, d, c = 0x8b4513) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, 5, d),
        new THREE.MeshLambertMaterial({ color: c })
      );
      m.position.set(x, 2.5, z);
      scene.add(m);
      walls.push(m);
    };

    mkWall(-14, -40, 2, 120);
    mkWall(14, -40, 2, 120);
    mkWall(0, 20, 30, 2);
    for (let z = 10; z > -30; z -= 6) {
      const l = new THREE.PointLight(0xffffaa, 0.5, 15);
      l.position.set(0, 4, z);
      scene.add(l);
    }
    mkWall(-7, -110, 2, 60, 0x2a1a0a);
    mkWall(7, -110, 2, 60, 0x2a1a0a);
    for (let z = -85; z > -135; z -= 15) {
      const l = new THREE.PointLight(0xff4400, 0.4, 10);
      l.position.set(Math.sin(z * 0.1) * 4, 3, z);
      scene.add(l);
    }
    mkWall(-12, -150, 2, 30, 0x1a0a0a);
    mkWall(12, -150, 2, 30, 0x1a0a0a);
    mkWall(-12, -164, 10, 2, 0x1a0a0a);
    mkWall(12, -164, 10, 2, 0x1a0a0a);
    const bossLight = new THREE.PointLight(0xcc4444, 0.6, 25);
    bossLight.position.set(0, 4, -150);
    scene.add(bossLight);

    // === MAZE TO GREEN HILL ZONE ===
    // Exit from boss arena - narrow corridor
    mkWall(-5, -190, 2, 50, 0x3a2a1a);
    mkWall(5, -190, 2, 50, 0x3a2a1a);

    // First junction - must go RIGHT
    mkWall(0, -216, 12, 2, 0x3a2a1a); // blocks straight
    mkWall(-5, -230, 2, 30, 0x3a2a1a); // left wall continues
    mkWall(20, -223, 32, 2, 0x3a2a1a); // right corridor top
    mkWall(20, -237, 32, 2, 0x3a2a1a); // right corridor bottom

    // Right turn down
    mkWall(35, -250, 2, 28, 0x3a2a1a);
    mkWall(5, -250, 2, 28, 0x3a2a1a);

    // Second junction - must go LEFT
    mkWall(20, -265, 32, 2, 0x3a2a1a); // blocks straight
    mkWall(35, -280, 2, 32, 0x3a2a1a); // right wall
    mkWall(-10, -273, 32, 2, 0x3a2a1a); // left corridor top
    mkWall(-10, -287, 32, 2, 0x3a2a1a); // left corridor bottom

    // Dead end traps
    mkWall(35, -295, 2, 20, 0x2a1a0a); // fake path right
    mkWall(25, -305, 22, 2, 0x2a1a0a);
    mkWall(-35, -295, 2, 20, 0x2a1a0a); // fake path left
    mkWall(-25, -305, 22, 2, 0x2a1a0a);

    // Continue left then down
    mkWall(-25, -300, 2, 28, 0x3a2a1a);
    mkWall(-5, -300, 2, 28, 0x3a2a1a);

    // Third junction - zigzag required
    mkWall(-15, -315, 22, 2, 0x3a2a1a);
    mkWall(-25, -330, 2, 32, 0x3a2a1a);
    mkWall(5, -330, 2, 32, 0x3a2a1a);
    mkWall(20, -323, 32, 2, 0x3a2a1a);
    mkWall(20, -337, 32, 2, 0x3a2a1a);
    mkWall(35, -350, 2, 28, 0x3a2a1a);
    mkWall(5, -350, 2, 28, 0x3a2a1a);

    // Dark maze lights
    for (let z = -170; z > -360; z -= 25) {
      const l = new THREE.PointLight(0xffaa44, 0.25, 12);
      l.position.set(Math.sin(z * 0.05) * 15, 3, z);
      scene.add(l);
    }

    // === GREEN HILL ZONE - Larger, more complex ===
    const ghz = new THREE.Mesh(
      new THREE.PlaneGeometry(150, 200),
      new THREE.MeshLambertMaterial({ color: 0x33aa33 })
    );
    ghz.rotation.x = -Math.PI / 2;
    ghz.position.set(0, 0.02, -420);
    scene.add(ghz);

    // GHZ entry walls - opens up into large area
    mkWall(-60, -380, 2, 80, 0x228b22);
    mkWall(60, -380, 2, 80, 0x228b22);
    mkWall(-35, -340, 52, 2, 0x228b22); // partial wall with gap
    mkWall(35, -340, 52, 2, 0x228b22);

    // Hills and obstacles hiding the flag
    const hillPositions = [
      [-30, -380, 5],
      [-10, -400, 4],
      [20, -390, 6],
      [40, -410, 4],
      [-40, -430, 5],
      [0, -450, 7],
      [30, -440, 4],
      [-20, -460, 5],
      [45, -470, 6],
      [-45, -480, 4],
      [15, -485, 5],
      [-30, -495, 6],
      [35, -500, 4],
    ];
    hillPositions.forEach(([hx, hz, hr]) => {
      const h = new THREE.Mesh(
        new THREE.SphereGeometry(hr, 16, 12),
        new THREE.MeshLambertMaterial({ color: 0x2d882d })
      );
      h.scale.set(1, 0.4, 1);
      h.position.set(hx, 0, hz);
      scene.add(h);
    });

    // Maze walls INSIDE Green Hill Zone
    mkWall(-20, -390, 2, 30, 0x228b22);
    mkWall(25, -400, 2, 40, 0x228b22);
    mkWall(-10, -430, 40, 2, 0x228b22);
    mkWall(10, -450, 2, 30, 0x228b22);
    mkWall(-35, -460, 30, 2, 0x228b22);
    mkWall(40, -470, 2, 40, 0x228b22);
    mkWall(-15, -480, 50, 2, 0x228b22);
    mkWall(20, -490, 2, 30, 0x228b22);
    mkWall(-40, -500, 60, 2, 0x228b22);

    // Hidden corner walls for flag
    if (difficulty === "easy") {
      mkWall(45, -390, 30, 2, 0x228b22);
      mkWall(58, -400, 2, 22, 0x228b22);
    } else if (difficulty === "sproto") {
      mkWall(-55, -430, 30, 2, 0x228b22);
      mkWall(-68, -445, 2, 32, 0x228b22);
    } else {
      mkWall(55, -490, 30, 2, 0x228b22);
      mkWall(68, -505, 2, 32, 0x228b22);
    }

    // Ranch fence posts instead of palm trees
    const mkFencePost = (x, z) => {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 2, 8),
        new THREE.MeshLambertMaterial({ color: 0x8b4513 })
      );
      post.position.set(x, 1, z);
      scene.add(post);
      const top = new THREE.Mesh(
        new THREE.ConeGeometry(0.12, 0.2, 8),
        new THREE.MeshLambertMaterial({ color: 0x8b4513 })
      );
      top.position.set(x, 2.1, z);
      scene.add(top);
    };
    // Fence posts around Sproto Ranch
    [
      [-55, -360],
      [55, -360],
      [-60, -400],
      [60, -400],
      [-55, -450],
      [55, -450],
      [-60, -490],
      [60, -490],
      [-50, -520],
      [50, -520],
    ].forEach(([x, z]) => mkFencePost(x, z));

    // Fence rails between posts
    const mkFenceRail = (x1, z1, x2, z2) => {
      const len = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
      const rail1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, len, 6),
        new THREE.MeshLambertMaterial({ color: 0xa0522d })
      );
      rail1.position.set((x1 + x2) / 2, 1.5, (z1 + z2) / 2);
      rail1.rotation.z = Math.PI / 2;
      rail1.rotation.y = Math.atan2(z2 - z1, x2 - x1);
      scene.add(rail1);
      const rail2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, len, 6),
        new THREE.MeshLambertMaterial({ color: 0xa0522d })
      );
      rail2.position.set((x1 + x2) / 2, 0.8, (z1 + z2) / 2);
      rail2.rotation.z = Math.PI / 2;
      rail2.rotation.y = Math.atan2(z2 - z1, x2 - x1);
      scene.add(rail2);
    };
    mkFenceRail(-55, -360, -60, -400);
    mkFenceRail(-60, -400, -55, -450);
    mkFenceRail(-55, -450, -60, -490);
    mkFenceRail(-60, -490, -50, -520);
    mkFenceRail(55, -360, 60, -400);
    mkFenceRail(60, -400, 55, -450);
    mkFenceRail(55, -450, 60, -490);
    mkFenceRail(60, -490, 50, -520);

    // RED BARN
    const barnBase = new THREE.Mesh(
      new THREE.BoxGeometry(8, 5, 6),
      new THREE.MeshLambertMaterial({ color: 0xaa2222 })
    );
    barnBase.position.set(-35, -410, 2.5);
    scene.add(barnBase);
    const barnRoof = new THREE.Mesh(
      new THREE.ConeGeometry(5, 3, 4),
      new THREE.MeshLambertMaterial({ color: 0x8b4513 })
    );
    barnRoof.position.set(-35, -410, 5.5);
    barnRoof.rotation.x = Math.PI / 2;
    barnRoof.rotation.z = Math.PI / 4;
    scene.add(barnRoof);
    const barnDoor = new THREE.Mesh(
      new THREE.BoxGeometry(2, 3, 0.1),
      new THREE.MeshLambertMaterial({ color: 0x4a3728 })
    );
    barnDoor.position.set(-35, -407, 1.5);
    scene.add(barnDoor);
    // Barn X decoration
    const barnX1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 3.5, 0.05),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    barnX1.position.set(-35, -407, 3);
    barnX1.rotation.z = 0.7;
    scene.add(barnX1);
    const barnX2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 3.5, 0.05),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    barnX2.position.set(-35, -407, 3);
    barnX2.rotation.z = -0.7;
    scene.add(barnX2);

    // FARMHOUSE
    const houseBase = new THREE.Mesh(
      new THREE.BoxGeometry(6, 4, 5),
      new THREE.MeshLambertMaterial({ color: 0xf5deb3 })
    );
    houseBase.position.set(35, -385, 2);
    scene.add(houseBase);
    const houseRoof = new THREE.Mesh(
      new THREE.ConeGeometry(4.5, 2.5, 4),
      new THREE.MeshLambertMaterial({ color: 0x654321 })
    );
    houseRoof.position.set(35, -385, 4.5);
    houseRoof.rotation.x = Math.PI / 2;
    houseRoof.rotation.z = Math.PI / 4;
    scene.add(houseRoof);
    const houseDoor = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 2.2, 0.1),
      new THREE.MeshLambertMaterial({ color: 0x8b4513 })
    );
    houseDoor.position.set(35, -382.5, 1);
    scene.add(houseDoor);
    // Windows
    [
      [-1.5, 2],
      [1.5, 2],
    ].forEach(([wx, wz]) => {
      const win = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 0.1),
        new THREE.MeshBasicMaterial({ color: 0x87ceeb })
      );
      win.position.set(35 + wx, -382.5, wz);
      scene.add(win);
    });

    // WATER TOWER
    const towerLegs = [
      [0.8, 0.8],
      [-0.8, 0.8],
      [0.8, -0.8],
      [-0.8, -0.8],
    ];
    towerLegs.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.2, 6, 8),
        new THREE.MeshLambertMaterial({ color: 0x8b4513 })
      );
      leg.position.set(-50 + lx, -440 + lz, 3);
      scene.add(leg);
    });
    const waterTank = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 3, 16),
      new THREE.MeshLambertMaterial({ color: 0x4682b4 })
    );
    waterTank.position.set(-50, -440, 7.5);
    scene.add(waterTank);
    const tankRoof = new THREE.Mesh(
      new THREE.ConeGeometry(2.2, 1, 16),
      new THREE.MeshLambertMaterial({ color: 0x363636 })
    );
    tankRoof.position.set(-50, -440, 9.5);
    scene.add(tankRoof);

    // SILO
    const silo = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 8, 16),
      new THREE.MeshLambertMaterial({ color: 0xc0c0c0 })
    );
    silo.position.set(-42, -415, 4);
    scene.add(silo);
    const siloRoof = new THREE.Mesh(
      new THREE.ConeGeometry(1.7, 2, 16),
      new THREE.MeshLambertMaterial({ color: 0xaa2222 })
    );
    siloRoof.position.set(-42, -415, 9);
    scene.add(siloRoof);

    // CHICKEN COOP
    const coop = new THREE.Mesh(
      new THREE.BoxGeometry(3, 2, 2.5),
      new THREE.MeshLambertMaterial({ color: 0xdeb887 })
    );
    coop.position.set(20, -470, 1);
    scene.add(coop);
    const coopRoof = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 0.3, 3),
      new THREE.MeshLambertMaterial({ color: 0x8b0000 })
    );
    coopRoof.position.set(20, -470, 2.3);
    coopRoof.rotation.x = 0.2;
    scene.add(coopRoof);

    // WINDMILL
    const windmillTower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.5, 8, 8),
      new THREE.MeshLambertMaterial({ color: 0x888888 })
    );
    windmillTower.position.set(40, -420, 4);
    scene.add(windmillTower);
    const windmillTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 10, 10),
      new THREE.MeshLambertMaterial({ color: 0x666666 })
    );
    windmillTop.position.set(40, -420, 8.2);
    scene.add(windmillTop);
    // Blades
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 4, 0.1),
        new THREE.MeshLambertMaterial({ color: 0xdddddd })
      );
      blade.position.set(40, -419, 8.2);
      blade.rotation.z = (i * Math.PI) / 2;
      scene.add(blade);
    }

    // TRACTOR
    const tractorBody = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.5, 1.5),
      new THREE.MeshLambertMaterial({ color: 0x228b22 })
    );
    tractorBody.position.set(15, -395, 0.75);
    scene.add(tractorBody);
    const tractorCab = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1.2, 1.3),
      new THREE.MeshLambertMaterial({ color: 0x228b22 })
    );
    tractorCab.position.set(15.3, -395, 1.8);
    scene.add(tractorCab);
    const tractorWindow = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.6, 0.8),
      new THREE.MeshBasicMaterial({ color: 0x87ceeb })
    );
    tractorWindow.position.set(15.8, -395, 1.9);
    scene.add(tractorWindow);
    // Wheels
    const bigWheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 0.4, 16),
      new THREE.MeshLambertMaterial({ color: 0x222 })
    );
    bigWheel.position.set(14.2, -394.2, 0.7);
    bigWheel.rotation.x = Math.PI / 2;
    scene.add(bigWheel);
    const bigWheel2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 0.4, 16),
      new THREE.MeshLambertMaterial({ color: 0x222 })
    );
    bigWheel2.position.set(14.2, -395.8, 0.7);
    bigWheel2.rotation.x = Math.PI / 2;
    scene.add(bigWheel2);
    const smallWheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16),
      new THREE.MeshLambertMaterial({ color: 0x222 })
    );
    smallWheel.position.set(15.8, -394.3, 0.4);
    smallWheel.rotation.x = Math.PI / 2;
    scene.add(smallWheel);
    const smallWheel2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16),
      new THREE.MeshLambertMaterial({ color: 0x222 })
    );
    smallWheel2.position.set(15.8, -395.7, 0.4);
    smallWheel2.rotation.x = Math.PI / 2;
    scene.add(smallWheel2);

    // Hay bales scattered around
    [
      [25, -380],
      [10, -430],
      [-15, -470],
      [35, -490],
      [-40, -510],
      [0, -400],
      [45, -440],
      [-20, -395],
      [50, -470],
    ].forEach(([hx, hz]) => {
      const hay = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 1.5, 12),
        new THREE.MeshLambertMaterial({ color: 0xdaa520 })
      );
      hay.position.set(hx, 0.75, hz);
      hay.rotation.x = Math.PI / 2;
      scene.add(hay);
    });

    // Gold rings (Sonic style but cowboy gold)
    [
      [0, -370],
      [30, -420],
      [-25, -460],
      [15, -500],
    ].forEach(([lx, lz]) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(4, 0.35, 8, 24),
        new THREE.MeshLambertMaterial({ color: 0xffd700 })
      );
      ring.position.set(lx, 4, lz);
      ring.rotation.y = Math.PI / 2;
      scene.add(ring);
    });

    // === FRIENDLY RANCH ANIMALS (can shoot but don't hurt you) ===
    let animals = [];

    // COW
    const mkCow = (x, z) => {
      const g = new THREE.Group();
      g.userData = { hp: 30, pts: 10, type: "cow", isAnimal: true };
      // Body (white with black spots)
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.8, 0.7),
        new THREE.MeshLambertMaterial({ color: 0xfffff0 })
      );
      body.position.y = 0.6;
      g.add(body);
      // Black spots
      const spot1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        new THREE.MeshLambertMaterial({ color: 0x222 })
      );
      spot1.position.set(0.2, 0.7, 0.36);
      spot1.scale.set(1, 1, 0.2);
      g.add(spot1);
      const spot2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 8, 8),
        new THREE.MeshLambertMaterial({ color: 0x222 })
      );
      spot2.position.set(-0.3, 0.5, 0.36);
      spot2.scale.set(1, 1, 0.2);
      g.add(spot2);
      // Head
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 0.35),
        new THREE.MeshLambertMaterial({ color: 0xfffff0 })
      );
      head.position.set(0.7, 0.7, 0);
      g.add(head);
      // Snout (pink)
      const snout = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.15, 0.2),
        new THREE.MeshLambertMaterial({ color: 0xffb6c1 })
      );
      snout.position.set(0.9, 0.6, 0);
      g.add(snout);
      // Eyes
      [-1, 1].forEach((s) => {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x000 })
        );
        eye.position.set(0.85, 0.8, s * 0.12);
        g.add(eye);
      });
      // Ears
      [-1, 1].forEach((s) => {
        const ear = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.08, 0.15),
          new THREE.MeshLambertMaterial({ color: 0xfffff0 })
        );
        ear.position.set(0.6, 0.95, s * 0.2);
        g.add(ear);
      });
      // Horns
      [-1, 1].forEach((s) => {
        const horn = new THREE.Mesh(
          new THREE.ConeGeometry(0.04, 0.15, 8),
          new THREE.MeshLambertMaterial({ color: 0xf5deb3 })
        );
        horn.position.set(0.6, 1, s * 0.15);
        horn.rotation.z = s * 0.3;
        g.add(horn);
      });
      // Legs
      [
        [-0.4, -0.2],
        [0.4, -0.2],
        [-0.4, 0.2],
        [0.4, 0.2],
      ].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8),
          new THREE.MeshLambertMaterial({ color: 0xfffff0 })
        );
        leg.position.set(lx, 0.2, lz);
        g.add(leg);
      });
      // Udder
      const udder = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 10, 10),
        new THREE.MeshLambertMaterial({ color: 0xffb6c1 })
      );
      udder.position.set(-0.2, 0.25, 0);
      g.add(udder);
      // Tail
      const tail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.03, 0.4, 6),
        new THREE.MeshLambertMaterial({ color: 0xfffff0 })
      );
      tail.position.set(-0.7, 0.6, 0);
      tail.rotation.z = 0.5;
      g.add(tail);
      g.position.set(x, 0, z);
      return g;
    };

    // EMU
    const mkEmu = (x, z) => {
      const g = new THREE.Group();
      g.userData = { hp: 20, pts: 15, type: "emu", isAnimal: true };
      // Body (brown/gray feathers)
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 12, 12),
        new THREE.MeshLambertMaterial({ color: 0x4a4a4a })
      );
      body.scale.set(1, 0.8, 0.7);
      body.position.y = 0.8;
      g.add(body);
      // Long neck
      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 1, 10),
        new THREE.MeshLambertMaterial({ color: 0x5c5c5c })
      );
      neck.position.set(0.2, 1.5, 0);
      neck.rotation.z = -0.2;
      g.add(neck);
      // Small head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 10, 10),
        new THREE.MeshLambertMaterial({ color: 0x4a4a4a })
      );
      head.position.set(0.35, 2.1, 0);
      g.add(head);
      // Beak
      const beak = new THREE.Mesh(
        new THREE.ConeGeometry(0.05, 0.15, 6),
        new THREE.MeshLambertMaterial({ color: 0x333 })
      );
      beak.position.set(0.5, 2.05, 0);
      beak.rotation.z = -Math.PI / 2;
      g.add(beak);
      // Eyes
      [-1, 1].forEach((s) => {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xff6600 })
        );
        eye.position.set(0.42, 2.15, s * 0.08);
        g.add(eye);
      });
      // Legs (long thin)
      [-1, 1].forEach((s) => {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.05, 0.8, 8),
          new THREE.MeshLambertMaterial({ color: 0x8b7355 })
        );
        leg.position.set(0, 0.4, s * 0.15);
        g.add(leg);
        const foot = new THREE.Mesh(
          new THREE.BoxGeometry(0.15, 0.03, 0.1),
          new THREE.MeshLambertMaterial({ color: 0x8b7355 })
        );
        foot.position.set(0.03, 0.02, s * 0.15);
        g.add(foot);
      });
      // Tail feathers
      const tailF = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        new THREE.MeshLambertMaterial({ color: 0x3a3a3a })
      );
      tailF.position.set(-0.4, 0.8, 0);
      tailF.scale.set(0.8, 0.6, 0.5);
      g.add(tailF);
      g.position.set(x, 0, z);
      return g;
    };

    // KANGAROO
    const mkKangaroo = (x, z) => {
      const g = new THREE.Group();
      g.userData = { hp: 25, pts: 20, type: "kangaroo", isAnimal: true };
      // Body (brown/tan)
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 14, 12),
        new THREE.MeshLambertMaterial({ color: 0xc19a6b })
      );
      body.scale.set(0.8, 1.2, 0.7);
      body.position.y = 0.9;
      g.add(body);
      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 12, 12),
        new THREE.MeshLambertMaterial({ color: 0xc19a6b })
      );
      head.scale.set(0.9, 1.1, 0.8);
      head.position.set(0.15, 1.7, 0);
      g.add(head);
      // Snout
      const snout = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.12, 0.12),
        new THREE.MeshLambertMaterial({ color: 0xd4a574 })
      );
      snout.position.set(0.35, 1.6, 0);
      g.add(snout);
      // Nose
      const nose = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        new THREE.MeshLambertMaterial({ color: 0x333 })
      );
      nose.position.set(0.42, 1.62, 0);
      g.add(nose);
      // Eyes
      [-1, 1].forEach((s) => {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x222 })
        );
        eye.position.set(0.28, 1.75, s * 0.1);
        g.add(eye);
      });
      // Ears (big pointy)
      [-1, 1].forEach((s) => {
        const ear = new THREE.Mesh(
          new THREE.ConeGeometry(0.08, 0.25, 8),
          new THREE.MeshLambertMaterial({ color: 0xc19a6b })
        );
        ear.position.set(0, 1.95, s * 0.15);
        ear.rotation.z = s * 0.2;
        g.add(ear);
        const earInner = new THREE.Mesh(
          new THREE.ConeGeometry(0.04, 0.15, 8),
          new THREE.MeshLambertMaterial({ color: 0xffb6c1 })
        );
        earInner.position.set(0, 1.92, s * 0.15);
        earInner.rotation.z = s * 0.2;
        g.add(earInner);
      });
      // Arms (small)
      [-1, 1].forEach((s) => {
        const arm = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.04, 0.3, 8),
          new THREE.MeshLambertMaterial({ color: 0xc19a6b })
        );
        arm.position.set(0.15, 1.1, s * 0.25);
        arm.rotation.z = 0.5;
        arm.rotation.x = s * 0.3;
        g.add(arm);
      });
      // Big back legs
      [-1, 1].forEach((s) => {
        const thigh = new THREE.Mesh(
          new THREE.SphereGeometry(0.2, 10, 10),
          new THREE.MeshLambertMaterial({ color: 0xc19a6b })
        );
        thigh.scale.set(0.8, 1.2, 0.7);
        thigh.position.set(-0.1, 0.5, s * 0.2);
        g.add(thigh);
        const foot = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 0.08, 0.12),
          new THREE.MeshLambertMaterial({ color: 0xc19a6b })
        );
        foot.position.set(0.05, 0.04, s * 0.2);
        g.add(foot);
      });
      // Tail (thick, used for balance)
      const tail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.06, 0.8, 10),
        new THREE.MeshLambertMaterial({ color: 0xc19a6b })
      );
      tail.position.set(-0.5, 0.4, 0);
      tail.rotation.z = 1.2;
      g.add(tail);
      // Pouch
      const pouch = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 10, 10),
        new THREE.MeshLambertMaterial({ color: 0xd4a574 })
      );
      pouch.scale.set(1, 0.8, 0.5);
      pouch.position.set(0.1, 0.7, 0);
      g.add(pouch);
      g.position.set(x, 0, z);
      return g;
    };

    // Spawn animals in Sproto Ranch
    const animalSpawns = [
      { mk: mkCow, x: -15, z: -375 },
      { mk: mkCow, x: 10, z: -405 },
      { mk: mkCow, x: -30, z: -455 },
      { mk: mkCow, x: 25, z: -485 },
      { mk: mkEmu, x: 5, z: -365 },
      { mk: mkEmu, x: -25, z: -425 },
      { mk: mkEmu, x: 35, z: -465 },
      { mk: mkEmu, x: -10, z: -505 },
      { mk: mkKangaroo, x: 20, z: -375 },
      { mk: mkKangaroo, x: -40, z: -445 },
      { mk: mkKangaroo, x: 45, z: -495 },
      { mk: mkKangaroo, x: 0, z: -515 },
    ];
    animalSpawns.forEach(({ mk, x, z }) => {
      const animal = mk(x, z);
      animals.push(animal);
      scene.add(animal);
    });

    // Additional random hills in open areas
    for (let i = 0; i < 8; i++) {
      const h = new THREE.Mesh(
        new THREE.SphereGeometry(2 + Math.random() * 3, 16, 12),
        new THREE.MeshLambertMaterial({ color: 0x2d882d })
      );
      h.scale.set(1, 0.4, 1);
      h.position.set(
        (Math.random() - 0.5) * 100,
        0,
        -380 - Math.random() * 140
      );
      scene.add(h);
    }

    const sky = new THREE.Mesh(
      new THREE.PlaneGeometry(180, 60),
      new THREE.MeshBasicMaterial({ color: 0x4fc3f7 })
    );
    sky.position.set(0, 20, -540);
    scene.add(sky);

    for (let i = 0; i < 15; i++) {
      const c = new THREE.Mesh(
        new THREE.SphereGeometry(2 + Math.random() * 3, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      c.scale.set(2, 0.8, 1);
      c.position.set(
        (Math.random() - 0.5) * 140,
        16 + Math.random() * 10,
        -420 - Math.random() * 100
      );
      scene.add(c);
    }

    const ghzSun = new THREE.PointLight(0xffffaa, 0.9, 100);
    ghzSun.position.set(0, 25, -450);
    scene.add(ghzSun);

    // Outer boundary walls for GHZ
    mkWall(-75, -450, 2, 200, 0x228b22);
    mkWall(75, -450, 2, 200, 0x228b22);
    mkWall(0, -550, 152, 2, 0x228b22);

    const handCol = [0x3355cc, 0xffdd44, 0x3366cc, 0x3366cc, 0xffdd44][charIdx];

    // Create Ethereum diamond shape
    const mkEthSymbol = () => {
      const g = new THREE.Group();
      // Top triangle
      const top = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.12, 4),
        new THREE.MeshBasicMaterial({ color: 0x627eea })
      );
      top.rotation.y = Math.PI / 4;
      top.position.y = 0.06;
      g.add(top);
      // Bottom triangle (inverted)
      const bot = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.08, 4),
        new THREE.MeshBasicMaterial({ color: 0x627eea })
      );
      bot.rotation.x = Math.PI;
      bot.rotation.y = Math.PI / 4;
      bot.position.y = -0.04;
      g.add(bot);
      return g;
    };

    // Create "pump.fun" text as simple blocks
    const mkPumpFunLabel = (color = 0xffffff) => {
      const g = new THREE.Group();
      // Simple "P.F" representation with blocks
      const mat = new THREE.MeshBasicMaterial({ color });
      // P
      g.add(
        new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.02), mat).translateX(
          -0.06
        )
      );
      g.add(
        new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.02), mat)
          .translateX(-0.04)
          .translateY(0.04)
      );
      g.add(
        new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.02), mat)
          .translateX(-0.04)
          .translateY(0.02)
      );
      g.add(
        new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.02), mat)
          .translateX(-0.02)
          .translateY(0.03)
      );
      // dot
      g.add(
        new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.02), mat)
          .translateX(0.01)
          .translateY(-0.04)
      );
      // F
      g.add(
        new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.02), mat).translateX(
          0.06
        )
      );
      g.add(
        new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.02), mat)
          .translateX(0.08)
          .translateY(0.04)
      );
      g.add(
        new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.02), mat)
          .translateX(0.075)
          .translateY(0.01)
      );
      return g;
    };

    const mkGun = (idx) => {
      const g = new THREE.Group();
      if (idx === 0) {
        g.add(
          new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.14, 0.4),
            new THREE.MeshLambertMaterial({ color: 0xffd700 })
          )
        );
        const b = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.3, 12),
          new THREE.MeshLambertMaterial({ color: 0xdaa520 })
        );
        b.rotation.x = Math.PI / 2;
        b.position.set(0, 0.02, -0.32);
        g.add(b);
      } else if (idx === 1) {
        g.add(
          new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 0.14, 0.28),
            new THREE.MeshLambertMaterial({ color: 0xff6633 })
          )
        );
        [-0.045, 0.045].forEach((xo) => {
          const b = new THREE.Mesh(
            new THREE.CylinderGeometry(0.038, 0.038, 0.48, 12),
            new THREE.MeshLambertMaterial({ color: 0x333 })
          );
          b.rotation.x = Math.PI / 2;
          b.position.set(xo, 0.02, -0.4);
          g.add(b);
        });
      } else if (idx === 2) {
        g.add(
          new THREE.Mesh(
            new THREE.BoxGeometry(0.11, 0.14, 0.34),
            new THREE.MeshLambertMaterial({ color: 0x00ced1 })
          )
        );
        const m = new THREE.Mesh(
          new THREE.BoxGeometry(0.07, 0.24, 0.07),
          new THREE.MeshLambertMaterial({ color: 0x006666 })
        );
        m.position.set(0, -0.18, 0);
        g.add(m);
      } else if (idx === 3) {
        const t = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.11, 0.7, 16),
          new THREE.MeshLambertMaterial({ color: 0x556b2f })
        );
        t.rotation.x = Math.PI / 2;
        t.position.set(0, 0.05, -0.12);
        g.add(t);
        const r = new THREE.Mesh(
          new THREE.CylinderGeometry(0.065, 0.065, 0.22, 12),
          new THREE.MeshLambertMaterial({ color: 0xff3333 })
        );
        r.rotation.x = Math.PI / 2;
        r.position.set(0, 0.05, -0.38);
        g.add(r);
        const tip = new THREE.Mesh(
          new THREE.ConeGeometry(0.065, 0.14, 12),
          new THREE.MeshLambertMaterial({ color: 0xffaa00 })
        );
        tip.rotation.x = -Math.PI / 2;
        tip.position.set(0, 0.05, -0.54);
        g.add(tip);
      } else {
        // MAGIC WAND
        const shaft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.045, 0.6, 12),
          new THREE.MeshLambertMaterial({ color: 0x4a2c2a })
        );
        shaft.rotation.x = Math.PI / 2;
        shaft.position.set(0, 0, -0.08);
        g.add(shaft);
        // Purple crystal
        const crystal = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.14, 0),
          new THREE.MeshBasicMaterial({ color: 0xaa44ff })
        );
        crystal.position.set(0, 0, -0.48);
        g.add(crystal);
        // Inner glow
        const glow = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 12, 12),
          new THREE.MeshBasicMaterial({
            color: 0xdd88ff,
            transparent: true,
            opacity: 0.35,
          })
        );
        glow.position.set(0, 0, -0.48);
        g.add(glow);
        // Gold band
        const band = new THREE.Mesh(
          new THREE.TorusGeometry(0.06, 0.02, 8, 16),
          new THREE.MeshLambertMaterial({ color: 0xffd700 })
        );
        band.position.set(0, 0, -0.35);
        g.add(band);
        // Sparkles
        for (let i = 0; i < 4; i++) {
          const sp = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.02, 0),
            new THREE.MeshBasicMaterial({ color: 0xffff44 })
          );
          sp.position.set(
            Math.sin(i * 1.5) * 0.12,
            Math.cos(i * 1.5) * 0.12,
            -0.3 - i * 0.06
          );
          g.add(sp);
        }
      }
      const hand = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.14, 0.38),
        new THREE.MeshLambertMaterial({ color: handCol })
      );
      hand.position.set(0.05, -0.08, 0.3);
      g.add(hand);
      g.position.set(0.34, -0.26, -0.52);
      return g;
    };

    let gun = mkGun(0);
    camera.add(gun);
    scene.add(camera);

    // === ACCURATE WAYNE'S WORLD SPROTO ===
    const mkWaynes = (x, z) => {
      const g = new THREE.Group();
      g.userData = {
        hp: 65 * diff.hpMult,
        spd: 0.026 * diff.spdMult,
        pts: 130,
        type: "waynes",
      };

      // Blue body (medium blue like reference)
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 20, 18),
        new THREE.MeshLambertMaterial({ color: 0x5588cc })
      );
      body.scale.set(1, 1.15, 0.88);
      body.position.y = 0.62;
      g.add(body);

      // Yellow horizontal stripe/band
      const yellowBand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.52, 0.52, 0.16, 20),
        new THREE.MeshLambertMaterial({ color: 0xffdd00 })
      );
      yellowBand.position.y = 0.82;
      g.add(yellowBand);

      // Black overalls
      const overalls = new THREE.Mesh(
        new THREE.BoxGeometry(0.54, 0.44, 0.46),
        new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
      );
      overalls.position.set(0, 0.36, 0);
      g.add(overalls);

      // Overall straps
      [-1, 1].forEach((s) => {
        const strap = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.42, 0.05),
          new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
        );
        strap.position.set(s * 0.18, 0.74, 0.22);
        g.add(strap);
      });

      // Yellow shoulder patches
      [-1, 1].forEach((s) => {
        const patch = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.1, 0.05),
          new THREE.MeshLambertMaterial({ color: 0xffdd00 })
        );
        patch.position.set(s * 0.3, 0.9, 0.15);
        g.add(patch);
      });

      // Overall pocket with pump.fun
      const pocket = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.14, 0.02),
        new THREE.MeshLambertMaterial({ color: 0x222 })
      );
      pocket.position.set(0, 0.32, 0.24);
      g.add(pocket);
      const pf = mkPumpFunLabel(0xffdd00);
      pf.position.set(0, 0.32, 0.26);
      pf.scale.setScalar(0.8);
      g.add(pf);

      // Blue head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 20, 18),
        new THREE.MeshLambertMaterial({ color: 0x5588cc })
      );
      head.position.y = 1.3;
      g.add(head);

      // GRAY cap (not black - matches reference)
      const capBase = new THREE.Mesh(
        new THREE.SphereGeometry(0.36, 20, 14),
        new THREE.MeshLambertMaterial({ color: 0x3a3a3a })
      );
      capBase.scale.set(1.12, 0.44, 1.08);
      capBase.position.y = 1.58;
      g.add(capBase);

      // Cap brim
      const brim = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.06, 0.28),
        new THREE.MeshLambertMaterial({ color: 0x3a3a3a })
      );
      brim.position.set(0, 1.5, 0.26);
      brim.rotation.x = 0.2;
      g.add(brim);

      // "WAYNES WORLD" text area (white)
      const textPatch = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.15, 0.02),
        new THREE.MeshBasicMaterial({ color: 0xeeeeee })
      );
      textPatch.position.set(0, 1.6, 0.36);
      g.add(textPatch);

      // Logo on cap (hexagon like in image)
      const logo = new THREE.Mesh(
        new THREE.CircleGeometry(0.05, 6),
        new THREE.MeshBasicMaterial({ color: 0xcccccc })
      );
      logo.position.set(0, 1.64, 0.37);
      g.add(logo);

      // Brown wavy hair on both sides
      [-1, 1].forEach((s) => {
        for (let i = 0; i < 5; i++) {
          const strand = new THREE.Mesh(
            new THREE.BoxGeometry(0.12 - i * 0.01, 0.14 + i * 0.1, 0.22),
            new THREE.MeshLambertMaterial({ color: 0x5d4037 })
          );
          strand.position.set(s * (0.36 + i * 0.02), 1.18 - i * 0.14, -0.02);
          strand.rotation.z = s * 0.08;
          g.add(strand);
        }
        // Curly ends
        const curl = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 10, 10),
          new THREE.MeshLambertMaterial({ color: 0x5d4037 })
        );
        curl.scale.set(0.7, 1, 0.9);
        curl.position.set(s * 0.44, 0.62, 0);
        g.add(curl);
      });

      // Skin-colored eye area (visible through glasses)
      const eyeArea = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 0.18, 0.12),
        new THREE.MeshLambertMaterial({ color: 0xd4a574 })
      );
      eyeArea.position.set(0, 1.32, 0.32);
      g.add(eyeArea);

      // BLACK round glasses
      const glassesFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.16, 0.08),
        new THREE.MeshLambertMaterial({ color: 0x111111 })
      );
      glassesFrame.position.set(0, 1.32, 0.35);
      g.add(glassesFrame);

      // Round lens holes
      [-1, 1].forEach((s) => {
        const lens = new THREE.Mesh(
          new THREE.CircleGeometry(0.065, 16),
          new THREE.MeshBasicMaterial({ color: 0xd4a574 })
        );
        lens.position.set(s * 0.13, 1.32, 0.36);
        g.add(lens);
        // Eyes
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0x8b6914 })
        );
        eye.position.set(s * 0.13, 1.32, 0.38);
        g.add(eye);
        const pupil = new THREE.Mesh(
          new THREE.SphereGeometry(0.022, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x000 })
        );
        pupil.position.set(s * 0.13, 1.32, 0.41);
        g.add(pupil);
      });

      // BIG RED LIPS (prominent like reference)
      const upperLip = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 16, 14),
        new THREE.MeshLambertMaterial({ color: 0xcc2222 })
      );
      upperLip.scale.set(1.55, 0.52, 0.72);
      upperLip.position.set(0, 1.1, 0.36);
      g.add(upperLip);
      const lowerLip = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 14),
        new THREE.MeshLambertMaterial({ color: 0xcc2222 })
      );
      lowerLip.scale.set(1.65, 0.58, 0.78);
      lowerLip.position.set(0, 0.99, 0.38);
      g.add(lowerLip);

      // Blue arms
      [-1, 1].forEach((s) => {
        const arm = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 0.45, 12),
          new THREE.MeshLambertMaterial({ color: 0x5588cc })
        );
        arm.position.set(s * 0.58, 0.58, 0.05);
        arm.rotation.z = s * 0.5;
        g.add(arm);
        const hand = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 12, 12),
          new THREE.MeshLambertMaterial({ color: 0x5588cc })
        );
        hand.position.set(s * 0.72, 0.38, 0.05);
        g.add(hand);
      });

      // Right arm raised holding mustard
      const rArmUp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.45, 12),
        new THREE.MeshLambertMaterial({ color: 0x5588cc })
      );
      rArmUp.position.set(0.52, 0.95, 0.15);
      rArmUp.rotation.z = -1;
      rArmUp.rotation.x = -0.3;
      g.add(rArmUp);
      const rHandUp = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshLambertMaterial({ color: 0x5588cc })
      );
      rHandUp.position.set(0.72, 1.2, 0.2);
      g.add(rHandUp);

      // YELLOW MUSTARD BOTTLE "Nocsalod"
      const bottle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 0.58, 14),
        new THREE.MeshLambertMaterial({ color: 0xffdd00 })
      );
      bottle.position.set(0.78, 1.4, 0.24);
      bottle.rotation.z = -0.15;
      g.add(bottle);
      const nozzle = new THREE.Mesh(
        new THREE.ConeGeometry(0.06, 0.2, 10),
        new THREE.MeshLambertMaterial({ color: 0xffdd00 })
      );
      nozzle.position.set(0.82, 1.75, 0.28);
      nozzle.rotation.z = -0.15;
      g.add(nozzle);
      // Red label
      const label = new THREE.Mesh(
        new THREE.CylinderGeometry(0.105, 0.105, 0.22, 14),
        new THREE.MeshLambertMaterial({ color: 0xcc3333 })
      );
      label.position.set(0.78, 1.28, 0.24);
      label.rotation.z = -0.15;
      g.add(label);
      // Face on bottle
      const face = new THREE.Mesh(
        new THREE.CircleGeometry(0.06, 12),
        new THREE.MeshBasicMaterial({ color: 0xd4a574 })
      );
      face.position.set(0.78, 1.28, 0.36);
      g.add(face);

      // Ethereum symbol on body
      const eth = mkEthSymbol();
      eth.position.set(0, 0.7, 0.46);
      eth.scale.setScalar(1.2);
      g.add(eth);

      g.position.set(x, 0, z);
      return g;
    };

    // TINUBU DEMON (RED) with Ethereum and pump.fun
    const mkTinubu = (x, z) => {
      const g = new THREE.Group();
      g.userData = {
        hp: 80 * diff.hpMult,
        spd: 0.024 * diff.spdMult,
        pts: 180,
        type: "tinubu",
      };

      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 14),
        new THREE.MeshLambertMaterial({ color: 0x8b0000 })
      );
      body.scale.set(1, 1.2, 0.9);
      body.position.y = 0.65;
      g.add(body);

      // pump.fun on chest
      const pf = mkPumpFunLabel(0xffdd00);
      pf.position.set(0, 0.7, 0.48);
      pf.scale.setScalar(1);
      g.add(pf);

      // Ethereum symbol
      const eth = mkEthSymbol();
      eth.position.set(0, 0.5, 0.46);
      eth.scale.setScalar(1);
      g.add(eth);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 14),
        new THREE.MeshLambertMaterial({ color: 0xaa2222 })
      );
      head.position.y = 1.35;
      g.add(head);

      [-1, 1].forEach((s) => {
        const horn = new THREE.Mesh(
          new THREE.ConeGeometry(0.06, 0.35, 8),
          new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
        );
        horn.position.set(s * 0.22, 1.6, 0);
        horn.rotation.z = s * -0.4;
        g.add(horn);
      });
      [-1, 1].forEach((s) => {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0xffaa00 })
        );
        eye.position.set(s * 0.12, 1.4, 0.28);
        g.add(eye);
        const pupil = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        pupil.position.set(s * 0.12, 1.4, 0.33);
        g.add(pupil);
      });
      const mouth = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.08, 0.1),
        new THREE.MeshLambertMaterial({ color: 0x111 })
      );
      mouth.position.set(0, 1.18, 0.3);
      g.add(mouth);
      for (let i = -2; i <= 2; i++) {
        const t = new THREE.Mesh(
          new THREE.ConeGeometry(0.02, 0.06, 4),
          new THREE.MeshLambertMaterial({ color: 0xfff })
        );
        t.position.set(i * 0.045, 1.16, 0.32);
        t.rotation.x = Math.PI;
        g.add(t);
      }
      [-1, 1].forEach((s) => {
        const w = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.4, 0.3),
          new THREE.MeshLambertMaterial({ color: 0x660000 })
        );
        w.position.set(s * 0.5, 0.8, -0.15);
        w.rotation.y = s * 0.5;
        g.add(w);
      });
      const aura = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 12, 12),
        new THREE.MeshBasicMaterial({
          color: 0xff4400,
          transparent: true,
          opacity: 0.15,
        })
      );
      aura.position.y = 0.7;
      g.add(aura);
      g.position.set(x, 0, z);
      return g;
    };

    // Other enemies with Ethereum and pump.fun
    const mkSkel = (x, z) => {
      const g = new THREE.Group();
      g.userData = {
        hp: 55 * diff.hpMult,
        spd: 0.032 * diff.spdMult,
        pts: 100,
        type: "skel",
      };
      const b = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 0.72, 0.38),
        new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
      );
      b.position.y = 0.56;
      g.add(b);
      const eth = mkEthSymbol();
      eth.position.set(0, 0.56, 0.22);
      eth.scale.setScalar(1.5);
      g.add(eth);
      const pf = mkPumpFunLabel(0x888899);
      pf.position.set(0, 0.72, 0.22);
      g.add(pf);
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 14, 12),
        new THREE.MeshLambertMaterial({ color: 0xeeeedd })
      );
      s.position.y = 1.18;
      g.add(s);
      [-1, 1].forEach((s) => {
        const e = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0x000 })
        );
        e.position.set(s * 0.11, 1.2, 0.22);
        g.add(e);
      });
      g.position.set(x, 0, z);
      return g;
    };

    const mkMoney = (x, z) => {
      const g = new THREE.Group();
      g.userData = {
        hp: 85 * diff.hpMult,
        spd: 0.022 * diff.spdMult,
        pts: 150,
        type: "money",
      };
      const b = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.68, 0.42),
        new THREE.MeshLambertMaterial({ color: 0x2e7d32 })
      );
      b.position.y = 0.54;
      g.add(b);
      const eth = mkEthSymbol();
      eth.position.set(0, 0.6, 0.24);
      eth.scale.setScalar(1.3);
      g.add(eth);
      const pf = mkPumpFunLabel(0xffd700);
      pf.position.set(0, 0.75, 0.24);
      g.add(pf);
      const h = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 14, 12),
        new THREE.MeshLambertMaterial({ color: 0xd4a574 })
      );
      h.position.y = 1.12;
      g.add(h);
      const ht = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.24, 0.2, 14),
        new THREE.MeshLambertMaterial({ color: 0x1b5e20 })
      );
      ht.position.y = 1.46;
      g.add(ht);
      g.position.set(x, 0, z);
      return g;
    };

    const mkPeng = (x, z) => {
      const g = new THREE.Group();
      g.userData = {
        hp: 60 * diff.hpMult,
        spd: 0.028 * diff.spdMult,
        pts: 110,
        type: "peng",
      };
      const b = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 14, 12),
        new THREE.MeshLambertMaterial({ color: 0x1976d2 })
      );
      b.scale.set(1, 1.22, 0.92);
      b.position.y = 0.58;
      g.add(b);
      const belly = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 12, 10),
        new THREE.MeshLambertMaterial({ color: 0xd4a574 })
      );
      belly.scale.set(1, 1, 0.5);
      belly.position.set(0, 0.52, 0.22);
      g.add(belly);
      const eth = mkEthSymbol();
      eth.position.set(0, 0.55, 0.38);
      eth.scale.setScalar(1);
      g.add(eth);
      const pf = mkPumpFunLabel(0xffffff);
      pf.position.set(0, 0.7, 0.38);
      pf.scale.setScalar(0.8);
      g.add(pf);
      const h = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 14, 12),
        new THREE.MeshLambertMaterial({ color: 0x1976d2 })
      );
      h.position.y = 1.15;
      g.add(h);
      const bk = new THREE.Mesh(
        new THREE.ConeGeometry(0.07, 0.14, 8),
        new THREE.MeshLambertMaterial({ color: 0xff6600 })
      );
      bk.rotation.x = Math.PI / 2;
      bk.position.set(0, 1.02, 0.35);
      g.add(bk);
      g.position.set(x, 0, z);
      return g;
    };

    const mkRobot = (x, z) => {
      const g = new THREE.Group();
      g.userData = {
        hp: 110 * diff.hpMult,
        spd: 0.018 * diff.spdMult,
        pts: 200,
        type: "robot",
      };
      const b = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.72, 0.42),
        new THREE.MeshLambertMaterial({ color: 0x607d8b })
      );
      b.position.y = 0.56;
      g.add(b);
      const eth = mkEthSymbol();
      eth.position.set(0, 0.6, 0.24);
      eth.scale.setScalar(1.4);
      g.add(eth);
      const pf = mkPumpFunLabel(0x00ffff);
      pf.position.set(0, 0.76, 0.24);
      g.add(pf);
      const h = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.38, 0.38),
        new THREE.MeshLambertMaterial({ color: 0x78909c })
      );
      h.position.y = 1.18;
      g.add(h);
      [-1, 1].forEach((s) => {
        const e = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.07, 0.06),
          new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        e.position.set(s * 0.11, 1.2, 0.2);
        g.add(e);
      });
      g.position.set(x, 0, z);
      return g;
    };

    // === THE WHALE BOSS (Wayne's World guy with SPX on shirt) ===
    const mkBoss = () => {
      const g = new THREE.Group();
      g.userData = {
        hp: diff.bossHP,
        spd: 0.01 * (difficulty === "endgame" ? 1.4 : 1),
        pts: 5000,
        isBoss: true,
      };

      // Blue body
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 22, 20),
        new THREE.MeshLambertMaterial({ color: 0x5588cc })
      );
      body.scale.set(1, 1.15, 0.9);
      body.position.y = 1.5;
      g.add(body);

      // Yellow horizontal band/stripe
      const yellowBand = new THREE.Mesh(
        new THREE.CylinderGeometry(1.25, 1.25, 0.35, 22),
        new THREE.MeshLambertMaterial({ color: 0xffdd00 })
      );
      yellowBand.position.y = 1.8;
      g.add(yellowBand);

      // Black overalls
      const overalls = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 1.1, 1.1),
        new THREE.MeshLambertMaterial({ color: 0x111111 })
      );
      overalls.position.set(0, 0.7, 0);
      g.add(overalls);

      // Overall straps
      [-1, 1].forEach((s) => {
        const strap = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 1.1, 0.1),
          new THREE.MeshLambertMaterial({ color: 0x111111 })
        );
        strap.position.set(s * 0.45, 1.7, 0.5);
        g.add(strap);
      });

      // White/cream buttons on overalls
      [-1, 1].forEach((s) => {
        const btn = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 10, 10),
          new THREE.MeshLambertMaterial({ color: 0xeeeedd })
        );
        btn.position.set(s * 0.35, 1.25, 0.56);
        g.add(btn);
      });

      // SPX text on overalls - BLACK on black but visible
      const spxMat = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
      // S
      const s1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.05, 0.02),
        spxMat
      );
      s1.position.set(-0.35, 0.9, 0.57);
      g.add(s1);
      const s2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.02), spxMat);
      s2.position.set(-0.44, 0.83, 0.57);
      g.add(s2);
      const s3 = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.05, 0.02),
        spxMat
      );
      s3.position.set(-0.35, 0.76, 0.57);
      g.add(s3);
      const s4 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.02), spxMat);
      s4.position.set(-0.26, 0.69, 0.57);
      g.add(s4);
      const s5 = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.05, 0.02),
        spxMat
      );
      s5.position.set(-0.35, 0.62, 0.57);
      g.add(s5);
      // P
      const p1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.33, 0.02),
        spxMat
      );
      p1.position.set(0, 0.76, 0.57);
      g.add(p1);
      const p2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.05, 0.02),
        spxMat
      );
      p2.position.set(0.07, 0.9, 0.57);
      g.add(p2);
      const p3 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.02), spxMat);
      p3.position.set(0.14, 0.83, 0.57);
      g.add(p3);
      const p4 = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.05, 0.02),
        spxMat
      );
      p4.position.set(0.07, 0.76, 0.57);
      g.add(p4);
      // X
      const x1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.38, 0.02),
        spxMat
      );
      x1.position.set(0.38, 0.76, 0.57);
      x1.rotation.z = 0.45;
      g.add(x1);
      const x2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.38, 0.02),
        spxMat
      );
      x2.position.set(0.38, 0.76, 0.57);
      x2.rotation.z = -0.45;
      g.add(x2);

      // Blue head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.95, 22, 20),
        new THREE.MeshLambertMaterial({ color: 0x5588cc })
      );
      head.position.y = 3.2;
      g.add(head);

      // Black Wayne's World cap
      const capBase = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 22, 16),
        new THREE.MeshLambertMaterial({ color: 0x222222 })
      );
      capBase.scale.set(1.12, 0.42, 1.08);
      capBase.position.y = 3.7;
      g.add(capBase);
      const brim = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.1, 0.6),
        new THREE.MeshLambertMaterial({ color: 0x222222 })
      );
      brim.position.set(0, 3.55, 0.65);
      brim.rotation.x = 0.15;
      g.add(brim);
      // WAYNE'S WORLD text patch
      const textPatch = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.35, 0.02),
        new THREE.MeshBasicMaterial({ color: 0xeeeedd })
      );
      textPatch.position.set(0, 3.75, 0.92);
      g.add(textPatch);
      // Globe logo
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xccccbb })
      );
      globe.position.set(0, 3.82, 0.94);
      g.add(globe);

      // Brown wavy hair on sides
      [-1, 1].forEach((s) => {
        for (let i = 0; i < 6; i++) {
          const strand = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.22 + i * 0.12, 0.35),
            new THREE.MeshLambertMaterial({ color: 0x4a3728 })
          );
          strand.position.set(s * (0.85 + i * 0.03), 2.85 - i * 0.2, 0);
          g.add(strand);
        }
      });

      // Skin-colored eye area behind glasses
      const eyeArea = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.35, 0.2),
        new THREE.MeshLambertMaterial({ color: 0xd4a574 })
      );
      eyeArea.position.set(0, 3.35, 0.8);
      g.add(eyeArea);

      // Black rectangular glasses
      const glassesFrame = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.3, 0.08),
        new THREE.MeshLambertMaterial({ color: 0x222222 })
      );
      glassesFrame.position.set(0, 3.35, 0.9);
      g.add(glassesFrame);
      // Lens holes with eyes
      [-1, 1].forEach((s) => {
        const lens = new THREE.Mesh(
          new THREE.BoxGeometry(0.35, 0.2, 0.02),
          new THREE.MeshBasicMaterial({ color: 0xd4a574 })
        );
        lens.position.set(s * 0.3, 3.35, 0.92);
        g.add(lens);
        // Brown eyes
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x5d4037 })
        );
        eye.position.set(s * 0.3, 3.35, 0.96);
        g.add(eye);
        const pupil = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0x111 })
        );
        pupil.position.set(s * 0.3, 3.35, 1.02);
        g.add(pupil);
      });

      // Open mouth (surprised expression)
      const mouth = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 14, 14),
        new THREE.MeshLambertMaterial({ color: 0x331111 })
      );
      mouth.scale.set(1.2, 0.8, 0.5);
      mouth.position.set(0, 2.85, 0.9);
      g.add(mouth);

      // Blue arms
      [-1, 1].forEach((s) => {
        const arm = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.2, 1, 14),
          new THREE.MeshLambertMaterial({ color: 0x5588cc })
        );
        arm.position.set(s * 1.4, 1.4, 0.2);
        arm.rotation.z = s * 0.6;
        g.add(arm);
        const hand = new THREE.Mesh(
          new THREE.SphereGeometry(0.25, 14, 14),
          new THREE.MeshLambertMaterial({ color: 0x5588cc })
        );
        hand.position.set(s * 1.7, 1.0, 0.3);
        g.add(hand);
      });

      // GIANT MUSTARD BOTTLE in left hand
      const bottle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.32, 1.5, 16),
        new THREE.MeshLambertMaterial({ color: 0xffdd00 })
      );
      bottle.position.set(-2, 1.8, 0.5);
      bottle.rotation.z = 0.2;
      g.add(bottle);
      const nozzle = new THREE.Mesh(
        new THREE.ConeGeometry(0.15, 0.5, 12),
        new THREE.MeshLambertMaterial({ color: 0xffdd00 })
      );
      nozzle.position.set(-2.15, 2.65, 0.6);
      nozzle.rotation.z = 0.2;
      g.add(nozzle);
      // Red label with text
      const label = new THREE.Mesh(
        new THREE.CylinderGeometry(0.27, 0.27, 0.5, 16),
        new THREE.MeshLambertMaterial({ color: 0xcc3333 })
      );
      label.position.set(-2, 1.5, 0.5);
      label.rotation.z = 0.2;
      g.add(label);
      // Face on bottle
      const face = new THREE.Mesh(
        new THREE.CircleGeometry(0.12, 16),
        new THREE.MeshBasicMaterial({ color: 0xd4a574 })
      );
      face.position.set(-1.95, 1.5, 0.78);
      g.add(face);

      g.position.set(0, 0, -150);
      return g;
    };

    const mkGoal = () => {
      const g = new THREE.Group();
      const p = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 6, 14),
        new THREE.MeshLambertMaterial({ color: 0xffd700 })
      );
      p.position.y = 3;
      g.add(p);
      const f = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1, 0.06),
        new THREE.MeshLambertMaterial({ color: 0xf7931a })
      );
      f.position.set(0.8, 5.2, 0);
      g.add(f);
      [0.8, 1.2, 1.6].forEach((r, i) => {
        const rg = new THREE.Mesh(
          new THREE.TorusGeometry(r, 0.08, 12, 28),
          new THREE.MeshBasicMaterial({
            color: 0x44ff44,
            transparent: true,
            opacity: 0.5 - i * 0.12,
          })
        );
        rg.rotation.x = Math.PI / 2;
        rg.position.y = 0.08;
        g.add(rg);
      });
      // Hidden positions based on difficulty
      g.position.set(diff.goalX, 0, diff.goalZ);
      return g;
    };

    const mkPU = (x, z, type) => {
      const cols = { health: 0xff4444, armor: 0x4488ff, ammo: 0xffaa00 };
      const g = new THREE.Group();
      const b = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.42, 0.48),
        new THREE.MeshLambertMaterial({ color: cols[type] })
      );
      g.add(b);
      g.position.set(x, 0.78, z);
      g.userData = { type };
      pickups.push(g);
      scene.add(g);
    };

    [
      [5, 5],
      [-5, -10],
      [0, -25],
      [-6, -45],
      [6, -65],
      [0, -95],
      [-4, -115],
      [3, -145],
      [0, -180],
      [15, -230],
      [-20, -270],
      [25, -310],
      [-15, -350],
      [30, -400],
      [-25, -440],
      [10, -480],
      [diff.goalX - 5, diff.goalZ + 10],
    ].forEach(([x, z]) => mkPU(x, z, "health"));
    [
      [8, 0],
      [-8, -35],
      [0, -75],
      [4, -130],
      [15, -200],
      [-10, -260],
      [20, -320],
      [-20, -390],
      [35, -450],
      [-30, -500],
    ].forEach(([x, z]) => mkPU(x, z, "armor"));
    [
      [0, 10],
      [-6, -20],
      [6, -55],
      [0, -85],
      [-4, -120],
      [3, -160],
      [0, -195],
      [25, -240],
      [-15, -290],
      [10, -340],
      [-5, -410],
      [20, -470],
      [diff.goalX, diff.goalZ + 20],
    ].forEach(([x, z]) => mkPU(x, z, "ammo"));

    const spawnBTC = (pos) => {
      const g = new THREE.Group();
      g.add(
        new THREE.Mesh(
          new THREE.TorusGeometry(0.11, 0.025, 10, 18),
          new THREE.MeshBasicMaterial({ color: 0xf7931a })
        )
      );
      g.position.copy(pos);
      g.userData = {
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.16,
          0.13,
          (Math.random() - 0.5) * 0.16
        ),
        life: 1,
      };
      particles.push(g);
      scene.add(g);
    };

    // LIGHTNING BOLT PROJECTILE
    const spawnLightningBolt = (startPos, direction) => {
      const g = new THREE.Group();

      // Main bolt - zigzag shape
      const points = [];
      let pos = new THREE.Vector3(0, 0, 0);
      points.push(pos.clone());
      for (let i = 0; i < 5; i++) {
        pos.z -= 0.15;
        pos.x += (Math.random() - 0.5) * 0.1;
        pos.y += (Math.random() - 0.5) * 0.1;
        points.push(pos.clone());
      }

      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0xaaaaff,
        linewidth: 3,
      });
      const bolt = new THREE.Line(geo, mat);
      g.add(bolt);

      // Glowing core
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      g.add(core);

      // Outer glow
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 10, 10),
        new THREE.MeshBasicMaterial({
          color: 0xaa88ff,
          transparent: true,
          opacity: 0.5,
        })
      );
      g.add(glow);

      // Small sparks
      for (let i = 0; i < 4; i++) {
        const spark = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.03, 0),
          new THREE.MeshBasicMaterial({ color: 0xffff88 })
        );
        spark.position.set(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        );
        g.add(spark);
      }

      g.position.copy(startPos);
      g.userData = {
        vel: direction.clone().multiplyScalar(0.8),
        life: 2,
        dmg: WPNS[4].dmg,
      };

      // Orient bolt in direction of travel
      g.lookAt(startPos.clone().add(direction));

      projectiles.push(g);
      scene.add(g);
    };

    const hitWall = (p) => {
      for (const w of walls) {
        const b = new THREE.Box3().setFromObject(w);
        if (
          p.x > b.min.x - 0.4 &&
          p.x < b.max.x + 0.4 &&
          p.z > b.min.z - 0.4 &&
          p.z < b.max.z + 0.4
        )
          return true;
      }
      return false;
    };

    // === BLACK SPROTO (matching reference exactly) ===
    const mkBlackSproto = (x, z) => {
      const g = new THREE.Group();
      g.userData = {
        hp: 70 * diff.hpMult,
        spd: 0.025 * diff.spdMult,
        pts: 140,
        type: "blacksproto",
      };

      // All black body
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 18, 16),
        new THREE.MeshLambertMaterial({ color: 0x111111 })
      );
      body.scale.set(1, 1.15, 0.9);
      body.position.y = 0.6;
      g.add(body);

      // Yellow belly/chest area at bottom
      const yellowBelly = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 14, 12),
        new THREE.MeshLambertMaterial({ color: 0xffdd00 })
      );
      yellowBelly.scale.set(1.2, 0.6, 0.6);
      yellowBelly.position.set(0, 0.25, 0.25);
      g.add(yellowBelly);

      // Small red lips on chest
      const chestLips = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 10),
        new THREE.MeshLambertMaterial({ color: 0xcc2222 })
      );
      chestLips.scale.set(1.4, 0.5, 0.6);
      chestLips.position.set(0, 0.35, 0.38);
      g.add(chestLips);

      // Black head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 18, 16),
        new THREE.MeshLambertMaterial({ color: 0x111111 })
      );
      head.position.y = 1.2;
      g.add(head);

      // Spiky black hair/quills on top
      for (let i = 0; i < 5; i++) {
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.06, 0.25, 6),
          new THREE.MeshLambertMaterial({ color: 0x111111 })
        );
        spike.position.set(-0.15 + i * 0.08, 1.55, 0);
        spike.rotation.z = (i - 2) * 0.2;
        g.add(spike);
      }
      // Side spikes (left)
      for (let i = 0; i < 3; i++) {
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.05, 0.2, 6),
          new THREE.MeshLambertMaterial({ color: 0x111111 })
        );
        spike.position.set(-0.4, 1.1 - i * 0.15, 0);
        spike.rotation.z = 1.2 + i * 0.1;
        g.add(spike);
      }
      // Side spikes (right)
      for (let i = 0; i < 3; i++) {
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.05, 0.2, 6),
          new THREE.MeshLambertMaterial({ color: 0x111111 })
        );
        spike.position.set(0.4, 1.1 - i * 0.15, 0);
        spike.rotation.z = -1.2 - i * 0.1;
        g.add(spike);
      }

      // Big round YELLOW eyes with black pupils
      [-1, 1].forEach((s) => {
        const eyeWhite = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 14, 14),
          new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        eyeWhite.position.set(s * 0.15, 1.3, 0.32);
        g.add(eyeWhite);
        const pupil = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x000000 })
        );
        pupil.position.set(s * 0.15, 1.3, 0.42);
        g.add(pupil);
        // White highlight dot
        const highlight = new THREE.Mesh(
          new THREE.SphereGeometry(0.02, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        highlight.position.set(s * 0.13, 1.32, 0.46);
        g.add(highlight);
      });

      // HUGE pink/flesh colored realistic lips (main feature)
      const upperLip = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 18, 16),
        new THREE.MeshLambertMaterial({ color: 0xdda0a0 })
      );
      upperLip.scale.set(1.8, 0.6, 0.8);
      upperLip.position.set(0, 1.0, 0.35);
      g.add(upperLip);
      const lowerLip = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 18, 16),
        new THREE.MeshLambertMaterial({ color: 0xdda0a0 })
      );
      lowerLip.scale.set(2, 0.7, 0.9);
      lowerLip.position.set(0, 0.82, 0.38);
      g.add(lowerLip);
      // Lip line/crease
      const lipLine = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.02, 0.05),
        new THREE.MeshLambertMaterial({ color: 0xbb8888 })
      );
      lipLine.position.set(0, 0.92, 0.52);
      g.add(lipLine);

      const eth = mkEthSymbol();
      eth.position.set(0, 0.25, 0.45);
      eth.scale.setScalar(0.8);
      g.add(eth);
      g.position.set(x, 0, z);
      return g;
    };

    // === SONIC ENEMY ===
    const mkSonic = (x, z) => {
      const g = new THREE.Group();
      g.userData = {
        hp: 55 * diff.hpMult,
        spd: 0.038 * diff.spdMult,
        pts: 120,
        type: "sonic",
      };
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 14),
        new THREE.MeshLambertMaterial({ color: 0x1e90ff })
      );
      body.scale.set(1, 1.2, 0.85);
      body.position.y = 0.55;
      g.add(body);
      const belly = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 14, 12),
        new THREE.MeshLambertMaterial({ color: 0xd4a574 })
      );
      belly.scale.set(0.9, 1, 0.5);
      belly.position.set(0, 0.5, 0.18);
      g.add(belly);
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 16, 14),
        new THREE.MeshLambertMaterial({ color: 0x1e90ff })
      );
      head.position.y = 1.05;
      g.add(head);
      for (let i = 0; i < 6; i++) {
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.08, 0.35, 6),
          new THREE.MeshLambertMaterial({ color: 0x1e90ff })
        );
        spike.position.set(
          -0.1 - i * 0.08,
          1.15 + Math.sin(i * 0.5) * 0.05,
          -0.2
        );
        spike.rotation.x = 0.8 + i * 0.1;
        spike.rotation.z = 0.2;
        g.add(spike);
      }
      [-1, 1].forEach((s) => {
        const ear = new THREE.Mesh(
          new THREE.ConeGeometry(0.06, 0.15, 6),
          new THREE.MeshLambertMaterial({ color: 0x1e90ff })
        );
        ear.position.set(s * 0.22, 1.3, 0);
        ear.rotation.z = s * -0.3;
        g.add(ear);
      });
      const eyeArea = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      eyeArea.scale.set(1.2, 0.8, 0.5);
      eyeArea.position.set(0, 1.08, 0.22);
      g.add(eyeArea);
      [-1, 1].forEach((s) => {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0x000 })
        );
        eye.position.set(s * 0.08, 1.08, 0.32);
        g.add(eye);
      });
      const nose = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 10, 10),
        new THREE.MeshLambertMaterial({ color: 0x222 })
      );
      nose.position.set(0, 0.98, 0.35);
      g.add(nose);
      [-1, 1].forEach((s) => {
        const glove = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 10, 10),
          new THREE.MeshLambertMaterial({ color: 0xffffff })
        );
        glove.position.set(s * 0.4, 0.4, 0.1);
        g.add(glove);
      });
      [-1, 1].forEach((s) => {
        const shoe = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.1, 0.22),
          new THREE.MeshLambertMaterial({ color: 0xcc0000 })
        );
        shoe.position.set(s * 0.15, 0.05, 0.05);
        g.add(shoe);
        const stripe = new THREE.Mesh(
          new THREE.BoxGeometry(0.13, 0.03, 0.08),
          new THREE.MeshLambertMaterial({ color: 0xffffff })
        );
        stripe.position.set(s * 0.15, 0.08, 0.12);
        g.add(stripe);
      });
      const eth = mkEthSymbol();
      eth.position.set(0, 0.5, 0.35);
      eth.scale.setScalar(0.8);
      g.add(eth);
      g.position.set(x, 0, z);
      return g;
    };

    // === SUIT GUY ENEMY ===
    const mkSuitGuy = (x, z) => {
      const g = new THREE.Group();
      g.userData = {
        hp: 75 * diff.hpMult,
        spd: 0.02 * diff.spdMult,
        pts: 150,
        type: "suitguy",
      };
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.7, 0.35),
        new THREE.MeshLambertMaterial({ color: 0x2f2f2f })
      );
      body.position.y = 0.55;
      g.add(body);
      const shirt = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.35, 0.02),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );
      shirt.position.set(0, 0.6, 0.18);
      g.add(shirt);
      const tie = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.3, 0.02),
        new THREE.MeshLambertMaterial({ color: 0xcc4400 })
      );
      tie.position.set(0, 0.55, 0.2);
      g.add(tie);
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 14, 12),
        new THREE.MeshLambertMaterial({ color: 0xc68642 })
      );
      head.position.y = 1.15;
      g.add(head);
      const hair = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 12, 10),
        new THREE.MeshLambertMaterial({ color: 0x111111 })
      );
      hair.scale.set(1, 0.6, 0.9);
      hair.position.set(0, 1.32, 0);
      g.add(hair);
      [-1, 1].forEach((s) => {
        const ear = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 8, 8),
          new THREE.MeshLambertMaterial({ color: 0xc68642 })
        );
        ear.position.set(s * 0.25, 1.12, 0);
        g.add(ear);
      });
      [-1, 1].forEach((s) => {
        const eye = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.04, 0.02),
          new THREE.MeshBasicMaterial({ color: 0x222 })
        );
        eye.position.set(s * 0.08, 1.18, 0.22);
        g.add(eye);
      });
      const smile = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.03, 0.02),
        new THREE.MeshLambertMaterial({ color: 0x994444 })
      );
      smile.position.set(0, 1.02, 0.24);
      g.add(smile);
      [-1, 1].forEach((s) => {
        const arm = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.5, 0.12),
          new THREE.MeshLambertMaterial({ color: 0x2f2f2f })
        );
        arm.position.set(s * 0.32, 0.5, 0);
        g.add(arm);
      });
      const eth = mkEthSymbol();
      eth.position.set(0, 0.7, 0.2);
      eth.scale.setScalar(1);
      g.add(eth);
      g.position.set(x, 0, z);
      return g;
    };

    // === GLASSES KID (Harry Potter style) ===
    const mkGlassesKid = (x, z) => {
      const g = new THREE.Group();
      g.userData = {
        hp: 50 * diff.hpMult,
        spd: 0.024 * diff.spdMult,
        pts: 100,
        type: "glasses",
      };
      const robe = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.65, 0.35),
        new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
      );
      robe.position.y = 0.5;
      g.add(robe);
      const trim = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.1, 0.02),
        new THREE.MeshLambertMaterial({ color: 0xdd8800 })
      );
      trim.position.set(0, 0.75, 0.18);
      g.add(trim);
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 14, 12),
        new THREE.MeshLambertMaterial({ color: 0xd4a574 })
      );
      head.position.y = 1.05;
      g.add(head);
      for (let i = 0; i < 5; i++) {
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.04, 0.15, 4),
          new THREE.MeshLambertMaterial({ color: 0x3d2314 })
        );
        spike.position.set(-0.08 + i * 0.04, 1.25, 0);
        spike.rotation.z = (i - 2) * 0.15;
        g.add(spike);
      }
      [-1, 1].forEach((s) => {
        const lens = new THREE.Mesh(
          new THREE.TorusGeometry(0.07, 0.015, 8, 16),
          new THREE.MeshLambertMaterial({ color: 0x111 })
        );
        lens.position.set(s * 0.1, 1.08, 0.2);
        g.add(lens);
      });
      const bridge = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.015, 0.02),
        new THREE.MeshLambertMaterial({ color: 0x111 })
      );
      bridge.position.set(0, 1.08, 0.2);
      g.add(bridge);
      [-1, 1].forEach((s) => {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.025, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x442200 })
        );
        eye.position.set(s * 0.1, 1.08, 0.22);
        g.add(eye);
      });
      const eth = mkEthSymbol();
      eth.position.set(0, 0.6, 0.2);
      eth.scale.setScalar(0.9);
      g.add(eth);
      g.position.set(x, 0, z);
      return g;
    };

    // === SANTA PEPE ===
    const mkSantaPepe = (x, z) => {
      const g = new THREE.Group();
      g.userData = {
        hp: 85 * diff.hpMult,
        spd: 0.02 * diff.spdMult,
        pts: 170,
        type: "santapepe",
      };
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 16, 14),
        new THREE.MeshLambertMaterial({ color: 0xcc0000 })
      );
      body.scale.set(1, 1.1, 0.9);
      body.position.y = 0.55;
      g.add(body);
      const trim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.47, 0.47, 0.08, 16),
        new THREE.MeshLambertMaterial({ color: 0xffaa00 })
      );
      trim.position.y = 0.75;
      g.add(trim);
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 16, 14),
        new THREE.MeshLambertMaterial({ color: 0x3366aa })
      );
      head.scale.set(1, 0.85, 0.9);
      head.position.y = 1.15;
      g.add(head);
      [-1, 1].forEach((s) => {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0xffdd00 })
        );
        eye.scale.set(1, 0.6, 0.5);
        eye.position.set(s * 0.15, 1.25, 0.28);
        g.add(eye);
        const lid = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.04, 0.06),
          new THREE.MeshLambertMaterial({ color: 0x3366aa })
        );
        lid.position.set(s * 0.15, 1.28, 0.3);
        g.add(lid);
      });
      const mouth = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.04, 0.05),
        new THREE.MeshLambertMaterial({ color: 0x884444 })
      );
      mouth.position.set(0, 1.0, 0.32);
      g.add(mouth);
      const hatBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.38, 0.15, 16),
        new THREE.MeshLambertMaterial({ color: 0xcc0000 })
      );
      hatBase.position.y = 1.45;
      g.add(hatBase);
      const hatWhite = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.38, 0.08, 16),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );
      hatWhite.position.y = 1.38;
      g.add(hatWhite);
      const hatTop = new THREE.Mesh(
        new THREE.ConeGeometry(0.25, 0.35, 12),
        new THREE.MeshLambertMaterial({ color: 0xcc0000 })
      );
      hatTop.position.set(0.1, 1.65, -0.1);
      hatTop.rotation.z = -0.3;
      g.add(hatTop);
      const pompom = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 10, 10),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );
      pompom.position.set(0.25, 1.75, -0.15);
      g.add(pompom);
      const eth = mkEthSymbol();
      eth.position.set(0, 0.5, 0.45);
      eth.scale.setScalar(1.1);
      g.add(eth);
      g.position.set(x, 0, z);
      return g;
    };

    // ALL 11 ENEMY TYPES (including Black Sproto)
    const enemyMakers = [
      mkBlackSproto,
      mkTinubu,
      mkWaynes,
      mkSkel,
      mkMoney,
      mkPeng,
      mkRobot,
      mkSonic,
      mkSuitGuy,
      mkGlassesKid,
      mkSantaPepe,
    ];

    const spawnZone = (zn) => {
      if (spawnedZones[zn]) return;
      spawnedZones[zn] = true;
      let ct = 0,
        zMin = 0,
        zMax = 0,
        xRange = 22;
      if (zn === "start") {
        ct = Math.floor(8 * diff.countMult);
        zMin = -5;
        zMax = -35;
      } else if (zn === "mid") {
        ct = Math.floor(15 * diff.countMult);
        zMin = -40;
        zMax = -78;
      } else if (zn === "corridor") {
        ct = Math.floor(12 * diff.countMult);
        zMin = -85;
        zMax = -135;
      } else if (zn === "boss") {
        if (!bossUp && !bossDead) {
          setBossHP(diff.bossHP);
          setShowBoss(true);
          sfx("boss");
          setTimeout(() => {
            setShowBoss(false);
            const boss = mkBoss();
            enemies.push(boss);
            scene.add(boss);
            bossUp = true;
          }, 2500);
        }
        setEnemyCount(enemies.length);
        return;
      } else if (zn === "exit") {
        ct = Math.floor(18 * diff.countMult);
        zMin = -170;
        zMax = -335;
        xRange = 35;
      } else if (zn === "greenhill") {
        ct = Math.floor(20 * diff.countMult);
        zMin = -345;
        zMax = -520;
        xRange = 65;
      }
      for (let i = 0; i < ct; i++) {
        const ex = (Math.random() - 0.5) * xRange;
        const ez = zMin - Math.random() * Math.abs(zMax - zMin);
        const e = enemyMakers[Math.floor(Math.random() * enemyMakers.length)](
          ex,
          ez
        );
        enemies.push(e);
        scene.add(e);
      }
      setEnemyCount(enemies.length);
    };

    spawnZone("start");

    const shoot = () => {
      const now = Date.now();
      const w = WPNS[wIdx];
      if (now - lastShot < w.rate || wAmmo[wIdx] <= 0) return;
      lastShot = now;
      wAmmo[wIdx]--;
      setAmmo(wAmmo[wIdx]);
      if (wIdx === 0) sfx("shoot");
      else if (wIdx === 1) sfx("shotgun");
      else if (wIdx === 2) sfx("smg");
      else if (wIdx === 3) sfx("rocket");
      else sfx("wand");
      gun.position.z += 0.13;
      gun.rotation.x -= 0.09;

      // WAND shoots lightning bolt projectile
      if (wIdx === 4) {
        const dir = new THREE.Vector3(0, 0, -1);
        dir.applyQuaternion(camera.quaternion);
        const startPos = camera.position
          .clone()
          .add(dir.clone().multiplyScalar(0.5));
        spawnLightningBolt(startPos, dir);
        return;
      }

      const pellets = w.pellets || 1;
      for (let p = 0; p < pellets; p++) {
        const spread = w.pellets ? 0.12 : 0;
        const ray = new THREE.Raycaster();
        ray.setFromCamera(
          new THREE.Vector2(
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * spread
          ),
          camera
        );

        // Check enemies first
        const hits = ray.intersectObjects(enemies, true);
        if (hits.length > 0) {
          let tgt = hits[0].object;
          while (tgt.parent && !tgt.userData.hp) tgt = tgt.parent;
          if (tgt.userData?.hp !== undefined) {
            tgt.userData.hp -= w.dmg;
            spawnBTC(hits[0].point);
            sfx("hit");
            if (tgt.userData.isBoss) setBossHP(Math.max(0, tgt.userData.hp));
            if (tgt.userData.hp <= 0) {
              scene.remove(tgt);
              enemies = enemies.filter((e) => e !== tgt);
              setScore((s) => s + tgt.userData.pts);
              setKills((k) => k + 1);
              setEnemyCount(enemies.length);
              sfx("kill");
              if (tgt.userData.isBoss) {
                bossDead = true;
                bossUp = false;
                setBossHP(0);
                setShowGoal(true);
                sfx("win");
                setTimeout(() => setShowGoal(false), 3500);
              }
            }
          }
        }

        // Check animals (can shoot but they don't hurt you)
        const animalHits = ray.intersectObjects(animals, true);
        if (animalHits.length > 0) {
          let tgt = animalHits[0].object;
          while (tgt.parent && !tgt.userData.hp) tgt = tgt.parent;
          if (tgt.userData?.hp !== undefined && tgt.userData.isAnimal) {
            tgt.userData.hp -= w.dmg;
            spawnBTC(animalHits[0].point);
            sfx("hit");
            if (tgt.userData.hp <= 0) {
              scene.remove(tgt);
              animals = animals.filter((a) => a !== tgt);
              setScore((s) => s + tgt.userData.pts);
              sfx("kill");
            }
          }
        }
      }
    };

    const keys = { w: false, a: false, s: false, d: false };
    const onMD = (e) => {
      e.preventDefault();
      if (e.button === 0) lDown = true;
      if (e.button === 2) {
        rDown = true;
        lmx = e.clientX;
        lmy = e.clientY;
      }
    };
    const onMU = (e) => {
      if (e.button === 0) lDown = false;
      if (e.button === 2) rDown = false;
    };
    const onMM = (e) => {
      if (rDown) {
        yaw -= (e.clientX - lmx) * 0.008;
        pitch -= (e.clientY - lmy) * 0.008;
        pitch = Math.max(-1.2, Math.min(1.2, pitch));
      }
      lmx = e.clientX;
      lmy = e.clientY;
    };
    const onCtx = (e) => e.preventDefault();
    const onKD = (e) => {
      const k = e.key.toLowerCase();
      if ("wasd".includes(k)) keys[k] = true;
      if (k === "r") {
        wAmmo = [50, 16, 100, 8, 40];
        setAmmo(wAmmo[wIdx]);
        sfx("pu");
      }
      if (e.key === "Shift") {
        wIdx = (wIdx + 1) % 5;
        setWpnIdx(wIdx);
        setAmmo(wAmmo[wIdx]);
        sfx("switch");
        camera.remove(gun);
        gun = mkGun(wIdx);
        camera.add(gun);
      }
      if (k === " ") {
        e.preventDefault();
        shoot();
      }
    };
    const onKU = (e) => {
      const k = e.key.toLowerCase();
      if ("wasd".includes(k)) keys[k] = false;
    };

    renderer.domElement.addEventListener("mousedown", onMD);
    renderer.domElement.addEventListener("mouseup", onMU);
    renderer.domElement.addEventListener("mousemove", onMM);
    renderer.domElement.addEventListener("contextmenu", onCtx);
    window.addEventListener("keydown", onKD);
    window.addEventListener("keyup", onKU);

    const loop = () => {
      fid = requestAnimationFrame(loop);

      // Apply mobile look input (reversed left/right, matched speed)
      yaw -= mobileInput.lookX * 0.02;
      pitch -= mobileInput.lookY * 0.02;
      pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch));

      camera.rotation.order = "YXZ";
      camera.rotation.y = yaw;
      camera.rotation.x = pitch;
      if (lDown || mobileInput.fire) shoot();
      gun.position.z += (-0.52 - gun.position.z) * 0.15;
      gun.rotation.x += (0 - gun.rotation.x) * 0.15;

      // Animate wand crystal glow
      if (wIdx === 4 && gun.children.length > 2) {
        const t = Date.now() * 0.005;
        gun.children[2].scale.setScalar(0.16 + Math.sin(t) * 0.03);
      }

      const spd = 0.1;
      const fwd = new THREE.Vector3(0, 0, -1).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        yaw
      );
      const rgt = new THREE.Vector3(1, 0, 0).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        yaw
      );
      let mx = 0,
        mz = 0;
      if (keys.w) {
        mx += fwd.x * spd;
        mz += fwd.z * spd;
      }
      if (keys.s) {
        mx -= fwd.x * spd;
        mz -= fwd.z * spd;
      }
      if (keys.a) {
        mx -= rgt.x * spd;
        mz -= rgt.z * spd;
      }
      if (keys.d) {
        mx += rgt.x * spd;
        mz += rgt.z * spd;
      }

      // Apply mobile movement input (reversed forward/back, doubled speed)
      if (Math.abs(mobileInput.moveX) > 0.1 || Math.abs(mobileInput.moveY) > 0.1) {
        mx -= fwd.x * mobileInput.moveY * spd * 2;
        mz -= fwd.z * mobileInput.moveY * spd * 2;
        mx += rgt.x * mobileInput.moveX * spd * 2;
        mz += rgt.z * mobileInput.moveX * spd * 2;
      }
      const testX = new THREE.Vector3(
        camera.position.x + mx,
        1.6,
        camera.position.z
      );
      const testZ = new THREE.Vector3(
        camera.position.x,
        1.6,
        camera.position.z + mz
      );
      if (!hitWall(testX)) camera.position.x += mx;
      if (!hitWall(testZ)) camera.position.z += mz;

      playerLight.position.copy(camera.position);

      const pz = camera.position.z;
      if (pz > -35) {
        curZone = "start";
        scene.fog.near = 10;
        scene.fog.far = 60;
        scene.background.setHex(0x87ceeb);
        scene.fog.color.setHex(0x87ceeb);
      } else if (pz > -80) {
        curZone = "mid";
        scene.fog.near = 8;
        scene.fog.far = 50;
        spawnZone("mid");
      } else if (pz > -140) {
        curZone = "corridor";
        scene.fog.near = 3;
        scene.fog.far = 25;
        scene.fog.color.setHex(0x1a0a0a);
        scene.background.setHex(0x1a0a0a);
        spawnZone("corridor");
      } else if (pz > -165) {
        curZone = "boss";
        scene.fog.near = 5;
        scene.fog.far = 35;
        scene.fog.color.setHex(0x2a0a0a);
        scene.background.setHex(0x2a0a0a);
        spawnZone("boss");
      } else if (pz > -340) {
        curZone = "exit";
        scene.fog.near = 4;
        scene.fog.far = 30;
        scene.fog.color.setHex(0x1a1a0a);
        scene.background.setHex(0x2a2a1a);
        spawnZone("exit");
        if (bossDead && !goal) {
          goal = mkGoal();
          scene.add(goal);
          setHasGoal(true);
        }
      } else {
        curZone = "greenhill";
        scene.fog.near = 20;
        scene.fog.far = 90;
        scene.fog.color.setHex(0x87ceeb);
        scene.background.setHex(0x4fc3f7);
        spawnZone("greenhill");
      }
      setZone(curZone);

      // Update lightning bolt projectiles
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const proj = projectiles[i];
        proj.position.add(proj.userData.vel);
        proj.userData.life -= 0.016;

        // Rotate sparks
        proj.children.forEach((c, idx) => {
          if (idx > 2) c.rotation.x += 0.2;
          c.rotation.y += 0.3;
        });

        // Check collision with enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (proj.position.distanceTo(e.position) < 1.2) {
            e.userData.hp -= proj.userData.dmg;
            sfx("hit");
            // Spawn electric sparks
            for (let k = 0; k < 5; k++) {
              const spark = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.05, 0),
                new THREE.MeshBasicMaterial({ color: 0xaaaaff })
              );
              spark.position.copy(proj.position);
              spark.userData = {
                vel: new THREE.Vector3(
                  (Math.random() - 0.5) * 0.2,
                  Math.random() * 0.15,
                  (Math.random() - 0.5) * 0.2
                ),
                life: 0.5,
              };
              particles.push(spark);
              scene.add(spark);
            }
            if (e.userData.isBoss) setBossHP(Math.max(0, e.userData.hp));
            if (e.userData.hp <= 0) {
              scene.remove(e);
              enemies.splice(j, 1);
              setScore((s) => s + e.userData.pts);
              setKills((k) => k + 1);
              setEnemyCount(enemies.length);
              sfx("kill");
              if (e.userData.isBoss) {
                bossDead = true;
                bossUp = false;
                setBossHP(0);
                setShowGoal(true);
                sfx("win");
                setTimeout(() => setShowGoal(false), 3500);
              }
            }
            proj.userData.life = 0;
            break;
          }
        }

        if (proj.userData.life <= 0) {
          scene.remove(proj);
          projectiles.splice(i, 1);
        }
      }

      let hit = false;
      enemies.forEach((e) => {
        const dx = camera.position.x - e.position.x;
        const dz = camera.position.z - e.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist > 1.2) {
          e.position.x += (dx / dist) * e.userData.spd;
          e.position.z += (dz / dist) * e.userData.spd;
        } else hit = true;
        e.rotation.y = Math.atan2(dx, dz);
        e.position.y = Math.sin(Date.now() * 0.005) * 0.04;
      });

      // Animals wander randomly (don't chase player, don't hurt player)
      animals.forEach((a) => {
        // Random wandering - change direction occasionally
        if (!a.userData.wanderDir || Math.random() < 0.01) {
          a.userData.wanderDir = {
            x: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02,
          };
        }
        a.position.x += a.userData.wanderDir.x;
        a.position.z += a.userData.wanderDir.z;
        // Keep in ranch bounds
        if (a.position.x < -55) a.position.x = -55;
        if (a.position.x > 55) a.position.x = 55;
        if (a.position.z > -355) a.position.z = -355;
        if (a.position.z < -530) a.position.z = -530;
        // Face direction of movement
        if (a.userData.wanderDir)
          a.rotation.y = Math.atan2(
            a.userData.wanderDir.x,
            a.userData.wanderDir.z
          );
        // Gentle bobbing
        a.position.y = Math.sin(Date.now() * 0.003 + a.position.x) * 0.02;
      });

      if (hit) {
        const dmg = 0.22 * diff.dmgMult;
        if (arm > 0) {
          arm -= dmg * 0.5;
          setArmor(Math.max(0, arm));
        }
        hp -= arm > 0 ? dmg * 0.5 : dmg;
        setHealth(Math.max(0, hp));
        if (Date.now() - lastHurt > 400) {
          sfx("hurt");
          lastHurt = Date.now();
        }
        if (hp <= 0) {
          stopMusic();
          setScreen("gameover");
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.userData.vel) {
          p.position.add(p.userData.vel);
          p.userData.vel.y -= 0.005;
        }
        if (p.rotation) p.rotation.y += 0.12;
        p.userData.life -= 0.025;
        if (p.scale && p.userData.life > 0)
          p.scale.setScalar(Math.max(0.01, p.userData.life));
        if (p.userData.life <= 0) {
          scene.remove(p);
          particles.splice(i, 1);
        }
      }

      for (let i = pickups.length - 1; i >= 0; i--) {
        const pu = pickups[i];
        pu.rotation.y += 0.03;
        pu.position.y = 0.78 + Math.sin(Date.now() * 0.004) * 0.12;
        if (camera.position.distanceTo(pu.position) < 1.3) {
          if (pu.userData.type === "health") {
            hp = Math.min(100, hp + 30);
            setHealth(hp);
          } else if (pu.userData.type === "armor") {
            arm = Math.min(100, arm + 25);
            setArmor(arm);
          } else if (pu.userData.type === "ammo") {
            wAmmo = [50, 16, 100, 8, 40];
            setAmmo(wAmmo[wIdx]);
          }
          sfx("pu");
          scene.remove(pu);
          pickups.splice(i, 1);
        }
      }

      if (goal) {
        goal.rotation.y += 0.02;
        if (camera.position.distanceTo(goal.position) < 3) {
          setScore((s) => s + 2000);
          sfx("win");
          stopMusic();
          setScreen("victory");
        }
      }


      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(fid);
      stopMusic();
      renderer.domElement.removeEventListener("mousedown", onMD);
      renderer.domElement.removeEventListener("mouseup", onMU);
      renderer.domElement.removeEventListener("mousemove", onMM);
      renderer.domElement.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("keydown", onKD);
      window.removeEventListener("keyup", onKU);
      if (mobileControls) {
        mobileControls.destroy();
      }
      if (containerRef.current?.contains(renderer.domElement))
        containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [screen, charIdx, difficulty, sfx, startMusic, stopMusic]);
   const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .limit(20);
    if (data) setLeaderboard(data);
  };

  const handleRegister = async () => {
    setAuthError("");
    if (!authUsername || !authPassword || !authEmail) { setAuthError("Fill in all fields"); return; }    
    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });
    if (error) { setAuthError(error.message); return; }
    await supabase.from("profiles").insert({ id: data.user.id, username: authUsername });
    setUser(data.user);
    setUsername(authUsername);
    setScreen("menu");
  };

  const handleLogin = async () => {
    setAuthError("");
    if (!authUsername || !authPassword || !authEmail) { setAuthError("Fill in all fields"); return; }    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,      
      password: authPassword,
    });
    if (error) { setAuthError(error.message); return; }
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", data.user.id).single();
    setUser(data.user);
    setUsername(profile?.username || authUsername);
    setScreen("menu");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUsername("");
  };

  const submitScore = async (finalScore, finalKills, timeSeconds) => {
    if (!user) return;
    await supabase.from("leaderboard").insert({
      user_id: user.id,
      username: username,
      score: finalScore,
      kills: finalKills,
      time_seconds: timeSeconds,
      difficulty: difficulty,
    });
  };
   const startGame = () => {
    setScreen("playing");
    setScore(0);
    setHealth(100);
    setArmor(0);
    setAmmo(50);
    setKills(0);
    setBossHP(0);
    setShowBoss(false);
    setShowGoal(false);
    setHasGoal(false);
    setZone("start");
    setWpnIdx(0);
  };

  const F = {
    fontFamily: "monospace",
    fontWeight: "bold",
    textShadow: "2px 2px 0 #000",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
 {screen === "auth" && (
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(#1a1a2e,#000)", zIndex:10 }}>
          <h1 style={{ ...F, fontSize:"32px", color:"#FFD700", marginBottom:"20px" }}>SPROTO EYE</h1>
          <div style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
            <button onClick={() => setAuthScreen("login")} style={{ ...F, fontSize:"12px", padding:"8px 20px", background: authScreen==="login" ? "#FFD700" : "#333", color: authScreen==="login" ? "#000" : "#FFF", border:"2px solid #FFD700", cursor:"pointer", borderRadius:"6px" }}>LOGIN</button>
            <button onClick={() => setAuthScreen("register")} style={{ ...F, fontSize:"12px", padding:"8px 20px", background: authScreen==="register" ? "#FFD700" : "#333", color: authScreen==="register" ? "#000" : "#FFF", border:"2px solid #FFD700", cursor:"pointer", borderRadius:"6px" }}>REGISTER</button>
          </div>
          <input placeholder="USERNAME" value={authUsername} onChange={e => setAuthUsername(e.target.value)} style={{ ...F, fontSize:"14px", padding:"10px", marginBottom:"10px", width:"220px", background:"#111", color:"#FFF", border:"2px solid #444", borderRadius:"6px" }} />
   <input placeholder="EMAIL" type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} style={{ ...F, fontSize:"14px", padding:"10px", marginBottom:"10px", width:"220px", background:"#111", color:"#FFF", border:"2px solid #444", borderRadius:"6px" }} />          
   <input placeholder="PASSWORD" type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} style={{ ...F, fontSize:"14px", padding:"10px", marginBottom:"10px", width:"220px", background:"#111", color:"#FFF", border:"2px solid #444", borderRadius:"6px" }} />
          {authError && <p style={{ ...F, fontSize:"11px", color:"#FF4444", marginBottom:"10px" }}>{authError}</p>}
          <button onClick={authScreen==="login" ? handleLogin : handleRegister} style={{ ...F, fontSize:"14px", padding:"10px 40px", background:"linear-gradient(#FFD700,#B8860B)", color:"#000", border:"4px solid #FFF68F", cursor:"pointer", borderRadius:"10px", marginBottom:"15px" }}>
            {authScreen==="login" ? "LOGIN" : "CREATE ACCOUNT"}
          </button>
          <button onClick={() => setScreen("menu")} style={{ ...F, fontSize:"11px", padding:"6px 20px", background:"transparent", color:"#666", border:"1px solid #333", cursor:"pointer", borderRadius:"6px" }}>PLAY WITHOUT ACCOUNT</button>
        </div>
      )}

      {screen === "leaderboard" && (
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", background:"linear-gradient(#1a1a2e,#000)", zIndex:10, padding:"20px", overflowY:"auto" }}>
          <h1 style={{ ...F, fontSize:"28px", color:"#FFD700", marginBottom:"20px" }}>🏆 LEADERBOARD</h1>
          <div style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
            {["easy","sproto","endgame"].map(d => (
              <button key={d} onClick={() => { setDifficulty(d); fetchLeaderboard(); }} style={{ ...F, fontSize:"11px", padding:"6px 14px", background: difficulty===d ? "#FFD700" : "#333", color: difficulty===d ? "#000" : "#FFF", border:"2px solid #555", cursor:"pointer", borderRadius:"6px" }}>{d.toUpperCase()}</button>
            ))}
          </div>
          <div style={{ width:"100%", maxWidth:"500px" }}>
            {leaderboard.filter(e => e.difficulty === difficulty).length === 0 && <p style={{ ...F, color:"#666", textAlign:"center" }}>No scores yet for this difficulty!</p>}
            {leaderboard.filter(e => e.difficulty === difficulty).map((entry, i) => (
              <div key={entry.id} style={{ display:"flex", justifyContent:"space-between", padding:"10px 15px", marginBottom:"6px", background: i===0 ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.05)", border: i===0 ? "2px solid #FFD700" : "1px solid #333", borderRadius:"8px" }}>
                <span style={{ ...F, color: i===0 ? "#FFD700" : i===1 ? "#CCCCCC" : i===2 ? "#CD7F32" : "#888", fontSize:"14px" }}>#{i+1} {entry.username}</span>
                <span style={{ ...F, color:"#FFF", fontSize:"14px" }}>{entry.score} pts</span>
                <span style={{ ...F, color:"#888", fontSize:"11px" }}>{entry.kills}💀</span>
              </div>
            ))}
          </div>
          <button onClick={() => setScreen("menu")} style={{ ...F, fontSize:"14px", padding:"10px 30px", marginTop:"20px", background:"#333", color:"#FFF", border:"2px solid #555", cursor:"pointer", borderRadius:"8px" }}>BACK</button>
        </div>
      )}{screen === "menu" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(#1a1a2e,#000)",
            zIndex: 10,
            padding: "20px",
          }}
        >
          <h1
            style={{
              ...F,
              fontSize: "42px",
              color: "#FFD700",
              marginBottom: "15px",
            }}
          >
            SPROTO EYE
          </h1>
          <p
            style={{
              ...F,
              fontSize: "12px",
              color: "#888",
              marginBottom: "15px",
            }}
          >
            SELECT CHARACTER
          </p>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {CHARS.map((c, i) => (
              <div
                key={c.name}
                onClick={() => setCharIdx(i)}
                style={{
                  cursor: "pointer",
                  padding: "6px",
                  background:
                    charIdx === i ? "rgba(255,215,0,0.3)" : "rgba(0,0,0,0.5)",
                  border:
                    charIdx === i ? "3px solid #FFD700" : "3px solid #444",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <CharPortrait idx={i} size={60} />
                <div
                  style={{
                    ...F,
                    fontSize: "8px",
                    color: charIdx === i ? "#FFD700" : "#888",
                    marginTop: "4px",
                  }}
                >
                  {c.name}
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              ...F,
              fontSize: "12px",
              color: "#888",
              marginBottom: "10px",
            }}
          >
            SELECT DIFFICULTY
          </p>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            {[
              ["easy", "EASY", "#44AA44"],
              ["sproto", "SPROTO", "#FFAA00"],
              ["endgame", "ENDGAME", "#FF4444"],
            ].map(([d, label, col]) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  ...F,
                  fontSize: "12px",
                  padding: "10px 18px",
                  background: difficulty === d ? col : "#333",
                  color: "#FFF",
                  border:
                    difficulty === d ? `3px solid ${col}` : "3px solid #555",
                  cursor: "pointer",
                  borderRadius: "6px",
                  opacity: difficulty === d ? 1 : 0.7,
                }}
              >
                {label}
              </button>
            ))}
          </div>
<div style={{ display:"flex", gap:"10px", marginBottom:"15px" }}>
            <button onClick={() => { fetchLeaderboard(); setScreen("leaderboard"); }} style={{ ...F, fontSize:"11px", padding:"8px 16px", background:"#333", color:"#FFD700", border:"2px solid #FFD700", cursor:"pointer", borderRadius:"6px" }}>🏆 LEADERBOARD</button>
            {user ? (
              <button onClick={handleLogout} style={{ ...F, fontSize:"11px", padding:"8px 16px", background:"#333", color:"#FF4444", border:"2px solid #FF4444", cursor:"pointer", borderRadius:"6px" }}>LOGOUT ({username})</button>
            ) : (
              <button onClick={() => setScreen("auth")} style={{ ...F, fontSize:"11px", padding:"8px 16px", background:"#333", color:"#88FF88", border:"2px solid #88FF88", cursor:"pointer", borderRadius:"6px" }}>LOGIN / REGISTER</button>
            )}
          </div><button
            onClick={startGame}
            style={{
              ...F,
              fontSize: "16px",
              padding: "12px 40px",
              background: "linear-gradient(#FFD700,#B8860B)",
              color: "#000",
              border: "4px solid #FFF68F",
              cursor: "pointer",
              borderRadius: "10px",
            }}
          >
            PLAY AS {CHARS[charIdx].name.toUpperCase()}
          </button>
          <div
            style={{
              ...F,
              fontSize: "9px",
              color: "#555",
              marginTop: "20px",
              textAlign: "center",
              lineHeight: "1.8",
            }}
          >
            <div>WASD = MOVE | RIGHT-CLICK DRAG = LOOK</div>
            <div>LEFT-CLICK = SHOOT | SHIFT = WEAPON | R = RELOAD</div>
            <div style={{ color: "#AA44FF", marginTop: "8px" }}>
              ⚡ MAGIC WAND SHOOTS LIGHTNING BOLTS ⚡
            </div>
          </div>
        </div>
      )}

      {screen === "gameover" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.95)",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
         
          <img src={GAMEOVER_IMAGE} alt="Game Over" style={{width:"300px",height:"300px",objectFit:"cover",borderRadius:"10px",margin:"20px 0"}} />          {/* Selected character with X eyes and Bitcoins */}
          

          {/* Character name */}
          <p
            style={{
              ...F,
              fontSize: "16px",
              color: "#FF6666",
              marginTop: "10px",
            }}
          >
            {CHARS[charIdx].name} IS DEAD
          </p>

          
          <button
            onClick={() => { submitScore(score, kills, 0); setScreen("menu"); }}            style={{
              ...F,
              fontSize: "14px",
              padding: "10px 30px",
              marginTop: "20px",
              background: "#CC3333",
              color: "#FFF",
              border: "3px solid #FF6666",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            TRY AGAIN
          </button>
        </div>
      )}

      {screen === "victory" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(#1a3a1a,#000)",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
         
        

          <h1
            style={{
              ...F,
              fontSize: "32px",
              color: "#44FF44",
              textShadow: "0 0 25px #44FF44",
            }}
          >
            MAXIMUM RETENTION!
          </h1>
          <img src={VICTORY_IMAGE} alt="Victory" style={{width:"300px",height:"300px",objectFit:"cover",borderRadius:"10px",margin:"20px 0"}} />
          <div style={{ fontSize: "50px", margin: "10px 0" }}>🏆</div>
          <p style={{ ...F, fontSize: "18px", color: "#FFF" }}>
            SCORE: {score}
          </p>
          <p
            style={{ ...F, fontSize: "12px", color: "#888", marginTop: "8px" }}
          >
            KILLS: {kills} • {difficulty.toUpperCase()} MODE
          </p>
          <button
            onClick={() => { submitScore(score, kills, 0); setScreen("menu"); }}            style={{
              ...F,
              fontSize: "14px",
              padding: "10px 30px",
              marginTop: "20px",
              background: "#44AA44",
              color: "#FFF",
              border: "3px solid #66FF66",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {screen === "playing" && (
        <>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "3px",
                background: "#0F0",
                position: "absolute",
                left: "-12px",
                top: "-1px",
                boxShadow: "0 0 6px #0F0",
              }}
            />
            <div
              style={{
                width: "3px",
                height: "24px",
                background: "#0F0",
                position: "absolute",
                left: "-1px",
                top: "-12px",
                boxShadow: "0 0 6px #0F0",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "15px",
              left: "15px",
              zIndex: 5,
            }}
          >
            <div
              style={{
                ...F,
                fontSize: "9px",
                color: "#888",
                marginBottom: "4px",
              }}
            >
              {CHARS[charIdx].name} | {difficulty.toUpperCase()}
            </div>
            <div
              style={{
                ...F,
                fontSize: "10px",
                color: "#FF4444",
                marginBottom: "2px",
              }}
            >
              HP
            </div>
            <div
              style={{
                width: "110px",
                height: "11px",
                background: "#333",
                border: "2px solid #555",
                borderRadius: "3px",
              }}
            >
              <div
                style={{
                  width: `${health}%`,
                  height: "100%",
                  background: health > 30 ? "#FF4444" : "#FF0000",
                  borderRadius: "2px",
                }}
              />
            </div>
            <div
              style={{
                ...F,
                fontSize: "10px",
                color: "#4488FF",
                marginTop: "5px",
                marginBottom: "2px",
              }}
            >
              ARM
            </div>
            <div
              style={{
                width: "110px",
                height: "11px",
                background: "#333",
                border: "2px solid #555",
                borderRadius: "3px",
              }}
            >
              <div
                style={{
                  width: `${armor}%`,
                  height: "100%",
                  background: "#4488FF",
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "15px",
              right: "15px",
              zIndex: 5,
              textAlign: "right",
            }}
          >
            <div
              style={{
                ...F,
                fontSize: "11px",
                color: WPNS[wpnIdx].col,
                marginBottom: "3px",
              }}
            >
              {WPNS[wpnIdx].name}
            </div>
            <div
              style={{
                ...F,
                fontSize: "20px",
                color: ammo <= 5 ? "#FF4444" : "#FFF",
              }}
            >
              {ammo}
              <span style={{ fontSize: "11px", color: "#888" }}>
                /{WPNS[wpnIdx].max}
              </span>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              zIndex: 5,
            }}
          >
            <div style={{ ...F, fontSize: "14px", color: "#FFD700" }}>
              SCORE: {score}
            </div>
            <div
              style={{
                ...F,
                fontSize: "9px",
                color:
                  zone === "corridor"
                    ? "#FF4444"
                    : zone === "boss"
                    ? "#FF0000"
                    : zone === "greenhill"
                    ? "#DAA520"
                    : "#888",
                marginTop: "4px",
              }}
            >
              {zone === "start"
                ? "ENTRANCE"
                : zone === "mid"
                ? "MIDWAY"
                : zone === "corridor"
                ? "⚠ DARK CORRIDOR"
                : zone === "boss"
                ? "💀 BOSS ARENA"
                : zone === "exit"
                ? "🚪 EXIT"
                : "🤠 SPROTO RANCH"}
            </div>
            <div
              style={{ ...F, fontSize: "8px", color: "#666", marginTop: "3px" }}
            >
              ENEMIES: {enemyCount} | KILLS: {kills}
            </div>
          </div>
          {bossHP > 0 && (
            <div
              style={{
                position: "absolute",
                top: "65px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 5,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  ...F,
                  fontSize: "11px",
                  color: "#5588CC",
                  marginBottom: "4px",
                }}
              >
                THE WHALE - SPX
              </div>
              <div
                style={{
                  width: "200px",
                  height: "14px",
                  background: "#111",
                  border: "3px solid #444",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{
                    width: `${(bossHP / maxBossHP) * 100}%`,
                    height: "100%",
                    background: "linear-gradient(90deg,#DDA0A0,#FFAAAA)",
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>
          )}
          {showBoss && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.9)",
                zIndex: 15,
              }}
            >
              <p style={{ ...F, fontSize: "22px", color: "#FF4444" }}>
                ⚠ WARNING ⚠
              </p>
              <p
                style={{
                  ...F,
                  fontSize: "36px",
                  color: "#5588CC",
                  marginTop: "12px",
                }}
              >
                THE WHALE
              </p>
              <p
                style={{
                  ...F,
                  fontSize: "18px",
                  color: "#FFDD00",
                  marginTop: "8px",
                }}
              >
                WAYNE'S WORLD SPX
              </p>
            </div>
          )}
          {showGoal && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,50,0,0.9)",
                zIndex: 15,
              }}
            >
              <p style={{ ...F, fontSize: "18px", color: "#44FF44" }}>
                ★ THE WHALE DEFEATED! ★
              </p>
              <p
                style={{
                  ...F,
                  fontSize: "28px",
                  color: "#FFD700",
                  marginTop: "12px",
                }}
              >
                ESCAPE TO SPROTO RANCH!
              </p>
            </div>
          )}
          {hasGoal && !showGoal && (
            <div
              style={{
                position: "absolute",
                top: "90px",
                left: "50%",
                transform: "translateX(-50%)",
                ...F,
                fontSize: "11px",
                color: "#44FF44",
                zIndex: 5,
              }}
            >
              🤠 PROTECT THE RANCH! FIND THE GOAL! 🤠
            </div>
          )}
        </>
      )}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
export default SprotoEye;
