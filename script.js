'use strict';

const main = document.querySelector('.main');

const movingCells = 1;
const fixedCells = 2;
const freeCells = 0;
const speedFigure = 1000;

const field = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let activePiece = createPieces();
let nextPiece = createPieces();

function createPieces() {
  const index = Math.floor(Math.random() * 7);
  const type = 'IJLOTSZ'[index];
  const piece = { x: 0, y: 0 };
  switch (type) {
  case 'I':
      piece.blocks = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      break;
    case 'J':
      piece.blocks = [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ];
      break;
    case 'L':
      piece.blocks = [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ];
      break;
    case 'O':
      piece.blocks = [
        [1, 1],
        [1, 1],
      ];
      break;
    case 'T':
      piece.blocks = [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];
      break;
    case 'S':
      piece.blocks = [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ];
      break;
    case 'Z':
      piece.blocks = [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ];
      break;
    default:
      throw new Error('undefined figure');
  }
  piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
  piece.y = 0;

  return piece;
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

let { x: pieceY, x: pieceX } = activePiece;
const { blocks } = activePiece;

function addActivePiece() {
  removePrevPiece();
  for (let y = 0; y < blocks.length; y++) {
    for (let x = 0; x < blocks[y].length; x++) {
      if (blocks[y][x] === movingCells) {
        field[pieceY + y][pieceX + x] = blocks[y][x];
      }
    }
  }
}

function hasCollisions() {
  for (let y = 0; y < blocks.length; y++) {
    for (let x = 0; x < blocks[y].length; x++) {
      if (
        blocks[y][x] &&
        (field[pieceY + y] === undefined ||
          field[pieceY + y][pieceX + x] === undefined ||
          field[pieceY + y][pieceX + x] === fixedCells)
      ) {
        return true;
      }
    }
  }
  return false;
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
  pieceY += 1;
  if (hasCollisions()) {
    pieceY -= 1;
    fixFigure();
    updatePiece();
    pieceY = 0;
  }
}

document.addEventListener(
  'keydown',
  e => {
    switch (e.code) {
      case 'ArrowLeft':
        pieceX -= 1;
        if (hasCollisions()) {
          pieceX += 1;
        }
        break;
      case 'ArrowRight':
        pieceX += 1;
        if (hasCollisions()) {
          pieceX -= 1;
        }
        break;
      case 'ArrowDown':
        moveDown();
        break;
    }

    addActivePiece();
    draw();
  },
  true
);

function startGame() {
  moveDown();
  addActivePiece();
  draw();
  setTimeout(startGame, speedFigure);
}

setTimeout(startGame, speedFigure);

function updatePiece() {
  activePiece = nextPiece;
  nextPiece = createPieces();
}
