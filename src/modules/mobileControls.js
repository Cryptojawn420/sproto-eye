/**
 * Mobile Touch Controls System
 * Handles joystick input, touch buttons, and mobile-optimized gameplay
 */

export class MobileControls {
  constructor(containerElement) {
    this.container = containerElement;
    this.isActive = false;
    this.touchState = {
      leftJoystick: { x: 0, y: 0, active: false },
      rightJoystick: { x: 0, y: 0, active: false },
      firePressed: false,
      weaponSwap: false,
    };

    this.joystickRadius = 50;
    this.deadZone = 0.1;
    this.callbacks = {
      onMove: null,
      onLook: null,
      onFire: null,
      onWeaponSwap: null,
    };
  }

  init() {
    this.createTouchUI();
    this.attachTouchListeners();
    this.isActive = true;
    console.log("✓ Mobile controls initialized");
  }

  createTouchUI() {
    const html = `
      <div id="mobile-controls" style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        pointer-events: none;
        z-index: 1000;
      ">
        <!-- Left Joystick -->
        <div id="left-joystick-bg" style="
          position: fixed;
          bottom: 40px;
          left: 40px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(100, 100, 100, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.5);
          pointer-events: auto;
          touch-action: none;
        ">
          <div id="left-joystick-stick" style="
            position: absolute;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(150, 150, 150, 0.6);
            border: 2px solid rgba(255, 255, 255, 0.8);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: auto;
          "></div>
        </div>

        <!-- Right Joystick -->
        <div id="right-joystick-bg" style="
          position: fixed;
          bottom: 40px;
          right: 40px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(100, 100, 100, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.5);
          pointer-events: auto;
          touch-action: none;
        ">
          <div id="right-joystick-stick" style="
            position: absolute;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(150, 150, 150, 0.6);
            border: 2px solid rgba(255, 255, 255, 0.8);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: auto;
          "></div>
        </div>

        <!-- Fire Button -->
        <button id="fire-button" style="
          position: fixed;
          bottom: 40px;
          right: 200px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 50, 50, 0.7);
          border: 3px solid rgba(255, 255, 255, 0.8);
          color: white;
          font-size: 24px;
          font-weight: bold;
          pointer-events: auto;
          touch-action: none;
          cursor: pointer;
          z-index: 1001;
        ">FIRE</button>

        <!-- Weapon Swap Buttons -->
        <div id="weapon-swap" style="
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          pointer-events: auto;
          z-index: 1001;
        ">
          <button id="prev-weapon" style="
            padding: 10px 15px;
            background: rgba(100, 150, 255, 0.7);
            border: 2px solid white;
            color: white;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            touch-action: none;
          ">← PREV</button>
          <div id="weapon-display" style="
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid white;
            color: white;
            border-radius: 5px;
            font-weight: bold;
            min-width: 80px;
            text-align: center;
          ">PISTOL</div>
          <button id="next-weapon" style="
            padding: 10px 15px;
            background: rgba(100, 150, 255, 0.7);
            border: 2px solid white;
            color: white;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            touch-action: none;
          ">NEXT →</button>
        </div>
      </div>
    `;

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
    this.weaponDisplay = document.getElementById("weapon-display");
  }

  attachTouchListeners() {
    // Left joystick
    this.leftBg.addEventListener("touchstart", (e) =>
      this.handleJoystickStart(e, "left")
    );
    this.leftBg.addEventListener("touchmove", (e) =>
      this.handleJoystickMove(e, "left")
    );
    this.leftBg.addEventListener("touchend", (e) =>
      this.handleJoystickEnd(e, "left")
    );

    // Right joystick
    this.rightBg.addEventListener("touchstart", (e) =>
      this.handleJoystickStart(e, "right")
    );
    this.rightBg.addEventListener("touchmove", (e) =>
      this.handleJoystickMove(e, "right")
    );
    this.rightBg.addEventListener("touchend", (e) =>
      this.handleJoystickEnd(e, "right")
    );

    // Fire button
    this.fireBtn.addEventListener("touchstart", () => this.handleFireStart());
    this.fireBtn.addEventListener("touchend", () => this.handleFireEnd());
    this.fireBtn.addEventListener("mousedown", () => this.handleFireStart());
    this.fireBtn.addEventListener("mouseup", () => this.handleFireEnd());

    // Weapon swap
    this.prevWeapon.addEventListener("click", () =>
      this.callbacks.onWeaponSwap && this.callbacks.onWeaponSwap(-1)
    );
    this.nextWeapon.addEventListener("click", () =>
      this.callbacks.onWeaponSwap && this.callbacks.onWeaponSwap(1)
    );
  }

