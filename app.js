const countdownOverlay = document.getElementById("countdownOverlay");
const countdownNumber = document.getElementById("countdownNumber");
const mainContent = document.getElementById("mainContent");
const replayBtn = document.getElementById("replayBtn");
const burstBtn = document.getElementById("burstBtn");
const typewriter = document.getElementById("typewriter");
const twinkles = document.getElementById("twinkles");
const confettiCanvas = document.getElementById("confettiCanvas");
const heartPop = document.getElementById("heartPop");

const birthdayMessage =
  "HAPPY BIRTHDAY PAWII 🌟\nHaving a close friend like you means a lot to me.\nWishing you a year that treats you better than ever, with big wins and happy moments 💯";

let confettiPieces = [];
let confettiRunning = false;
let fireworks = [];
let ctx;
let width;
let height;
let repeatRainTimer;
let heartTimer;
let fireworkSequenceTimer;
let fireworkSequenceStopTimer;
let animationFrameId;

function createTwinkles() {
  for (let i = 0; i < 45; i += 1) {
    const dot = document.createElement("span");
    dot.className = "sparkle";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDelay = `${Math.random() * 3}s`;
    dot.style.animationDuration = `${2 + Math.random() * 2.5}s`;
    twinkles.appendChild(dot);
  }
}

function typeWriterEffect(text, speed = 34) {
  typewriter.textContent = "";
  let index = 0;
  const timer = setInterval(() => {
    typewriter.textContent += text[index] || "";
    index += 1;
    if (index >= text.length) {
      clearInterval(timer);
    }
  }, speed);
}

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  confettiCanvas.width = width;
  confettiCanvas.height = height;
}

function generateConfetti(count = 180) {
  const colors = ["#ff5fa2", "#ffca5f", "#49f8b8", "#66d3ff", "#c9a8ff"];
  confettiPieces = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * -height,
    r: 3 + Math.random() * 4,
    d: 0.35 + Math.random() * 0.65,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.005 + Math.random() * 0.009,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

function drawConfetti() {
  confettiPieces.forEach((piece) => {
    ctx.beginPath();
    ctx.fillStyle = piece.color;
    ctx.fillRect(piece.x, piece.y, piece.r, piece.r * 1.4);
  });
}

function updateConfetti() {
  confettiPieces.forEach((piece) => {
    piece.y += piece.d;
    piece.sway += piece.swaySpeed;
    piece.x += Math.sin(piece.sway) * 0.18;

    if (piece.y > height + 10) {
      piece.y = -10;
      piece.x = Math.random() * width;
    }
  });
}

function spawnFireworkBurst(x, y, particleCount = 34) {
  const colors = ["#ffd36f", "#ff7eb8", "#6ce7ff", "#8dffb7", "#d2b0ff"];
  for (let i = 0; i < particleCount; i += 1) {
    const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.22;
    const speed = 1.8 + Math.random() * 2.4;
    fireworks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      decay: 0.013 + Math.random() * 0.02,
      size: 1.6 + Math.random() * 1.8,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function drawFireworks() {
  fireworks.forEach((particle) => {
    ctx.beginPath();
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = Math.max(particle.alpha, 0);
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function updateFireworks() {
  fireworks = fireworks.filter((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.03;
    particle.vx *= 0.992;
    particle.vy *= 0.992;
    particle.alpha -= particle.decay;
    return particle.alpha > 0;
  });
}

function animateScene() {
  const shouldKeepAnimating = confettiRunning || fireworks.length > 0;
  if (!shouldKeepAnimating) {
    animationFrameId = undefined;
    return;
  }

  ctx.clearRect(0, 0, width, height);
  drawConfetti();
  drawFireworks();
  updateConfetti();
  updateFireworks();

  animationFrameId = requestAnimationFrame(animateScene);
}

function startAnimationLoop() {
  if (animationFrameId || !ctx) {
    return;
  }
  animationFrameId = requestAnimationFrame(animateScene);
}

function startConfetti(pieceCount = 220, stopAfterMs = 0) {
  if (!ctx) {
    ctx = confettiCanvas.getContext("2d");
  }
  resizeCanvas();
  generateConfetti(pieceCount);
  confettiRunning = true;
  startAnimationLoop();

  if (stopAfterMs > 0) {
    setTimeout(() => {
      confettiRunning = false;
    }, stopAfterMs);
  }
}

function launchCountdownFireworks(durationMs = 3200) {
  if (fireworkSequenceTimer) {
    clearInterval(fireworkSequenceTimer);
  }
  if (fireworkSequenceStopTimer) {
    clearTimeout(fireworkSequenceStopTimer);
  }

  const burst = () => {
    const x = width * (0.12 + Math.random() * 0.76);
    const y = height * (0.12 + Math.random() * 0.45);
    spawnFireworkBurst(x, y, 28 + Math.floor(Math.random() * 14));
    startAnimationLoop();
  };

  burst();
  fireworkSequenceTimer = setInterval(burst, 360);

  fireworkSequenceStopTimer = setTimeout(() => {
    clearInterval(fireworkSequenceTimer);
    fireworkSequenceTimer = undefined;
    fireworkSequenceStopTimer = undefined;
  }, durationMs);
}

function enableRepeatingRain() {
  if (repeatRainTimer) {
    clearInterval(repeatRainTimer);
  }

  startConfetti(220);

  // Refresh particles periodically so the rain effect stays lively.
  repeatRainTimer = setInterval(() => {
    startConfetti(220);
  }, 18000);
}

function triggerSoftHeart() {
  if (!heartPop) {
    return;
  }

  const runHeartPulse = () => {
    heartPop.classList.remove("show");
    // Force reflow to restart animation class reliably.
    void heartPop.offsetWidth;
    heartPop.classList.add("show");
  };

  if (heartTimer) {
    clearInterval(heartTimer);
  }

  runHeartPulse();
  heartTimer = setInterval(runHeartPulse, 5200);
}

function launchCountdown() {
  let time = 5;
  countdownNumber.textContent = String(time);
  countdownOverlay.classList.remove("hidden");
  mainContent.classList.remove("revealed");

  const timer = setInterval(() => {
    time -= 1;
    if (time > 0) {
      countdownNumber.textContent = String(time);
      return;
    }

    clearInterval(timer);
    countdownOverlay.classList.add("hidden");
    mainContent.classList.add("revealed");
    typeWriterEffect(birthdayMessage);
    enableRepeatingRain();
    launchCountdownFireworks();
    triggerSoftHeart();
  }, 1000);
}

replayBtn.addEventListener("click", () => {
  launchCountdown();
});

burstBtn.addEventListener("click", () => {
  startConfetti(320);
});

window.addEventListener("resize", resizeCanvas);

createTwinkles();
launchCountdown();
