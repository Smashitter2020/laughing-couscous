var score = 0;
var AIScore = 0;

let timer = 10;
let scoreLeft = 0;
let scoreRight = 0;

function resetGame() {
  score = 0;
  AIScore = 0;
  timer = 10;
  document.getElementById("pointsBtn").disabled = false;
}

function getScore() {
  score += (Math.floor(Math.random() * 1) + 1);
  document.getElementById("myScore").textContent = score;
}

setInterval(() => {
  if (timer >= 1) {
    timer--;
    AIScore += (Math.floor(Math.random() * 1) + 1);
    document.getElementById("AIscore").textContent = AIScore;
  } else if (timer === 0) {
    timer--;
    document.getElementById("pointsBtn").disabled = true;
  }
}, 1000);
