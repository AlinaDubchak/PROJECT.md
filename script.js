'use strict';

const main = document.querySelector('.main');
const points = document.getElementById('score');
const levels = document.getElementById('level');
const gameOver = document.getElementById('game-over');
const yourScore = document.getElementById('current-score');
const textScore = document.getElementById('your-score');
const start = document.getElementById('start');
const startAgain = document.getElementById('start-again');
const pause = document.getElementById('space');
const nextFigure = document.getElementById('next-piece');

const movingCells = 1,
  fixedCells = 2,
  freeCells = 0,
  rows = 20,
  colums = 10;
let score = 0;
let isPaused = true;
let currentLevel = 1;
let timerID;

const possibleLevels = {
  1: {
    speed: 1000,
    nextLevelScore: 100,
  },
  2: {
    speed: 750,
    nextLevelScore: 250,
  },
  3: {
    speed: 500,
    nextLevelScore: 400,
  },
  4: {
    speed: 250,
    nextLevelScore: 500,
  },
  5: {
    speed: 200,
    nextLevelScore: 700,
  },
};

const figures = {
  I: [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  J: [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 0],
  ],
  L: [
    [1, 1, 1],
    [1, 0, 0],
    [0, 0, 0],
  ],

  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

let field = createField(); //1
let activePiece = getNewFigures();
let nextPiece = getNewFigures();

function createField() {
  const field = [];
  for (let y = 0; y < rows; y++) {
    field[y] = [];
    for (let x = 0; x < colums; x++) {
      field[y][x] = 0;
    }
  }
  return field;
}

function getState() {
  const field = createField(); //1
  for (let y = 0; y < field.length; y++) {
    field[y] = [];
    for (let x = 0; x < field[y].length; x++) {
      field[y][x];
    }
  }
  for (let y = 0; y < activePiece.blocks.length; y++) {
    for (let x = 0; x < activePiece.blocks[y].length; x++) {
      if (activePiece.blocks[y][x]) {
        field[activePiece.y + y][activePiece.x + x] = activePiece.blocks[y][x];
      }
    }
  }
  return field;
}

function draw() {
  let fieldHTML = '';
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === movingCells) {
        fieldHTML += '<div class="cell movingCell"></div>';
      } else if (field[y][x] === fixedCells) {
        fieldHTML += '<div class="cell fixedCell"></div>';
      } else fieldHTML += '<div class="cell"></div>';
    }
  }

  main.innerHTML = fieldHTML;
}

function drawNextPiece() {
  let nextFigureInnerHTML = '';
  for (let y = 0; y < nextPiece.blocks.length; y++) {
    for (let x = 0; x < nextPiece.blocks[y].length; x++) {
      if (nextPiece.blocks[y][x]) {
        nextFigureInnerHTML += '<div class="cell movingCell"></div>';
      }
      else {
        nextFigureInnerHTML += '<div class="cell"></div>';
      }
    }
    nextFigureInnerHTML += '<br/>';
    }
  nextFigure.innerHTML = nextFigureInnerHTML; 
}

function removePrevPiece() {
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === movingCells) {
        field[y][x] = freeCells;
      }
    }
  }
}

function addActivePiece() {
  removePrevPiece();
  for (let y = 0; y < activePiece.blocks.length; y++) {
    for (let x = 0; x < activePiece.blocks[y].length; x++) {
      if (activePiece.blocks[y][x] === movingCells) {
        field[activePiece.y + y][activePiece.x + x] = activePiece.blocks[y][x];
      }
    }
  }
}

function spinPiece() {
  const prevPiecePosition = activePiece.blocks;
  activePiece.blocks = activePiece.blocks[0].map((val, index) =>
    activePiece.blocks.map((row) => row[index]).reverse()
  );
  if (hasCollisions()) {
    activePiece.blocks = prevPiecePosition;
  }
}

function dropPiece() {
  for (let y = activePiece.y; y < field.length; y++) {
    activePiece.y += 1;
    if (hasCollisions()){
      activePiece.y -= 1;
      break;
    }
  }
}

