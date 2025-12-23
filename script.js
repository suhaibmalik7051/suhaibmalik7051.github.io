// ===============================
// EDUCATIONAL CRASH GRAPH (DEMO)
// ===============================
// Purpose: Awareness only
// No money, no betting, no control illusion
// Crash point is PRE-DECIDED each round

const canvas = document.getElementById("crashCanvas");
const ctx = canvas.getContext("2d");
const info = document.getElementById("roundInfo");

// Resize canvas for responsiveness
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = 320;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Animation state
let animationId = null;
let startTime = null;
let crashPoint = 0;
let crashed = false;

// Graph state
let points = [];

// Config (tuned for smooth feel)
const BASE_GROWTH = 0.015;   // base multiplier growth
const CURVE_POWER = 1.35;   // curve smoothness
const MAX_TIME = 12000;     // safety stop (ms)

// ===============================
// ROUND SETUP
// ===============================
function newRound() {
  cancelAnimationFrame(animationId);
  startTime = null;
  crashed = false;
  points = [];

  // Pre-decided crash point (hidden in real games)
  crashPoint = randomCrashPoint();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  info.innerText = "New round started. Crash point already decided (hidden).";

  animationId = requestAnimationFrame(animate);
}

// Random crash distribution (more low crashes, fewer high)
function randomCrashPoint() {
  // Skewed distribution to show reality
  const r = Math.random();
  if (r < 0.65) return randomBetween(1.1, 2.2);
  if (r < 0.9) return randomBetween(2.2, 5.0);
  return randomBetween(5.0, 12.0);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

// ===============================
// ANIMATION LOOP
// ===============================
function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;

  // Time-based smooth growth (exponential-style)
  const t = elapsed / 1000;
  const multiplier =
    1 + Math.pow(t * BASE_GROWTH + 0.01, CURVE_POWER) * 80;

  // Convert to usable value
  const value = Math.max(1, multiplier);

  // Save point
  points.push(value);

  // Draw
  drawGraph(points);

  // Update info text
  info.innerText = `Multiplier: ${value.toFixed(2)}x`;

  // Crash check
  if (value >= crashPoint) {
    crash(value);
    return;
  }

  // Safety stop
  if (elapsed > MAX_TIME) {
    crash(value);
    return;
  }

  animationId = requestAnimationFrame(animate);
}

// ===============================
// DRAWING
// ===============================
function drawGraph(data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  const padding = 30;
  const w = canvas.width - padding * 2;
  const h = canvas.height - padding * 2;

  // Scale Y to visible area
  const maxVal = Math.max(...data, 3);
  const xStep = w / Math.max(data.length - 1, 1);

  data.forEach((v, i) => {
    const x = padding + i * xStep;
    const y = padding + h - (v / maxVal) * h;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.shadowColor = "rgba(56,189,248,0.6)";
  ctx.shadowBlur = 12;
  ctx.stroke();

  // Reset shadow
  ctx.shadowBlur = 0;
}

// ===============================
// CRASH EVENT
// ===============================
function crash(value) {
  crashed = true;
  cancelAnimationFrame(animationId);

  info.innerText =
    `CRASHED at ${value.toFixed(2)}x — This point was decided before the round started.`;

  // Red flash to show crash (visual only)
  ctx.fillStyle = "rgba(239,68,68,0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Auto restart after pause
  setTimeout(newRound, 2200);
}

// ===============================
// START AUTO DEMO
// ===============================
setTimeout(newRound, 800);