  handleJoystickStart(e, side) {
    e.preventDefault();
    const touch = e.touches[0];
    if (side === "left") {
      this.touchState.leftJoystick.active = true;
    } else {
      this.touchState.rightJoystick.active = true;
    }
  }

  handleJoystickMove(e, side) {
    e.preventDefault();
    const touch = e.touches[0];
    const bg = side === "left" ? this.leftBg : this.rightBg;
    const stick = side === "left" ? this.leftStick : this.rightStick;

    const rect = bg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (touch.clientX - centerX) / (rect.width / 2);
    const dy = (touch.clientY - centerY) / (rect.height / 2);

    const distance = Math.sqrt(dx * dx + dy * dy);
    const clamped = Math.min(distance, 1);

    let x = dx / (distance || 1) * clamped * this.joystickRadius;
    let y = dy / (distance || 1) * clamped * this.joystickRadius;

    stick.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

    // Apply dead zone
    const normalizedDist = Math.max(0, clamped - this.deadZone) / (1 - this.deadZone);
    const normalizedX = (dx / (distance || 1)) * normalizedDist;
    const normalizedY = (dy / (distance || 1)) * normalizedDist;

    if (side === "left") {
      this.touchState.leftJoystick.x = normalizedX;
      this.touchState.leftJoystick.y = normalizedY;
      if (this.callbacks.onMove) {
        this.callbacks.onMove(normalizedX, normalizedY);
      }
    } else {
      this.touchState.rightJoystick.x = normalizedX;
      this.touchState.rightJoystick.y = normalizedY;
      if (this.callbacks.onLook) {
        this.callbacks.onLook(normalizedX, normalizedY);
      }
    }
  }

  handleJoystickEnd(e, side) {
    e.preventDefault();
    const stick = side === "left" ? this.leftStick : this.rightStick;
    stick.style.transform = "translate(-50%, -50%)";

    if (side === "left") {
      this.touchState.leftJoystick = { x: 0, y: 0, active: false };
      if (this.callbacks.onMove) {
        this.callbacks.onMove(0, 0);
      }
    } else {
      this.touchState.rightJoystick = { x: 0, y: 0, active: false };
      if (this.callbacks.onLook) {
        this.callbacks.onLook(0, 0);
      }
    }
  }

  handleFireStart() {
    this.touchState.firePressed = true;
    this.fireBtn.style.background = "rgba(255, 100, 100, 0.9)";
    if (this.callbacks.onFire) {
      this.callbacks.onFire(true);
    }
  }

  handleFireEnd() {
    this.touchState.firePressed = false;
    this.fireBtn.style.background = "rgba(255, 50, 50, 0.7)";
    if (this.callbacks.onFire) {
      this.callbacks.onFire(false);
    }
  }

  setWeaponDisplay(name) {
    this.weaponDisplay.textContent = name;
  }

  onMove(callback) {
    this.callbacks.onMove = callback;
  }

  onLook(callback) {
    this.callbacks.onLook = callback;
  }

  onFire(callback) {
    this.callbacks.onFire = callback;
  }

  onWeaponSwap(callback) {
    this.callbacks.onWeaponSwap = callback;
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  destroy() {
    if (this.container) {
      const controls = this.container.querySelector("#mobile-controls");
      if (controls) {
        controls.remove();
      }
    }
    this.isActive = false;
  }
}

export const mobileControls = (containerElement) =>
  new MobileControls(containerElement);
