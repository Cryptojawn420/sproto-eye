# Sproto Eye Refactor Plan

## Goal
Convert 4055-line monolith into modular, maintainable codebase so you can:
- Build new levels easily
- Add features without spaghetti
- Test components independently
- Work on the game effectively

## Current State
- `src/App.js` — 4055 lines (all game logic, rendering, UI)
- **Issues:** 
  - Can't edit levels without touching code
  - Hard to test individual systems
  - Mobile support impossible without refactor
  - Supabase integration mixed everywhere

## Phase 1: Extract & Organize (Tonight)
✅ **Created:**
- `src/config/gameConstants.js` — all game data (characters, weapons, difficulties)
- `src/modules/gameState.js` — game state management
- `src/modules/audioSystem.js` — Web Audio synthesis
- `src/modules/weaponSystem.js` — weapon logic
- `src/data/levelData.js` — level configuration (editable!)
- `src/AppRefactored.js` — sketch of modular app (not active yet)

**Next:** Keep original App.js working, gradually incorporate modules

---

## Phase 2: Gradual Integration (Nights 2-3)
1. **Import constants** from gameConstants.js into App.js
   - No logic changes, just replace inline constants
   - Test that game still works
   - Commit

2. **Extract audio system**
   - Move sfx() and startMusic() to audioSystem module
   - Keep audioRef, musicRef in App for now
   - Test and commit

3. **Extract weapon system**
   - Move all weapon logic to weaponSystem
   - Update App to use weaponSystem methods
   - Test and commit

---

## Phase 3: Render Pipeline (Nights 4-5)
1. **Extract Three.js scene building**
   - Create `sceneBuilder.js` that constructs level from levelData
   - Builder takes scene + level config
   - Returns walls, objects, etc.
   - Test and commit

2. **Extract enemy spawning**
   - Create `entityManager.js` for enemies, pickups, projectiles
   - Manage lifecycle, collision, AI
   - Test and commit

3. **Extract game loop**
   - Create `gameLoop.js` that orchestrates update/render
   - Cleaner separation of concerns

---

## Phase 4: UI Components (Night 6)
Split React components:
- `Menu.js`
- `CharSelect.js`
- `DiffSelect.js`
- `GameScreen.js`
- `HUD.js`
- `LeaderboardUI.js`

---

## Phase 5: Mobile (Night 7+)
1. **Touch controls**
   - Left joystick: movement
   - Right joystick: aim
   - Buttons: fire, switch weapons

2. **Gamepad support**
   - Analog sticks
   - Trigger buttons

3. **Responsive UI**
   - Scale HUD for mobile
   - Touch-friendly menus

---

## Timeline
- **Tonight:** Groundwork done, modules ready, original game still works
- **Next 6 nights:** Gradual integration, testing each step
- **Week 2:** Mobile support, polishing

## Key Principle
**No breaking changes.** Always keep a working version. If something breaks, roll back.

## After Refactor
You can:
- Edit `levelData.js` to add new zones, buildings, walls
- Add new weapons in `gameConstants.js`
- Change difficulty in `DIFFICULTIES`
- Work on game design without touching core logic

## Testing Strategy
- Play 5x every night (keeps Supabase alive, validates game works)
- Check for errors in console
- Report back each morning
