// Boot and the one loop: input is read as it arrives, the world advances in
// fixed 1/60 s steps (several in a slow frame, none in a fast one), and the
// renderer paints what is there. The game moves between six screens: title,
// play, paused, level-clear, win and timeout.
//
// ?seed=N fixes the run. ?shot=start|play|play2|end (with &seed=N) stages that
// scene instead of running the loop, paints it twice and sets
// window.__shotReady for a screenshot.

import { BEST_KEY, STEP } from './config.js';
import { createRandom } from './random.js';
import {
  EVENT_FOUND,
  EVENT_HINT,
  EVENT_LEVEL,
  EVENT_TIMEOUT,
  EVENT_WIN,
  EVENT_WRONG,
  SCREEN_LEVEL,
  SCREEN_PAUSED,
  SCREEN_PLAY,
  SCREEN_TIMEOUT,
  SCREEN_TITLE,
  SCREEN_WIN,
  clickAt,
  createWorld,
  nextLevel,
  startGame,
  step,
  useHint,
} from './world.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_PAUSE, ACTION_RESTART, createInput } from './input.js';
import { createAudio } from './audio.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';

/** The longest frame the loop catches up on; a longer stall is dropped. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);
void createRandom(seed); // the seed is kept for deterministic runs; scenes are fixed art.

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
const renderer = createRenderer(canvas);
const audio = createAudio();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score lasts this visit only.
  }
}

world.best = readBest();

function announce() {
  const total = 7;
  const found = world.found.size;
  const lines = {
    title: 'Spot the Difference. Press Enter or click to start hunting.',
    play: `Level ${world.level + 1} of 3. Found ${found} of ${total} differences. ${Math.ceil(world.timeLeft)} seconds left. Score ${world.score}.`,
    paused: 'Paused.',
    level: `Level ${world.level + 1} cleared. Score ${world.score}.`,
    win: `You found them all. Final score ${world.score}.`,
    timeout: `Time is up. You found ${found} of ${total}. Score ${world.score}.`,
  };
  status.textContent = lines[world.screen] ?? '';
}

function playEvents(events) {
  if (events & EVENT_FOUND) audio.found();
  if (events & EVENT_WRONG) audio.wrong();
  if (events & EVENT_HINT) audio.hint();
  if (events & EVENT_LEVEL) audio.level();
  if (events & EVENT_WIN) {
    audio.win();
    if (world.score > world.best) {
      world.best = world.score;
      saveBest(world.best);
    }
  }
  if (events & EVENT_TIMEOUT) {
    audio.timeout();
    if (world.score > world.best) {
      world.best = world.score;
      saveBest(world.best);
    }
  }
}

function onClick(x, y) {
  audio.unlock();
  if (world.screen === SCREEN_TITLE) {
    startGame(world);
  } else if (world.screen === SCREEN_LEVEL) {
    nextLevel(world);
  } else if (world.screen === SCREEN_WIN || world.screen === SCREEN_TIMEOUT) {
    startGame(world);
  } else if (world.screen === SCREEN_PAUSED) {
    world.screen = SCREEN_PLAY;
  } else if (world.screen === SCREEN_PLAY) {
    playEvents(clickAt(world, x, y));
  }
  announce();
}

function onAction(action) {
  audio.unlock();
  if (action === ACTION_CONFIRM) {
    if (world.screen === SCREEN_TITLE) startGame(world);
    else if (world.screen === SCREEN_LEVEL) nextLevel(world);
    else if (world.screen === SCREEN_WIN || world.screen === SCREEN_TIMEOUT) startGame(world);
    else if (world.screen === SCREEN_PAUSED) world.screen = SCREEN_PLAY;
  } else if (action === ACTION_PAUSE) {
    if (world.screen === SCREEN_PLAY) world.screen = SCREEN_PAUSED;
    else if (world.screen === SCREEN_PAUSED) world.screen = SCREEN_PLAY;
  } else if (action === ACTION_HINT) {
    playEvents(useHint(world));
  } else if (action === ACTION_MUTE) {
    audio.toggleMute();
  } else if (action === ACTION_RESTART) {
    startGame(world);
  }
  announce();
}

function runShot(name) {
  stageShot(name, world);
  announce();
  let painted = 0;
  function paint() {
    renderer.draw(world);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  createInput(canvas, onClick, onAction);
  announce();
  let last = performance.now();
  let accumulator = 0;
  let lastWholeSecond = Math.ceil(world.timeLeft);
  function frame(now) {
    const elapsed = Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    accumulator += elapsed;
    while (accumulator >= STEP) {
      accumulator -= STEP;
      const events = step(world, STEP);
      if (events & EVENT_TIMEOUT) playEvents(events);
      if (world.screen === SCREEN_PLAY) {
        const whole = Math.ceil(world.timeLeft);
        if (whole < lastWholeSecond) {
          lastWholeSecond = whole;
          if (whole <= 10 && whole > 0) audio.tick();
        }
      } else {
        lastWholeSecond = Math.ceil(world.timeLeft);
      }
    }
    renderer.draw(world);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
