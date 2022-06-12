'use strict';

let field = createField();
let activePiece = getNewFigures();
let nextPiece = getNewFigures();

function createField() {
  const field = [];
  for (let y = 0; y < gameOptions.rows; y++) {
    field[y] = [];
    for (let x = 0; x < gameOptions.colums; x++) {
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
      if (field[y][x] === gameOptions.movingCells) {
        fieldHTML += '<div class="cell movingCell"></div>';
      } else if (field[y][x] === gameOptions.fixedCells) {
        fieldHTML += '<div class="cell fixedCell"></div>';
      } else fieldHTML += '<div class="cell"></div>';
    }
  }

  visual.main.innerHTML = fieldHTML;
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
  visual.nextFigure.innerHTML = nextFigureInnerHTML;
}

function removePrevPiece() {
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === gameOptions.movingCells) {
        field[y][x] = gameOptions.freeCells;
      }
    }
  }
}

function addActivePiece() {
  removePrevPiece();
  for (let y = 0; y < activePiece.blocks.length; y++) {
    for (let x = 0; x < activePiece.blocks[y].length; x++) {
      if (activePiece.blocks[y][x] === gameOptions.movingCells) {
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
            gameOptions.fixedCells)
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
  for (let y = gameOptions.rows - 1; y >= 0; y--) {
    let numberOfBlocks = 0;
    for (let x = 0; x < gameOptions.colums; x++) {
      if (field[y][x]) {
        numberOfBlocks += 1;
      }
    }
    if (numberOfBlocks === 0) {
      break;
    } else if (numberOfBlocks < gameOptions.colums) {
      continue;
    } else if (numberOfBlocks === gameOptions.colums) {
      lines.unshift(y);
    }
  }
  for (const index of lines) {
    field.splice(index, 1);
    field.unshift(new Array(gameOptions.colums).fill(0));
    filledLines += 1;
    playMusic(scoreSound());
  }

  gameOptions.score += filledLines * filledLines * 10;
  visual.points.innerHTML = gameOptions.score;

  if (
    gameOptions.score >= possibleLevels[gameOptions.currentLevel].nextLevelScore
  ) {
    gameOptions.currentLevel++;
    visual.levels.innerHTML = gameOptions.currentLevel;
  }
  if (
    gameOptions.score >= possibleLevels[5].nextLevelScore
  ) {
    stopMusic(mainSound);
    playMusic(victorySound);
    beginMusic(mainSound);
    visual.win.style.display = 'block';
    visual.startAgainBtn.style.display = 'block';
    clear();
  }
}

function clear() {
  clearInterval(gameTimers.timerID);
  gameTimers.isPaused = true;
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
      if (field[y][x] === gameOptions.movingCells) {
        field[y][x] = gameOptions.fixedCells;
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
  visual.pause.style.display = 'none';
  visual.yourScore.style.display = 'block';
  visual.yourScore.innerHTML = gameOptions.score;

  updateScore();
}

function updateState() {
  addActivePiece();
  drawNextPiece();
  draw();
}

function text(condition) {
  visual.gameOver.style.display = condition;
  visual.textScore.style.display = condition;
  visual.startAgain.style.display = condition;
}

function updateScore() {
  gameOptions.score = 0;
  gameOptions.currentLevel = 1;
  visual.levels.innerHTML = gameOptions.currentLevel;
  visual.points.innerHTML = gameOptions.score;
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
    } else {
      collection.get(e.code)();
      updateState();
    }
  }
  );
}

controllers();


function pauseKey() {
  clearInterval(gameTimers.timerID);
  visual.pause.style.display = 'block';
  if (gameTimers.isPaused) {
    gameTimers.timerID = setInterval(
      startGame,
      possibleLevels[gameOptions.currentLevel].speed
    );
    visual.pause.style.display = 'none';
  }
  gameTimers.isPaused = !gameTimers.isPaused;
}

function enterKey() {
  if (!gameTimers.timerID) {
    gameTimers.isPaused = false;
    gameTimers.timerID = setInterval(
      startGame,
      possibleLevels[gameOptions.currentLevel].speed
    );
    text('none');
    visual.start.style.display = 'none';
    visual.prevNextFigure.style.display = 'block';
  } else {
    reset(true);
  }
}


visual.startAgainBtn.addEventListener('click', e => {
  visual.startAgainBtn.style.display = 'none';
  location.reload();
}, true);

visual.points.innerHTML = gameOptions.score;
visual.levels.innerHTML = gameOptions.currentLevel;

draw();

function startGame() {
  playMusic(mainSound);
  drawNextPiece();
  moveDown();
  updateState();
}
