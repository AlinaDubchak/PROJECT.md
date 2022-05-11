'use strict';

const main = document.querySelector('.main');

const movingCells = 1;
const fixedCells = 2;
const freeCells = 0;

const rows = Array(10).fill(0);
const field = Array(20).fill(rows);
/*let field = [
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
];*/

let activePiece = {
  x: 0,
  y: 0,
  blocks: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
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

function hasCollisions() {
  for (let y = 0; y < activePiece.blocks.length; y++) {
    for (let x = 0; x < activePiece.blocks[y].length; x++) {
     if (activePiece.blocks[y][x] === movingCells && 
      (field[activePiece.y + y] === undefined || field[activePiece.y + y][activePiece.x + x] === undefined)) {
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

const speedFigure = 1000;
draw();

document.onkeydown = event => {
  switch (event.keyCode) {
    case 37: activePiece.x -= 1;
    if(hasCollisions() === true) {
      activePiece.x += 1;}
             break;
    case 39: activePiece.x += 1;
    if(hasCollisions() === true) {
      activePiece.x -= 1;}
             break;
    case 40: activePiece.y += 1;
             if(hasCollisions() === true) {
                activePiece.y -= 1;
              fixFigure();
              activePiece.y = 0;
            }
             break;
  }
    
    
  
  addActivePiece();
  draw();
}


function startGame() {
  addActivePiece();
  draw();
  setTimeout(startGame, speedFigure);
}

setTimeout(startGame, speedFigure);