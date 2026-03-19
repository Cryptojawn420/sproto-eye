export class MobileControls {
  constructor(containerElement) {
    this.container = containerElement;
    this.isActive = false;
    this.touchState = {
      leftJoystick: { x: 0, y: 0, active: false, pointerId: null },
      rightJoystick: { x: 0, y: 0, active: false, pointerId: null },
      firePressed: false,
    };
    this.joystickRadius = 50;
    this.deadZone = 0.1;
    this.callbacks = { 
      onMove: null, 
      onLook: null, 
      onFire: null, 
      onWeaponSwap: null, 
      onReload: null
    };
    // Options set via init()
    this.autoReload = false;
    this.autoLockOn = false;
    this.isReloading = false;
    this.gameState = null;
    this.isLandscape = false;
  }

  init(options = {}) {
    // Apply options (set during character select, before game starts)
    if (options.autoReload !== undefined) this.autoReload = options.autoReload;
    if (options.autoLockOn !== undefined) this.autoLockOn = options.autoLockOn;
    
    // Detect orientation
    this.detectOrientation();
    window.addEventListener('orientationchange', () => {
      this.detectOrientation();
      this.updateUILayout();
    });
    window.addEventListener('resize', () => {
      this.detectOrientation();
      this.updateUILayout();
    });
    
    this.createTouchUI();
    this.updateUILayout(); // Apply initial layout
    this.attachListeners();
    this.isActive = true;
    
    if (this.autoReload) {
      this.startAutoReloadCheck();
    }
  }

  detectOrientation() {
    this.isLandscape = window.innerWidth > window.innerHeight;
    if (this.isActive) {
      this.updateUILayout();
    }
  }

  updateUILayout() {
    const leftJoy = document.getElementById("left-joystick-bg");
    const rightJoy = document.getElementById("right-joystick-bg");
    const fireBtn = document.getElementById("fire-button");
    const weaponPanel = document.getElementById("weapon-swap");

    if (!leftJoy || !rightJoy || !fireBtn || !weaponPanel) return;

    if (this.isLandscape) {
      // Landscape: joysticks at edges, fire button centered above them
      leftJoy.style.bottom = "15vh";
      leftJoy.style.left = "5vw";
      leftJoy.style.right = "auto";
      
      rightJoy.style.bottom = "15vh";
      rightJoy.style.right = "5vw";
      rightJoy.style.left = "auto";
      
      // Fire button: centered, way above the joysticks to avoid overlap
      fireBtn.style.bottom = "55vh";
      fireBtn.style.left = "50%";
      fireBtn.style.right = "auto";
      fireBtn.style.transform = "translateX(-50%)";
      
      weaponPanel.style.bottom = "auto";
      weaponPanel.style.top = "2vh";
      weaponPanel.style.left = "50%";
      weaponPanel.style.transform = "translateX(-50%)";
    } else {
      // Portrait: original positions
      leftJoy.style.bottom = "100px";
      leftJoy.style.left = "20px";
      leftJoy.style.right = "auto";
      
      rightJoy.style.bottom = "100px";
      rightJoy.style.right = "20px";
      rightJoy.style.left = "auto";
      
      // Fire button: centered between joysticks, above them
      fireBtn.style.bottom = "120px";
      fireBtn.style.left = "50%";
      fireBtn.style.right = "auto";
      fireBtn.style.transform = "translateX(-50%)";
      
      weaponPanel.style.bottom = "5px";
      weaponPanel.style.top = "auto";
      weaponPanel.style.left = "50%";
      weaponPanel.style.transform = "translateX(-50%)";
    }
  }

  startAutoReloadCheck() {
    this.autoReloadInterval = setInterval(() => {
      if (this.autoReload && this.gameState) {
        const currentAmmo = this.gameState.weapon.ammo[this.gameState.weapon.currentIdx];
        if (currentAmmo === 0 && !this.isReloading) {
          this.triggerAutoReload();
        }
      }
    }, 100);
  }

  triggerAutoReload() {
    this.isReloading = true;
    if (this.callbacks.onReload) {
      this.callbacks.onReload();
    }
    setTimeout(() => {
      this.isReloading = false;
    }, 600);
  }

  setGameState(gameState) {
    this.gameState = gameState;
  }

  createTouchUI() {
    const html = `<div id="mobile-controls" style="position:fixed;bottom:0;left:0;right:0;top:0;pointer-events:none;z-index:1000">
      <!-- Left Joystick (Movement) -->
      <div id="left-joystick-bg" style="position:fixed;bottom:40px;left:40px;width:120px;height:120px;border-radius:50%;background:rgba(100,100,100,0.3);border:2px solid rgba(255,255,255,0.5);pointer-events:auto;touch-action:none">
        <div id="left-joystick-stick" style="position:absolute;width:60px;height:60px;border-radius:50%;background:rgba(150,150,150,0.6);border:2px solid rgba(255,255,255,0.8);top:50%;left:50%;transform:translate(-50%,-50%)"></div>
      </div>
      
      <!-- Right Joystick (Look) -->
      <div id="right-joystick-bg" style="position:fixed;bottom:40px;right:40px;width:120px;height:120px;border-radius:50%;background:rgba(100,100,100,0.3);border:2px solid rgba(255,255,255,0.5);pointer-events:auto;touch-action:none">
        <div id="right-joystick-stick" style="position:absolute;width:60px;height:60px;border-radius:50%;background:rgba(150,150,150,0.6);border:2px solid rgba(255,255,255,0.8);top:50%;left:50%;transform:translate(-50%,-50%)"></div>
      </div>
      
      <!-- Fire Button (between joysticks, bottom center) -->
      <button id="fire-button" style="position:fixed;bottom:120px;left:50%;width:50px;height:50px;border-radius:50%;background:rgba(255,50,50,0.7);border:2px solid rgba(255,255,255,0.8);color:white;font-size:18px;font-weight:bold;pointer-events:auto;cursor:pointer;z-index:1001;transform:translateX(-50%)">FIRE</button>
      
      <!-- Weapon Selector (Bottom Panel) -->
      <div id="weapon-swap" style="position:fixed;bottom:5px;left:50%;transform:translateX(-50%);display:flex;gap:5px;pointer-events:auto;z-index:1001;flex-wrap:wrap;justify-content:center;max-width:95vw">
        <button id="prev-weapon" style="padding:6px 10px;font-size:11px;background:rgba(100,150,255,0.7);border:1px solid white;color:white;border-radius:3px;font-weight:bold;cursor:pointer;touch-action:none">← PREV</button>
        <div id="weapon-display" style="padding:6px 10px;font-size:11px;background:rgba(0,0,0,0.5);border:1px solid white;color:white;border-radius:3px;font-weight:bold;min-width:60px;text-align:center">PISTOL</div>
        <button id="next-weapon" style="padding:6px 10px;font-size:11px;background:rgba(100,150,255,0.7);border:1px solid white;color:white;border-radius:3px;font-weight:bold;cursor:pointer;touch-action:none">NEXT →</button>
        <button id="reload-button" style="padding:6px 10px;font-size:11px;background:rgba(50,200,50,0.7);border:1px solid white;color:white;border-radius:3px;font-weight:bold;cursor:pointer;touch-action:none">RELOAD</button>
      </div>
    </div>`;
    
    const controlsContainer = document.createElement("div");
    controlsContainer.innerHTML = html;
    this.container.appendChild(controlsContainer);
    
    this.leftBg = document.getElementById("left-joystick-bg");
    this.leftStick = document.getElementById("left-joystick-stick");
    this.rightBg = document.getElementById("right-joystick-bg");
    this.rightStick = document.getElementById("right-joystick-stick");
    this.fireBtn = document.getElementById("fire-button");
    this.prevWeapon = document.getElementById("prev-weapon");
    this.nextWeapon = document.getElementById("next-weapon");
    this.reloadBtn = document.getElementById("reload-button");
    this.weaponDisplay = document.getElementById("weapon-display");
  }

  attachListeners() {
    // Left Joystick
    this.leftBg.addEventListener("pointerdown", (e) => this.handlePointerDown(e, "left"));
    this.leftBg.addEventListener("pointermove", (e) => this.handlePointerMove(e, "left"));
    this.leftBg.addEventListener("pointerup", (e) => this.handlePointerUp(e, "left"));
    this.leftBg.addEventListener("pointercancel", (e) => this.handlePointerUp(e, "left"));
    
    // Right Joystick
    this.rightBg.addEventListener("pointerdown", (e) => this.handlePointerDown(e, "right"));
    this.rightBg.addEventListener("pointermove", (e) => this.handlePointerMove(e, "right"));
    this.rightBg.addEventListener("pointerup", (e) => this.handlePointerUp(e, "right"));
    this.rightBg.addEventListener("pointercancel", (e) => this.handlePointerUp(e, "right"));
    
    // Fire Button
    this.fireBtn.addEventListener("pointerdown", () => this.handleFireStart());
    this.fireBtn.addEventListener("pointerup", () => this.handleFireEnd());
    this.fireBtn.addEventListener("pointercancel", () => this.handleFireEnd());
    
    // Weapon Controls
    this.prevWeapon.addEventListener("click", () => this.callbacks.onWeaponSwap && this.callbacks.onWeaponSwap(-1));
    this.nextWeapon.addEventListener("click", () => this.callbacks.onWeaponSwap && this.callbacks.onWeaponSwap(1));
    this.reloadBtn.addEventListener("click", () => this.callbacks.onReload && this.callbacks.onReload());
  }

  handlePointerDown(e, side) {
    const state = side === "left" ? this.touchState.leftJoystick : this.touchState.rightJoystick;
    if (!state.active) {
      state.active = true;
      state.pointerId = e.pointerId;
      e.target.setPointerCapture(e.pointerId);
    }
  }

  handlePointerMove(e, side) {
    const state = side === "left" ? this.touchState.leftJoystick : this.touchState.rightJoystick;
    if (state.pointerId !== e.pointerId) return;
    
    const stick = side === "left" ? this.leftStick : this.rightStick;
    const bg = side === "left" ? this.leftBg : this.rightBg;
    const rect = bg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = (e.clientX - centerX) / (rect.width / 2);
    const dy = (e.clientY - centerY) / (rect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const clamped = Math.min(distance, 1);
    
    let x = (dx / (distance || 1)) * clamped * this.joystickRadius;
    let y = (dy / (distance || 1)) * clamped * this.joystickRadius;
    stick.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    
    const normalizedDist = Math.max(0, clamped - this.deadZone) / (1 - this.deadZone);
    const normalizedX = (dx / (distance || 1)) * normalizedDist;
    const normalizedY = (dy / (distance || 1)) * normalizedDist;
    
    if (side === "left") {
      this.touchState.leftJoystick.x = normalizedX;
      this.touchState.leftJoystick.y = normalizedY;
      if (this.callbacks.onMove) this.callbacks.onMove(normalizedX, normalizedY);
    } else {
      this.touchState.rightJoystick.x = normalizedX;
      this.touchState.rightJoystick.y = normalizedY;
      if (this.callbacks.onLook) this.callbacks.onLook(normalizedX, normalizedY);
    }
  }

  handlePointerUp(e, side) {
    const state = side === "left" ? this.touchState.leftJoystick : this.touchState.rightJoystick;
    if (state.pointerId === e.pointerId) {
      const stick = side === "left" ? this.leftStick : this.rightStick;
      stick.style.transform = "translate(-50%, -50%)";
      state.active = false;
      state.pointerId = null;
      state.x = 0;
      state.y = 0;
      if (side === "left" && this.callbacks.onMove) {
        this.callbacks.onMove(0, 0);
      } else if (side === "right" && this.callbacks.onLook) {
        this.callbacks.onLook(0, 0);
      }
    }
  }

  handleFireStart() {
    this.touchState.firePressed = true;
    this.fireBtn.style.background = "rgba(255, 100, 100, 0.9)";
    if (this.callbacks.onFire) this.callbacks.onFire(true);
  }

  handleFireEnd() {
    this.touchState.firePressed = false;
    this.fireBtn.style.background = "rgba(255, 50, 50, 0.7)";
    if (this.callbacks.onFire) this.callbacks.onFire(false);
  }

  // Callback setters
  onMove(callback) { this.callbacks.onMove = callback; }
  onLook(callback) { this.callbacks.onLook = callback; }
  onFire(callback) { this.callbacks.onFire = callback; }
  onWeaponSwap(callback) { this.callbacks.onWeaponSwap = callback; }
  onReload(callback) { this.callbacks.onReload = callback; }
  
  isMobile() { 
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); 
  }
  
  destroy() {
    if (this.autoReloadInterval) clearInterval(this.autoReloadInterval);
    if (this.container) {
      const controls = this.container.querySelector("#mobile-controls");
      if (controls) controls.remove();
    }
  }
}
