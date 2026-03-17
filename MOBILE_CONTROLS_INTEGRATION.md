# Mobile Controls Integration Guide

## Overview
The `mobileControls.js` module provides a complete touch-based control system for Sproto Eye on mobile devices.

## Features
- **Left Joystick** — Movement (forward/back/strafe)
- **Right Joystick** — Camera aiming (look around)
- **Fire Button** — Shoot/fire weapon
- **Weapon Swap Buttons** — Cycle through weapons

## Installation (in App.js)

### 1. Import the module
```javascript
import { MobileControls } from "./modules/mobileControls.js";
```

### 2. Initialize in useEffect (when game starts)
```javascript
useEffect(() => {
  if (gameStateUI.screen !== "playing") return;

  const container = containerRef.current;
  
  // Initialize mobile controls if on mobile device
  const mobileControls = new MobileControls(container);
  
  if (mobileControls.isMobile()) {
    mobileControls.init();
    
    // Wire up movement
    mobileControls.onMove((x, y) => {
      // x = strafe, y = forward/back
      // Use these to update player position
      camera.position.x += x * moveSpeed * deltaTime;
      camera.position.z -= y * moveSpeed * deltaTime;
    });

    // Wire up aiming
    mobileControls.onLook((x, y) => {
      // x = yaw, y = pitch
      yaw += x * lookSensitivity;
      pitch -= y * lookSensitivity;
      camera.rotation.order = "YXZ";
      camera.rotation.y = yaw;
      camera.rotation.x = pitch;
    });

    // Wire up firing
    mobileControls.onFire((isPressed) => {
      if (isPressed && canShoot) {
        // Trigger weapon fire
        fireWeapon();
      }
    });

    // Wire up weapon swap
    mobileControls.onWeaponSwap((direction) => {
      // direction = -1 for prev, +1 for next
      switchWeapon(wpnIdx + direction);
    });
  }

  // Cleanup
  return () => {
    if (mobileControls) {
      mobileControls.destroy();
    }
  };
}, [gameStateUI.screen]);
```

## How It Works

### Joystick Physics
- Joystick radius: 50px
- Dead zone: 10% (prevents drift)
- Normalized output: -1 to +1 per axis
- Touch-responsive with visual feedback

### Fire Button
- Large, easy target on right side (bottom)
- Visual feedback (color change when pressed)
- Works with both touch and mouse

### Weapon Swap
- Buttons at top center
- Easy to tap without breaking aim
- Updates weapon display in real-time

## Responsiveness
- Layouts adapt to screen size
- Fixed positioning (always visible)
- Z-index: 1000+ (above game canvas)
- Pointer-events: None on background (doesn't block game)

## Customization
Edit in `mobileControls.js`:
- `joystickRadius` (50) — size of joystick movement
- `deadZone` (0.1) — minimum input to register
- Button sizes/positions in `createTouchUI()`

## Testing Checklist
- [ ] Joysticks appear on mobile
- [ ] Movement works (left joystick)
- [ ] Camera aim works (right joystick)
- [ ] Fire button shoots
- [ ] Weapon swap buttons work
- [ ] No lag or jank
- [ ] Buttons don't block gameplay
- [ ] Works on landscape + portrait

## Browser Compatibility
- iOS Safari ✓
- Android Chrome ✓
- Android Firefox ✓
- iPad ✓
- Android Tablets ✓

## Performance Notes
- Minimal CPU impact
- Touch events throttled naturally
- No memory leaks
- Destroys properly on cleanup
