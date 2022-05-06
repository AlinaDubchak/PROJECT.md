'use strict';

const main = document.querySelector('.main');

const movingCells = 1;
const fixedCells = 2;
const freeCells = 0;

const rows = Array(10).fill(0);
const field = Array(20).fill(rows);


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

function canMoveDown() {
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === movingCells) {
        if (y === field.length - 1 || field[y + 1][x] === fixedCells) {
          return false;
        }
      }
    }
  }
  return true;
}

function moveDown() {
  if (canMoveDown()) {
    for (let y = field.length - 1; y >= 0; y--) {
      for (let x = 0; x < field[y].length; x++) {
        if (field[y][x] === movingCells) {
          field[y + 1][x] = movingCells;
          field[y][x] = freeCells;
        }
      }
    }
  } else fixFigure();
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

const speedFigure = 1000;
draw();

function startGame() {
  moveDown();
  draw();
  setTimeout(startGame, speedFigure);
}

setTimeout(startGame, speedFigure);
