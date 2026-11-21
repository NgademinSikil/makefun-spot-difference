// The three scenes, drawn from scratch with canvas primitives — no borrowed art.
// Each scene draws itself twice: once plain (left panel) and once with a set of
// `changed` difference ids applied (right panel). A difference is a spot in scene
// coordinates with a click radius and a short label for the "found" toast.

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function cloud(ctx, x, y, scale) {
  ctx.fillStyle = '#ffffff';
  circle(ctx, x, y, 22 * scale);
  circle(ctx, x + 22 * scale, y + 4 * scale, 17 * scale);
  circle(ctx, x - 22 * scale, y + 5 * scale, 16 * scale);
  roundRect(ctx, x - 34 * scale, y - 2 * scale, 70 * scale, 18 * scale, 9 * scale);
}

// ---------------------------------------------------------------- Sunny Park
function drawPark(ctx, changed) {
  // Sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 440);
  sky.addColorStop(0, '#6ec1f5');
  sky.addColorStop(1, '#d8f2fd');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 580, 440);

  // Sun, top left — with sunglasses in the changed panel.
  ctx.fillStyle = '#ffd93b';
  circle(ctx, 88, 72, 36);
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(88 + Math.cos(a) * 44, 72 + Math.sin(a) * 44);
    ctx.lineTo(88 + Math.cos(a) * 56, 72 + Math.sin(a) * 56);
    ctx.stroke();
  }
  if (changed.has('sun-glasses')) {
    ctx.fillStyle = '#20242e';
    roundRect(ctx, 62, 62, 20, 14, 6);
    roundRect(ctx, 90, 62, 20, 14, 6);
    ctx.fillRect(82, 67, 8, 3);
    ctx.fillRect(56, 67, 6, 3);
    ctx.fillRect(110, 67, 6, 3);
  }

  // Clouds — the middle one vanishes in the changed panel.
  cloud(ctx, 205, 58, 1);
  if (!changed.has('cloud-missing')) cloud(ctx, 385, 46, 0.9);
  cloud(ctx, 495, 96, 0.7);

  // Bird in the sky — gone in the changed panel.
  if (!changed.has('bird')) {
    ctx.strokeStyle = '#33415c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(252, 118);
    ctx.quadraticCurveTo(260, 108, 268, 118);
    ctx.quadraticCurveTo(276, 108, 284, 118);
    ctx.stroke();
  }

  // Rolling hills.
  ctx.fillStyle = '#7ec850';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(160, 240, 330, 300);
  ctx.quadraticCurveTo(460, 345, 580, 295);
  ctx.lineTo(580, 440);
  ctx.lineTo(0, 440);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#69b843';
  ctx.beginPath();
  ctx.moveTo(0, 350);
  ctx.quadraticCurveTo(200, 305, 400, 352);
  ctx.quadraticCurveTo(500, 378, 580, 350);
  ctx.lineTo(580, 440);
  ctx.lineTo(0, 440);
  ctx.closePath();
  ctx.fill();

  // Pond with a duck — the duck swims away in the changed panel.
  ctx.fillStyle = '#4aa8dd';
  ellipse(ctx, 300, 392, 78, 24);
  ctx.fillStyle = '#7cc7ec';
  ellipse(ctx, 300, 388, 60, 16);
  if (!changed.has('duck')) {
    ctx.fillStyle = '#ffffff';
    ellipse(ctx, 296, 384, 13, 9);
    circle(ctx, 307, 377, 7);
    ctx.fillStyle = '#f2a541';
    ctx.beginPath();
    ctx.moveTo(313, 376);
    ctx.lineTo(321, 379);
    ctx.lineTo(313, 382);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#20242e';
    circle(ctx, 309, 375, 1.6);
  }

  // Little house, left.
  ctx.fillStyle = '#f6d8a0';
  ctx.fillRect(88, 268, 96, 72);
  ctx.fillStyle = '#d95f4b';
  ctx.beginPath();
  ctx.moveTo(76, 270);
  ctx.lineTo(136, 226);
  ctx.lineTo(196, 270);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(126, 300, 22, 40);
  ctx.fillStyle = '#bfe3f2';
  ctx.fillRect(98, 282, 20, 18);
  ctx.fillRect(154, 282, 20, 18);
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 2;
  ctx.strokeRect(98, 282, 20, 18);
  ctx.strokeRect(154, 282, 20, 18);

  // Big tree, right — its apples drop in the changed panel.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(462, 268, 18, 72);
  ctx.fillStyle = '#3f9e4d';
  circle(ctx, 471, 232, 42);
  circle(ctx, 438, 252, 30);
  circle(ctx, 504, 252, 30);
  if (!changed.has('tree-apples')) {
    ctx.fillStyle = '#e5534b';
    circle(ctx, 448, 238, 7);
    circle(ctx, 486, 224, 7);
    circle(ctx, 500, 252, 7);
    circle(ctx, 452, 262, 7);
  }

  // Picket fence across the middle — one plank snaps off in the changed panel.
  ctx.fillStyle = '#f2ead8';
  ctx.fillRect(40, 322, 500, 8);
  for (let i = 0; i < 10; i += 1) {
    const x = 52 + i * 50;
    if (changed.has('fence-plank') && i === 5) continue;
    ctx.fillRect(x, 296, 12, 44);
    ctx.beginPath();
    ctx.moveTo(x, 296);
    ctx.lineTo(x + 6, 286);
    ctx.lineTo(x + 12, 296);
    ctx.closePath();
    ctx.fill();
  }

  // Tulips along the bottom — one changes colour in the changed panel.
  const tulipXs = [70, 130, 190, 250, 380, 440, 520];
  tulipXs.forEach((x, i) => {
    ctx.strokeStyle = '#3f9e4d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 428);
    ctx.lineTo(x, 402);
    ctx.stroke();
    ctx.fillStyle = i === 2 && changed.has('flower-color') ? '#9b59d0' : '#e5534b';
    ctx.beginPath();
    ctx.moveTo(x - 9, 402);
    ctx.lineTo(x - 9, 388);
    ctx.quadraticCurveTo(x, 380, x + 9, 388);
    ctx.lineTo(x + 9, 402);
    ctx.closePath();
    ctx.fill();
  });
}

