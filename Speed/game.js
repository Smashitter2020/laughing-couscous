var score = 0;
var AIScore = 0;

let timer = 10;
let scoreLeft = 0;
let scoreRight = 0;

function resetGame() {
  score = 0;
  AIScore = 0;
  timer = 10;
}

function getScore() {
  score += (Math.floor(Math.random() * 1) + 1);
  document.getElementById("myScore").textContent = score;
}

setTimeout(() => {
  document.getElementById("pointsBtn").disabled = true;
  if (score = AIScore) {
    return;
  }
  else if(score > AIScore) {
    scoreLeft++;
  }
  else {
    scoreRight++;
  }
}, 10000);

setInterval(() => {
  if (timer >= 1) {
    timer--;
    AIScore += (Math.floor(Math.random() * 1) + 1);
    document.getElementById("AIscore").textContent = AIScore;
  }
}, 1000);
