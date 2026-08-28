---
status: pending
title: Neon 2048 — Addictive Tile-Merging Web Game
---

# Neon 2048

A single-page arcade game where the player slides numbered tiles with arrow keys (or swipes on touch) to merge matching tiles and chase a personal best. Dark neon-arcade look, glowing tiles, animated merges, persistent high score and a local leaderboard of the player's top runs.

## Phase 1 — Project foundation

1. Scaffold the app skeleton: create `index.html`, `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, and `src/main.tsx`.
   - Dependencies: react, react-dom, @tanstack/react-router; dev: vite, @vitejs/plugin-react, typescript, tailwindcss, @tailwindcss/vite, @tanstack/router-plugin, @types/react, @types/react-dom.
   - `vite.config.ts` registers the React plugin, the Tailwind Vite plugin, the TanStack Router plugin (file-based routes from `src/routes`), and the `@/` alias pointing at `src/`.
   - Expected outcome: `npm run dev` starts a working blank app with no console errors.

2. Create `src/styles/global.css` starting with exactly `@import "tailwindcss";`, imported once from `src/main.tsx`.
   - Add CSS custom properties for the neon palette (deep near-black background, cyan/magenta/violet accents, per-tile-value glow colors) and keyframe animations for tile spawn (pop-in), tile merge (pulse) and score float-up.
   - Expected outcome: a single stylesheet drives the whole neon theme; tile colors are looked up by value.

3. Create `src/routes/__root.tsx` as the app shell.
   - Full-height dark background with a subtle animated neon grid/glow backdrop, centered content column, and the router outlet.
   - Expected outcome: every page renders inside the arcade-styled shell.

## Phase 2 — Game engine (pure logic, no UI)

4. Create `src/types/game.ts` with the shared shapes: a tile (unique id, row, column, value, flags for "just spawned" and "just merged"), the board state (tiles, score, best, status of playing/won/lost), and the four move directions.
   - Expected outcome: one source of truth for game data used by logic, hooks and components.

5. Create `src/lib/game-engine.ts` with pure functions: create a new 4×4 board with two random starting tiles, spawn a random tile (90% value 2, 10% value 4) in a free cell, resolve a move in a given direction (slide, merge each pair only once per move, compute points gained), detect whether any move remains (game over), and detect reaching 2048 (win).
   - Tiles keep stable ids across moves so the UI can animate them from old position to new position.
   - Expected outcome: a fully testable engine that returns the next board plus whether anything actually moved and how many points were scored.

6. Create `src/lib/storage.ts` to safely read/write the best score and the leaderboard entries in browser local storage, with guards so a corrupted or unavailable store never crashes the game.
   - Expected outcome: progress survives page reloads.

## Phase 3 — Input and state wiring

7. Create `src/hooks/useGame.ts` — the single hook the UI talks to. It holds board state, score, best score and status; exposes actions to move in a direction, start a new game and undo the last move (one step of history); ignores moves that change nothing; spawns a new tile after every valid move; updates best score and pushes a leaderboard entry when a run ends.
   - Expected outcome: components stay presentational; all rules live behind one hook.

8. Create `src/hooks/useSwipeAndKeys.ts` to translate arrow keys / WASD and touch swipes (with a minimum distance threshold and axis locking) into move directions, and prevent page scrolling while playing.
   - Expected outcome: the game feels identical on desktop and mobile.

## Phase 4 — Game UI

9. Create `src/components/Tile.tsx` — an absolutely positioned glowing tile whose color, glow intensity and font size derive from its value, animating position changes and playing the pop/pulse animation when it spawns or merges.
   - Expected outcome: merges feel snappy and satisfying rather than instant redraws.

10. Create `src/components/Board.tsx` — the 4×4 neon grid: recessed empty cells, the tile layer on top, responsive square sizing that fits small phone screens, and a translucent overlay for "You win — keep going" and "Game over" states with a restart button.
    - Expected outcome: the core play surface, playable end to end.

11. Create `src/components/ScorePanel.tsx` — current score with a floating "+N" animation on each merge, best score, and buttons for New Game and Undo.
    - Expected outcome: instant feedback on every successful move.

12. Create `src/components/Leaderboard.tsx` — the player's top 10 local runs (score, highest tile reached, date), highlighting a brand-new personal best.
    - Expected outcome: a visible chase-your-own-record hook.

13. Create `src/components/HowToPlay.tsx` — a compact, dismissible instructions strip (arrow keys or swipe, merge equal tiles, reach 2048).
    - Expected outcome: a first-time player understands the game in seconds.

## Phase 5 — Pages and polish

14. Create `src/routes/index.tsx` as the game page: title/logo, score panel, board, how-to-play strip and leaderboard composed in a mobile-first single column that widens to board-beside-leaderboard on large screens.
    - Expected outcome: the whole game lives at the home URL.

15. Polish pass across the components: keyboard focus styles and ARIA labels on controls, a live-region announcement of the score for screen readers, `prefers-reduced-motion` respected by toning down animations, and verification that nothing overflows at 320px width.
    - Expected outcome: smooth, accessible, no layout shifts.

16. Update `README.md` with a short description and how to run the app locally.
    - Expected outcome: anyone can start the project without guessing.

## Deliberately out of scope (possible follow-ups)

17. Online/global leaderboard (needs a backend), daily challenge seeds, achievements, sound effects, and shareable score cards — each can be added later on top of this structure.
