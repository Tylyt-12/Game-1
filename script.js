const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('bestScore');
const statusElement = document.getElementById('status');
const startButton = document.getElementById('startButton');
const soundButton = document.getElementById('soundButton');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let bestScore = 0;
let gameInterval = null;
let isRunning = false;
let soundOn = true;
let lastKey = null;

function playSound() {
  // Sound is disabled in this build to avoid browser compatibility issues.
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 0, y: 0 };
  score = 0;
  food = getRandomFoodPosition();
  isRunning = false;
  lastKey = null;
  updateScore();
  statusElement.textContent = 'Нажмите стрелку, чтобы начать';
  draw();
}

function updateScore() {
  scoreElement.textContent = score;
  bestScoreElement.textContent = bestScore;
}

function getRandomFoodPosition() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some(part => part.x === position.x && part.y === position.y));
  return position;
}

function playSound(sound) {
  if (!soundOn) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function gameOver() {
  clearInterval(gameInterval);
  isRunning = false;
  statusElement.textContent = 'Игра окончена! Нажмите «Начать заново»';
  playSound(sounds.crash);
}

function gameLoop() {
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    bestScore = Math.max(bestScore, score);
    food = getRandomFoodPosition();
    updateScore();
    statusElement.textContent = 'Еда съедена!';
    playSound(sounds.eat);
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#22c55e';
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    if (index === 0) {
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
      ctx.fillStyle = '#22c55e';
    }
  });

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

function startGame() {
  if (isRunning) return;
  if (velocity.x === 0 && velocity.y === 0) {
    velocity = { x: 1, y: 0 };
  }
  isRunning = true;
  statusElement.textContent = 'Игра идет';
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 120);
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  const directions = {
    arrowup: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },
    d: { x: 1, y: 0 },
  };

  if (!directions[key]) return;
  const newDirection = directions[key];

  if (lastKey === key) return;
  lastKey = key;

  if (snake.length > 1 && snake[0].x + newDirection.x === snake[1].x && snake[0].y + newDirection.y === snake[1].y) {
    return;
  }

  velocity = newDirection;
  if (!isRunning) {
    startGame();
  }
});

startButton.addEventListener('click', () => {
  resetGame();
});

soundButton.addEventListener('click', () => {
  soundOn = !soundOn;
  soundButton.textContent = `Звук: ${soundOn ? 'Вкл' : 'Выкл'}`;
});

resetGame();
