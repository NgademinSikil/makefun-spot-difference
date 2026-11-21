// The rules: levels, finds, the clock, the score, hints and the screens.
// The world knows nothing about the canvas — the renderer paints its state.

import {
  CLICK_RADIUS,
  FIND_POINTS,
  HINTS_PER_LEVEL,
  HINT_COST,
  HINT_SECONDS,
  LEVEL_TIME,
  STREAK_BONUS,
  TIME_BONUS,
  WRONG_POINTS,
  WRONG_SECONDS,
  WRONG_TIME,
} from './config.js';
import { SCENES } from './scenes.js';

export const EVENT_FOUND = 1;
export const EVENT_WRONG = 2;
export const EVENT_LEVEL = 4;
export const EVENT_WIN = 8;
export const EVENT_TIMEOUT = 16;
export const EVENT_HINT = 32;

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL = 'level';
export const SCREEN_WIN = 'win';
export const SCREEN_TIMEOUT = 'timeout';

/** A fresh world: title screen, level one, nothing found yet. */
export function createWorld() {
  return {
    screen: SCREEN_TITLE,
    level: 0,
    found: new Set(),
    foundOrder: [],
    score: 0,
    streak: 0,
    timeLeft: LEVEL_TIME,
    hintsLeft: HINTS_PER_LEVEL,
    hintAt: null, // the difference id a hint is ringing, or null
    hintUntil: 0,
    wrongAt: null, // { panel, x, y, until } of the last wrong click, or null
    toast: '',
    toastUntil: 0,
    elapsed: 0,
    levelBonus: 0,
    totalFound: 0,
    best: 0,
  };
}

/** The differences of the current level. */
export function currentDiffs(world) {
  return SCENES[world.level].differences;
}

/** Every difference id of the current level, i.e. the changed set of the right panel. */
export function changedIds(world) {
  return new Set(currentDiffs(world).map((d) => d.id));
}

/** Start (or restart) the whole game from level one. */
export function startGame(world) {
  world.level = 0;
  world.score = 0;
  world.streak = 0;
  world.totalFound = 0;
  world.screen = SCREEN_PLAY;
  resetLevel(world);
}

/** Set up the current level's clock, finds and hints. */
export function resetLevel(world) {
  world.found = new Set();
  world.foundOrder = [];
  world.timeLeft = LEVEL_TIME;
  world.hintsLeft = HINTS_PER_LEVEL;
  world.hintAt = null;
  world.wrongAt = null;
  world.toast = '';
}

/** Which panel a field point is in: 0 for left, 1 for right, -1 for neither. */
export function panelAt(x, y) {
  if (y < 108 || y > 548) return -1;
  if (x >= 40 && x <= 620) return 0;
  if (x >= 660 && x <= 1240) return 1;
  return -1;
}

/** Convert a field point to scene coordinates inside its panel. */
export function toScene(panel, x, y) {
  return { x: x - (panel === 0 ? 40 : 660), y: y - 108 };
}

/**
 * Handle a click at field coordinates. Returns an event mask. A click on a
 * difference finds it on both panels; anywhere else in a panel is a miss.
 */
export function clickAt(world, x, y) {
  if (world.screen !== SCREEN_PLAY) return 0;
  const panel = panelAt(x, y);
  if (panel === -1) return 0;
  const point = toScene(panel, x, y);
  let hit = null;
  let hitD = Infinity;
  for (const d of currentDiffs(world)) {
    if (world.found.has(d.id)) continue;
    const dist = Math.hypot(point.x - d.x, point.y - d.y);
    if (dist < hitD) {
      hitD = dist;
      hit = d;
    }
  }
  const radius = CLICK_RADIUS;
  if (hit && hitD <= radius) {
    world.found.add(hit.id);
    world.foundOrder.push(hit.id);
    world.totalFound += 1;
    world.streak += 1;
    const gained = FIND_POINTS + STREAK_BONUS * (world.streak - 1);
    world.score += gained;
    world.toast = `${hit.label}! +${gained}`;
    world.toastUntil = world.elapsed + 2;
    world.hintAt = null;
    if (world.found.size === currentDiffs(world).length) {
      world.levelBonus = Math.ceil(world.timeLeft) * TIME_BONUS;
      world.score += world.levelBonus;
      if (world.level === SCENES.length - 1) {
        world.screen = SCREEN_WIN;
        return EVENT_FOUND | EVENT_WIN;
      }
      world.screen = SCREEN_LEVEL;
      return EVENT_FOUND | EVENT_LEVEL;
    }
    return EVENT_FOUND;
  }
  world.streak = 0;
  world.score = Math.max(0, world.score - WRONG_POINTS);
  world.timeLeft = Math.max(0, world.timeLeft - WRONG_TIME);
  world.wrongAt = { panel, x: point.x, y: point.y, until: world.elapsed + WRONG_SECONDS };
  world.toast = `Not there — ${WRONG_TIME}s!`;
  world.toastUntil = world.elapsed + 1.2;
  return EVENT_WRONG;
}

/** Spend a hint: ring a random difference you have not found yet. */
export function useHint(world) {
  if (world.screen !== SCREEN_PLAY) return 0;
  if (world.hintsLeft <= 0) {
    world.toast = 'No hints left!';
    world.toastUntil = world.elapsed + 1.2;
    return 0;
  }
  const remaining = currentDiffs(world).filter((d) => !world.found.has(d.id));
  if (remaining.length === 0) return 0;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  world.hintsLeft -= 1;
  world.score = Math.max(0, world.score - HINT_COST);
  world.hintAt = pick.id;
  world.hintUntil = world.elapsed + HINT_SECONDS;
  world.toast = `Hint: look near the ${pick.label.toLowerCase().replace(/^the /, '')}…`;
  world.toastUntil = world.elapsed + HINT_SECONDS;
  return EVENT_HINT;
}

/** Move to the next level after a level-clear screen. */
export function nextLevel(world) {
  world.level += 1;
  world.screen = SCREEN_PLAY;
  resetLevel(world);
}

/** Advance the clock; returns an event mask (a timeout ends the run). */
export function step(world, dt) {
  world.elapsed += dt;
  if (world.screen === SCREEN_PLAY) {
    world.timeLeft -= dt;
    if (world.timeLeft <= 0) {
      world.timeLeft = 0;
      world.screen = SCREEN_TIMEOUT;
      return EVENT_TIMEOUT;
    }
  }
  return 0;
}
