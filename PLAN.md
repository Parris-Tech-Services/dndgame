# PLAN

## Current status (2026-04-12)
- Only source file found: `DNDGAME.txt`.
- File contains narrative text + an opening ```html fence + partial HTML/CSS.
- Snapshot is truncated mid-tag and does not include any JavaScript logic.

## Checkpoint progress
- Phase 1 complete: recovered assets, modular file structure created, legacy snapshot preserved.
- Phase 2 complete: runnable baseline runtime implemented (state, save/load, exploration, dialogue, combat, crafting, boss path).

## Goals
1. Recover a runnable baseline from the available snapshot.
2. Refactor into modular browser project files.
3. Rebuild/complete missing systems and content in a data-driven way.
4. Stabilize save/load, combat, quests, and UX for end-to-end playability.

## Phases

### Phase 1: Recovery + Structure
- Extract recoverable CSS and HTML shell into project files.
- Preserve a legacy snapshot for reference.
- Create modular folders (`src/core`, `src/data`, `src/ui`, `styles`).
- Produce `BUGS.md` with known blockers from the truncated source.

### Phase 2: Core Runtime (safe baseline)
- Implement a minimal game engine with explicit state object.
- Implement robust save/load with versioned schema.
- Implement title screen -> character creation -> game loop transitions.
- Implement sidebar rendering and action routing with guardrails.

### Phase 3: Content Completion
- Add remaining NPCs (Whisper, Neverember, Vexira, Tormund, Miri) and existing core NPC set.
- Add location encounters and complete quest progression path.
- Add crafting recipes/materials and integration with quest progression.
- Add final boss and ending states.

### Phase 4: Hardening + UX
- Dead-end prevention and fail/recovery path.
- Synchronize quest flags, inventory deltas, combat/rest/spell state.
- Improve prompts, feedback, and help panel.
- Mobile-safe layout checks and keyboard-friendly controls where practical.

### Phase 5: Verification + Documentation
- Smoke test start-to-finish flow.
- Document structure, save format, and content authoring in `README.md`.
- Record known limitations and future enhancements.

## Immediate checkpoint target
- Complete Phase 1 and Phase 2 with a runnable modular baseline.
