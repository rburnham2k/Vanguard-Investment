const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerScoreEl = document.getElementById('player-score');
const aiScoreEl = document.getElementById('ai-score');
const gameOverEl = document.getElementById('game-over');
const winnerTextEl = document.getElementById('winner-text');
const restartBtn = document.getElementById('restart-btn');

const WINNING_SCORE = 5;

// Game objects
const paddle = {
    width: 12,
    height: 80,
    x: 20,
    y: canvas.height / 2 - 40,
    speed: 6,
    dy: 0
};

const aiPaddle = {
    width: 12,
    height: 80,
    x: canvas.width - 32,
    y: canvas.height / 2 - 40,
    speed: 4.5,
    dy: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    speed: 5,
    dx: 5,
    dy: 5,
    reset: function() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        const angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
        const dir = Math.random() < 0.5 ? 1 : -1;
        this.dx = dir * this.speed * Math.cos(angle);
        this.dy = (Math.random() * 2 - 1) * this.speed * 0.5;
    }
};

let playerScore = 0;
let aiScore = 0;
let gameState = 'waiting'; // 'waiting', 'playing', 'paused', 'gameover'

// Keys
const keys = {};

// Draw functions
function drawPaddle(x, y, w, h) {
    ctx.fillStyle = '#ffd700';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffd700';
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;
}

function drawBall(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffd700';
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawCenterLine() {
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawMessage(text) {
    ctx.fillStyle = '#ffd700';
    ctx.font = '24px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffd700';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 50);
    ctx.shadowBlur = 0;
}

function drawPauseOverlay() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700';
    ctx.font = '36px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffd700';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0;
}

// Update functions
function updatePaddle() {
    if (keys['w'] || keys['W']) {
        paddle.dy = -paddle.speed;
    } else if (keys['s'] || keys['S']) {
        paddle.dy = paddle.speed;
    } else {
        paddle.dy = 0;
    }

    paddle.y += paddle.dy;
    paddle.y = Math.max(0, Math.min(canvas.height - paddle.height, paddle.y));
}

function updateAI() {
    const targetY = ball.y - aiPaddle.height / 2;
    const diff = targetY - aiPaddle.y;
    
    if (Math.abs(diff) > aiPaddle.speed) {
        aiPaddle.dy = Math.sign(diff) * aiPaddle.speed;
    } else {
        aiPaddle.dy = diff;
    }

    aiPaddle.y += aiPaddle.dy;
    aiPaddle.y = Math.max(0, Math.min(canvas.height - aiPaddle.height, aiPaddle.y));
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top & bottom walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.dy = -ball.dy;
    }

    // Paddle collision (player)
    if (
        ball.x - ball.radius <= paddle.x + paddle.width &&
        ball.x + ball.radius >= paddle.x &&
        ball.y >= paddle.y &&
        ball.y <= paddle.y + paddle.height
    ) {
        ball.dx = -ball.dx;
        ball.x = paddle.x + paddle.width + ball.radius;
        // Add spin based on where ball hit paddle
        const hitPos = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
        ball.dy += hitPos * 0.5;
        // Cap speed
        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        if (speed > 8) {
            ball.dx = (ball.dx / speed) * 8;
            ball.dy = (ball.dy / speed) * 8;
        }
    }

    // Paddle collision (AI)
    if (
        ball.x + ball.radius >= aiPaddle.x &&
        ball.x - ball.radius <= aiPaddle.x + aiPaddle.width &&
        ball.y >= aiPaddle.y &&
        ball.y <= aiPaddle.y + aiPaddle.height
    ) {
        ball.dx = -ball.dx;
        ball.x = aiPaddle.x - ball.radius;
        const hitPos = (ball.y - (aiPaddle.y + aiPaddle.height / 2)) / (aiPaddle.height / 2);
        ball.dy += hitPos * 0.5;
        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        if (speed > 8) {
            ball.dx = (ball.dx / speed) * 8;
            ball.dy = (ball.dy / speed) * 8;
        }
    }

    // Score
    if (ball.x - ball.radius <= 0) {
        aiScore++;
        aiScoreEl.textContent = aiScore;
        checkWin();
        if (gameState === 'playing') ball.reset();
    } else if (ball.x + ball.radius >= canvas.width) {
        playerScore++;
        playerScoreEl.textContent = playerScore;
        checkWin();
        if (gameState === 'playing') ball.reset();
    }
}

function checkWin() {
    if (playerScore >= WINNING_SCORE || aiScore >= WINNING_SCORE) {
        gameState = 'gameover';
        const winner = playerScore > aiScore ? 'You Win!' : 'AI Wins!';
        winnerTextEl.textContent = winner;
        gameOverEl.classList.remove('hidden');
    }
}

function resetGame() {
    playerScore = 0;
    aiScore = 0;
    playerScoreEl.textContent = '0';
    aiScoreEl.textContent = '0';
    paddle.y = canvas.height / 2 - paddle.height / 2;
    aiPaddle.y = canvas.height / 2 - aiPaddle.height / 2;
    ball.reset();
    gameOverEl.classList.add('hidden');
    gameState = 'waiting';
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCenterLine();

    if (gameState === 'waiting') {
        drawPaddle(paddle.x, paddle.y, paddle.width, paddle.height);
        drawPaddle(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
        drawBall(ball.x, ball.y, ball.radius);
        drawMessage('Press SPACE to start');
    } else if (gameState === 'playing') {
        updatePaddle();
        updateAI();
        updateBall();
        drawPaddle(paddle.x, paddle.y, paddle.width, paddle.height);
        drawPaddle(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
        drawBall(ball.x, ball.y, ball.radius);
    } else if (gameState === 'paused') {
        drawPaddle(paddle.x, paddle.y, paddle.width, paddle.height);
        drawPaddle(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
        drawBall(ball.x, ball.y, ball.radius);
        drawPauseOverlay();
    }

    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        if (gameState === 'waiting') {
            ball.reset();
            gameState = 'playing';
        }
    }

    if (e.key === 'p' || e.key === 'P') {
        if (gameState === 'playing') {
            gameState = 'paused';
        } else if (gameState === 'paused') {
            gameState = 'playing';
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

restartBtn.addEventListener('click', resetGame);

// Prevent page scroll on arrow keys
window.addEventListener('keydown', (e) => {
    if ([' ', 'Space', 'w', 'W', 's', 'S', 'p', 'P'].includes(e.key)) {
        e.preventDefault();
    }
});

// Start game loop
ball.reset();
gameLoop();