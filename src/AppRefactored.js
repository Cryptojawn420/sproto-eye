import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import * as THREE from "three";

// Import modules
import { gameState, GameState } from "./modules/gameState.js";
import { audioSystem } from "./modules/audioSystem.js";
import { weaponSystem } from "./modules/weaponSystem.js";
import { CHARACTERS, CHARACTER_IMAGES, DIFFICULTIES, SUPABASE_CONFIG, HAND_COLORS } from "./config/gameConstants.js";
import levelData from "./data/levelData.js";

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

// TODO: Extract Three.js scene building to separate module
// TODO: Extract enemy AI to separate module
// TODO: Extract game loop logic to separate module
// TODO: Extract UI components to separate React components

function SprotoEye() {
  const containerRef = useRef(null);
  const [gameStateUI, setGameStateUI] = useState({
    screen: "menu",
    charIdx: 0,
    difficulty: "easy",
    score: 0,
    health: 100,
    armor: 0,
    ammo: 50,
    kills: 0,
    bossHP: 0,
    maxBossHP: 800,
    username: "",
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const gameRef = useRef(new GameState());

  // Initialize game and Three.js
  useEffect(() => {
    if (gameStateUI.screen !== "playing") return;

    const game = gameRef.current;
    const container = containerRef.current;
    if (!container) return;

    const diff = DIFFICULTIES[gameStateUI.difficulty];
    audioSystem.startMusic();

    // === THREE.JS SETUP ===
    const W = container.clientWidth;
    const H = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 10, 60);

    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 200);
    camera.position.set(0, 1.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const sun = new THREE.DirectionalLight(0xffffee, 0.6);
    sun.position.set(10, 20, 5);
    scene.add(sun);

    // === BUILD LEVEL FROM DATA ===
    const buildStartZone = () => {
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(
          levelData.startZone.floor.width,
          levelData.startZone.floor.depth
        ),
        new THREE.MeshLambertMaterial({ color: levelData.startZone.floor.color })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(...levelData.startZone.floor.position);
      scene.add(floor);

      // Build walls from config
      levelData.startZone.walls.forEach((wall) => {
        const m = new THREE.Mesh(
          new THREE.BoxGeometry(wall.w, 5, wall.d),
          new THREE.MeshLambertMaterial({ color: wall.color })
        );
        m.position.set(wall.x, 2.5, wall.z);
        scene.add(m);
      });
    };

    buildStartZone();

    // Input tracking
    let yaw = Math.PI;
    let pitch = 0;
    let lDown = false;
    let rDown = false;
    let lmx = 0;
    let lmy = 0;

    const onMouseMove = (e) => {
      if (!lDown) return;
      const dx = e.clientX - lmx;
      const dy = e.clientY - lmy;
      yaw -= dx * 0.005;
      pitch -= dy * 0.005;
      pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch));
      lmx = e.clientX;
      lmy = e.clientY;

      camera.rotation.order = "YXZ";
      camera.rotation.y = yaw;
      camera.rotation.x = pitch;
    };

    const onMouseDown = (e) => {
      if (e.button === 0) {
        lDown = true;
        lmx = e.clientX;
        lmy = e.clientY;
      }
    };

    const onMouseUp = () => {
      lDown = false;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("contextmenu", (e) => e.preventDefault());

    // Main game loop
    let hp = 100;
    let arm = 0;
    let frameCount = 0;

    const animate = () => {
      frameCount++;
      const now = Date.now();

      // Update game state for UI
      setGameStateUI((prev) => ({
        ...prev,
        score: game.game.score,
        health: Math.max(0, game.player.hp),
        armor: game.player.armor,
        ammo: game.weapon.ammo[game.weapon.currentIdx],
        kills: game.game.kills,
        bossHP: game.boss.hp,
        maxBossHP: game.boss.maxHp,
      }));

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseup", onMouseUp);
      audioSystem.stopMusic();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [gameStateUI.screen, gameStateUI.difficulty]);

  // UI Handlers
  const startGame = () => {
    gameRef.current.reset();
    gameRef.current.game.characterIdx = gameStateUI.charIdx;
    gameRef.current.game.difficulty = gameStateUI.difficulty;
    setGameStateUI((prev) => ({ ...prev, screen: "playing" }));
  };

  const selectCharacter = (idx) => {
    setGameStateUI((prev) => ({ ...prev, charIdx: idx }));
  };

  const selectDifficulty = (diff) => {
    setGameStateUI((prev) => ({ ...prev, difficulty: diff }));
  };

  // Render UI based on screen
  if (gameStateUI.screen === "menu") {
    return (
      <div style={styles.container}>
        <div style={styles.menu}>
          <h1>SPROTO EYE</h1>
          <p>A HarryPotterObamaSonic10inu FPS</p>
          <button onClick={() => setGameStateUI((prev) => ({ ...prev, screen: "charselect" }))}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameStateUI.screen === "charselect") {
    return (
      <div style={styles.container}>
        <div style={styles.menu}>
          <h2>Select Character</h2>
          <div style={styles.charGrid}>
            {CHARACTERS.map((char, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.charOption,
                  border: gameStateUI.charIdx === idx ? "3px solid yellow" : "1px solid gray",
                }}
                onClick={() => selectCharacter(idx)}
              >
                <img src={CHARACTER_IMAGES[idx]} alt={char.name} style={styles.charImage} />
                <p>{char.name}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setGameStateUI((prev) => ({ ...prev, screen: "diffselect" }))}>
            Next
          </button>
        </div>
      </div>
    );
  }

  if (gameStateUI.screen === "diffselect") {
    return (
      <div style={styles.container}>
        <div style={styles.menu}>
          <h2>Select Difficulty</h2>
          <div style={styles.diffGrid}>
            {["easy", "sproto", "endgame"].map((diff) => (
              <button
                key={diff}
                onClick={() => selectDifficulty(diff)}
                style={{
                  ...styles.diffButton,
                  backgroundColor: gameStateUI.difficulty === diff ? "yellow" : "gray",
                }}
              >
                {diff.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={startGame}>Play</button>
        </div>
      </div>
    );
  }

  if (gameStateUI.screen === "playing") {
    return (
      <div style={styles.container}>
        <div ref={containerRef} style={styles.game} />
        <div style={styles.hud}>
          <div style={styles.hudPanel}>
            <p>Health: {gameStateUI.health}</p>
            <p>Armor: {gameStateUI.armor}</p>
            <p>Ammo: {gameStateUI.ammo}</p>
            <p>Score: {gameStateUI.score}</p>
            <p>Kills: {gameStateUI.kills}</p>
          </div>
        </div>
      </div>
    );
  }

  return <div style={styles.container}>Loading...</div>;
}

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    margin: 0,
    padding: 0,
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#000",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    color: "white",
    textAlign: "center",
  },
  charGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },
  charOption: {
    padding: "10px",
    cursor: "pointer",
    textAlign: "center",
  },
  charImage: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  diffGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },
  diffButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    color: "black",
  },
  game: {
    width: "100%",
    height: "100%",
  },
  hud: {
    position: "absolute",
    top: "10px",
    left: "10px",
    color: "white",
    fontFamily: "monospace",
    fontSize: "14px",
  },
  hudPanel: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "10px",
    borderRadius: "5px",
  },
};

export default SprotoEye;
