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
let previousSnake = []; // Stores the snake's state before the last logical update for interpolation
let timeSinceLastLogicalUpdate = 0; // Time accumulated since the last logical grid movement
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
  previousSnake = [{ x: 10, y: 10 }]; // Initialize previousSnake with the same initial state
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
  previousSnake = JSON.parse(JSON.stringify(snake)); // Initialize previousSnake at game start
  lastRenderTime = 0;
  timeSinceLastLogicalUpdate = 0; // Reset this on game start
  isRunning = true;
  statusElement.textContent = 'Игра началась';
  window.requestAnimationFrame(mainLoop);
}

function mainLoop(currentTime) {
  if (isGameOver) return;
  animationFrameId = window.requestAnimationFrame(mainLoop);
  const deltaTime = currentTime - lastRenderTime;
  lastRenderTime = currentTime;

  timeSinceLastLogicalUpdate += deltaTime;

  // Perform logical updates (move snake to next grid cell)
  while (timeSinceLastLogicalUpdate >= gameSpeed) {
    previousSnake = JSON.parse(JSON.stringify(snake)); // Capture current snake state before updating for interpolation
    updateGameLogic(); // Update snake's logical grid positions
    timeSinceLastLogicalUpdate -= gameSpeed; // Subtract gameSpeed to handle potential frame overruns
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

  // Draw apple
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 1, gridSize - 1);

  // Calculate interpolation progress (0 to 1)
  let interpolationProgress = Math.min(1, timeSinceLastLogicalUpdate / gameSpeed);

  // Draw snake segments with interpolation
  snake.forEach((segment, index) => {
    let startX, startY;
    let endX, endY;

    if (index === 0) { // Head segment
      startX = previousSnake[0].x;
      startY = previousSnake[0].y;
      endX = segment.x;
      endY = segment.y;

      // Handle wrap-around for head interpolation
      if (Math.abs(endX - startX) > 1) { // Wrapped horizontally
        if (endX === 0 && startX === tileCount - 1) startX = -1; // Wrapped from right to left
        else if (endX === tileCount - 1 && startX === 0) startX = tileCount; // Wrapped from left to right
      }
      if (Math.abs(endY - startY) > 1) { // Wrapped vertically
        if (endY === 0 && startY === tileCount - 1) startY = -1; // Wrapped from bottom to top
        else if (endY === tileCount - 1 && startY === 0) startY = tileCount; // Wrapped from top to bottom
      }
    } else { // Body segments
      // Each body segment moves to where the segment in front of it was in the previous frame.
      // So, its starting point for interpolation is previousSnake[index-1].
      // Its ending point is its current logical position (snake[index]).
      startX = previousSnake[index - 1] ? previousSnake[index - 1].x : segment.x;
      startY = previousSnake[index - 1] ? previousSnake[index - 1].y : segment.y;
      endX = segment.x;
      endY = segment.y;
    }

    const interpolatedX = (startX + (endX - startX) * interpolationProgress) * gridSize;
    const interpolatedY = (startY + (endY - startY) * interpolationProgress) * gridSize;

    ctx.fillStyle = index === 0 ? '#22c55e' : '#4ade80'; // Head is darker green
    ctx.fillRect(interpolatedX, interpolatedY, gridSize - 1, gridSize - 1);
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
