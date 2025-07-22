const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

// Game dimensions
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Paddle properties
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const PADDLE_GAP = 24;

// Ball properties
const BALL_SIZE = 16;
const BALL_SPEED = 6;

// Score
let scoreLeft = 0;
let scoreRight = 0;

// Left paddle (player)
let leftPaddleY = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;

// Right paddle (AI)
let rightPaddleY = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
const AI_SPEED = 5;

// Ball
let ballX, ballY, ballVX, ballVY;

// Start game
function resetBall(direction = 1) {
  ballX = CANVAS_WIDTH / 2;
  ballY = CANVAS_HEIGHT / 2;
  // Angle: randomize, but always toward the player who missed
  let angle = (Math.random() * Math.PI / 3) - (Math.PI / 6); // between -30 and +30 degrees
  ballVX = direction * BALL_SPEED * Math.cos(angle);
  ballVY = BALL_SPEED * Math.sin(angle);
}

function resetGame() {
  scoreLeft = 0;
  scoreRight = 0;
  updateScoreboard();
  resetBall(1);
}

function updateScoreboard() {
  document.getElementById('score-left').textContent = scoreLeft;
  document.getElementById('score-right').textContent = scoreRight;
}

// Mouse movement for player paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddleY = mouseY - PADDLE_HEIGHT / 2;

  // Clamp paddle within canvas
  if (leftPaddleY < 0) leftPaddleY = 0;
  if (leftPaddleY > CANVAS_HEIGHT - PADDLE_HEIGHT) leftPaddleY = CANVAS_HEIGHT - PADDLE_HEIGHT;
});

// Game loop
function gameLoop() {
  // Move ball
  ballX += ballVX;
  ballY += ballVY;

  // Wall collision (top/bottom)
  if (ballY < 0) {
    ballY = 0;
    ballVY = -ballVY;
  }
  if (ballY > CANVAS_HEIGHT - BALL_SIZE) {
    ballY = CANVAS_HEIGHT - BALL_SIZE;
    ballVY = -ballVY;
  }

  // Paddle collision - left
  if (
    ballX < PADDLE_GAP + PADDLE_WIDTH &&
    ballY + BALL_SIZE > leftPaddleY &&
    ballY < leftPaddleY + PADDLE_HEIGHT
  ) {
    ballX = PADDLE_GAP + PADDLE_WIDTH; // Avoid sticking
    ballVX = -ballVX;

    // Add spin
    let hitPos = (ballY + BALL_SIZE / 2) - (leftPaddleY + PADDLE_HEIGHT / 2);
    ballVY += hitPos * 0.18;
  }

  // Paddle collision - right (AI)
  if (
    ballX + BALL_SIZE > CANVAS_WIDTH - PADDLE_GAP - PADDLE_WIDTH &&
    ballY + BALL_SIZE > rightPaddleY &&
    ballY < rightPaddleY + PADDLE_HEIGHT
  ) {
    ballX = CANVAS_WIDTH - PADDLE_GAP - PADDLE_WIDTH - BALL_SIZE;
    ballVX = -ballVX;

    // Add spin
    let hitPos = (ballY + BALL_SIZE / 2) - (rightPaddleY + PADDLE_HEIGHT / 2);
    ballVY += hitPos * 0.18;
  }

  // Score!
  if (ballX < 0) {
    scoreRight++;
    updateScoreboard();
    resetBall(1);
  }
  if (ballX > CANVAS_WIDTH - BALL_SIZE) {
    scoreLeft++;
    updateScoreboard();
    resetBall(-1);
  }

  // AI paddle movement
  let targetY = ballY + BALL_SIZE / 2 - PADDLE_HEIGHT / 2;
  if (rightPaddleY + PADDLE_HEIGHT / 2 < targetY) {
    rightPaddleY += AI_SPEED;
  } else if (rightPaddleY + PADDLE_HEIGHT / 2 > targetY) {
    rightPaddleY -= AI_SPEED;
  }
  // Clamp
  if (rightPaddleY < 0) rightPaddleY = 0;
  if (rightPaddleY > CANVAS_HEIGHT - PADDLE_HEIGHT) rightPaddleY = CANVAS_HEIGHT - PADDLE_HEIGHT;

  // Draw everything
  draw();

  requestAnimationFrame(gameLoop);
}

// Drawing
function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw middle line
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 6;
  ctx.setLineDash([18, 20]);
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2, 0);
  ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw left paddle
  ctx.fillStyle = "#1de9b6";
  ctx.fillRect(PADDLE_GAP, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw right paddle
  ctx.fillStyle = "#ff1744";
  ctx.fillRect(CANVAS_WIDTH - PADDLE_GAP - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, 2 * Math.PI);
  ctx.fill();
}

// Initialize
resetGame();
gameLoop();
