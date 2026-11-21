# Spot the Difference — make.fun best-spot-the-difference-game-20261121-0451 entry

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/NgademinSikil/makefun-spot-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/NgademinSikil/makefun-spot-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A complete, original spot-the-difference game that plays offline in a desktop
browser from its own static files. No libraries, no network requests, no build
step. Every picture is drawn in code — no borrowed art.

## How to play

Serve it locally and open http://localhost:8080 (or open `game/index.html` directly):

```
node serve.ts
```

- **Find:** click a difference on either picture — a green ring marks it on both
- **Wrong clicks** cost 3 seconds and 10 points, and reset your streak
- **Hint:** H (rings one hiding difference, −50 points, 3 per level)
- **Pause:** P or Esc · **Mute:** M · **Restart:** R · **Start / continue:** Enter or click

## The game

Three hand-drawn scenes, seven sneaky differences in each:

1. **Sunny Park** — the sun puts on sunglasses, a cloud drifts away, the apples
   fall off the tree, a tulip changes colour, the bird flies off, a fence plank
   snaps, the duck swims away.
2. **Cozy Kitchen** — the clock jumps to half past six, the teapot stops steaming,
   the cat's tail drops, a cup vanishes, the apple turns green, the plant loses
   leaves, the picture changes scenes.
3. **Moon Base** — the flag changes colour, the rover loses a wheel, a star winks
   out, the astronaut's visor goes dark, the rocket loses a window, a crater
   fills itself in, the dish swings around.

120 seconds a level. A find is worth 100 points plus a streak bonus; clearing a
level pays 10 points per second left. Synthesised WebAudio sound effects (find
chime, wrong buzz, hint blip, level fanfare) — no audio files. Best score is
saved in `localStorage`.

## Layout

- `main.ts` — Node 22 entry: copies `game/` + `screenshots/` to `/output` and writes
  `dossier.json` via `vendor/makefun-game.ts` (copied unchanged from the kit)
- `game/index.html` + `game/src/` — the game: `config`, `random` (seeded),
  `scenes` (all three pictures, drawn in code), `world` (rules), `input`,
  `audio` (WebAudio synth), `render` (canvas), `shots` (screenshot scenes),
  `main` (loop)
- `screenshots/` — 4 real renders of the game's own code (1280×720); the cover
  is a mid-hunt frame with 3 of 7 found, 4 still hiding, and the counter showing it
- `shots.json` — the `?shot=` scenes each screenshot was taken from
- `serve.ts` — tiny static server for local play-testing

## Status

Entered in make.fun's "Make the best spot the difference game" bounty ($50 pool,
$5 each for the top 10). Bounty closes Sun 22 Nov 2026 00:51 WITA.

---

<sub>Entered on [make.fun](https://make.fun/?ref=ds1567x3&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
