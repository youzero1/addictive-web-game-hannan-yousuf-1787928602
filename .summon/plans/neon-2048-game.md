---
status: implemented
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

## Phase 6 — Game modes

16. Extend `src/types/game.ts` with a game-mode shape (classic, blitz, daily), a board-size setting (4×4, 5×5, 6×6) and a difficulty setting that controls how often a 4 spawns instead of a 2.
    - Expected outcome: one config object describes any run, so modes reuse the same engine.

17. Generalise `src/lib/game-engine.ts` from a fixed 4×4 grid to any square size, and make the win target depend on board size (2048 on 4×4, higher targets on bigger boards).
    - Expected outcome: bigger boards play correctly with no rule duplication.

18. Create `src/lib/daily.ts` to turn the current date into a repeatable random seed, plus a seeded random generator so every player gets the identical tile sequence for that day, and record whether today's run is already finished.
    - Expected outcome: a "puzzle of the day" that is the same for everyone and resets at midnight.

19. Create `src/hooks/useGameTimer.ts` for Blitz mode: a 3-minute countdown that starts on the first move, pauses when the tab is hidden, and ends the run at zero.
    - Expected outcome: a high-pressure mode that scores as many merges as possible before time runs out.

20. Create `src/components/ModeSelect.tsx` — a segmented control for Classic / Blitz / Daily plus pickers for board size and difficulty, disabled mid-run with a confirm prompt if a game is in progress.
    - Expected outcome: the player picks how they want to play before starting.

## Phase 7 — Power-ups

21. Create `src/lib/powerups.ts` with pure actions: remove a single chosen tile, shuffle all tiles into new positions, and swap two adjacent tiles — each returning a new board and never producing an unwinnable state.
    - Expected outcome: reliable board-altering helpers separate from normal moves.

22. Extend `src/hooks/useGame.ts` with a limited power-up budget per run (earned back at score milestones), an "arming" state where the next tap on a tile applies the selected power-up, and Escape to cancel.
    - Expected outcome: power-ups are strategic and limited, not spammable.

23. Create `src/components/PowerUpBar.tsx` — glowing icon buttons showing remaining charges, the armed state, and a hint line telling the player what to tap next.
    - Expected outcome: obvious, tactile power-up controls on mobile and desktop.

## Phase 8 — Sound, themes and feel

24. Create `src/lib/audio.ts` — lightweight synthesized blips for move, merge, power-up, win and game-over using the browser's own audio engine (no audio files), with a master mute stored in local storage and lazy initialisation on first user interaction.
    - Expected outcome: satisfying feedback with no download cost and no autoplay warnings.

25. Create `src/hooks/useTheme.ts` and `src/components/ThemeSwitcher.tsx` with three palettes — Neon, Retro CRT and Pastel — applied through CSS variables on the app shell and remembered between visits.
    - Expected outcome: the whole app recolors instantly from one control.

26. Add feel polish in `src/components/Board.tsx` and `src/components/Tile.tsx`: screen-shake on large merges, particle sparkles when a new highest tile appears, and a combo counter that flashes when several merges land in one move — all suppressed under reduced-motion settings.
    - Expected outcome: big moments feel like a reward.

## Phase 9 — Progression and sharing

27. Create `src/lib/achievements.ts` defining unlockable badges (first 512, first 2048, 10k score, a run with zero undos, a Blitz score threshold, a 7-day daily streak) and a checker that runs after every move and at game end.
    - Expected outcome: clear goals that pull players back.

28. Create `src/components/AchievementToast.tsx` for a corner toast when a badge unlocks, and `src/components/AchievementGrid.tsx` showing locked/unlocked badges with descriptions.
    - Expected outcome: visible collection to complete.

29. Extend `src/lib/storage.ts` with a player profile: games played, wins, best score per mode, highest tile ever, current and longest daily streak, and total merges — plus a reset-all-data option.
    - Expected outcome: personal stats accumulate across sessions.

30. Create `src/components/StatsPanel.tsx` to display those stats compactly, and update `src/components/Leaderboard.tsx` to filter top runs by mode.
    - Expected outcome: the player can see progress at a glance.

31. Create `src/components/ShareCard.tsx` that renders an end-of-run summary (mode, score, highest tile, badges earned) and copies a short text summary with emoji tile squares to the clipboard for sharing.
    - Expected outcome: one-tap bragging without any backend.

## Phase 10 — Pages and final pass

32. Add `src/routes/stats.tsx` (stats + achievements) and `src/routes/how-to-play.tsx` (full rules, modes and power-up explanations), and add a compact nav plus mute and theme controls to `src/routes/__root.tsx`.
    - Expected outcome: extras get their own space without cluttering the game screen.

33. Update `src/routes/index.tsx` to compose mode select, score panel, power-up bar, board, share card on game end and the mode-filtered leaderboard, staying single-column on phones and widening to two columns on desktop.
    - Expected outcome: everything is reachable from the home screen.

34. Final pass: keyboard shortcuts (N new game, U undo, 1-3 power-ups, M mute), focus styles and ARIA labels on all new controls, verification at 320px width, and confirmation that a corrupted saved profile never blocks play.
    - Expected outcome: fast, accessible and crash-proof.

35. Update `README.md` with a short description, the list of modes and how to run the app locally.
    - Expected outcome: anyone can start the project without guessing.

## Deliberately out of scope (possible follow-ups)

36. Online/global leaderboard, friend challenges and cloud-synced profiles — these need a database and can be layered on later.
