const TIMER_DURATION = 15; // seconds

let timeLeft = TIMER_DURATION;
let clicks = 0;
let timerInterval = null;
let testActive = false;

const timerSpan = document.getElementById('timer');
const clicksSpan = document.getElementById('clicks');
const clickerBtn = document.getElementById('clicker-btn');
const resultDialog = document.getElementById('result-dialog');
const finalClicksSpan = document.getElementById('final-clicks');
const cpsSpan = document.getElementById('cps');
const closeDialogBtn = document.getElementById('close-dialog');

function startTest() {
  if (testActive) return;
  testActive = true;
  timeLeft = TIMER_DURATION;
  clicks = 0;
  timerSpan.textContent = timeLeft;
  clicksSpan.textContent = clicks;
  clickerBtn.disabled = false;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}

function endTest() {
  clearInterval(timerInterval);
  clickerBtn.disabled = true;
  testActive = false;

  finalClicksSpan.textContent = clicks;
  cpsSpan.textContent = (clicks / TIMER_DURATION).toFixed(2);
  resultDialog.style.display = "flex";
}

clickerBtn.addEventListener('click', () => {
  if (!testActive) {
    startTest();
  }
  if (testActive && timeLeft > 0) {
    clicks++;
    clicksSpan.textContent = clicks;
  }
});

closeDialogBtn.addEventListener('click', () => {
  resultDialog.style.display = "none";
  clickerBtn.disabled = false;
  timeLeft = TIMER_DURATION;
  clicks = 0;
  timerSpan.textContent = timeLeft;
  clicksSpan.textContent = clicks;
  testActive = false;
});

window.addEventListener('load', () => {
  // Initial state
  timerSpan.textContent = TIMER_DURATION;
  clicksSpan.textContent = 0;
  clickerBtn.disabled = false;
  resultDialog.style.display = "none";
});
