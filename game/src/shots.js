// The screenshot scenes behind ?shot=start|play|play2|end. Each one plays the
// real rules forward from a fresh world by clicking real difference spots, so
// the frame is what a genuine game looks like and the same seed always gives
// the same frame. The play scenes leave several differences unfound, with the
// counter showing how many remain — exactly what the game looks like mid-hunt.

import { clickAt, createWorld, nextLevel, startGame } from './world.js';
import { SCENES } from './scenes.js';

/** Field coordinates of a difference on the left panel. */
function leftSpot(diff) {
  return { x: 40 + diff.x, y: 108 + diff.y };
}

/** Click the first `count` differences of the current level, in scene order. */
function findSome(world, count) {
  const diffs = SCENES[world.level].differences;
  for (let i = 0; i < count && i < diffs.length; i += 1) {
    const spot = leftSpot(diffs[i]);
    clickAt(world, spot.x, spot.y);
  }
}

/** Burn some clock so the timer reads mid-game rather than full. */
function burnTime(world, seconds) {
  world.timeLeft = Math.max(5, world.timeLeft - seconds);
}

/**
 * Set `world` to the named scene (start, play, play2 or end; any other name
 * is start) and return the screen to draw over it.
 */
export function stageShot(name, world) {
  if (name === 'play') {
    startGame(world);
    findSome(world, 3);
    burnTime(world, 46);
    return world.screen;
  }
  if (name === 'play2') {
    startGame(world);
    // Clear level one, then hunt four differences in the kitchen.
    const first = SCENES[0].differences;
    for (const d of first) {
      const spot = leftSpot(d);
      clickAt(world, spot.x, spot.y);
    }
    nextLevel(world);
    findSome(world, 4);
    burnTime(world, 71);
    return world.screen;
  }
  if (name === 'end') {
    startGame(world);
    for (let level = 0; level < SCENES.length; level += 1) {
      const diffs = SCENES[world.level].differences;
      for (const d of diffs) {
        const spot = leftSpot(d);
        clickAt(world, spot.x, spot.y);
      }
      if (world.level < SCENES.length - 1) nextLevel(world);
    }
    // The staged win is a real win: the best score follows the final score.
    if (world.score > world.best) world.best = world.score;
    return world.screen;
  }
  // start (and anything else): a fresh title screen.
  const fresh = createWorld();
  Object.assign(world, fresh);
  return world.screen;
}