const PARK_DIFFS = [
  { id: 'sun-glasses', x: 88, y: 72, r: 30, label: 'The sun put on sunglasses' },
  { id: 'cloud-missing', x: 385, y: 46, r: 30, label: 'A cloud drifted away' },
  { id: 'tree-apples', x: 471, y: 240, r: 30, label: 'The apples fell off the tree' },
  { id: 'flower-color', x: 190, y: 394, r: 24, label: 'A tulip changed colour' },
  { id: 'bird', x: 268, y: 114, r: 26, label: 'The bird flew off' },
  { id: 'fence-plank', x: 308, y: 310, r: 26, label: 'A fence plank is missing' },
  { id: 'duck', x: 300, y: 380, r: 28, label: 'The duck swam away' },
];

// -------------------------------------------------------------- Cozy Kitchen
function drawKitchen(ctx, changed) {
  // Wall and floor.
  ctx.fillStyle = '#f6e3c5';
  ctx.fillRect(0, 0, 580, 350);
  ctx.fillStyle = '#c89b6a';
  ctx.fillRect(0, 350, 580, 90);
  ctx.fillStyle = '#b98a5a';
  for (let y = 372; y < 440; y += 22) ctx.fillRect(0, y, 580, 2);

  // Window with curtains, left.
  ctx.fillStyle = '#8fb8d8';
  ctx.fillRect(58, 42, 164, 138);
  ctx.fillStyle = '#bfe3f2';
  ctx.fillRect(70, 54, 140, 114);
  ctx.fillStyle = '#ffd93b';
  circle(ctx, 178, 88, 18);
  cloud(ctx, 118, 82, 0.5);
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(58, 42, 164, 8);
  ctx.fillRect(58, 172, 164, 8);
  ctx.fillRect(58, 42, 8, 138);
  ctx.fillRect(214, 42, 8, 138);
  ctx.fillRect(136, 42, 6, 138);
  ctx.fillStyle = '#d95f4b';
  ctx.beginPath();
  ctx.moveTo(52, 34);
  ctx.lineTo(76, 34);
  ctx.lineTo(70, 186);
  ctx.lineTo(52, 186);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(228, 34);
  ctx.lineTo(204, 34);
  ctx.lineTo(210, 186);
  ctx.lineTo(228, 186);
  ctx.closePath();
  ctx.fill();

  // Wall clock — it reads 3:00 on the left, 6:30 on the right.
  ctx.fillStyle = '#ffffff';
  circle(ctx, 430, 74, 34);
  ctx.strokeStyle = '#33415c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(430, 74, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#33415c';
  circle(ctx, 430, 74, 3);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(430, 74);
  if (changed.has('clock-time')) {
    ctx.lineTo(430, 96); // minute hand: 30, pointing down
    ctx.moveTo(430, 74);
    ctx.lineTo(420, 90); // hour hand: half past six, down-left
  } else {
    ctx.lineTo(430, 52); // minute hand: 12, pointing up
    ctx.moveTo(430, 74);
    ctx.lineTo(452, 74); // hour hand: 3, pointing right
  }
  ctx.stroke();

  // Framed picture — mountains on the left, a sunset on the right.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(296, 46, 96, 74);
  if (changed.has('picture')) {
    ctx.fillStyle = '#ff9a5c';
    ctx.fillRect(304, 54, 80, 58);
    ctx.fillStyle = '#ffd93b';
    circle(ctx, 344, 96, 14);
    ctx.fillStyle = '#7a4a21';
    ctx.fillRect(304, 100, 80, 12);
  } else {
    ctx.fillStyle = '#9fd3f5';
    ctx.fillRect(304, 54, 80, 58);
    ctx.fillStyle = '#5d8a4a';
    ctx.beginPath();
    ctx.moveTo(304, 112);
    ctx.lineTo(330, 72);
    ctx.lineTo(356, 112);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#4a7a3d';
    ctx.beginPath();
    ctx.moveTo(336, 112);
    ctx.lineTo(362, 78);
    ctx.lineTo(384, 112);
    ctx.closePath();
    ctx.fill();
  }

  // Hanging plant — it loses two leaves in the changed panel.
  ctx.strokeStyle = '#8a6a42';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(516, 0);
  ctx.lineTo(516, 34);
  ctx.stroke();
  ctx.fillStyle = '#d95f4b';
  ctx.beginPath();
  ctx.moveTo(496, 34);
  ctx.lineTo(536, 34);
  ctx.lineTo(526, 62);
  ctx.lineTo(506, 62);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3f9e4d';
  const leaves = changed.has('plant-leaf') ? 3 : 5;
  for (let i = 0; i < leaves; i += 1) {
    const a = -Math.PI / 2 + (i - (leaves - 1) / 2) * 0.5;
    ellipse(ctx, 516 + Math.cos(a) * 22, 66 + Math.sin(a) * 16, 9, 15);
  }

  // Table.
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(36, 300, 508, 16);
  ctx.fillRect(60, 316, 14, 34);
  ctx.fillRect(506, 316, 14, 34);

  // Teapot — its steam is gone in the changed panel.
  ctx.fillStyle = '#4a7fb5';
  ellipse(ctx, 150, 272, 34, 26);
  ctx.fillRect(138, 240, 24, 12);
  circle(ctx, 150, 238, 7);
  ctx.beginPath();
  ctx.moveTo(182, 262);
  ctx.quadraticCurveTo(206, 252, 200, 232);
  ctx.lineTo(192, 238);
  ctx.quadraticCurveTo(196, 252, 182, 256);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(118, 268, 14, Math.PI * 0.5, Math.PI * 1.5);
  ctx.strokeStyle = '#4a7fb5';
  ctx.lineWidth = 6;
  ctx.stroke();
  if (!changed.has('steam')) {
    ctx.strokeStyle = 'rgba(180, 190, 205, 0.9)';
    ctx.lineWidth = 3;
    for (const dx of [-8, 4]) {
      ctx.beginPath();
      ctx.moveTo(150 + dx, 232);
      ctx.quadraticCurveTo(144 + dx, 214, 152 + dx, 200);
      ctx.quadraticCurveTo(158 + dx, 190, 150 + dx, 180);
      ctx.stroke();
    }
  }

  // Two cups — the second one is missing in the changed panel.
  for (const cx of [296, 356]) {
    if (cx === 356 && changed.has('cups')) continue;
    ctx.fillStyle = '#f2ead8';
    roundRect(ctx, cx - 16, 272, 32, 24, 5);
    ctx.fillStyle = '#8a5a2e';
    ctx.fillRect(cx - 16, 272, 32, 4);
    ctx.strokeStyle = '#f2ead8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx + 18, 284, 8, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }

  // Fruit bowl — the apple turns green in the changed panel.
  ctx.fillStyle = '#d95f4b';
  ctx.beginPath();
  ctx.moveTo(428, 284);
  ctx.lineTo(512, 284);
  ctx.lineTo(500, 302);
  ctx.lineTo(440, 302);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2a541';
  circle(ctx, 452, 274, 11);
  circle(ctx, 492, 274, 11);
  ctx.fillStyle = changed.has('apple-color') ? '#7ec850' : '#e5534b';
  circle(ctx, 472, 268, 12);
  ctx.strokeStyle = '#3f9e4d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(472, 256);
  ctx.lineTo(478, 248);
  ctx.stroke();

  // Rug and cat — the tail lies flat in the changed panel.
  ctx.fillStyle = '#c96f5a';
  ellipse(ctx, 120, 402, 86, 22);
  ctx.fillStyle = '#e8b04b';
  ellipse(ctx, 120, 400, 70, 16);
  ctx.fillStyle = '#e8b04b';
  ellipse(ctx, 112, 384, 26, 20);
  circle(ctx, 128, 360, 15);
  ctx.beginPath();
  ctx.moveTo(116, 350);
  ctx.lineTo(120, 338);
  ctx.lineTo(126, 350);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(132, 350);
  ctx.lineTo(136, 338);
  ctx.lineTo(142, 350);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#20242e';
  circle(ctx, 123, 358, 2);
  circle(ctx, 133, 358, 2);
  ctx.strokeStyle = '#e8b04b';
  ctx.lineWidth = 7;
  ctx.beginPath();
  if (changed.has('cat-tail')) {
    ctx.moveTo(88, 392);
    ctx.quadraticCurveTo(70, 396, 62, 388);
  } else {
    ctx.moveTo(88, 392);
    ctx.quadraticCurveTo(72, 372, 82, 356);
  }
  ctx.stroke();
}

const KITCHEN_DIFFS = [
  { id: 'clock-time', x: 430, y: 74, r: 30, label: 'The clock jumped to half past six' },
  { id: 'steam', x: 150, y: 206, r: 28, label: 'The teapot stopped steaming' },
  { id: 'cat-tail', x: 76, y: 374, r: 28, label: "The cat's tail dropped" },
  { id: 'cups', x: 356, y: 284, r: 26, label: 'A cup vanished from the table' },
  { id: 'apple-color', x: 472, y: 268, r: 24, label: 'The apple turned green' },
  { id: 'plant-leaf', x: 516, y: 66, r: 28, label: 'The plant lost two leaves' },
  { id: 'picture', x: 344, y: 83, r: 30, label: 'The picture changed scenes' },
];

// ----------------------------------------------------------------- Moon Base
function drawMoon(ctx, changed) {
  // Deep space.
  ctx.fillStyle = '#0d1026';
  ctx.fillRect(0, 0, 580, 440);
  ctx.fillStyle = '#ffffff';
  const stars = [
    [60, 50, 2], [150, 30, 1.5], [240, 70, 2], [330, 40, 1.5], [520, 40, 2],
    [40, 140, 1.5], [200, 130, 1.5], [290, 100, 2], [380, 150, 1.5],
    [540, 130, 1.5], [90, 210, 1.5], [250, 190, 1.5], [500, 200, 2],
  ];
  for (const [x, y, r] of stars) circle(ctx, x, y, r);
  // One bright star winks out in the changed panel.
  if (!changed.has('stars')) {
    ctx.fillStyle = '#ffe9a8';
    circle(ctx, 120, 62, 4);
    ctx.strokeStyle = '#ffe9a8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(120, 50);
    ctx.lineTo(120, 74);
    ctx.moveTo(108, 62);
    ctx.lineTo(132, 62);
    ctx.stroke();
  }

  // Ringed planet, top right.
  ctx.fillStyle = '#c96f5a';
  circle(ctx, 452, 92, 52);
  ctx.fillStyle = '#a8543f';
  circle(ctx, 436, 80, 12);
  circle(ctx, 468, 104, 9);
  ctx.strokeStyle = '#e8b04b';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.ellipse(452, 92, 78, 18, -0.35, 0, Math.PI * 2);
  ctx.stroke();

  // Moon ground.
  ctx.fillStyle = '#9aa3b2';
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.quadraticCurveTo(180, 300, 360, 328);
  ctx.quadraticCurveTo(480, 348, 580, 322);
  ctx.lineTo(580, 440);
  ctx.lineTo(0, 440);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7e8798';
  ellipse(ctx, 90, 392, 26, 9);
  ellipse(ctx, 360, 410, 34, 11);
  ellipse(ctx, 520, 400, 22, 8);
  // A crater fills in in the changed panel.
  if (!changed.has('crater')) {
    ctx.fillStyle = '#7e8798';
    ellipse(ctx, 200, 384, 24, 9);
    ctx.fillStyle = '#6a7484';
    ellipse(ctx, 200, 386, 16, 5);
  }

  // Rocket, left — it loses a window in the changed panel.
  ctx.fillStyle = '#e8eef4';
  ctx.beginPath();
  ctx.moveTo(118, 176);
  ctx.quadraticCurveTo(118, 230, 118, 300);
  ctx.lineTo(158, 300);
  ctx.quadraticCurveTo(158, 230, 158, 176);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e5534b';
  ctx.beginPath();
  ctx.moveTo(118, 200);
  ctx.quadraticCurveTo(138, 158, 158, 200);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e5534b';
  ctx.beginPath();
  ctx.moveTo(118, 300);
  ctx.lineTo(100, 330);
  ctx.lineTo(118, 322);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(158, 300);
  ctx.lineTo(176, 330);
  ctx.lineTo(158, 322);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4aa8dd';
  circle(ctx, 138, 216, 11);
  if (!changed.has('rocket-window')) circle(ctx, 138, 252, 11);
  ctx.strokeStyle = '#33415c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(138, 216, 11, 0, Math.PI * 2);
  ctx.stroke();
  if (!changed.has('rocket-window')) {
    ctx.beginPath();
    ctx.arc(138, 252, 11, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Astronaut — the visor turns dark in the changed panel.
  ctx.fillStyle = '#e8eef4';
  roundRect(ctx, 286, 296, 34, 52, 10);
  ctx.fillStyle = '#c9d2de';
  roundRect(ctx, 320, 306, 10, 30, 4);
  ctx.fillStyle = '#e8eef4';
  circle(ctx, 303, 276, 19);
  ctx.fillStyle = changed.has('visor') ? '#20242e' : '#f2c94c';
  ctx.beginPath();
  ctx.arc(303, 276, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e8eef4';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(288, 330);
  ctx.lineTo(282, 356);
  ctx.moveTo(314, 330);
  ctx.lineTo(320, 356);
  ctx.stroke();
  ctx.fillStyle = '#e5534b';
  roundRect(ctx, 296, 312, 14, 10, 3);

  // Rover — a wheel falls off in the changed panel.
  ctx.fillStyle = '#f2a541';
  roundRect(ctx, 408, 322, 76, 26, 8);
  ctx.fillStyle = '#4aa8dd';
  roundRect(ctx, 424, 306, 30, 16, 4);
  ctx.fillStyle = '#20242e';
  circle(ctx, 424, 354, 11);
  circle(ctx, 452, 354, 11);
  if (!changed.has('rover-wheel')) circle(ctx, 474, 354, 11);
  ctx.fillStyle = '#8b93a3';
  circle(ctx, 424, 354, 4);
  circle(ctx, 452, 354, 4);
  if (!changed.has('rover-wheel')) circle(ctx, 474, 354, 4);

  // Flag — red on the left, blue on the right.
  ctx.strokeStyle = '#c9d2de';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(528, 246);
  ctx.lineTo(528, 322);
  ctx.stroke();
  ctx.fillStyle = changed.has('flag') ? '#4a7fb5' : '#e5534b';
  ctx.beginPath();
  ctx.moveTo(528, 246);
  ctx.lineTo(560, 256);
  ctx.lineTo(528, 268);
  ctx.closePath();
  ctx.fill();

  // Satellite dish — it swings the other way in the changed panel.
  ctx.strokeStyle = '#c9d2de';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(56, 300);
  ctx.lineTo(56, 340);
  ctx.stroke();
  ctx.fillStyle = '#e8eef4';
  ctx.beginPath();
  if (changed.has('dish')) {
    ctx.arc(56, 296, 22, -Math.PI * 0.15, Math.PI * 0.55);
  } else {
    ctx.arc(56, 296, 22, Math.PI * 0.45, Math.PI * 1.15);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e5534b';
  circle(ctx, 56, 296, 4);
}

const MOON_DIFFS = [
  { id: 'flag', x: 544, y: 257, r: 26, label: 'The flag changed colour' },
  { id: 'rover-wheel', x: 474, y: 354, r: 24, label: 'The rover lost a wheel' },
  { id: 'stars', x: 120, y: 62, r: 26, label: 'A bright star winked out' },
  { id: 'visor', x: 303, y: 276, r: 24, label: "The astronaut's visor went dark" },
  { id: 'rocket-window', x: 138, y: 252, r: 24, label: 'The rocket lost a window' },
  { id: 'crater', x: 200, y: 384, r: 26, label: 'A crater filled itself in' },
  { id: 'dish', x: 56, y: 296, r: 26, label: 'The dish swung around' },
];

/** The scenes in play order: each has a draw function and its differences. */
export const SCENES = [
  { draw: drawPark, differences: PARK_DIFFS },
  { draw: drawKitchen, differences: KITCHEN_DIFFS },
  { draw: drawMoon, differences: MOON_DIFFS },
];

/** Draw one scene into `ctx` at its panel origin, plain or with `changed` applied. */
export function drawScene(ctx, sceneIndex, changed, ox, oy) {
  ctx.save();
  ctx.translate(ox, oy);
  ctx.beginPath();
  ctx.rect(0, 0, 580, 440);
  ctx.clip();
  SCENES[sceneIndex].draw(ctx, changed);
  ctx.restore();
}
