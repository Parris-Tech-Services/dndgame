# BUGS / GAPS

## Source integrity blockers
1. `DNDGAME.txt` is truncated mid-markup (`<div class`) and cannot run as HTML.
2. Opening markdown fence (` ```html `) has no closing fence.
3. No JavaScript block is present in the available snapshot.
4. HTML document in snapshot has no closing tags (`</div>`, `</body>`, `</html>`).
5. Several UTF-8 characters are mojibake (`â€”`, etc.) from encoding/copy conversion.

## Functional gaps (from snapshot and inspection)
1. No executable game logic is recoverable (combat, dice, quests, dialogue handlers absent).
2. Save/load hooks referenced in UI are undefined (`saveGame`, `loadGame`, etc.).
3. Character creation container exists but has no content.
4. Sidebar/action panels are present structurally but lack rendering logic.
5. End-to-end play path cannot exist without missing JS and data.

## Structural risks
1. Original approach is a single monolithic file, hard to maintain and test.
2. No explicit state schema/versioning for save data.
3. No separation of content data from runtime logic.

## Recovery strategy
- Treat `DNDGAME.txt` as style/layout reference only.
- Rebuild runtime in modular files with versioned state.
- Keep a legacy snapshot copy for audit/reference.
