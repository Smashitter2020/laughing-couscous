var score = 0;
var AIScore = 0;

let timer = 10;
let scoreLeft = 0;
let scoreRight = 0;
let gameEnd = false;

function resetGame() {
  score = 0;
  AIScore = 0;
  timer = 10;
  gameEnd = false;
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
    gameEnd = true;
  }

  if (gameEnd) {
    if (score === AIScore) {
      return gameEnd = false;
    } else if (score > AIScore) {
      scoreLeft++;
      document.getElementById("score-left").textContent = scoreLeft;
      gameEnd = false;
    } else if (score < AIScore) {
      scoreRight++;
      document.getElementById("score-left").textContent = scoreRight;
      gameEnd = false;
    }
  }
}, 1000);
