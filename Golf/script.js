const canvas = document.getElementById('golf-canvas');
const ctx = canvas.getContext('2d');

const scoreElem = document.getElementById('score');
const shotsElem = document.getElementById('shots');
const resetBtn = document.getElementById('reset-btn');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const BALL_RADIUS = 15;
const HOLE_RADIUS = 22;
const FRICTION = 0.98;
const MIN_VELOCITY = 0.6;

let ballStart = {x: 60, y: HEIGHT / 2};
let ball = {x: ballStart.x, y: ballStart.y, vx: 0, vy: 0, moving: false};

let hole = {x: WIDTH - 80, y: HEIGHT / 2};

let obstacles = [
    // wall obstacles: {x, y, w, h}
    {x: 200, y: 80, w: 20, h: 340},
    {x: 400, y: 0, w: 20, h: 230},
    {x: 400, y: 330, w: 20, h: 170},
    {x: 600, y: 120, w: 20, h: 260},
    {x: 320, y: 200, w: 120, h: 20}, // horizontal
];

let dragging = false;
let aimStart = null;
let aimEnd = null;

let score = 0;
let shots = 0;

// Draw everything
function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw hole
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, HOLE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#222';
    ctx.fill();
    ctx.closePath();

    // Draw flag
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y - HOLE_RADIUS);
    ctx.lineTo(hole.x, hole.y - HOLE_RADIUS - 38);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.closePath();
    // Flag
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y - HOLE_RADIUS - 38);
    ctx.lineTo(hole.x + 22, hole.y - HOLE_RADIUS - 28);
    ctx.lineTo(hole.x, hole.y - HOLE_RADIUS - 18);
    ctx.fillStyle = '#e9453a';
    ctx.fill();
    ctx.closePath();

    // Draw obstacles
    for (let obs of obstacles) {
        ctx.fillStyle = '#8d5524';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
    }

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = "#bbb";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;

    // Draw aiming line
    if (dragging && aimStart && aimEnd) {
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(aimEnd.x, aimEnd.y);
        ctx.strokeStyle = '#e9453a';
        ctx.setLineDash([8, 7]);
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.closePath();

        // Draw arrow head
        let dx = aimEnd.x - ball.x;
        let dy = aimEnd.y - ball.y;
        let len = Math.sqrt(dx*dx + dy*dy);
        if (len > 0) {
            let angle = Math.atan2(dy, dx);
            let ahx = aimEnd.x - 18 * Math.cos(angle);
            let ahy = aimEnd.y - 18 * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(aimEnd.x, aimEnd.y);
            ctx.lineTo(ahx + 8*Math.sin(angle), ahy - 8*Math.cos(angle));
            ctx.lineTo(ahx - 8*Math.sin(angle), ahy + 8*Math.cos(angle));
            ctx.lineTo(aimEnd.x, aimEnd.y);
            ctx.fillStyle = '#e9453a';
            ctx.fill();
            ctx.closePath();
        }
    }
}

// Ball-wall collision
function handleCollisions() {
    // Canvas edges
    if (ball.x - BALL_RADIUS < 0) {
        ball.x = BALL_RADIUS;
        ball.vx *= -0.7;
    }
    if (ball.x + BALL_RADIUS > WIDTH) {
        ball.x = WIDTH - BALL_RADIUS;
        ball.vx *= -0.7;
    }
    if (ball.y - BALL_RADIUS < 0) {
        ball.y = BALL_RADIUS;
        ball.vy *= -0.7;
    }
    if (ball.y + BALL_RADIUS > HEIGHT) {
        ball.y = HEIGHT - BALL_RADIUS;
        ball.vy *= -0.7;
    }

    // Obstacles
    for (let obs of obstacles) {
        // Ball's bounding box
        let closestX = Math.max(obs.x, Math.min(ball.x, obs.x + obs.w));
        let closestY = Math.max(obs.y, Math.min(ball.y, obs.y + obs.h));
        let dx = ball.x - closestX;
        let dy = ball.y - closestY;
        if (dx*dx + dy*dy < BALL_RADIUS*BALL_RADIUS) {
            // Very simple bounce
            // Find which side: left/right/top/bottom
            let overlapX = 0, overlapY = 0;
            if (ball.x < obs.x) overlapX = ball.x - (obs.x - BALL_RADIUS);
            else if (ball.x > obs.x + obs.w) overlapX = ball.x - (obs.x + obs.w + BALL_RADIUS);
            if (ball.y < obs.y) overlapY = ball.y - (obs.y - BALL_RADIUS);
            else if (ball.y > obs.y + obs.h) overlapY = ball.y - (obs.y + obs.h + BALL_RADIUS);

            // Horizontal wall
            if (Math.abs(dx) > Math.abs(dy)) {
                ball.vx *= -0.7;
                if (ball.x < obs.x) ball.x = obs.x - BALL_RADIUS;
                else ball.x = obs.x + obs.w + BALL_RADIUS;
            } else {
                ball.vy *= -0.7;
                if (ball.y < obs.y) ball.y = obs.y - BALL_RADIUS;
                else ball.y = obs.y + obs.h + BALL_RADIUS;
            }
        }
    }
}

