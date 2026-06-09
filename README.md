# Chronicles of the Sword Coast

A modular browser RPG rebuilt from a truncated legacy snapshot.

## Run locally
1. Open a terminal in this folder.
2. Start a local server:
   - `python -m http.server 8765`
3. Open `http://127.0.0.1:8765/index.html` in a browser.

## Run tests
- Install dependencies: `npm install`
- Install browser once: `npx playwright install chromium`
- Run smoke suite: `npm run test:e2e`
- Run all Playwright tests: `npm test`

## Player and test controls

- Press `F` or use a Fullscreen button to toggle fullscreen.
- Press `S` to save, `R` to rest outside combat, `L` to load from the title, and `1`-`9` to choose visible actions.
- `window.render_game_to_text()` returns a concise JSON summary of the current screen, player, world, combat, and visible choices.
- `window.advanceTime(ms)` deterministically refreshes the turn-based view and returns the same summary.

## Project structure
- `index.html`: app shell and UI containers.
- `styles/main.css`: core styling (recovered + patch updates).
- `src/main.js`: gameplay loop, UI actions, dialogue, encounters, crafting, boss flow.
- `src/core/*`: dice, save/load, state helpers.
- `src/data/*`: races, classes, spells, items, recipes, NPCs, locations, quests.
- `src/ui/render.js`: screen rendering and sidebar/action panel rendering.
- `legacy/DNDGAME_snapshot_truncated.html`: preserved legacy extraction.
- `PLAN.md`: phased roadmap.
- `BUGS.md`: source integrity issues from the legacy snapshot.

## Save data
- Save key: `chronicles_sword_coast_save`
- Schema version: `1`
- Save payload includes `version`, `savedAt`, and serialized `state`.

## Content authoring
Add or edit content in `src/data/*`:
- New NPCs: `src/data/npcs.js`
- New locations/encounters/boss tuning: `src/data/locations.js`
- New quests: `src/data/quests.js`
- New items/shop entries: `src/data/items.js`
- New crafting recipes: `src/data/recipes.js`
- New spells/classes/races: corresponding data files

## Current gameplay coverage
- Title screen, new game, load game, help prompt
- Character creation
- Exploration and travel
- NPC interactions
- Turn-based combat with attacks, spells, potion, flee
- Side quest and main quest progression
- Crafting Warded Key
- Final boss fight and victory ending state
- Death/recovery path

## Known limitations
- Encounter and dialogue depth is intentionally compact for this checkpoint.
- Balance tuning is baseline only and may need iteration.
