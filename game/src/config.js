// Every tuning number and colour in one place. The playfield is a fixed 1280x720
// logical area; the renderer scales it to the window, so no rule below depends
// on the screen size. Each scene panel is 580x440 scene units.

export const FIELD = { width: 1280, height: 720 };

/** The simulation's fixed step, in seconds: 60 updates a second whatever the display's rate. */
export const STEP = 1 / 60;

// The two picture panels, in field coordinates.
export const PANEL = {
  width: 580,
  height: 440,
  y: 108,
  leftX: 40,
  rightX: 660,
  gap: 40,
};

export const HEADER = { height: 88 };
export const FOOTER = { y: 566, height: 130 };

/** Seconds on the clock when a level starts. */
export const LEVEL_TIME = 120;

/** Hints per level, and what one costs. */
export const HINTS_PER_LEVEL = 3;
export const HINT_COST = 50;

/** Points for a find, plus this much per find in the current streak. */
export const FIND_POINTS = 100;
export const STREAK_BONUS = 25;

/** What a wrong click costs: seconds off the clock and points off the score. */
export const WRONG_TIME = 3;
export const WRONG_POINTS = 10;

/** Points per second left when a level is cleared. */
export const TIME_BONUS = 10;

/** How long a hint ring pulses, in seconds, and a wrong-click X, in seconds. */
export const HINT_SECONDS = 2.5;
export const WRONG_SECONDS = 0.8;

/** The radius, in scene units, inside which a click counts as a find. */
export const CLICK_RADIUS = 34;

export const LEVELS = [
  { name: 'Sunny Park', tagline: 'A lazy afternoon in the park' },
  { name: 'Cozy Kitchen', tagline: 'Tea is on — something is off' },
  { name: 'Moon Base', tagline: 'One small step, seven small changes' },
];

export const PALETTE = {
  backdrop: '#141a26',
  header: '#1d2536',
  panelFrame: '#2b3548',
  panelLabel: '#8b93a3',
  text: '#eef1f5',
  muted: '#9aa3b2',
  accent: '#f2c94c',
  found: '#3ddc84',
  wrong: '#e5534b',
  hint: '#ffd23f',
  timerOk: '#3ddc84',
  timerLow: '#e5534b',
  overlay: 'rgba(10, 14, 22, 0.82)',
  button: '#f2c94c',
  buttonText: '#141a26',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'spot-the-difference.best';