// Ball movement and win logic
function update() {
    if (ball.moving) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        ball.vx *= FRICTION;
        ball.vy *= FRICTION;

        handleCollisions();

        // Check if ball stopped
        if (Math.abs(ball.vx) < MIN_VELOCITY && Math.abs(ball.vy) < MIN_VELOCITY) {
            ball.vx = ball.vy = 0;
            ball.moving = false;
        }

        // Check for scoring (in hole)
        let distToHole = Math.hypot(ball.x - hole.x, ball.y - hole.y);
        if (distToHole < HOLE_RADIUS - 7) {
            score++;
            scoreElem.textContent = score;
            ball.moving = false;
            setTimeout(() => {
                resetBall();
            }, 1200);
        }
    }
    draw();
    requestAnimationFrame(update);
}

// Aiming logic
canvas.addEventListener('mousedown', function(e) {
    if (ball.moving) return;
    let rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;
    let dist = Math.hypot(mx - ball.x, my - ball.y);
    if (dist <= BALL_RADIUS + 7) {
        dragging = true;
        aimStart = {x: ball.x, y: ball.y};
        aimEnd = {x: mx, y: my};
    }
});
canvas.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    let rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;
    aimEnd = {x: mx, y: my};
});
canvas.addEventListener('mouseup', function(e) {
    if (!dragging) return;
    dragging = false;
    let dx = aimStart.x - aimEnd.x;
    let dy = aimStart.y - aimEnd.y;
    // Strength capped for playability
    let force = Math.min(Math.hypot(dx, dy), 120);
    let angle = Math.atan2(dy, dx);
    ball.vx = Math.cos(angle) * force * 0.25;
    ball.vy = Math.sin(angle) * force * 0.25;
    ball.moving = true;
    aimStart = null;
    aimEnd = null;
    shots++;
    shotsElem.textContent = shots;
});

// Touch events for mobile
canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (ball.moving) return;
    let rect = canvas.getBoundingClientRect();
    let t = e.touches[0];
    let mx = t.clientX - rect.left;
    let my = t.clientY - rect.top;
    let dist = Math.hypot(mx - ball.x, my - ball.y);
    if (dist <= BALL_RADIUS + 7) {
        dragging = true;
        aimStart = {x: ball.x, y: ball.y};
        aimEnd = {x: mx, y: my};
    }
});
canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (!dragging) return;
    let rect = canvas.getBoundingClientRect();
    let t = e.touches[0];
    let mx = t.clientX - rect.left;
    let my = t.clientY - rect.top;
    aimEnd = {x: mx, y: my};
});
canvas.addEventListener('touchend', function(e) {
    if (!dragging) return;
    dragging = false;
    let dx = aimStart.x - aimEnd.x;
    let dy = aimStart.y - aimEnd.y;
    let force = Math.min(Math.hypot(dx, dy), 120);
    let angle = Math.atan2(dy, dx);
    ball.vx = Math.cos(angle) * force * 0.25;
    ball.vy = Math.sin(angle) * force * 0.25;
    ball.moving = true;
    aimStart = null;
    aimEnd = null;
    shots++;
    shotsElem.textContent = shots;
});

// Restart button
resetBtn.addEventListener('click', function () {
    score = 0;
    shots = 0;
    scoreElem.textContent = score;
    shotsElem.textContent = shots;
    resetBall();
});

function resetBall() {
    ball.x = ballStart.x;
    ball.y = ballStart.y;
    ball.vx = ball.vy = 0;
    ball.moving = false;
    aimStart = null;
    aimEnd = null;
}

resetBall();
draw();
update();