function hasCollisions() {
  for (let y = 0; y < activePiece.blocks.length; y++) {
    for (let x = 0; x < activePiece.blocks[y].length; x++) {
      if (
        activePiece.blocks[y][x] &&
        (field[activePiece.y + y] === undefined ||
          field[activePiece.y + y][activePiece.x + x] === undefined ||
          field[activePiece.y + y][activePiece.x + x] === fixedCells)
      ) {
        return true;
      }
    }
  }
  return false;
}

function eraseLines() {
  const lines = [];
  let filledLines = 0;
  for (let y = rows - 1; y >= 0; y--) {
    let numberOfBlocks = 0;
    for (let x = 0; x < colums; x++) {
      if (field[y][x]) {
        numberOfBlocks += 1;
      }
    }
    if (numberOfBlocks === 0) {
      break;
    } else if (numberOfBlocks < colums) {
      continue;
    } else if (numberOfBlocks === colums) {
      lines.unshift(y);
    }
  }
  for (const index of lines) {
    field.splice(index, 1);
    field.unshift(new Array(colums).fill(0));
    filledLines += 1;
  }

  score += filledLines * filledLines * 10;
  points.innerHTML = score;

  if (score >= possibleLevels[currentLevel].nextLevelScore) {
    currentLevel++;
    levels.innerHTML = currentLevel;
  }
}

function getNewFigures() {
  const possibleFigures = 'IJLOTSZ';
  const rand = Math.floor(Math.random() * 7);
  const newPiece = figures[possibleFigures[rand]];
  return {
    x: Math.floor((10 - newPiece[0].length) / 2),
    y: 0,
    blocks: newPiece,
  };
}

function fixFigure() {
  for (let y = field.length - 1; y >= 0; y--) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === movingCells) {
        field[y][x] = fixedCells;
      }
    }
  }
}

function moveDown() {
  activePiece.y += 1;
  if (hasCollisions()) {
    activePiece.y -= 1;
    fixFigure();
    eraseLines();
    activePiece = nextPiece;
    nextPiece = getNewFigures();
    if (hasCollisions()) {
      reset();
    }
  }
}

function reset(manualReset = false) {
  field = createField();
  getState();
  if (manualReset) {
    activePiece = getNewFigures();
    gameTime();
    updateState();
  } else {
    gameTime();
  }
  text('block');
  yourScore.style.display = 'block';
  yourScore.innerHTML = score;
  updateScore();
}

function updateState() {
  addActivePiece();
  drawNextPiece();
  draw();
}

function text(condition) {
  gameOver.style.display = condition;
  textScore.style.display = condition;
  startAgain.style.display = condition;
}

function updateScore() {
  score = 0;
  currentLevel = 1;
  levels.innerHTML = currentLevel;
  points.innerHTML = score;
}

function gameTime() {
  clearInterval(timerID);
  timerID = undefined;
  isPaused = true;
}

document.addEventListener(
  'keydown',
  (e) => {
    if (!isPaused) {
      switch (e.code) {
        case 'ArrowLeft':
          activePiece.x -= 1;
          if (hasCollisions()) {
            activePiece.x += 1;
          }
          break;
        case 'ArrowRight':
          activePiece.x += 1;
          if (hasCollisions()) {
            activePiece.x -= 1;
          }
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          spinPiece();
          break;
        case 'ShiftRight':
          dropPiece();
          break;
      }
      updateState();
    }
  },
  true
);

document.addEventListener(
  'keydown',
  (e) => {
    switch (e.code) {
      case 'Space':
        clearInterval(timerID);
        pause.style.display = 'block';
        if (isPaused) {
          timerID = setInterval(startGame, possibleLevels[currentLevel].speed);
          pause.style.display = 'none';
        }
        isPaused = !isPaused;
        break;
      case 'Enter':
        if (!timerID) {
          isPaused = false;
          timerID = setInterval(startGame, possibleLevels[currentLevel].speed);
          text('none');
          start.style.display = 'none';
        } else {
          reset(true);
        }
     }
  },
  true
);

points.innerHTML = score;
levels.innerHTML = currentLevel;

draw();



function startGame() {
  drawNextPiece();
  moveDown();
  updateState();
}
