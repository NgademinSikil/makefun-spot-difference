// The painter: header, the two picture panels with their markers, the footer
// and every screen overlay. It draws the world state and nothing else — the
// rules live in world.js and the pictures live in scenes.js.

import { FIELD, FOOTER, HEADER, LEVELS, PALETTE, PANEL } from './config.js';
import { drawScene } from './scenes.js';
import {
  SCREEN_LEVEL,
  SCREEN_PAUSED,
  SCREEN_PLAY,
  SCREEN_TIMEOUT,
  SCREEN_TITLE,
  SCREEN_WIN,
  changedIds,
  currentDiffs,
} from './world.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function text(ctx, str, x, y, size, color, align = 'left', weight = '600') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(str, x, y);
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** A green ring with a tick, drawn over a found difference on one panel. */
function drawFoundMark(ctx, ox, oy, diff, pulse) {
  const r = diff.r + 6 + Math.sin(pulse * 6) * 1.5;
  ctx.strokeStyle = PALETTE.found;
  ctx.lineWidth = 5;
  circle(ctx, ox + diff.x, oy + diff.y, r);
  ctx.stroke();
  ctx.strokeStyle = PALETTE.found;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(ox + diff.x - 10, oy + diff.y);
  ctx.lineTo(ox + diff.x - 3, oy + diff.y + 8);
  ctx.lineTo(ox + diff.x + 11, oy + diff.y - 8);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

/** A red X where the player just clicked wrong. */
function drawWrongMark(ctx, ox, oy, mark) {
  ctx.strokeStyle = PALETTE.wrong;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  const s = 14;
  ctx.beginPath();
  ctx.moveTo(ox + mark.x - s, oy + mark.y - s);
  ctx.lineTo(ox + mark.x + s, oy + mark.y + s);
  ctx.moveTo(ox + mark.x + s, oy + mark.y - s);
  ctx.lineTo(ox + mark.x - s, oy + mark.y + s);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

/** A pulsing amber ring around the difference a hint is pointing at. */
function drawHintMark(ctx, ox, oy, diff, elapsed) {
  const pulse = 0.5 + 0.5 * Math.sin(elapsed * 8);
  ctx.strokeStyle = PALETTE.hint;
  ctx.globalAlpha = 0.55 + 0.45 * pulse;
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  circle(ctx, ox + diff.x, oy + diff.y, diff.r + 12 + pulse * 6);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function fit() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = FIELD.width * dpr;
    canvas.height = FIELD.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  fit();
  window.addEventListener('resize', fit);

  function drawPanels(world) {
    const changed = changedIds(world);
    const diffs = currentDiffs(world);
    const panels = [
      { x: PANEL.leftX, label: 'A', changed: new Set() },
      { x: PANEL.rightX, label: 'B', changed },
    ];
    for (const panel of panels) {
      ctx.fillStyle = PALETTE.panelFrame;
      roundRect(ctx, panel.x - 8, PANEL.y - 8, PANEL.width + 16, PANEL.height + 16, 14);
      ctx.fill();
      drawScene(ctx, world.level, panel.changed, panel.x, PANEL.y);
      text(ctx, panel.label, panel.x + 14, PANEL.y + 30, 20, 'rgba(255,255,255,0.85)', 'left', '800');
      for (const id of world.found) {
        const diff = diffs.find((d) => d.id === id);
        if (diff) drawFoundMark(ctx, panel.x, PANEL.y, diff, world.elapsed);
      }
      if (world.hintAt && world.elapsed < world.hintUntil) {
        const diff = diffs.find((d) => d.id === world.hintAt);
        if (diff) drawHintMark(ctx, panel.x, PANEL.y, diff, world.elapsed);
      }
      if (world.wrongAt && world.elapsed < world.wrongAt.until) {
        const wrongPanel = world.wrongAt.panel === 0 ? panels[0] : panels[1];
        if (wrongPanel === panel) drawWrongMark(ctx, panel.x, PANEL.y, world.wrongAt);
      }
    }
  }

  function drawHeader(world) {
    ctx.fillStyle = PALETTE.header;
    ctx.fillRect(0, 0, FIELD.width, HEADER.height);
    text(ctx, 'SPOT THE DIFFERENCE', 40, 40, 30, PALETTE.text, 'left', '800');
    const level = LEVELS[world.level];
    text(ctx, `Level ${world.level + 1}/3 · ${level.name}`, 40, 68, 16, PALETTE.muted);
    // Found counter.
    const found = world.found.size;
    const total = currentDiffs(world).length;
    text(ctx, `Found ${found}/${total}`, 640, 42, 24, PALETTE.accent, 'center', '800');
    text(ctx, `${total - found} still hiding`, 640, 68, 14, PALETTE.muted, 'center');
    // Timer bar.
    const low = world.timeLeft <= 15;
    ctx.fillStyle = '#0d1320';
    roundRect(ctx, 940, 22, 240, 14, 7);
    ctx.fill();
    ctx.fillStyle = low ? PALETTE.timerLow : PALETTE.timerOk;
    const w = Math.max(0, (world.timeLeft / 120) * 240);
    if (w > 0) {
      roundRect(ctx, 940, 22, w, 14, 7);
      ctx.fill();
    }
    text(ctx, formatTime(world.timeLeft), 940, 62, 22, low ? PALETTE.timerLow : PALETTE.text, 'left', '800');
    text(ctx, `Score ${world.score}`, 1180, 62, 22, PALETTE.text, 'right', '800');
  }

  function drawFooter(world) {
    const y = FOOTER.y;
    text(ctx, 'Click a difference on either picture  ·  H hint (−50)  ·  P pause  ·  M sound  ·  R restart', 640, y + 26, 16, PALETTE.muted, 'center');
    text(ctx, `Hints left: ${world.hintsLeft}   ·   Streak: ${world.streak}   ·   Best: ${world.best}`, 640, y + 54, 16, PALETTE.muted, 'center');
    if (world.toast && world.elapsed < world.toastUntil) {
      text(ctx, world.toast, 640, y + 92, 20, PALETTE.accent, 'center', '700');
    }
  }

  function overlay(title, lines, button) {
    ctx.fillStyle = PALETTE.overlay;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    text(ctx, title, 640, 250, 54, PALETTE.text, 'center', '800');
    lines.forEach((line, i) => text(ctx, line, 640, 310 + i * 34, 22, PALETTE.muted, 'center'));
    if (button) {
      ctx.fillStyle = PALETTE.button;
      roundRect(ctx, 490, 470, 300, 58, 12);
      ctx.fill();
      text(ctx, button, 640, 508, 24, PALETTE.buttonText, 'center', '800');
    }
  }

  function drawTitle(world) {
    // The park scene sits behind the title, both panels visible.
    const changed = changedIds({ level: 0 });
    drawScene(ctx, 0, new Set(), PANEL.leftX, PANEL.y);
    drawScene(ctx, 0, changed, PANEL.rightX, PANEL.y);
    ctx.fillStyle = 'rgba(10, 14, 22, 0.72)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    text(ctx, 'SPOT THE', 640, 200, 64, PALETTE.text, 'center', '800');
    text(ctx, 'DIFFERENCE', 640, 272, 64, PALETTE.accent, 'center', '800');
    text(ctx, 'Two pictures. Seven sneaky changes. Find them all before the clock runs out.', 640, 322, 22, PALETTE.text, 'center');
    text(ctx, 'Three hand-drawn scenes — Sunny Park, Cozy Kitchen and Moon Base.', 640, 356, 18, PALETTE.muted, 'center');
    text(ctx, 'Click a difference on either side · H for a hint · wrong clicks cost 3 seconds', 640, 388, 18, PALETTE.muted, 'center');
    ctx.fillStyle = PALETTE.button;
    roundRect(ctx, 490, 430, 300, 58, 12);
    ctx.fill();
    text(ctx, '▶  Start hunting', 640, 468, 24, PALETTE.buttonText, 'center', '800');
    if (world.best > 0) text(ctx, `Best score: ${world.best}`, 640, 540, 18, PALETTE.accent, 'center', '700');
  }

  function draw(world) {
    ctx.clearRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    if (world.screen === SCREEN_TITLE) {
      drawTitle(world);
      return;
    }
    drawHeader(world);
    drawPanels(world);
    drawFooter(world);
    if (world.screen === SCREEN_PAUSED) {
      overlay('Paused', ['Take a breath — the clock is stopped.', 'P or Esc to keep hunting'], 'Resume');
    } else if (world.screen === SCREEN_LEVEL) {
      overlay(`Level ${world.level + 1} cleared!`, [
        `All ${currentDiffs(world).length} differences found.`,
        `Time bonus: +${world.levelBonus} points`,
        `Score: ${world.score}`,
      ], 'Next level ▶');
    } else if (world.screen === SCREEN_WIN) {
      overlay('You found them all!', [
        `Every difference in all three scenes — ${world.totalFound} in total.`,
        `Final score: ${world.score}   ·   Best: ${Math.max(world.best, world.score)}`,
      ], 'Play again');
    } else if (world.screen === SCREEN_TIMEOUT) {
      overlay("Time's up!", [
        `You found ${world.found.size} of ${currentDiffs(world).length} differences in ${LEVELS[world.level].name}.`,
        `Score: ${world.score}`,
      ], 'Try again');
    }
  }

  return { draw };
}
