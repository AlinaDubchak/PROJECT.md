'use strict';

const main = document.querySelector('.main');

const movingCells = 1;
const fixedCells = 2;
const freeCells = 0;
const speedFigure = 1000;
const rows = 20;
const colums = 10;

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

const field = createField();
let activePiece = getNewFigures();

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
      if (field[y][x] === movingCells) {
        fieldHTML += '<div class="cell movingCell"></div>';
      } else if (field[y][x] === fixedCells) {
        fieldHTML += '<div class="cell fixedCell"></div>';
      } else fieldHTML += '<div class="cell"></div>';
    }
  }

  main.innerHTML = fieldHTML;
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
    activePiece.blocks.map(row => row[index]).reverse()
  );
  if (hasCollisions()) {
    activePiece.blocks = prevPiecePosition;
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
  for (let y = field.length - 1; y >= 0; y--) {
    let numberOfBlocks = 0;
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] !== 0) {
        numberOfBlocks += 1;
      }
    }
    if (numberOfBlocks === 0) {
      break;
    } else if (numberOfBlocks < field[y].length) {
      continue;
    } else if (numberOfBlocks === field[y].length) {
      field.splice(y, 1);
      field.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
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
    activePiece = getNewFigures();
    activePiece.y = 0;
  }
}

document.addEventListener(
  'keydown',
  e => {
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
    }
    addActivePiece();
    draw();
  },
  true
);

function startGame() {
  getState();
  moveDown();
  addActivePiece();
  draw();
  setTimeout(startGame, speedFigure);
}

setTimeout(startGame, speedFigure);
