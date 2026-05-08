const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('bestScore');
const statusElement = document.getElementById('status');
const finalScoreElement = document.getElementById('finalScore');
const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const playButton = document.getElementById('playButton');
const startButton = document.getElementById('startButton');
const menuButton = document.getElementById('menuButton');
const retryButton = document.getElementById('retryButton');
const backToMenuButton = document.getElementById('backToMenuButton');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
// The speed of the game in milliseconds.
// A lower number means the snake moves faster and the animation appears smoother
// because the updates happen more frequently.
// 120ms = ~8 updates per second. 75ms = ~13 updates per second.
const gameSpeed = 75;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let apple = { x: 7, y: 7 };
let score = 0;
let bestScore = 0;
let animationFrameId = null;
let lastRenderTime = 0;
let isRunning = false;
let isGameOver = false;
let lastDirection = null;

function showMenu() {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  isRunning = false;
  menuScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
  hideGameOver();
}

function showGame() {
  menuScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  hideGameOver();
  resetGame();
}

function showGameOver() {
  isGameOver = true;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  gameOverOverlay.classList.remove('hidden');
  finalScoreElement.textContent = score;
}

function hideGameOver() {
  gameOverOverlay.classList.add('hidden');
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 0, y: 0 };
  apple = getRandomApplePosition();
  score = 0;
  isRunning = false;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  isGameOver = false;
  lastDirection = null;
  updateScore();
  statusElement.textContent = 'Нажмите стрелку, чтобы начать';
  draw();
}

function updateScore() {
  scoreElement.textContent = score;
  bestScoreElement.textContent = bestScore;
}

function getRandomApplePosition() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));

  return position;
}

function startGame() {
  if (isRunning || isGameOver) return;
  if (velocity.x === 0 && velocity.y === 0) {
    velocity = { x: 1, y: 0 };
  }
  lastRenderTime = 0;
  isRunning = true;
  statusElement.textContent = 'Игра началась';
  window.requestAnimationFrame(mainLoop);
}

function mainLoop(currentTime) {
  if (isGameOver) return;

  animationFrameId = window.requestAnimationFrame(mainLoop);
  const elapsed = currentTime - lastRenderTime;

  if (elapsed > gameSpeed) {
    lastRenderTime = currentTime;
    updateGameLogic();
  }

  draw();
}

function updateGameLogic() {
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  // Wall wrapping logic
  if (head.x < 0) head.x = tileCount - 1;
  if (head.x >= tileCount) head.x = 0;
  if (head.y < 0) head.y = tileCount - 1;
  if (head.y >= tileCount) head.y = 0;

  const hitSelf = snake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y);

  if (hitSelf) {
    isRunning = false;
    if (score > bestScore) bestScore = score;
    updateScore();
    statusElement.textContent = 'Вы проиграли';
    showGameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score += 1;
    if (score > bestScore) bestScore = score;
    apple = getRandomApplePosition();
    statusElement.textContent = 'Яблоко съедено!';
    updateScore();
  } else {
    snake.pop();
  }
}

function draw() {
  // Clear the canvas to be transparent for the animated background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 1, gridSize - 1);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#22c55e' : '#4ade80';
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
  });
}

function setDirection(key) {
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

  const nextDirection = directions[key];
  if (!nextDirection || isGameOver) return;

  const isReverse = snake.length > 1 && velocity.x === -nextDirection.x && velocity.y === -nextDirection.y;
  if (isReverse) return;

  if (lastDirection === key) return;
  lastDirection = key;

  velocity = nextDirection;
  if (!isRunning) {
    startGame();
  }
}

window.addEventListener('keydown', (event) => {
  setDirection(event.key.toLowerCase());
});

playButton.addEventListener('click', showGame);
startButton.addEventListener('click', startGame);
menuButton.addEventListener('click', showMenu);
retryButton.addEventListener('click', () => {
  hideGameOver();
  resetGame();
});
backToMenuButton.addEventListener('click', showMenu);

showMenu();
