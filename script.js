'use strict';

let field = createField();
let activePiece = getNewFigures();
let nextPiece = getNewFigures();

function createField() {
  const field = [];
  for (let y = 0; y < options.rows; y++) {
    field[y] = [];
    for (let x = 0; x < options.colums; x++) {
      field[y][x] = 0;
    }
  }
  return field;
}

function getState() {
  const field = createField();
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
      if (field[y][x] === options.movingCells) {
        fieldHTML += '<div class="cell movingCell"></div>';
      } else if (field[y][x] === options.fixedCells) {
        fieldHTML += '<div class="cell fixedCell"></div>';
      } else fieldHTML += '<div class="cell"></div>';
    }
  }

  view.main.innerHTML = fieldHTML;
}

function drawNextPiece() {
  let nextFigureInnerHTML = '';
  for (let y = 0; y < nextPiece.blocks.length; y++) {
    for (let x = 0; x < nextPiece.blocks[y].length; x++) {
      if (nextPiece.blocks[y][x]) {
        nextFigureInnerHTML += '<div class="cell movingCell"></div>';
      } else {
        nextFigureInnerHTML += '<div class="cell"></div>';
      }
    }
    nextFigureInnerHTML += '<br/>';
  }
  view.nextFigure.innerHTML = nextFigureInnerHTML;
}

function removePrevPiece() {
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === options.movingCells) {
        field[y][x] = options.freeCells;
      }
    }
  }
}

function addActivePiece() {
  removePrevPiece();
  for (let y = 0; y < activePiece.blocks.length; y++) {
    for (let x = 0; x < activePiece.blocks[y].length; x++) {
      if (activePiece.blocks[y][x] === options.movingCells) {
        field[activePiece.y + y][activePiece.x + x] = activePiece.blocks[y][x];
      }
    }
  }
}

function spinPiece() {
  const prevPiecePosition = activePiece.blocks;
  activePiece.blocks = activePiece.blocks[0].map((val, index) =>
    activePiece.blocks.map(row => row[index]).reverse()
  );
  if (hasCollisions()) {
    activePiece.blocks = prevPiecePosition;
  }
}

function dropPiece() {
  for (let y = activePiece.y; y < field.length; y++) {
    activePiece.y += 1;
    if (hasCollisions()) {
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
          field[activePiece.y + y][activePiece.x + x] ===
            options.fixedCells)
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
  for (let y = options.rows - 1; y >= 0; y--) {
    let numberOfBlocks = 0;
    for (let x = 0; x < options.colums; x++) {
      if (field[y][x]) {
        numberOfBlocks += 1;
      }
    }
    if (numberOfBlocks === 0) {
      break;
    } else if (numberOfBlocks < options.colums) {
      continue;
    } else if (numberOfBlocks === options.colums) {
      lines.unshift(y);
    }
  }
  for (const index of lines) {
    field.splice(index, 1);
    field.unshift(new Array(options.colums).fill(0));
    filledLines += 1;
    playMusic(scoreSound());
  }
  options.score += filledLines * filledLines * 10;
  view.points.innerHTML = options.score;
}

function countScore() {
  if (
    options.score >= possibleLevels[options.currentLevel].nextLevelScore
  ) {
    options.currentLevel++;
    view.levels.innerHTML = options.currentLevel;
  }
  if (
    options.score >= possibleLevels[5].nextLevelScore
  ) {
    stopMusic(mainSound);
    playMusic(victorySound);
    beginMusic(mainSound);
    view.win.style.display = 'block';
    view.startAgainBtn.style.display = 'block';
    clear();
  }
}
countScore();

function clear() {
  clearInterval(gameTimers.timerID);
  field = createField();
  getState();
  updateState();
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
      if (field[y][x] === options.movingCells) {
        field[y][x] = options.fixedCells;
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
  stopMusic(mainSound);
  playMusic(defeatSound);
  beginMusic(mainSound);
  if (manualReset) {
    activePiece = getNewFigures();
    gameTime();
    draw();
  } else {
    gameTime();
  }
  text('block');
  view.pause.style.display = 'none';
  view.yourScore.style.display = 'block';
  view.yourScore.innerHTML = options.score;

  updateScore();
}

function updateState() {
  addActivePiece();
  drawNextPiece();
  draw();
}

function text(condition) {
  view.gameOver.style.display = condition;
  view.textScore.style.display = condition;
  view.startAgain.style.display = condition;
}

function updateScore() {
  options.score = 0;
  options.currentLevel = 1;
  view.levels.innerHTML = options.currentLevel;
  view.points.innerHTML = options.score;
}

function gameTime() {
  clearInterval(gameTimers.timerID);
  gameTimers.timerID = undefined;
  gameTimers.isPaused = true;
}

function controllers() {
  document.addEventListener('keydown', e => {
    if (!gameTimers.isPaused) {
      collection.get(e.code)();
      updateState();
    }
  }
  );
}
function gameStatus() {
  document.addEventListener('keydown', e => {
    collection2.get(e.code)();
    updateState();
  });
}

controllers();
gameStatus();

function pauseKey() {
  clearInterval(gameTimers.timerID);
  view.pause.style.display = 'block';
  if (gameTimers.isPaused) {
    gameTimers.timerID = setInterval(
      startGame,
      possibleLevels[options.currentLevel].speed
    );
    view.pause.style.display = 'none';
  }
  gameTimers.isPaused = !gameTimers.isPaused;
}

function enterKey() {
  if (!gameTimers.timerID) {
    gameTimers.isPaused = false;
    gameTimers.timerID = setInterval(
      startGame,
      possibleLevels[options.currentLevel].speed
    );
    text('none');
    view.start.style.display = 'none';
    view.prevNextFigure.style.display = 'block';
  } else {
    reset(true);
  }
}

view.startAgainBtn.addEventListener('click', e => {
  view.startAgainBtn.style.display = 'none';
  location.reload();
}, true);

view.points.innerHTML = options.score;
view.levels.innerHTML = options.currentLevel;

draw();

function startGame() {
  playMusic(mainSound);
  drawNextPiece();
  moveDown();
  updateState();
}
