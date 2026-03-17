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
    this.callbacks = { onMove: null, onLook: null, onFire: null, onWeaponSwap: null };
  }

  init() {
    this.createTouchUI();
    this.attachListeners();
    this.isActive = true;
  }

  createTouchUI() {
    const html = `<div id="mobile-controls" style="position:fixed;bottom:0;left:0;right:0;top:0;pointer-events:none;z-index:1000">
      <div id="left-joystick-bg" style="position:fixed;bottom:40px;left:40px;width:120px;height:120px;border-radius:50%;background:rgba(100,100,100,0.3);border:2px solid rgba(255,255,255,0.5);pointer-events:auto;touch-action:none">
        <div id="left-joystick-stick" style="position:absolute;width:60px;height:60px;border-radius:50%;background:rgba(150,150,150,0.6);border:2px solid rgba(255,255,255,0.8);top:50%;left:50%;transform:translate(-50%,-50%)"></div>
      </div>
      <div id="right-joystick-bg" style="position:fixed;bottom:40px;right:40px;width:120px;height:120px;border-radius:50%;background:rgba(100,100,100,0.3);border:2px solid rgba(255,255,255,0.5);pointer-events:auto;touch-action:none">
        <div id="right-joystick-stick" style="position:absolute;width:60px;height:60px;border-radius:50%;background:rgba(150,150,150,0.6);border:2px solid rgba(255,255,255,0.8);top:50%;left:50%;transform:translate(-50%,-50%)"></div>
      </div>
      <button id="fire-button" style="position:fixed;bottom:40px;right:200px;width:80px;height:80px;border-radius:50%;background:rgba(255,50,50,0.7);border:3px solid rgba(255,255,255,0.8);color:white;font-size:24px;font-weight:bold;pointer-events:auto;cursor:pointer;z-index:1001">FIRE</button>
      <div id="weapon-swap" style="position:fixed;top:20px;left:50%;transform:translateX(-50%);display:flex;gap:10px;pointer-events:auto;z-index:1001">
        <button id="prev-weapon" style="padding:10px 15px;background:rgba(100,150,255,0.7);border:2px solid white;color:white;border-radius:5px;font-weight:bold;cursor:pointer">← PREV</button>
        <div id="weapon-display" style="padding:10px 15px;background:rgba(0,0,0,0.5);border:2px solid white;color:white;border-radius:5px;font-weight:bold;min-width:80px;text-align:center">PISTOL</div>
        <button id="next-weapon" style="padding:10px 15px;background:rgba(100,150,255,0.7);border:2px solid white;color:white;border-radius:5px;font-weight:bold;cursor:pointer">NEXT →</button>
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
  }

  attachListeners() {
    this.leftBg.addEventListener("pointerdown", (e) => this.handlePointerDown(e, "left"));
    this.leftBg.addEventListener("pointermove", (e) => this.handlePointerMove(e, "left"));
    this.leftBg.addEventListener("pointerup", (e) => this.handlePointerUp(e, "left"));
    this.rightBg.addEventListener("pointerdown", (e) => this.handlePointerDown(e, "right"));
    this.rightBg.addEventListener("pointermove", (e) => this.handlePointerMove(e, "right"));
    this.rightBg.addEventListener("pointerup", (e) => this.handlePointerUp(e, "right"));
    this.fireBtn.addEventListener("pointerdown", () => this.handleFireStart());
    this.fireBtn.addEventListener("pointerup", () => this.handleFireEnd());
    this.prevWeapon.addEventListener("click", () => this.callbacks.onWeaponSwap && this.callbacks.onWeaponSwap(-1));
    this.nextWeapon.addEventListener("click", () => this.callbacks.onWeaponSwap && this.callbacks.onWeaponSwap(1));
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

  onMove(callback) { this.callbacks.onMove = callback; }
  onLook(callback) { this.callbacks.onLook = callback; }
  onFire(callback) { this.callbacks.onFire = callback; }
  onWeaponSwap(callback) { this.callbacks.onWeaponSwap = callback; }
  isMobile() { return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); }
  destroy() {
    if (this.container) {
      const controls = this.container.querySelector("#mobile-controls");
      if (controls) controls.remove();
    }
  }
}
