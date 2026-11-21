// Mouse and keyboard input, translated into field coordinates and actions.
// The canvas fills the window; the game logic works in fixed 1280x720 units,
// so every pointer position is scaled back into that space.

export const ACTION_CONFIRM = 'confirm';
export const ACTION_PAUSE = 'pause';
export const ACTION_HINT = 'hint';
export const ACTION_MUTE = 'mute';
export const ACTION_RESTART = 'restart';

export function createInput(canvas, onClick, onAction) {
  function scale(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 1280,
      y: ((event.clientY - rect.top) / rect.height) * 720,
    };
  }

  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    const point = scale(event);
    onClick(point.x, point.y);
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'enter' || key === ' ') {
      event.preventDefault();
      onAction(ACTION_CONFIRM);
    } else if (key === 'p' || key === 'escape') {
      onAction(ACTION_PAUSE);
    } else if (key === 'h') {
      onAction(ACTION_HINT);
    } else if (key === 'm') {
      onAction(ACTION_MUTE);
    } else if (key === 'r') {
      onAction(ACTION_RESTART);
    }
  });
}
